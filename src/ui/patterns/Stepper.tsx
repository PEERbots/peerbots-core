import React from "react";
import { cn } from "../utils";
import { Icon } from "../foundations/Icon";
import { ComponentColor, ComponentSize } from "../types";

export type StepStatus = "complete" | "current" | "upcoming" | "disabled";

export interface StepItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: StepStatus;
  icon?: React.ReactNode;
}

export interface StepperProps {
  /** Array of sequential steps */
  steps: StepItem[];
  /** Controlled currently active step id */
  activeStepId?: string;
  /** Callback fired when a step is clicked */
  onStepClick?: (stepId: string) => void;
  /** Layout orientation */
  orientation?: "horizontal" | "vertical" | "chips";
  /** Brand color theme */
  color?: ComponentColor;
  /** Size scale */
  size?: ComponentSize;
  className?: string;
}

const colorBadgeStyles: Record<string, { current: string; complete: string; line: string }> = {
  teal: {
    current: "pb:bg-peerbots-teal pb:text-gray-900 pb:ring-4 pb:ring-peerbots-teal/30",
    complete: "pb:bg-peerbots-darkteal pb:text-white",
    line: "pb:bg-peerbots-darkteal",
  },
  pink: {
    current: "pb:bg-rose-700 pb:text-white pb:ring-4 pb:ring-rose-200",
    complete: "pb:bg-rose-800 pb:text-white",
    line: "pb:bg-rose-700",
  },
  primary: {
    current: "pb:bg-primary pb:text-gray-900 pb:ring-4 pb:ring-primary/30",
    complete: "pb:bg-dark-primary pb:text-white",
    line: "pb:bg-dark-primary",
  },
  darkblue: {
    current: "pb:bg-peerbots-darkblue pb:text-white pb:ring-4 pb:ring-peerbots-darkblue/20",
    complete: "pb:bg-peerbots-darkblue pb:text-white",
    line: "pb:bg-peerbots-darkblue",
  },
  neutral: {
    current: "pb:bg-gray-900 pb:text-white pb:ring-4 pb:ring-gray-300",
    complete: "pb:bg-gray-800 pb:text-white",
    line: "pb:bg-gray-600",
  },
};

export function Stepper({
  steps,
  activeStepId,
  onStepClick,
  orientation = "horizontal",
  color = "teal",
  size = "md",
  className,
}: StepperProps) {
  const activeIndex = steps.findIndex((s) => s.id === activeStepId);
  const colorStyle = colorBadgeStyles[color] || colorBadgeStyles.teal;

  const resolveStatus = (step: StepItem, index: number): StepStatus => {
    if (step.status) return step.status;
    if (activeIndex === -1) return index === 0 ? "current" : "upcoming";
    if (index < activeIndex) return "complete";
    if (index === activeIndex) return "current";
    return "upcoming";
  };

  // 1. "chips" compact jump mode (as in Moddy build guide)
  if (orientation === "chips") {
    return (
      <ol
        className={cn(
          "pb:flex pb:flex-row pb:flex-wrap pb:items-center pb:gap-2 pb:list-none pb:p-0 pb:m-0",
          className,
        )}
      >
        {steps.map((step, idx) => {
          const status = resolveStatus(step, idx);
          const isCurrent = status === "current";
          const isComplete = status === "complete";
          const isClickable = Boolean(onStepClick) && status !== "disabled";

          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "pb:inline-flex pb:items-center pb:gap-1.5 pb:pl-1.5 pb:pr-3 pb:py-1 pb:rounded-full pb:border pb:transition-all pb:duration-150 pb:text-xs pb:font-bold",
                  isClickable ? "pb:cursor-pointer" : "pb:cursor-default",
                  isCurrent
                    ? cn(colorStyle.current, "pb:shadow-sm")
                    : isComplete
                      ? "pb:bg-gray-100 pb:text-gray-900 pb:border-gray-300 pb:hover:border-peerbots-darkteal"
                      : "pb:bg-white pb:text-gray-600 pb:border-gray-300 pb:hover:text-gray-900",
                )}
              >
                <span
                  className={cn(
                    "pb:flex pb:items-center pb:justify-center pb:w-4 pb:h-4 pb:rounded-full pb:text-[10px] pb:font-bold",
                    isCurrent
                      ? "pb:bg-black/15 pb:text-current"
                      : isComplete
                        ? "pb:bg-peerbots-darkteal pb:text-white"
                        : "pb:bg-gray-200 pb:text-gray-700",
                  )}
                >
                  {isComplete ? (
                    <Icon name="check" className="pb:w-2.5 pb:pb:h-2.5" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span className="pb:uppercase pb:tracking-tight pb:whitespace-nowrap">
                  {step.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    );
  }

  // 2. "vertical" layout mode
  if (orientation === "vertical") {
    return (
      <ol
        className={cn(
          "pb:flex pb:flex-col pb:gap-0 pb:list-none pb:p-0 pb:m-0",
          className,
        )}
      >
        {steps.map((step, idx) => {
          const status = resolveStatus(step, idx);
          const isCurrent = status === "current";
          const isComplete = status === "complete";
          const isLast = idx === steps.length - 1;
          const isClickable = Boolean(onStepClick) && status !== "disabled";

          return (
            <li key={step.id} className="pb:relative pb:flex pb:items-start pb:gap-4 pb:pb-6">
              {!isLast && (
                <div
                  className={cn(
                    "pb:absolute pb:left-4 pb:top-8 pb:-bottom-0 pb:w-0.5 pb:bg-gray-200",
                    isComplete && colorStyle.line,
                  )}
                />
              )}

              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "pb:flex pb:items-center pb:justify-center pb:w-8 pb:h-8 pb:rounded-full pb:font-bold pb:text-xs pb:shrink-0 pb:transition-all pb:duration-200 pb:z-10",
                  isClickable ? "pb:cursor-pointer" : "pb:cursor-default",
                  isCurrent
                    ? colorStyle.current
                    : isComplete
                      ? colorStyle.complete
                      : "pb:bg-gray-100 pb:text-gray-700 pb:border pb:border-gray-300",
                )}
              >
                {step.icon || (isComplete ? <Icon name="check" className="pb:w-4 pb:h-4" /> : idx + 1)}
              </button>

              <div
                onClick={() => isClickable && onStepClick?.(step.id)}
                className={cn(
                  "pb:pt-0.5 pb:flex-1",
                  isClickable && "pb:cursor-pointer",
                )}
              >
                <div
                  className={cn(
                    "pb:text-sm pb:font-bold",
                    isCurrent
                      ? "pb:text-gray-950"
                      : isComplete
                        ? "pb:text-gray-900"
                        : "pb:text-gray-600",
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className="pb:text-xs pb:text-gray-600 pb:mt-0.5 pb:leading-relaxed">
                    {step.description}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  // 3. "horizontal" rail mode (default)
  return (
    <ol
      className={cn(
        "pb:flex pb:w-full pb:items-center pb:justify-between pb:gap-2 pb:list-none pb:p-0 pb:m-0",
        className,
      )}
    >
      {steps.map((step, idx) => {
        const status = resolveStatus(step, idx);
        const isCurrent = status === "current";
        const isComplete = status === "complete";
        const isLast = idx === steps.length - 1;
        const isClickable = Boolean(onStepClick) && status !== "disabled";

        return (
          <React.Fragment key={step.id}>
            <li className="pb:flex pb:flex-col pb:items-center pb:text-center pb:relative">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "pb:flex pb:items-center pb:justify-center pb:w-9 pb:h-9 pb:rounded-full pb:font-bold pb:text-xs pb:transition-all pb:duration-200 pb:z-10",
                  isClickable ? "pb:cursor-pointer" : "pb:cursor-default",
                  isCurrent
                    ? colorStyle.current
                    : isComplete
                      ? colorStyle.complete
                      : "pb:bg-gray-100 pb:text-gray-700 pb:border pb:border-gray-300",
                )}
              >
                {step.icon || (isComplete ? <Icon name="check" className="pb:w-4 pb:h-4" /> : idx + 1)}
              </button>

              <div className="pb:mt-2 pb:max-w-[120px]">
                <div
                  className={cn(
                    "pb:text-xs pb:font-bold pb:leading-tight",
                    isCurrent
                      ? "pb:text-gray-950"
                      : isComplete
                        ? "pb:text-gray-900"
                        : "pb:text-gray-600",
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className="pb:text-[10px] pb:text-gray-600 pb:mt-0.5 pb:hidden sm:pb:block truncate">
                    {step.description}
                  </div>
                )}
              </div>
            </li>

            {!isLast && (
              <div
                className={cn(
                  "pb:flex-1 pb:h-0.5 pb:bg-gray-200 pb:mx-2 pb:transition-colors pb:duration-300 pb:-mt-6",
                  isComplete && colorStyle.line,
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </ol>
  );
}
