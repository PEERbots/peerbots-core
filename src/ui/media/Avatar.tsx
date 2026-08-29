import React, { useState } from "react";
import { Icon } from "../foundations/Icon";
import { cn } from "../utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL. */
  src?: string | null;
  /** Full name of the user, maker, or robot. Used to generate initials and accessible label. */
  name?: string;
  /** Accessible alt text for the avatar image. Defaults to `name` or `"Avatar"`. */
  alt?: string;
  /** Size variant. Defaults to `"md"`. */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Shape of the avatar. Defaults to `"circle"`. */
  shape?: "circle" | "rounded";
  /** Custom fallback icon if no image or initials are available. */
  fallbackIcon?: React.ReactNode;
}

function getInitials(name?: string): string {
  if (!name) return "";
  const trimmed = name.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const colorTints = [
  "pb:bg-teal-100 pb:text-teal-900 pb:border-teal-200",
  "pb:bg-blue-100 pb:text-blue-900 pb:border-blue-200",
  "pb:bg-purple-100 pb:text-purple-900 pb:border-purple-200",
  "pb:bg-amber-100 pb:text-amber-900 pb:border-amber-200",
  "pb:bg-rose-100 pb:text-rose-900 pb:border-rose-200",
  "pb:bg-emerald-100 pb:text-emerald-900 pb:border-emerald-200",
];

function getHashColor(name?: string): string {
  if (!name) return colorTints[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorTints.length;
  return colorTints[index];
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      name,
      alt,
      size = "md",
      shape = "circle",
      fallbackIcon,
      className,
      ...props
    },
    ref,
  ) => {
    const [imgError, setImgError] = useState(false);
    const initials = getInitials(name);
    const accessibleAlt = alt || name || "Avatar";

    const sizeStyles = {
      xs: "pb:w-6 pb:h-6 pb:text-[10px]",
      sm: "pb:w-8 pb:h-8 pb:text-xs",
      md: "pb:w-10 pb:h-10 pb:text-sm",
      lg: "pb:w-12 pb:h-12 pb:text-base",
      xl: "pb:w-16 pb:h-16 pb:text-xl",
    };

    const iconSizeStyles = {
      xs: "pb:w-3.5 pb:h-3.5",
      sm: "pb:w-4 pb:h-4",
      md: "pb:w-5 pb:h-5",
      lg: "pb:w-6 pb:h-6",
      xl: "pb:w-8 pb:h-8",
    };

    const shapeStyle = shape === "circle" ? "pb:rounded-full" : "pb:rounded-xl";
    const colorStyle = getHashColor(name);

    const hasValidImage = Boolean(src && !imgError);

    return (
      <div
        ref={ref}
        role="img"
        aria-label={accessibleAlt}
        className={cn(
          "pb:relative pb:inline-flex pb:items-center pb:justify-center pb:shrink-0 pb:overflow-hidden pb:border pb:font-bold pb:select-none",
          sizeStyles[size],
          shapeStyle,
          !hasValidImage && colorStyle,
          className,
        )}
        {...props}
      >
        {hasValidImage ? (
          <img
            src={src!}
            alt={accessibleAlt}
            onError={() => setImgError(true)}
            className="pb:w-full pb:h-full pb:object-cover"
          />
        ) : initials ? (
          <span className="pb:tracking-wider">{initials}</span>
        ) : (
          <span className={cn("pb:flex pb:items-center pb:justify-center", iconSizeStyles[size])}>
            {fallbackIcon || <Icon name="userCircle" className="pb:w-full pb:h-full" />}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
