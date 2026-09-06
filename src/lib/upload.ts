/**
 * Uploads an image directly to SquadLog CDN (High-Performance Image CDN).
 * Returns the CDN image URL which will be saved in the database.
 *
 * CDN Base URL: http://ys5u1ge5eguiimbv9s2bkxrg.200.141.14.181.sslip.io
 */

const CDN_URL = (
  process.env.NEXT_PUBLIC_CDN_URL || "https://ys5u1ge5eguiimbv9s2bkxrg.200.141.14.181.sslip.io"
).replace(/^http:\/\//i, "https://");

export const uploadImage = async (
  file: File,
  options?: { width?: number; quality?: number; format?: string }
): Promise<string> => {
  const cdnFormData = new FormData();
  cdnFormData.append("file", file);

  const params = new URLSearchParams({
    format: options?.format || "webp",
    q: (options?.quality || 80).toString(),
  });
  if (options?.width) params.append("w", options.width.toString());

  const response = await fetch(`${CDN_URL}/upload/image?${params.toString()}`, {
    method: "POST",
    body: cdnFormData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `CDN upload failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data && data.success && data.url) {
    return data.url; // This CDN URL will be saved to your database
  }

  throw new Error(data?.message || "Failed to retrieve CDN URL from upload response");
};


