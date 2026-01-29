/**
 * Maximum file size for image uploads (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

/**
 * Tiptap AI App ID
 * Replace with your actual Tiptap AI App ID
 * This will be replaced by Vite at build time
 */
const _env = (typeof import.meta !== "undefined" && (import.meta as { env?: Record<string, string> }).env) || {}
export const TIPTAP_AI_APP_ID = (_env.VITE_TIPTAP_AI_APP_ID as string) || ""

/**
 * Handles image upload
 * @param file - The file to upload
 * @param onProgress - Optional progress callback
 * @param abortSignal - Optional abort signal
 * @returns Promise resolving to the image URL
 */
export async function handleImageUpload(
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image")
  }

  // Create FormData
  const formData = new FormData()
  formData.append("file", file)

  // Upload to your API endpoint
  // Replace with your actual upload endpoint
  const apiUrl = (_env.VITE_APP_API_URL as string) || ""
  const uploadUrl = apiUrl
    ? `${apiUrl}/api/upload/image`
    : "/api/upload/image"

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Handle abort
    if (abortSignal) {
      abortSignal.addEventListener("abort", () => {
        xhr.abort()
        reject(new Error("Upload aborted"))
      })
    }

    // Track progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          onProgress({ progress })
        }
      })
    }

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response.url || response.data?.url || URL.createObjectURL(file))
        } catch {
          // If response is not JSON, assume it's a URL string
          resolve(xhr.responseText || URL.createObjectURL(file))
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    // Handle errors
    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"))
    })

    // Start upload
    xhr.open("POST", uploadUrl)
    xhr.send(formData)
  })
}
