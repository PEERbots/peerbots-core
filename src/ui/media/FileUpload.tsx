import React, { useRef, useState } from "react";
import { Button, ButtonProps } from "../forms/Button";
import { Icon } from "../foundations/Icon";
import { cn } from "../utils";

export interface FileUploadProps {
  /** Accepted file types (e.g. `"image/*"`, `".pdf"`, `"audio/*"`). */
  accept?: string;
  /** Whether multiple files can be selected. */
  multiple?: boolean;
  /** Whether the input is disabled. */
  disabled?: boolean;
  /** Maximum allowable file size in bytes. */
  maxSizeBytes?: number;
  /** Text displayed inside the trigger button. Default is `"Choose File"`. */
  buttonText?: React.ReactNode;
  /** Button style variant. Default is `"secondary"`. */
  buttonVariant?: ButtonProps["variant"];
  /** Button size. Default is `"md"`. */
  buttonSize?: ButtonProps["size"];
  /** Icon shown inside the button. Default is `<Icon name="arrowUpTray" />`. */
  buttonIcon?: React.ReactNode;
  /** Text shown when no file has been chosen. Default is `"No file chosen"`. */
  placeholder?: string;
  /** Whether to show a clear/remove button when files are selected. Default is `true`. */
  clearable?: boolean;
  /** Controlled file(s) value. */
  value?: File | File[] | null;
  /** Callback fired when file selection changes. */
  onChange?: (files: File | File[] | null) => void;
  /** Callback fired when a file exceeds size limit or validation fails. */
  onError?: (errorMessage: string) => void;
  /** Optional custom CSS classes. */
  className?: string;
  id?: string;
  name?: string;
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      accept,
      multiple = false,
      disabled = false,
      maxSizeBytes,
      buttonText = "Choose File",
      buttonVariant = "secondary",
      buttonSize = "md",
      buttonIcon = <Icon name="arrowUpTray" />,
      placeholder = "No file chosen",
      clearable = true,
      value,
      onChange,
      onError,
      className,
      id,
      name,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [internalFiles, setInternalFiles] = useState<File[]>([]);

    const activeFiles = value
      ? Array.isArray(value)
        ? value
        : [value]
      : internalFiles;

    const handleButtonClick = () => {
      if (disabled) return;
      inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files ? Array.from(e.target.files) : [];
      if (selected.length === 0) return;

      // Validate file sizes
      if (maxSizeBytes) {
        const oversized = selected.find((f) => f.size > maxSizeBytes);
        if (oversized) {
          const msg = `File "${oversized.name}" exceeds maximum allowed size of ${formatBytes(maxSizeBytes)}.`;
          onError?.(msg);
          if (inputRef.current) inputRef.current.value = "";
          return;
        }
      }

      setInternalFiles(selected);
      if (onChange) {
        onChange(multiple ? selected : selected[0] || null);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setInternalFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      if (onChange) {
        onChange(multiple ? [] : null);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "pb:inline-flex pb:items-center pb:gap-3 pb:w-full pb:max-w-md",
          disabled && "pb:opacity-60 pb:cursor-not-allowed",
          className,
        )}
      >
        <input
          ref={inputRef}
          type="file"
          id={id}
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleFileChange}
          className="pb:hidden"
          tabIndex={-1}
        />

        <Button
          type="button"
          variant={buttonVariant}
          size={buttonSize}
          disabled={disabled}
          leftIcon={buttonIcon}
          onClick={handleButtonClick}
        >
          {buttonText}
        </Button>

        <div className="pb:flex-1 pb:min-w-0 pb:flex pb:items-center pb:justify-between pb:gap-2 pb:py-1 pb:px-2 pb:bg-gray-50 pb:border pb:border-gray-200 pb:rounded-md pb:text-xs">
          {activeFiles.length > 0 ? (
            <span className="pb:font-medium pb:text-gray-800 pb:truncate">
              {activeFiles.length === 1
                ? `${activeFiles[0].name} (${formatBytes(activeFiles[0].size)})`
                : `${activeFiles.length} files selected`}
            </span>
          ) : (
            <span className="pb:text-gray-400 pb:truncate">{placeholder}</span>
          )}

          {clearable && activeFiles.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="pb:p-0.5 pb:text-gray-400 pb:hover:text-gray-700 pb:rounded pb:hover:bg-gray-200 pb:cursor-pointer pb:transition-colors"
              title="Clear selection"
              aria-label="Clear selected file"
            >
              <Icon name="x" className="pb:w-3.5 pb:h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  },
);

FileUpload.displayName = "FileUpload";
