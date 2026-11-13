import { HTMLAttributes } from "react";
import { cn } from "../utils";

/**
 * Props for `<Skeleton>` — an animated placeholder block used while content loads.
 */
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Sizing and shape utility classes (e.g. `"pb:h-6 pb:w-40"`). */
  className?: string;
}

/**
 * Pulsing loading placeholder surface.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("pb:animate-pulse pb:rounded-md pb:bg-gray-200", className)}
      {...props}
    />
  );
}
