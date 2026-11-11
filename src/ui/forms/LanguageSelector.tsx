import React, { useState } from "react";
import {
  DEFAULT_SUPPORTED_LANGUAGES,
  type LanguageOption,
} from "../../helpers/languageUtils";
import { usePeerbotsI18n } from "../../i18n";
import { Popover } from "../feedback/Popover";
import { Icon } from "../foundations/Icon";
import { cn } from "../utils";
import { Select } from "./Select";

export type LanguageBadgeType = "beta" | "new";
export type LanguageSelectorVariant = "default" | "topbar" | "sidebar";

export interface LanguageSelectorLabels {
  language: string;
  beta: string;
  new: string;
}

export const DEFAULT_LANGUAGE_SELECTOR_LABELS: LanguageSelectorLabels = {
  language: "Language",
  beta: "Beta",
  new: "New",
};

export interface LanguageSelectorProps {
  /** Currently selected language code (e.g. `"en"`, `"es"`, `"ar"`) */
  value: string;
  /** Available language options (defaults to `DEFAULT_SUPPORTED_LANGUAGES`) */
  languages?: readonly LanguageOption[];
  /** Callback fired when a new language code is selected */
  onChange: (languageCode: string) => void;
  /**
   * Presentation variant:
   * - `"default"`: standard accessible form dropdown using `Select`
   * - `"topbar"`: compact pill trigger opening a `Popover` language menu
   * - `"sidebar"`: dashboard sidebar trigger (expanded or collapsed) opening a `Popover` menu
   */
  variant?: LanguageSelectorVariant;
  /** Whether the sidebar is collapsed (applies when `variant="sidebar"`) */
  isCollapsed?: boolean;
  /** Optional badge indicator (`"beta" | "new" | boolean`) */
  badge?: LanguageBadgeType | boolean;
  disabled?: boolean;
  id?: string;
  labels?: Partial<LanguageSelectorLabels>;
  className?: string;
}

export function LanguageSelector({
  value,
  languages = DEFAULT_SUPPORTED_LANGUAGES,
  onChange,
  variant = "default",
  isCollapsed = false,
  badge = false,
  disabled = false,
  id,
  labels,
  className,
}: LanguageSelectorProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const [open, setOpen] = useState(false);

  const resolvedLabels: LanguageSelectorLabels = {
    language:
      labels?.language ??
      contextLabels?.language?.language ??
      DEFAULT_LANGUAGE_SELECTOR_LABELS.language,
    beta:
      labels?.beta ??
      contextLabels?.language?.beta ??
      DEFAULT_LANGUAGE_SELECTOR_LABELS.beta,
    new:
      labels?.new ??
      contextLabels?.language?.new ??
      DEFAULT_LANGUAGE_SELECTOR_LABELS.new,
  };

  const currentLanguageInfo: LanguageOption =
    languages.find((lang) => lang.code === value) ??
    languages[0] ?? {
      code: value || "en",
      name: value || "English",
      englishName: value || "English",
    };

  const handleSelectLanguage = (code: string) => {
    if (disabled) return;
    onChange(code);
    setOpen(false);
  };

  const badgeType: LanguageBadgeType | null =
    badge === false || badge === undefined
      ? null
      : badge === "new"
        ? "new"
        : "beta";

  const renderBadge = (extraClasses = "") => {
    if (!badgeType) return null;
    return (
      <span
        className={cn(
          "pb:text-[10px] pb:leading-none pb:font-bold pb:px-1.5 pb:py-0.5 pb:rounded-full pb:border pb:uppercase pb:tracking-tight pb:whitespace-nowrap",
          badgeType === "beta"
            ? "pb:bg-amber-100 pb:text-amber-900 pb:border-amber-300"
            : "pb:bg-blue-100 pb:text-blue-900 pb:border-blue-300",
          extraClasses,
        )}
      >
        {badgeType === "beta" ? resolvedLabels.beta : resolvedLabels.new}
      </span>
    );
  };

  if (variant === "default") {
    const selectOptions = languages.map((lang) => ({
      label:
        lang.englishName && lang.englishName !== lang.name
          ? `${lang.name} (${lang.englishName})`
          : lang.name,
      value: lang.code,
    }));

    return (
      <Select
        id={id}
        options={selectOptions}
        value={value}
        disabled={disabled}
        onChange={(val) => {
          if (val !== null) {
            handleSelectLanguage(String(val));
          }
        }}
        className={className}
        aria-label={resolvedLabels.language}
      />
    );
  }

  const popoverTitle = (
    <div className="pb:flex pb:items-center pb:gap-2">
      <span>{resolvedLabels.language}</span>
      {renderBadge()}
    </div>
  );

  const languageMenuContent = (
    <div
      role="group"
      aria-label={resolvedLabels.language}
      className="pb:flex pb:flex-col pb:gap-1 pb:min-w-[180px] pb:p-1"
    >
      {languages.map((lang) => {
        const isSelected = lang.code === value;
        return (
          <button
            key={lang.code}
            type="button"
            disabled={disabled}
            aria-pressed={isSelected}
            onClick={() => handleSelectLanguage(lang.code)}
            className={cn(
              "pb:flex pb:items-center pb:justify-between pb:px-3 pb:py-2 pb:text-sm pb:rounded-lg pb:transition-colors pb:cursor-pointer pb:text-start pb:focus-visible:outline-2 pb:focus-visible:outline-offset-1 pb:focus-visible:outline-peerbots-darkteal",
              isSelected
                ? "pb:bg-teal-50 pb:text-teal-950 pb:font-semibold pb:border pb:border-teal-300"
                : "pb:text-gray-800 pb:hover:bg-gray-100 pb:hover:text-gray-950",
            )}
          >
            <div className="pb:flex pb:flex-col">
              <span className="pb:font-medium pb:text-sm">{lang.name}</span>
              {lang.englishName && (
                <span className="pb:text-[11px] pb:text-gray-600">
                  {lang.englishName}
                </span>
              )}
            </div>
            {isSelected && (
              <span
                aria-hidden="true"
                className="pb:text-teal-800 pb:font-bold pb:ms-2"
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  if (variant === "topbar") {
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
        side="bottom"
        align="end"
        title={popoverTitle}
        className="pb:w-auto pb:p-2 pb:rounded-xl pb:shadow-xl pb:bg-white pb:border pb:border-gray-200"
        trigger={
          <button
            id={id}
            type="button"
            disabled={disabled}
            aria-label={`${resolvedLabels.language}: ${currentLanguageInfo.name}`}
            className={cn(
              "pb:inline-flex pb:items-center pb:gap-1.5 pb:px-2.5 pb:py-1.5 pb:min-h-8 pb:rounded-md pb:border pb:border-gray-300 pb:bg-white pb:hover:bg-gray-50 pb:text-gray-800 pb:hover:text-gray-950 pb:text-xs pb:font-medium pb:cursor-pointer pb:shadow-xs pb:transition-colors pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-peerbots-darkteal pb:disabled:opacity-50 pb:disabled:cursor-not-allowed",
              className,
            )}
          >
            <Icon
              name="globe"
              size="md"
              aria-hidden="true"
              className="pb:w-4 pb:h-4 pb:text-gray-800"
            />
            <span>{currentLanguageInfo.name}</span>
            {renderBadge()}
            <Icon
              name="chevronDownSmall"
              size="sm"
              aria-hidden="true"
              className="pb:w-3 pb:h-3 pb:text-gray-800"
            />
          </button>
        }
      >
        {languageMenuContent}
      </Popover>
    );
  }

  // Sidebar variant (collapsed or expanded)
  if (isCollapsed) {
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
        side="right"
        align="start"
        title={popoverTitle}
        className="pb:w-auto pb:p-2 pb:rounded-xl pb:shadow-xl pb:bg-white pb:border pb:border-gray-200"
        trigger={
          <button
            id={id}
            type="button"
            disabled={disabled}
            aria-label={`${resolvedLabels.language}: ${currentLanguageInfo.name}`}
            className={cn(
              "pb:relative pb:m-1 pb:p-2 pb:hover:bg-gray-200 pb:rounded-md pb:transition-all pb:duration-200 pb:cursor-pointer pb:flex pb:flex-col pb:justify-center pb:items-center pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-peerbots-darkteal pb:text-gray-800 pb:hover:text-gray-950 pb:disabled:opacity-50 pb:disabled:cursor-not-allowed",
              className,
            )}
          >
            {badgeType && renderBadge("pb:absolute pb:-top-1.5 pb:-end-1 pb:z-10")}
            <Icon
              name="globe"
              size="lg"
              aria-hidden="true"
              className="pb:w-6 pb:h-6 pb:text-gray-700"
            />
            <span className="pb:text-[10px] pb:text-center pb:mt-1 pb:uppercase pb:font-semibold">
              {value.toUpperCase()}
            </span>
          </button>
        }
      >
        {languageMenuContent}
      </Popover>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      side="right"
      align="end"
      title={popoverTitle}
      className="pb:w-auto pb:p-2 pb:rounded-xl pb:shadow-xl pb:bg-white pb:border pb:border-gray-200"
      trigger={
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-label={`${resolvedLabels.language}: ${currentLanguageInfo.name}`}
          className={cn(
            "pb:m-1 pb:p-2 pb:hover:bg-gray-200 pb:rounded-md pb:transition-all pb:duration-200 pb:cursor-pointer pb:flex pb:items-center pb:justify-between pb:w-[calc(100%-0.5rem)] pb:text-start pb:focus-visible:outline-2 pb:focus-visible:outline-offset-2 pb:focus-visible:outline-peerbots-darkteal pb:text-gray-800 pb:hover:text-gray-950 pb:disabled:opacity-50 pb:disabled:cursor-not-allowed",
            className,
          )}
        >
          <div className="pb:flex pb:items-center pb:gap-1.5">
            <span className="pb:inline-block pb:pe-1">
              <Icon
                name="globe"
                size="lg"
                aria-hidden="true"
                className="pb:w-5 pb:h-5 pb:text-gray-800"
              />
            </span>
            <span className="pb:font-medium">{currentLanguageInfo.name}</span>
            {renderBadge()}
          </div>
          <Icon
            name="chevronDownSmall"
            size="sm"
            aria-hidden="true"
            className="pb:w-3.5 pb:h-3.5 pb:text-gray-800"
          />
        </button>
      }
    >
      {languageMenuContent}
    </Popover>
  );
}
