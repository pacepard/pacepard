import * as React from "react"
import { cn } from "@pacepard/ui/lib/utils"
import { Image, X } from "@phosphor-icons/react"

export interface ImageUploadProps {
  /**
   * The current image URL or base64 string to display
   */
  value?: string | null
  /**
   * Callback when an image is selected
   */
  onChange?: (file: File | null, preview: string | null) => void
  /**
   * Callback when image is removed
   */
  onRemove?: () => void
  /**
   * Accept file types (default: "image/*")
   */
  accept?: string
  /**
   * Maximum file size in bytes (default: 5MB)
   */
  maxSize?: number
  /**
   * Custom className for the container
   */
  className?: string
  /**
   * Size of the upload area
   */
  size?: "sm" | "md" | "lg"
  /**
   * Show remove button
   */
  showRemove?: boolean
  /**
   * Placeholder text or element
   */
  placeholder?: React.ReactNode
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Error message
   */
  error?: string
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
  lg: "w-24 h-24",
}

const iconSizeClasses = {
  sm: "text-2xl",
  md: "text-[36px]",
  lg: "text-4xl",
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
  size = "md",
  showRemove = true,
  placeholder,
  disabled = false,
  error,
}: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [preview, setPreview] = React.useState<string | null>(value || null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setPreview(value || null)
  }, [value])

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Please select an image file"
    }
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }
    return null
  }

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setUploadError(validationError)
      return
    }

    setUploadError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      onChange?.(file, result)
    }
    reader.onerror = () => {
      setUploadError("Failed to read file")
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    setUploadError(null)
    onChange?.(null, null)
    onRemove?.()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const displayError = error || uploadError

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-[6px]",
          "flex items-center justify-center",
          "bg-[#f7f6f3] dark:bg-[#2e2e2e]",
          "border border-[#e9e9e6] dark:border-[#404040]",
          "shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]",
          "transition-all duration-150 ease-out",
          "cursor-pointer",
          sizeClasses[size],
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "hover:bg-[#f1f1ef] dark:hover:bg-[#3a3a3a]",
          !disabled && "hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.06)]",
          !disabled && "active:scale-[0.98]",
          isDragging && "ring-2 ring-[#2383e2]/20 ring-offset-2",
          displayError && "border-[#eb5757] dark:border-[#eb5757]"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-[6px]"
            />
            {showRemove && !disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className={cn(
                  "absolute -top-2 -right-2",
                  "w-6 h-6 rounded-full",
                  "bg-[#eb5757] hover:bg-[#d84545]",
                  "text-white",
                  "flex items-center justify-center",
                  "shadow-[0_2px_4px_0_rgba(0,0,0,0.1)]",
                  "transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-[#eb5757]/20 focus:ring-offset-2"
                )}
                aria-label="Remove image"
              >
                <X size={14} weight="bold" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {placeholder ? (
              placeholder
            ) : (
              <Image
                size={size === "sm" ? 24 : size === "md" ? 28 : 32}
                className="text-[#787774] dark:text-[#9b9a97]"
                weight="regular"
              />
            )}
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-[13px] text-[#eb5757] dark:text-[#ff6b6b] text-center">
          {displayError}
        </p>
      )}
    </div>
  )
}
