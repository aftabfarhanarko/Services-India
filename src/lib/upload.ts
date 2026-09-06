/**
 * Uploads an image to SquadLog CDN (High-Performance Image CDN) with automatic HTTPS/HTTP & ImgBB fallbacks.
 */

const CDN_HTTPS_URL = "https://ys5u1ge5eguiimbv9s2bkxrg.200.141.14.181.sslip.io";
const CDN_HTTP_URL = "http://ys5u1ge5eguiimbv9s2bkxrg.200.141.14.181.sslip.io";
const IMGBB_API_KEY = "a6c948ab64f7987bbf9e5477cde3a1cb";

export const uploadImage = async (
  file: File,
  options?: { width?: number; quality?: number; format?: string }
): Promise<string> => {
  const params = new URLSearchParams({
    format: options?.format || "webp",
    q: (options?.quality || 80).toString(),
  });
  if (options?.width) params.append("w", options.width.toString());

  // 1. Try SquadLog CDN via HTTPS
  try {
    const cdnFormData = new FormData();
    cdnFormData.append("file", file);

    const response = await fetch(`${CDN_HTTPS_URL}/upload/image?${params.toString()}`, {
      method: "POST",
      body: cdnFormData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn("CDN HTTPS upload failed, attempting HTTP endpoint...", err);
  }

  // 2. Try SquadLog CDN via HTTP (in case SSL certificate is not configured on VPS port)
  try {
    const cdnFormData = new FormData();
    cdnFormData.append("file", file);

    const response = await fetch(`${CDN_HTTP_URL}/upload/image?${params.toString()}`, {
      method: "POST",
      body: cdnFormData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn("CDN HTTP upload failed, falling back to ImgBB...", err);
  }

  // 3. Fallback to ImgBB if CDN Host is temporarily unreachable
  try {
    const imgbbFormData = new FormData();
    imgbbFormData.append("image", file);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: imgbbFormData,
    });

    if (imgbbResponse.ok) {
      const imgbbData = await imgbbResponse.json();
      if (imgbbData?.data?.url) {
        return imgbbData.data.url;
      }
    }
  } catch (imgbbErr) {
    console.error("ImgBB fallback upload error:", imgbbErr);
  }

  throw new Error("Failed to upload image via SquadLog CDN or fallback service");
};



