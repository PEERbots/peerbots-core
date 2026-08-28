import * as React from "react";
import { cn } from "./utils";

export interface AnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?:
    | "default"
    | "pink"
    | "teal"
    | "underline"
    | "underline-pink"
    | "muted";
  as?: React.ElementType;
  render?: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => React.ReactElement;
}

export type LinkProps = AnchorProps;

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  (
    {
      className,
      href,
      target,
      variant = "default",
      as: Component = "a",
      render,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default: "pb:text-gray-700 pb:hover:text-peerbots-pink",
      pink: "pb:text-peerbots-pink pb:hover:opacity-80 pb:font-semibold",
      teal: "pb:text-peerbots-teal pb:hover:opacity-80 pb:font-semibold",
      underline:
        "pb:text-gray-900 pb:underline pb:decoration-2 pb:decoration-peerbots-teal pb:underline-offset-4 pb:hover:bg-peerbots-teal/5",
      "underline-pink":
        "pb:text-gray-900 pb:underline pb:decoration-2 pb:decoration-peerbots-pink pb:underline-offset-4 pb:hover:bg-peerbots-pink/5",
      muted: "pb:text-gray-500 pb:hover:text-gray-900",
    };

    const commonClass = cn(
      "pb:transition-colors pb:duration-200 pb:cursor-pointer pb:font-medium",
      variants[variant],
      className,
    );

    const anchorProps = {
      href,
      target,
      className: commonClass,
      ...props,
    };

    if (render) {
      return render(anchorProps);
    }

    return (
      <Component ref={ref} {...anchorProps}>
        {children}
      </Component>
    );
  },
);

Anchor.displayName = "Anchor";

export const Link = Anchor;
export { Anchor };

