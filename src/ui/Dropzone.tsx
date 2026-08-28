import React, { useRef, useState } from "react";
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
  /** Optional URL or data URL of a currently selected/uploaded file to display in preview mode. */
  previewUrl?: string | null;
  /** How to render the preview. Default is `"auto"`. */
  previewType?: "image" | "video" | "auto";
  /** Main callout title. Default is `"Click or drag file to upload"`. */
  title?: React.ReactNode;
  /** Subtitle or requirement text. Default is `"Supported formats: PNG, JPG, MP4"`. */
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
      previewUrl,
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

    const isVideo =
      previewType === "video" ||
      (previewType === "auto" &&
        previewUrl &&
        (previewUrl.includes(".mp4") ||
          previewUrl.includes(".mov") ||
          previewUrl.includes(".webm") ||
          previewUrl.startsWith("data:video/")));

    return (
      <div
        ref={ref}
        className={cn(
          "pb:relative pb:w-full pb:rounded-xl pb:border-2 pb:border-dashed pb:transition-colors",
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

        {previewUrl ? (
          <div className="pb:p-4 pb:space-y-3">
            <div className="pb:relative pb:aspect-video pb:max-h-64 pb:w-full pb:mx-auto pb:overflow-hidden pb:rounded-lg pb:bg-black pb:flex pb:items-center pb:justify-center">
              {isVideo ? (
                <video
                  src={previewUrl}
                  controls
                  className="pb:w-full pb:h-full pb:object-contain"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="File preview"
                  className="pb:w-full pb:h-full pb:object-contain"
                />
              )}
            </div>

            <div className="pb:flex pb:items-center pb:justify-center pb:gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                disabled={disabled}
                leftIcon={<Icon name="arrowUpTray" />}
              >
                Change File
              </Button>

              {onFileRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (inputRef.current) inputRef.current.value = "";
                    onFileRemove();
                  }}
                  disabled={disabled}
                  leftIcon={<Icon name="x" />}
                  className="pb:text-red-600 pb:hover:text-red-700 pb:hover:bg-red-50"
                >
                  Remove
                </Button>
              )}
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
