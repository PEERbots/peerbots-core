/**
 * Canonical Peerbots Brand Palette tokens used for brand-themed UI accents and surfaces.
 *
 * - `"teal"`: Primary Brand Teal (`#5fc7cc`)
 * - `"pink"`: Secondary Brand Pink (`#e96c8a`)
 * - `"darkteal"`: High-Contrast Dark Teal (`#3f8588`)
 * - `"darkblue"`: Deep Navy for headings and dark surfaces (`#2e3a59`)
 * - `"olive"`: Earthy accent (`#82871f`)
 * - `"dark"`: Dark neutral / near-black (`#1a1a1a`)
 * - `"light"`: Light neutral / off-white (`#f8f9fa`)
 * - `"white"`: Pure white (`#ffffff`)
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
 * Semantic action and feedback status intent tokens for interactive controls and alerts.
 *
 * - `"primary"`: High-emphasis main call-to-action (Electric Cyan `#46d9d9`)
 * - `"neutral"`: Low-friction secondary action (Gray)
 * - `"success"`: Positive confirmation (Green)
 * - `"warning"`: Cautionary alert (Yellow/Amber)
 * - `"danger"`: Destructive action or error state (Red)
 * - `"info"`: Informational notice (Blue)
 */
export type IntentColor =
  | "primary"    // High-emphasis main call-to-action (Electric Cyan #46d9d9)
  | "neutral"    // Neutral, low-friction secondary action (Gray)
  | "success"    // Positive confirmation (Green)
  | "warning"    // Cautionary alert (Yellow/Amber)
  | "danger"     // Destructive action / Error (Red)
  | "info";      // Informational notice (Blue)

/**
 * Orthogonal color token accepted by `@peerbots/core` interactive components,
 * combining semantic {@link IntentColor} tokens with {@link BrandColor} tokens
 * independently of {@link FillVariant}, {@link ComponentSize}, and {@link ComponentRadius}.
 */
export type ComponentColor = IntentColor | BrandColor;

/**
 * Orthogonal visual fill treatment for interactive elements (e.g., `Button`),
 * decoupled from {@link ComponentColor}:
 * - `"solid"`: High-emphasis filled background with contrasting foreground text
 * - `"soft"`: Tinted subtle background fill
 * - `"outline"`: Transparent background with visible colored border
 * - `"ghost"`: Borderless transparent background that tints on hover/focus
 * - `"link"`: Inline text-link styling with underline behavior
 */
export type FillVariant = "solid" | "soft" | "outline" | "ghost" | "link";

/**
 * Orthogonal visual container style for layout surfaces (`Card`, `Dialog`, `SettingsPanel`):
 * - `"surface"`: Elevated background surface with subtle border/shadow
 * - `"outline"`: Crisp bordered container without elevation fill
 * - `"glass"`: Translucent frosted-glass backdrop surface
 * - `"flat"`: Minimal unbordered flat background container
 */
export type SurfaceVariant = "surface" | "outline" | "glass" | "flat";

/**
 * Standard five-step sizing scale controlling padding, typography, and minimum tap target height
 * across `@peerbots/core` form controls and buttons.
 */
export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Standard geometric corner radius tokens controlling border rounding on UI primitives
 * (`"none"` sharp corners through `"pill"` fully rounded capsules).
 */
export type ComponentRadius = "none" | "sm" | "md" | "lg" | "2xl" | "pill";
