/**
 * Canonical Peerbots Brand Palette
 */
export type BrandColor =
  | "teal"       // Primary Brand Teal (#5fc7cc)
  | "pink"       // Secondary Brand Pink (#e96c8a)
  | "darkteal"   // High-Contrast Dark Teal (#3f8588)
  | "darkblue"   // Deep Navy for Headings/Dark Surfaces (#2e3a59)
  | "olive"      // Earthy Accent (#82871f)
  | "dark"       // Dark Neutral / Near-Black (#1a1a1a)
  | "light"      // Light Neutral / Off-White (#f8f9fa)
  | "white";     // Pure White (#ffffff)

/**
 * Semantic Action & Status Intents
 */
export type IntentColor =
  | "primary"    // High-emphasis main call-to-action (Electric Cyan #46d9d9)
  | "neutral"    // Neutral, low-friction secondary action (Gray)
  | "success"    // Positive confirmation (Green)
  | "warning"    // Cautionary alert (Yellow/Amber)
  | "danger"     // Destructive action / Error (Red)
  | "info";      // Informational notice (Blue)

/**
 * Composite Color Token for UI Components
 */
export type ComponentColor = IntentColor | BrandColor;

/**
 * Visual Fill Style / Treatment
 */
export type FillVariant = "solid" | "soft" | "outline" | "ghost" | "link";

/**
 * Surface & Container Styles (Cards, Dialogs, Panels)
 */
export type SurfaceVariant = "surface" | "outline" | "glass" | "flat";

/**
 * Standard Sizing Scale
 */
export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Standard Geometric Border Radii
 */
export type ComponentRadius = "none" | "sm" | "md" | "lg" | "2xl" | "pill";
