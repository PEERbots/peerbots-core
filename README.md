# Peerbots Core

This package contains the core components for the Peerbots UI and theming. It provides the base for the Peerbots design system to be reused across repositories.

## Installation

```bash
npm install @peerbots/core
```

## Usage

### 1. Components
Import components and helpers directly from the package root:

```tsx
import { Button, Dialog, SEO } from "@peerbots/core";
```

### 2. Styles
You can import Peerbots styles either in your JavaScript/TypeScript entry point or directly in your CSS files.

#### **In JavaScript/TypeScript**
```tsx
// Complete styles (Components + Theme)
import "@peerbots/core/styles";

// OR Theme variables only (Colors + Fonts)
import "@peerbots/core/theme";
```

#### **In CSS**
If your bundler (like Vite or Webpack) supports resolving `node_modules`:

```css
/* Complete styles (Components + Theme) */
@import "@peerbots/core/styles";

/* OR Theme variables only (Colors + Fonts) */
@import "@peerbots/core/theme";
```

> [!TIP]
> **Which one should I use?**
> Use `@peerbots/core/styles` if you want the Peerbots UI components to look correct out of the box. Use `@peerbots/core/theme` if you only want to use the Peerbots color palette and typography in your own custom Tailwind project without the bundled component styles.