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
      sm: "pb:w-3 pb:h-3",
      md: "pb:w-4 pb:h-4",
      lg: "pb:w-6 pb:h-6",
      xl: "pb:w-8 pb:h-8",
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
        className={cn(sizes[size], "pb:inline-block", className)}
        {...props}
      >
        {iconContent}
      </svg>
    );
  },
);

Icon.displayName = "Icon";
