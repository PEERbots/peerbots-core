/**
 * `@peerbots/core` entry point exporting UI components, document head helpers,
 * data visualization charts, RTL/i18n providers, and Peerbots template schema & I/O utilities.
 */
import "./styles/index.css"; // Ensure CSS is bundled

export * from "./ui";
export * from "./helpers/SEO";
export * from "./charts";
export * from "./i18n";
export * from "./templates";
export type { PeerbotsColor } from "./templates";
