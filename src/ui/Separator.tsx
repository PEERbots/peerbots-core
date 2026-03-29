import * as React from "react";
import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "./utils";

export interface SeparatorProps extends React.ComponentPropsWithoutRef<
  typeof BaseSeparator
> {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const Separator = React.forwardRef<
  React.ElementRef<typeof BaseSeparator>,
  SeparatorProps
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <BaseSeparator
    ref={ref}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-gray-200",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className,
    )}
    {...props}
  />
));

Separator.displayName = BaseSeparator.displayName;
