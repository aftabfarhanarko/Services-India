import { formatImageUrl } from "./utils";

/**
 * SquadLog CDN (High-Performance Image & Asset CDN Service) Integration.
 * Uploads, compresses, and optimizes images on-the-fly using Sharp engine.
 * Target Endpoint: POST /upload/image?w=1200&q=80&format=webp
 */

const CDN_BASE_URL = (process.env.NEXT_PUBLIC_CDN_URL || "http://ys5u1ge5eguiimbv9s2bkxrg.200.141.14.181.sslip.io").replace(/\/+$/, "");
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.rajseba.in").replace(/\/+$/, "");

export const uploadImage = async (
  file: File,
  options?: { width?: number; quality?: number; format?: string }
): Promise<string> => {
  const params = new URLSearchParams({
    format: options?.format || "webp",
    q: (options?.quality || 80).toString(),
  });
  if (options?.width) {
    params.append("w", options.width.toString());
  } else {
    params.append("w", "1200");
  }

  const formData = new FormData();
  formData.append("file", file);

  // 1. Primary: SquadLog CDN High-Performance Image Optimization
  try {
    let cdnUrl = CDN_BASE_URL;
    if (typeof window !== "undefined" && window.location.protocol === "https:" && cdnUrl.startsWith("http://")) {
      cdnUrl = cdnUrl.replace(/^http:\/\//i, "https://");
    }

    const response = await fetch(`${cdnUrl}/upload/image?${params.toString()}`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.url) {
        return formatImageUrl(data.url);
      }
    }
  } catch (err) {
    console.warn("SquadLog CDN HTTPS upload failed, attempting direct HTTP endpoint...", err);
  }

  // 2. Direct SquadLog CDN HTTP Endpoint
  try {
    const response = await fetch(`${CDN_BASE_URL}/upload/image?${params.toString()}`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.url) {
        return formatImageUrl(data.url);
      }
    }
  } catch (err) {
    console.warn("SquadLog CDN HTTP upload failed, falling back to Backend API...", err);
  }

  // 3. Fallback: Backend API (/upload)
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      const rawUrl = data?.url || data?.data?.url;
      if (rawUrl) {
        return formatImageUrl(rawUrl);
      }
    }
  } catch (err) {
    console.warn("Backend API upload fallback failed, trying ImgBB...", err);
  }

  // 4. Fallback: ImgBB API
  try {
    const imgbbFormData = new FormData();
    imgbbFormData.append("image", file);

    const imgbbResponse = await fetch("https://api.imgbb.com/1/upload?key=6d207e02198a847aa98d0a2a901485a5", {
      method: "POST",
      body: imgbbFormData,
    });

    if (imgbbResponse.ok) {
      const imgbbData = await imgbbResponse.json();
      if (imgbbData?.data?.url) {
        return formatImageUrl(imgbbData.data.url);
      }
    }
  } catch (imgbbErr) {
    console.warn("ImgBB fallback upload error:", imgbbErr);
  }

  throw new Error("Failed to upload image via SquadLog CDN or fallback services");
};





