---
"@peerbots/core": minor
---

Upstream core primitives, design tokens, and domain icons:
- **Design Tokens**: Add canonical Peerbots brand colors (`--color-peerbots-*`) to `theme.css`.
- **Card**: Add new general `Card` primitive with elevation, tint variants, hover effects, and polymorphic `as`/`href` support.
- **Accordion**: Add new accessible multi-item `Accordion` component with single/multiple expansion modes.
- **CodeBlock**: Add standalone `CodeBlock` component with clipboard copy, line numbers, and language/filename badges.
- **SocialLinks**: Add standardized `SocialLinks` component with Peerbots social media icons and variant styling.
- **Anchor / Link**: Decouple from `react-router-dom`, making it framework-agnostic with variant styles (`default`, `teal`, `pink`, `underline`, `underline-pink`, `muted`).
- **Button**: Support polymorphic `href` rendering and add marketing variants (`marketing-teal`, `marketing-pink`, `outline`).
- **Typography**: Support marketing color variants on `Heading` and `Text`.
- **IconRegistry & Icon**: Add 30+ domain icons (robotics, authoring, marketplace, audio, motion) and brand social icons with alias lookup.
