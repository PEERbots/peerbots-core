import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const headingSizes = {
  1: "text-4xl font-bold",
  2: "text-3xl font-bold",
  3: "text-2xl font-bold",
  4: "text-xl font-bold",
  5: "text-lg font-bold",
  6: "text-base font-bold",
};

const textVariants = {
  default: "text-base text-slate-950",
  muted: "text-sm text-slate-600",
  error: "text-sm text-red-600 font-medium",
  small: "text-xs text-slate-600",
};

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}

export const Heading = ({
  level = 1,
  className,
  children,
  ...props
}: HeadingProps) => {
  return React.createElement(
    `h${level}`,
    { className: cn(headingSizes[level], className), ...props },
    children,
  );
};

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "error" | "small";
  as?: React.ElementType;
  children?: React.ReactNode;
}

export const Text = ({
  variant = "default",
  as: Component = "p",
  className,
  children,
  ...props
}: TextProps) => {
  return React.createElement(
    Component,
    { className: cn(textVariants[variant], className), ...props },
    children,
  );
};

export const TypographyList = ({ args }: { args: Record<string, unknown> }) => {
  return (
    <div
      className="pb:space-y-4"
      {...(args as React.HTMLAttributes<HTMLDivElement>)}
    >
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>
      <Text>Body text</Text>
      <Text variant="muted">Caption text</Text>
      <Text variant="small">Small text</Text>
      <Text variant="small" as="span">
        Small span text
      </Text>
    </div>
  );
};
