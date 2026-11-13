import React, { useRef, useImperativeHandle } from "react";
import { Icon } from "../foundations/Icon";
import { Input, InputProps } from "../forms/Input";
import { cn } from "../utils";

/**
 * Props for `<SearchInput>` — single-field search input primitive combining `<Input>`, a leading magnifying-glass icon,
 * Enter-to-search, and Escape / clear-button reset behavior.
 */
export interface SearchInputProps
  extends Omit<InputProps, "leftIcon" | "rightIcon"> {
  /** Callback invoked with the current query string when pressing `Enter` or clearing the input. */
  onSearch?: (query: string) => void;
  /** Callback invoked when the clear button is clicked or `Escape` is pressed. */
  onClear?: () => void;
  /** Whether to show the trailing clear (`xCircle`) button when the input is non-empty (@default true). */
  showClearButton?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      onSearch,
      onClear,
      showClearButton = true,
      placeholder = "Search...",
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const handleClear = () => {
      if (internalRef.current) {
        internalRef.current.value = "";
      }
      if (onClear) {
        onClear();
      }
      if (onSearch) {
        onSearch("");
      }
      internalRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(internalRef.current?.value ?? "");
      } else if (e.key === "Escape") {
        handleClear();
      }
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    const hasValue =
      value !== undefined
        ? String(value).length > 0
        : internalRef.current?.value && internalRef.current.value.length > 0;

    return (
      <div className={cn("pb:relative pb:w-full", className)}>
        <Input
          ref={internalRef}
          type="text"
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          leftIcon={<Icon name="search" className="pb:w-4 pb:h-4 pb:text-gray-400" />}
          className="pb:pe-8"
          {...props}
        />
        {showClearButton && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className={cn(
              "pb:absolute pb:inset-y-0 pb:end-0 pb:flex pb:items-center pb:pe-2.5 pb:text-gray-400 pb:hover:text-gray-600 pb:cursor-pointer pb:transition-opacity pb:duration-150 pb:focus-visible:outline-none pb:focus-visible:ring-2 pb:focus-visible:ring-primary pb:rounded-e-md",
              hasValue ? "pb:opacity-100 pb:visible" : "pb:opacity-0 pb:invisible",
            )}
          >
            <Icon name="xCircle" className="pb:w-4 pb:h-4" />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
