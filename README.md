# Peerbots Core

This package contains the core components for the Peerbots UI and theming. It provides the base for the Peerbots design system to be reused across repositories.

[**Browse Storybook**](https://main--69ce9e8ef541367e5769da26.chromatic.com)

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
Styles are **automatically injected** when you import any component. No additional CSS configuration or manual style imports are required in your project.

#### **Advanced: Theme Variables Only**
If you only want to use the Peerbots color palette and typography in your own custom Tailwind project without the bundled components, you can still import the CSS variables:

```tsx
// In JavaScript/TypeScript
import "@peerbots/core/theme";

// OR in CSS
@import "@peerbots/core/theme";
```

> [!TIP]
> **Which one should I use?**
> Use `@peerbots/core/styles` if you want the Peerbots UI components to look correct out of the box. Use `@peerbots/core/theme` if you only want to use the Peerbots color palette and typography in your own custom Tailwind project without the bundled component styles.