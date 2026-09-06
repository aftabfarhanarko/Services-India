/**
 * Uploads an image using ImgBB API with fallback to local NestJS backend upload.
 * 
 * API Key: a6c948ab64f7987bbf9e5477cde3a1cb
 * @param file - The Image file to upload.
 */
import { formatImageUrl } from "@/lib/utils";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "a6c948ab64f7987bbf9e5477cde3a1cb";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.rajseba.in";

export const uploadImage = async (file: File): Promise<string> => {
  // 1. Try uploading to ImgBB first
  try {
    const formData = new FormData();
    formData.append("image", file);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    if (imgbbResponse.ok) {
      const imgbbData = await imgbbResponse.json();
      if (imgbbData && imgbbData.data && imgbbData.data.url) {
        return imgbbData.data.url;
      }
    }
  } catch (imgbbError) {
    console.warn("ImgBB upload failed, attempting fallback to backend upload server:", imgbbError);
  }

  // 2. Fallback to NestJS backend /upload endpoint
  try {
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: backendFormData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const result = await response.json();

    if (result && (result.url || result.data?.url)) {
      const rawUrl = result.url || result.data?.url;
      return formatImageUrl(rawUrl);
    } else {
      throw new Error(result?.message || "Failed to upload image to server");
    }
  } catch (error: any) {
    console.error("Server upload error:", error);
    throw new Error(error.message || "Image upload failed");
  }
};
