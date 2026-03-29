import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "./utils";

export type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ className, href, target, ...props }, ref) => {
    const isInternal = href && !href.startsWith("http") && !target;
    const commonClass = cn(
      "font-medium text-teal-700 underline underline-offset-4 hover:text-teal-900 cursor-pointer",
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
