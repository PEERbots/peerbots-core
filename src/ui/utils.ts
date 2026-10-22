import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  experimentalParseClassName({ className, parseClassName }) {
    return parseClassName(
      className.startsWith("pb:")
        ? className.slice(3)
        : className.replace(/:pb:/g, ":"),
    );
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

