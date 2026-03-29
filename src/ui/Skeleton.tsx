import { HTMLAttributes } from "react";
import { cn } from "./utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200/50", className)}
      {...props}
    />
  );
}
