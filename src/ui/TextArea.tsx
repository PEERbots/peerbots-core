import { Input as BaseInput } from "@base-ui/react";
import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, id, ...props }, ref) => {
    return (
      <BaseInput
        render={<textarea />}
        ref={ref as React.Ref<HTMLTextAreaElement>}
        id={id}
        className={cn(
          "block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-primary/10 appearance-none",
          className,
        )}
        {...(props as ComponentPropsWithoutRef<typeof BaseInput>)}
      />
    );
  },
);

TextArea.displayName = "TextArea";
