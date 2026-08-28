import React from "react";
import { cn } from "./utils";
import { Icon, IconName } from "./Icon";

export interface SocialLinkItem {
  name: string;
  url: string;
  ariaLabel?: string;
  icon?: IconName;
}

export const DEFAULT_PEERBOTS_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/peerbots",
    ariaLabel: "Peerbots on Facebook",
    icon: "facebook",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/peerbots",
    ariaLabel: "Peerbots on Instagram",
    icon: "instagram",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/peerbots",
    ariaLabel: "Peerbots on LinkedIn",
    icon: "linkedin",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/peerbots",
    ariaLabel: "Peerbots on Twitter / X",
    icon: "twitter",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@peerbots",
    ariaLabel: "Peerbots on YouTube",
    icon: "youtube",
  },
  {
    name: "BlueSky",
    url: "https://bsky.app/profile/peerbots.bsky.social",
    ariaLabel: "Peerbots on BlueSky",
    icon: "bluesky",
  },
  {
    name: "GitHub",
    url: "https://github.com/peerbots",
    ariaLabel: "Peerbots on GitHub",
    icon: "github",
  },
];

export interface SocialLinksProps {
  className?: string;
  links?: SocialLinkItem[];
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white" | "teal" | "dark" | "muted";
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className,
  links = DEFAULT_PEERBOTS_SOCIAL_LINKS,
  size = "md",
  variant = "default",
}) => {
  const sizeClasses = {
    sm: "pb:w-4 pb:h-4",
    md: "pb:w-5 pb:h-5",
    lg: "pb:w-6 pb:h-6",
  }[size];

  const variantClasses = {
    default:
      "pb:text-gray-500 pb:hover:text-peerbots-darkteal pb:hover:bg-peerbots-teal/10",
    white: "pb:text-white/80 pb:hover:text-white pb:hover:bg-white/10",
    teal: "pb:text-peerbots-teal pb:hover:text-peerbots-darkteal pb:hover:bg-peerbots-teal/15",
    dark: "pb:text-gray-900 pb:hover:text-peerbots-teal pb:hover:bg-gray-100",
    muted: "pb:text-gray-400 pb:hover:text-gray-700 pb:hover:bg-gray-100",
  }[variant];

  const buttonSizeClasses = {
    sm: "pb:p-1.5 pb:rounded-lg",
    md: "pb:p-2 pb:rounded-xl",
    lg: "pb:p-2.5 pb:rounded-2xl",
  }[size];

  return (
    <div className={cn("pb:flex pb:flex-wrap pb:items-center pb:gap-1.5", className)}>
      {links.map((link) => {
        const iconName = (link.icon ||
          link.name.toLowerCase().replace(/[^a-z0-9]/g, "")) as IconName;

        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "pb:inline-flex pb:items-center pb:justify-center pb:transition-all pb:duration-200 pb:cursor-pointer",
              variantClasses,
              buttonSizeClasses,
            )}
            aria-label={link.ariaLabel || `Visit Peerbots on ${link.name}`}
            title={link.name}
          >
            <Icon name={iconName} className={sizeClasses} />
          </a>
        );
      })}
    </div>
  );
};
