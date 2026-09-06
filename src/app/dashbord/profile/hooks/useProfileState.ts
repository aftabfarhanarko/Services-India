"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useGetUserProfileQuery } from "@/redux/features/auth/authApi";
import { useUpdateUserMutation } from "@/redux/features/admin/user";
import { useCreateProfileMutation, useUpdateProfileMutation } from "@/redux/features/admin/profile";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { uploadImage } from "@/lib/upload";
import { formatImageUrl, cleanAddress } from "@/lib/utils";

export function useProfileState() {
  const role = useAppSelector((state) => state.auth.role) || "client";
  const reduxUser = useAppSelector((state) => state.auth.user);

  const { data: userRes, isLoading: isUserLoading, refetch } = useGetUserProfileQuery();
  const [updateUserMut] = useUpdateUserMutation();
  const [createProfileMut, { isLoading: isCreatingProfile }] = useCreateProfileMutation();
  const [updateProfileMut, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const { data: apiCategoriesRes, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();
  const allCategories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);

  // Prefer API response, fall back to Redux store (which is persisted from localStorage)
  const apiUser = userRes?.data?.user || userRes?.data || userRes;
  const user = (apiUser && Object.keys(apiUser).length > 1 ? apiUser : null) || reduxUser || {};
  const profile = apiUser?.profile;

  const name =
    (user as any).name ||
    ((user as any).firstName ? `${(user as any).firstName} ${(user as any).lastName || ""}`.trim() : null) ||
    "Unknown User";
  const email = (user as any).email || "No Email";
  const phone = (user as any).phone || (user as any).phoneNumber || "No Phone";
  const address = profile?.location || "No Address Provided";
  const hasProfile = !!profile;

  const [selectedDevision, setSelectedDevision] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("personal");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    const img = profile?.images?.[0] || profile?.picture || profile?.avatar || user?.avatar;
    if (img) {
      setAvatarUrl(formatImageUrl(img));
    }
  }, [profile, user?.avatar]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const url = await uploadImage(file);
      setAvatarUrl(url);

      if (hasProfile && profile?.id) {
        await updateProfileMut({
          id: profile.id,
          data: { picture: url },
        }).unwrap();
        toast.success("Profile image updated successfully!");
        refetch();
      } else {
        await createProfileMut({
          user_id: user.id || user._id,
          type: selectedType || "personal",
          picture: url,
        }).unwrap();
        toast.success("Profile image uploaded successfully!");
        refetch();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  useEffect(() => {
    if (profile && !selectedDevision && !selectedDistrict && !selectedArea) {
      if (profile.devision?.id) setSelectedDevision(profile.devision.id.toString());
      if (profile.district?.id) setSelectedDistrict(profile.district.id.toString());
      if (profile.area?.id) setSelectedArea(profile.area.id.toString());
      else if (profile.area_name) setSelectedArea(profile.area_name);
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      if (profile.type) setSelectedType(profile.type);
      if (profile.categories?.length) setSelectedCategories(profile.categories.map((c: any) => c.id.toString()));
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedUserData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
    };

    const primaryAddress = formData.get("address")?.toString().trim() || "";
    const specificLocation = formData.get("location")?.toString().trim() || "";
    const rawLocation = [primaryAddress, specificLocation].filter(Boolean).join(", ");
    const combinedLocation = cleanAddress(rawLocation);

    const profileData = {
      user_id: user.id || user._id,
      category_ids: selectedCategories.map((id) => Number(id)),
      type: selectedType,
      location: combinedLocation,
      devision_id: selectedDevision ? Number(selectedDevision) : undefined,
      district_id: selectedDistrict ? Number(selectedDistrict) : undefined,
      area_id: selectedArea && !isNaN(Number(selectedArea)) ? Number(selectedArea) : undefined,
      area_name: selectedArea && isNaN(Number(selectedArea)) ? selectedArea : undefined,
      description: formData.get("description")?.toString() || "",
      company_name: formData.get("company_name")?.toString() || "",
      min_starting_price: formData.get("min_starting_price") ? Number(formData.get("min_starting_price")) : 0,
      google_map_link: formData.get("google_map_link")?.toString() || "",
      picture: avatarUrl || undefined,
    };

    try {
      if (user.id || user._id) {
        // Update User
        await updateUserMut({ id: user.id || user._id, data: updatedUserData }).unwrap();

        // Update or Create Profile
        if (hasProfile) {
          await updateProfileMut({ id: profile.id, data: profileData }).unwrap();
        } else {
          await createProfileMut(profileData).unwrap();
        }

        toast.success("Profile saved successfully!");
        refetch();
      } else {
        toast.error("User ID not found! Cannot update.");
      }
    } catch (err) {
      toast.error("Failed to save profile");
      console.error(err);
    }
  };

  const isSaving = isCreatingProfile || isUpdatingProfile;

  return {
    role,
    user,
    profile,
    name,
    email,
    phone,
    address,
    hasProfile,
    selectedDevision,
    setSelectedDevision,
    selectedDistrict,
    setSelectedDistrict,
    selectedArea,
    setSelectedArea,
    selectedType,
    setSelectedType,
    selectedCategories,
    setSelectedCategories,
    avatarUrl,
    isUploadingAvatar,
    allCategories,
    isCategoriesLoading,
    isUserLoading,
    isSaving,
    handleAvatarUpload,
    handleSave,
  };
}
