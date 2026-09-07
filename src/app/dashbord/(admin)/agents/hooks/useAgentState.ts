"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useGetAllUsersQuery, useUpdateUserMutation, useCreateUserMutation, useDeleteUserMutation } from "@/redux/features/admin/user";
import { useGetAllRolesQuery } from "@/redux/features/admin/role";
import { useCreateProfileMutation } from "@/redux/features/admin/profile";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { uploadImage } from "@/lib/upload";
import { useConfirm } from "@/context/ConfirmDialogContext";

interface AgentItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  rating?: string;
  categoryName?: string;
  companyName?: string;
  location?: string;
  description?: string;
  shop_image1?: string;
  shop_image2?: string;
  nid_number?: string;
  nid_front?: string;
  nid_back?: string;
  devision?: string;
  district?: string;
  area?: string;
}

export function useAgentState() {
  const confirm = useConfirm();
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AgentItem | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);

  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [shopImage1File, setShopImage1File] = useState<File | null>(null);
  const [shopImage2File, setShopImage2File] = useState<File | null>(null);
  const [nidFrontFile, setNidFrontFile] = useState<File | null>(null);
  const [nidBackFile, setNidBackFile] = useState<File | null>(null);

  const { data: apiUsersRes, isLoading: isUsersLoading, refetch } = useGetAllUsersQuery();
  const { data: rolesRes } = useGetAllRolesQuery();
  const { data: apiCategoriesRes, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();

  const [updateUserMut] = useUpdateUserMutation();
  const [createUserMut, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [deleteUserMut] = useDeleteUserMutation();
  const [createProfileMut, { isLoading: isCreatingProfile }] = useCreateProfileMutation();

  const allCategories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);

  useEffect(() => {
    const apiUsers = apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []);
    if (apiUsers && apiUsers.length > 0) {
      const agentUsers = apiUsers.filter((u: any) => u.role?.name === "Agent" || u.role === "Agent");

      const mappedUsers = agentUsers.map((u: any) => ({
        id: u.id || u._id || `AGT-${Math.floor(Math.random() * 1000)}`,
        name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown User",
        email: u.email || "No Email",
        phone: u.phone || u.phoneNumber || "No Phone",
        role: u.role?.name || (typeof u.role === "string" ? u.role : "Agent"),
        status: u.status?.toLowerCase() || "inactive",
        joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Unknown",
        rating: u.profile?.rating || "New",
        categoryName: u.profile?.category?.name || "Unassigned",
        companyName: u.profile?.company_name || "N/A",
        location: u.profile?.location || "N/A",
        description: u.profile?.description || "N/A",
        shop_image1: u.profile?.shop_image1,
        shop_image2: u.profile?.shop_image2,
        nid_number: u.profile?.nid_number,
        nid_front: u.profile?.nid_front,
        nid_back: u.profile?.nid_back,
        devision: u.profile?.devision?.name || "N/A",
        district: u.profile?.district?.name || "N/A",
        area: u.profile?.area?.name || "N/A",
      }));
      setAgents(mappedUsers);
    } else {
      setAgents([]);
    }
  }, [apiUsersRes]);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roles = rolesRes?.data || (Array.isArray(rolesRes) ? rolesRes : []);
    const agentRole = roles.find((r: any) => r.name === "Agent");

    if (!agentRole) {
      toast.error("Agent role not found in the database!");
      return;
    }

    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      roleId: Number(agentRole.id || agentRole._id),
    };

    try {
      const userRes = await createUserMut(userData).unwrap();
      const newUserId = userRes.data?.id || userRes.id;
      setCreatedUserId(newUserId);
      toast.success("Agent user created! Now complete the profile.");
      setStep(2);
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to create agent user.");
    }
  };

  const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createdUserId) {
      toast.error("User ID missing. Start over.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    if (!pictureFile) {
      toast.error("Please upload a Profile / Logo picture.");
      return;
    }
    if (!formData.get("nid_number")?.toString().trim()) {
      toast.error("Please provide Govt ID / Aadhaar Number.");
      return;
    }
    if (!nidFrontFile || !nidBackFile) {
      toast.error("Please upload Govt ID / Aadhaar Front and Back pages.");
      return;
    }
    if (!shopImage1File || !shopImage2File) {
      toast.error("Please upload both Shop Images.");
      return;
    }

    try {
      toast.loading("Uploading files...", { id: "profile-upload" });
      const pictureUrl = await uploadImage(pictureFile);
      const nidFrontUrl = await uploadImage(nidFrontFile);
      const nidBackUrl = await uploadImage(nidBackFile);
      const shopImageUrl1 = await uploadImage(shopImage1File);
      const shopImageUrl2 = await uploadImage(shopImage2File);
      toast.dismiss("profile-upload");

      const profileData = {
        user_id: createdUserId,
        company_name: formData.get("company_name")?.toString() || "",
        nid_number: formData.get("nid_number")?.toString() || "",
        type: "personal",
        picture: pictureUrl,
        nid_front: nidFrontUrl,
        nid_back: nidBackUrl,
        shop_image1: shopImageUrl1,
        shop_image2: shopImageUrl2,
        description: formData.get("description")?.toString() || "",
      };

      await createProfileMut(profileData).unwrap();
      toast.success("Agent profile created successfully!");
      closeModal();
      refetch();
    } catch (err: any) {
      toast.dismiss("profile-upload");
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to create agent profile.");
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setStep(1);
    setCreatedUserId(null);
    setPictureFile(null);
    setShopImage1File(null);
    setShopImage2File(null);
    setNidFrontFile(null);
    setNidBackFile(null);
  };

  const handleActivate = async (id: string) => {
    setAgents((prev) => prev.map((u) => (u.id === id ? { ...u, status: "active" } : u)));
    try {
      await updateUserMut({ id, data: { status: "active" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeactivate = async (id: string) => {
    setAgents((prev) => prev.map((u) => (u.id === id ? { ...u, status: "inactive" } : u)));
    try {
      await updateUserMut({ id, data: { status: "inactive" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleBlock = async (id: string) => {
    setAgents((prev) => prev.map((u) => (u.id === id ? { ...u, status: "blocked" } : u)));
    try {
      await updateUserMut({ id, data: { status: "blocked" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Agent?",
      message: "Are you sure you want to delete this agent? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!isConfirmed) return;
    try {
      await deleteUserMut(id).unwrap();
      toast.success("Agent deleted successfully!");
      refetch();
    } catch (e: any) {
      console.error(e);
      toast.error(e.data?.message || "Failed to delete agent.");
    }
  };

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return {
    agents,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedUser,
    setSelectedUser,
    openDropdownId,
    setOpenDropdownId,
    step,
    isUsersLoading,
    pictureFile,
    setPictureFile,
    shopImage1File,
    setShopImage1File,
    shopImage2File,
    setShopImage2File,
    nidFrontFile,
    setNidFrontFile,
    nidBackFile,
    setNidBackFile,
    isCreatingUser,
    isCreatingProfile,
    handleCreateUser,
    handleCreateProfile,
    closeModal,
    handleActivate,
    handleDeactivate,
    handleBlock,
    handleDelete,
    isAuthenticated,
  };
}
