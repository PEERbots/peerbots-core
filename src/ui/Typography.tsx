import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const headingSizes = {
  1: "pb:text-4xl pb:font-bold",
  2: "pb:text-3xl pb:font-bold",
  3: "pb:text-2xl pb:font-bold",
  4: "pb:text-xl pb:font-bold",
  5: "pb:text-lg pb:font-bold",
  6: "pb:text-base pb:font-bold",
};

const textVariants = {
  default: "pb:text-base pb:text-slate-950",
  muted: "pb:text-sm pb:text-slate-600",
  error: "pb:text-sm pb:text-red-600 pb:font-medium",
  small: "pb:text-xs pb:text-slate-600",
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
