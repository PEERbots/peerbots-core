import React, { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { cn } from "./utils";

export interface DropzoneProps {
  /** Accepted MIME types or extensions (e.g. `"image/*"`, `"video/*"`, `".zip"`). */
  accept?: string;
  /** Maximum file size allowed in Megabytes (MB). */
  maxSizeMB?: number;
  /** Whether the dropzone is disabled. */
  disabled?: boolean;
  /**
   * Optional controlled URL or data URL of an uploaded file to display in preview mode.
   * If not provided, Dropzone will automatically generate and display a preview for selected images/videos.
   */
  previewUrl?: string | null;
  /** Optional controlled File object. */
  value?: File | null;
  /** Whether to automatically show a preview when an image/video is selected. Default is `true`. */
  showPreview?: boolean;
  /** How to render the preview. Default is `"auto"`. */
  previewType?: "image" | "video" | "auto";
  /** Main callout title. Default is `"Click or drag file to upload"`. */
  title?: React.ReactNode;
  /** Subtitle or requirement text. Default is `"Supported formats: PNG, JPG, WEBP, MP4"`. */
  subtitle?: React.ReactNode;
  /** Custom icon for the dropzone idle state. */
  icon?: React.ReactNode;
  /** Callback fired when a valid file is dropped or selected. */
  onFileSelect?: (file: File) => void;
  /** Callback fired when the active file/preview is cleared. */
  onFileRemove?: () => void;
  /** Callback fired when a file exceeds size limit or validation fails. */
  onError?: (errorMessage: string) => void;
  /** Optional custom CSS classes for the root dropzone container. */
  className?: string;
  id?: string;
  name?: string;
}

export const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    {
      accept,
      maxSizeMB,
      disabled = false,
      previewUrl: controlledPreviewUrl,
      value,
      showPreview = true,
      previewType = "auto",
      title = "Click or drag file to upload",
      subtitle,
      icon,
      onFileSelect,
      onFileRemove,
      onError,
      className,
      id,
      name,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [internalPreviewUrl, setInternalPreviewUrl] = useState<string | null>(null);
    const [internalPreviewType, setInternalPreviewType] = useState<"image" | "video">("image");
    const [imageLoadError, setImageLoadError] = useState(false);
    const generatedUrlRef = useRef<string | null>(null);

    // Sync value file prop to preview if passed
    useEffect(() => {
      if (value && showPreview) {
        if (generatedUrlRef.current) {
          URL.revokeObjectURL(generatedUrlRef.current);
        }
        const isVid = value.type.startsWith("video/");
        const url = URL.createObjectURL(value);
        generatedUrlRef.current = url;
        setInternalPreviewUrl(url);
        setInternalPreviewType(isVid ? "video" : "image");
        setImageLoadError(false);
      }
    }, [value, showPreview]);

    // Clean up created object URLs on unmount
    useEffect(() => {
      return () => {
        if (generatedUrlRef.current) {
          URL.revokeObjectURL(generatedUrlRef.current);
        }
      };
    }, []);

    const activePreviewUrl =
      controlledPreviewUrl !== undefined
        ? controlledPreviewUrl
        : internalPreviewUrl;

    const handleFile = (file: File) => {
      if (disabled) return;

      if (maxSizeMB) {
        const fileMB = file.size / (1024 * 1024);
        if (fileMB > maxSizeMB) {
          const msg = `File "${file.name}" (${fileMB.toFixed(1)} MB) exceeds maximum allowed size of ${maxSizeMB} MB.`;
          onError?.(msg);
          if (inputRef.current) inputRef.current.value = "";
          return;
        }
      }

      // Generate internal preview if enabled and not strictly controlled
      if (showPreview) {
        const isImg = file.type.startsWith("image/");
        const isVid = file.type.startsWith("video/");
        if (isImg || isVid) {
          if (generatedUrlRef.current) {
            URL.revokeObjectURL(generatedUrlRef.current);
          }
          const url = URL.createObjectURL(file);
          generatedUrlRef.current = url;
          setInternalPreviewUrl(url);
          setInternalPreviewType(isVid ? "video" : "image");
          setImageLoadError(false);
        }
      }

      onFileSelect?.(file);
    };

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragging(true);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
      }
    };

    const handleClick = () => {
      if (disabled) return;
      inputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    };

    const handleRemove = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (generatedUrlRef.current) {
        URL.revokeObjectURL(generatedUrlRef.current);
        generatedUrlRef.current = null;
      }
      setInternalPreviewUrl(null);
      setImageLoadError(false);
      if (inputRef.current) inputRef.current.value = "";
      onFileRemove?.();
    };

    const isVideo =
      previewType === "video" ||
      (previewType === "auto" &&
        (internalPreviewType === "video" ||
          (activePreviewUrl &&
            (activePreviewUrl.includes(".mp4") ||
              activePreviewUrl.includes(".mov") ||
              activePreviewUrl.includes(".webm") ||
              activePreviewUrl.startsWith("data:video/")))));

    const hasPreview = Boolean(showPreview && activePreviewUrl);

    return (
      <div
        ref={ref}
        className={cn(
          "pb:relative pb:w-full pb:rounded-2xl pb:border-2 pb:border-dashed pb:transition-all pb:overflow-hidden",
          isDragging
            ? "pb:border-primary pb:bg-primary/10"
            : "pb:border-gray-300 pb:hover:border-primary/80 pb:bg-gray-50/70 pb:hover:bg-gray-50",
          disabled && "pb:opacity-50 pb:cursor-not-allowed pb:hover:border-gray-300",
          className,
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          id={id}
          name={name}
          accept={accept}
          disabled={disabled}
          onChange={handleInputChange}
          className="pb:hidden"
          tabIndex={-1}
        />

        {/* Dragging Overlay when in preview mode */}
        {isDragging && hasPreview && (
          <div className="pb:absolute pb:inset-0 pb:z-20 pb:bg-primary/20 pb:backdrop-blur-xs pb:flex pb:flex-col pb:items-center pb:justify-center pb:gap-2">
            <div className="pb:w-10 pb:h-10 pb:rounded-full pb:bg-primary pb:text-slate-950 pb:flex pb:items-center pb:justify-center pb:shadow-md">
              <Icon name="arrowDownTray" className="pb:w-5 pb:h-5" />
            </div>
            <p className="pb:text-xs pb:font-bold pb:text-gray-900">Drop file to replace</p>
          </div>
        )}

        {hasPreview ? (
          <div className="pb:p-4 pb:space-y-3">
            <div
              onClick={handleClick}
              className="pb:relative pb:w-full pb:h-56 pb:overflow-hidden pb:rounded-xl pb:bg-gray-900 pb:flex pb:items-center pb:justify-center pb:cursor-pointer pb:group"
              title="Click to change file"
            >
              {isVideo ? (
                <video
                  src={activePreviewUrl!}
                  controls
                  className="pb:w-full pb:h-full pb:object-contain"
                />
              ) : imageLoadError ? (
                <div className="pb:p-6 pb:text-center pb:text-gray-400 pb:space-y-2">
                  <Icon name="xCircle" className="pb:w-8 pb:h-8 pb:mx-auto pb:text-red-400" />
                  <p className="pb:text-xs pb:font-medium">Failed to load image preview</p>
                </div>
              ) : (
                <img
                  src={activePreviewUrl!}
                  alt="File preview"
                  onError={() => setImageLoadError(true)}
                  className="pb:w-full pb:h-full pb:object-contain pb:group-hover:scale-102 pb:transition-transform"
                />
              )}

              {/* Hover overlay hint */}
              <div className="pb:absolute pb:inset-0 pb:bg-black/30 pb:opacity-0 pb:group-hover:opacity-100 pb:transition-opacity pb:flex pb:items-center pb:justify-center pb:pointer-events-none">
                <span className="pb:bg-white/90 pb:text-gray-900 pb:text-xs pb:font-bold pb:px-3 pb:py-1.5 pb:rounded-lg pb:shadow">
                  Click or drag to replace
                </span>
              </div>
            </div>

            <div className="pb:flex pb:items-center pb:justify-center pb:gap-3">
              <Button
                type="button"
                color="neutral"
                size="sm"
                onClick={handleClick}
                disabled={disabled}
                leftIcon={<Icon name="arrowUpTray" />}
              >
                Change File
              </Button>

              <Button
                type="button"
                variant="ghost"
                color="danger"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                leftIcon={<Icon name="x" />}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }}
            className="pb:p-8 pb:text-center pb:cursor-pointer pb:focus:outline-none pb:focus:ring-2 pb:focus:ring-primary pb:focus:ring-offset-2 pb:rounded-xl pb:space-y-2.5 pb:flex pb:flex-col pb:items-center pb:justify-center"
          >
            <div className="pb:w-12 pb:h-12 pb:rounded-full pb:bg-primary/20 pb:text-dark-primary pb:flex pb:items-center pb:justify-center">
              {icon || <Icon name="cloudArrowUp" className="pb:w-6 pb:h-6" />}
            </div>

            <div className="pb:space-y-1">
              <p className="pb:text-sm pb:font-bold pb:text-gray-900">{title}</p>
              {subtitle && (
                <p className="pb:text-xs pb:text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Dropzone.displayName = "Dropzone";
