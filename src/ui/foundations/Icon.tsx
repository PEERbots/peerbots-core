import React from "react";
import { cn } from "../utils";
import { IconName, icons } from "./IconRegistry";

export type { IconName };

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | "xl";
  name?: IconName;
  shouldMirror?: boolean;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, size = "md", name, children, shouldMirror, ...props }, ref) => {
    const sizes = {
      sm: "pb:w-3 pb:h-3",
      md: "pb:w-4 pb:h-4",
      lg: "pb:w-6 pb:h-6",
      xl: "pb:w-8 pb:h-8",
    };

    const iconContent = name ? icons[name] : children;

    // List of icons that should be mirrored in RTL by default
    const directionalIcons: IconName[] = [
      "chevronRight",
      "arrowRightOnRectangle",
      "arrowUturnLeft",
      "externalLink",
      "play",
    ];

    const isDirectional = name ? directionalIcons.includes(name) : false;
    const mirror = shouldMirror ?? isDirectional;

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
        className={cn(
          sizes[size],
          "pb:inline-block",
          mirror && "rtl:pb:-scale-x-100",
          className,
        )}
        {...props}
      >
        {iconContent}
      </svg>
    );
  },
);

Icon.displayName = "Icon";
