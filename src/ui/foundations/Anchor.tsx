import * as React from "react";
import { cn } from "../utils";
import { ComponentColor } from "../types";

export interface AnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Palette color or semantic intent.
   * @default "default"
   */
  color?: ComponentColor | "muted" | "default";
  /**
   * Underline text decoration control.
   * @default "hover"
   */
  underline?: "hover" | "always" | "none";
  /**
   * Interaction style variant.
   * @default "default"
   */
  variant?: "default" | "ghost";
  /** Polymorphic component wrapper (e.g. react-router Link, Next.js Link) */
  as?: React.ElementType;
  /** Custom render prop */
  render?: (
    props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
  ) => React.ReactElement;
}

export type LinkProps = AnchorProps;

const colorClasses: Record<string, string> = {
  default: "pb:text-gray-900 pb:hover:text-peerbots-darkteal",
  neutral: "pb:text-gray-700 pb:hover:text-gray-950",
  muted: "pb:text-gray-600 pb:hover:text-gray-900",
  teal: "pb:text-peerbots-darkteal pb:hover:text-teal-950 pb:font-semibold",
  pink: "pb:text-rose-800 pb:hover:text-rose-950 pb:font-semibold",
  primary: "pb:text-dark-primary pb:hover:text-teal-950 pb:font-semibold",
  darkteal: "pb:text-peerbots-darkteal pb:hover:text-teal-950 pb:font-semibold",
  darkblue: "pb:text-peerbots-darkblue pb:hover:text-teal-900 pb:font-semibold",
  danger: "pb:text-red-700 pb:hover:text-red-900 pb:font-semibold",
};

const underlineClasses = {
  hover: "pb:hover:underline pb:underline-offset-4 pb:decoration-current",
  always: "pb:underline pb:underline-offset-4 pb:decoration-current",
  none: "pb:no-underline",
};

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  (
    {
      className,
      href,
      target,
      color = "default",
      underline = "hover",
      variant = "default",
      as: Component = "a",
      render,
      children,
      ...props
    },
    ref,
  ) => {
    const commonClass = cn(
      "pb:transition-colors pb:duration-150 pb:cursor-pointer pb:font-medium pb:inline-flex pb:items-center pb:gap-1",
      colorClasses[color] || colorClasses.default,
      underlineClasses[underline],
      variant === "ghost" && "pb:px-2 pb:py-1 pb:rounded-lg pb:hover:bg-gray-100",
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
