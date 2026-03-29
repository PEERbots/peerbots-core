import React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react";
import { cn } from "./utils";
import { Icon } from "./Icon";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  delay?: "normal" | "slow";
}

export function Tooltip({
  content,
  children,
  className,
  delay = "normal",
}: TooltipProps) {
  return (
    <BaseTooltip.Provider delay={delay === "slow" ? 1000 : 0}>
      <BaseTooltip.Root>
        {React.isValidElement(children) ? (
          <BaseTooltip.Trigger render={children} />
        ) : (
          <BaseTooltip.Trigger>{children}</BaseTooltip.Trigger>
        )}
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner sideOffset={8}>
            <BaseTooltip.Popup
              className={cn(
                "z-50 rounded shadow-lg bg-white p-2 text-xs text-center whitespace-normal max-w-xs text-gray-900 border border-gray-200",
                className,
              )}
            >
              {content}
              <BaseTooltip.Arrow className="fill-white stroke-gray-200" />
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
export interface HelperTooltipProps {
  content: React.ReactNode;
  className?: string;
}

export function HelperTooltip({ content, className }: HelperTooltipProps) {
  return (
    <Tooltip content={content} className={className}>
      <Icon size="md" className="text-gray-500 hover:text-gray-700 cursor-help">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
        />
      </Icon>
    </Tooltip>
  );
}
