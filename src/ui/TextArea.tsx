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
          "pb:block pb:w-full pb:rounded-md pb:border-0 pb:px-1.5 pb:py-1.5 pb:text-gray-900 pb:ring-1 pb:ring-inset pb:ring-gray-300 pb:placeholder:text-gray-400 pb:focus:ring-2 pb:focus:ring-inset pb:focus:ring-primary pb:sm:text-sm pb:sm:leading-6 pb:bg-primary/10 pb:appearance-none",
          className,
        )}
        {...(props as ComponentPropsWithoutRef<typeof BaseInput>)}
      />
    );
  },
);

TextArea.displayName = "TextArea";
