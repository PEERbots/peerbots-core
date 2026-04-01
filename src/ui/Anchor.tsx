import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "./utils";

export type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ className, href, target, ...props }, ref) => {
    const isInternal = href && !href.startsWith("http") && !target;
    const commonClass = cn(
      "pb:font-medium pb:text-teal-700 pb:underline pb:underline-offset-4 pb:hover:text-teal-900 pb:cursor-pointer",
      className,
    );

    if (isInternal) {
      return <Link to={href} ref={ref} className={commonClass} {...props} />;
    } else {
      return (
        <a
          href={href}
          target={target}
          ref={ref}
          className={commonClass}
          {...props}
        />
      );
    }
  },
);
Anchor.displayName = "Anchor";

export { Anchor };
