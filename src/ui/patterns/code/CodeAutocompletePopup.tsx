import { cn } from "../../utils";
import type { CodeAutocompleteOption, CodeAutocompleteState } from "./types";

export interface CodeAutocompletePopupProps {
  context: CodeAutocompleteState;
  selectedIndex: number;
  position: {
    top?: number;
    bottom?: string;
    left: string;
  };
  onHoverIndex: (idx: number) => void;
  onSelect: (suggestion: CodeAutocompleteOption) => void;
}

/**
 * Domain-neutral inline floating autocomplete listbox positioned near the editor caret.
 */
export function CodeAutocompletePopup({
  context,
  selectedIndex,
  position,
  onHoverIndex,
  onSelect,
}: CodeAutocompletePopupProps) {
  return (
    <div
      style={{
        top: position.top,
        bottom: position.bottom,
        left: position.left,
      }}
      className="pb:absolute pb:z-30 pb:w-72 pb:max-w-[calc(100%-1rem)] pb:rounded-lg pb:border pb:border-peerbots-teal/60 pb:bg-white pb:shadow-xl pb:overflow-hidden"
    >
      <div className="pb:flex pb:items-center pb:justify-between pb:px-2.5 pb:py-1 pb:bg-gray-50 pb:border-b pb:border-gray-200 pb:text-[10px]">
        <span className="pb:font-semibold pb:text-gray-700 pb:truncate">
          {context.heading}
        </span>
        <span className="pb:text-gray-500 pb:shrink-0 pb:ms-2">Tab/Enter</span>
      </div>
      <div
        role="listbox"
        aria-label={context.heading}
        className="pb:max-h-40 pb:overflow-y-auto pb:divide-y pb:divide-gray-100"
      >
        {context.suggestions.map((sug, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={`${sug.label}-${idx}`}
              type="button"
              role="option"
              aria-selected={isSelected}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => onHoverIndex(idx)}
              onClick={() => onSelect(sug)}
              className={cn(
                "pb:w-full pb:flex pb:items-center pb:justify-between pb:gap-2 pb:px-2.5 pb:py-1.5 pb:text-left pb:text-xs pb:transition-colors pb:cursor-pointer",
                isSelected
                  ? "pb:bg-peerbots-teal/15 pb:text-gray-900"
                  : "pb:bg-white pb:text-gray-700 hover:pb:bg-gray-50",
              )}
            >
              <span className="pb:flex pb:items-center pb:gap-2 pb:min-w-0">
                {sug.swatchColor && (
                  <span
                    aria-hidden="true"
                    className="pb:w-3 pb:h-3 pb:rounded-sm pb:border pb:border-gray-300 pb:shrink-0"
                    style={{ backgroundColor: sug.swatchColor }}
                  />
                )}
                <code className="pb:font-mono pb:font-semibold pb:text-gray-900">
                  {sug.label}
                </code>
              </span>
              <span className="pb:text-[11px] pb:text-gray-500 pb:truncate">
                {sug.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
