import React from "react";
import { cn } from "./utils";
import { IconName, icons } from "./IconRegistry";

export type { IconName };

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | "xl";
  name?: IconName;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, size = "md", name, children, ...props }, ref) => {
    const sizes = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    };

    const iconContent = name ? icons[name] : children;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(sizes[size], "inline-block", className)}
        {...props}
      >
        {iconContent}
      </svg>
    );
  },
);

Icon.displayName = "Icon";
