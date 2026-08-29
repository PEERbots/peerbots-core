# @peerbots/core

## 1.0.0

### Major Changes

- [#14](https://github.com/PEERbots/peerbots-core/pull/14) [`299e477`](https://github.com/PEERbots/peerbots-core/commit/299e477310db89648919427e918610d1384cac29) Thanks [@sbeleidy](https://github.com/sbeleidy)! - # Major Release: Design System Primitives, Orthogonal Architecture, & Component Taxonomy

  This major release introduces the centralized **Orthogonal Prop Architecture**, 10+ new UI primitives upstreamed from the ecosystem, hardware-accelerated animations, and a reorganized 7-category Storybook hierarchy.

  ***

  ## 1. New Primitives & Components

  - **`ChipGroup` (`Forms/ChipGroup`)**: Selectable pill chips for single/multi-selection, filtering, status badges (`Soon`, `New`), custom icons, and optional horizontal scrollable rail.
  - **`Stepper` (`Patterns/Stepper`)**: Workflow sequence progress tracker with `horizontal` (connected line rail), `vertical` (timeline), and `chips` (jump pills) orientations.
  - **`Popover` (`Feedback/Popover`)**: Floating contextual card overlay built on Base UI with placement controls, header title, close button, pointing arrow, and backdrop dismissal.
  - **`Spinner` (`Feedback/Spinner`)**: Standalone animated circular loader supporting `size` and `color` props.
  - **`Card` (`Layout/Card`)**: Structural surface container supporting `surface` (elevated), `glass` (translucent backdrop-blur), `outline`, and `flat` variants, plus subtle brand tinting.
  - **`Accordion` & `Collapsible` (`Layout/`)**: Unified expandable disclosure components with smooth hardware-accelerated CSS Grid height/opacity transitions.
  - **`CodeBlock` (`Foundations/CodeBlock`)**: Clean frameless code block by default with floating top-right copy button; macOS-style file/terminal box opt-in via `variant="window"`.
  - **`CopyButton` (`Patterns/CopyButton`)**: Accessible click-to-copy button with clipboard hook integration, timeout, and copied feedback state.
  - **`SearchInput` (`Patterns/SearchInput`)**: Search input with built-in search icon, loading indicator, and clear button.
  - **`EmptyState` (`Feedback/EmptyState`)**: Dash-bordered empty state placeholder with icon, title, description, and primary/secondary action buttons.
  - **`FileUpload` & `Dropzone` (`Media & Files/`)**: Drag-and-drop file upload with live image/video preview, file validation, and replacement controls.
  - **`Avatar` (`Media & Files/`)**: Polymorphic user and robot avatar with image fallback initials and status indicator.
  - **`LineGraph` (`Charts/LineGraph`)**: Victory-based responsive SVG line graph with min/max bounds and data point markers.

  ***

  ## 2. Orthogonal Prop Architecture (`src/ui/types.ts`)

  Untangled overloaded `variant` props into dedicated, composable dimensions:

  - **`variant` (Fill Treatment)**: `"solid" | "soft" | "outline" | "ghost" | "link"`
  - **`color` (Palette & Intent)**: `"primary" | "neutral" | "teal" | "pink" | "darkblue" | "danger" | "success" | "warning"`
  - **`size` (Scale)**: `"xs" | "sm" | "md" | "lg" | "xl"`
  - **`radius` (Geometry)**: `"none" | "sm" | "md" | "lg" | "2xl" | "pill"`

  ### Component Updates:

  - **`Button`**: Fully supports the orthogonal matrix. E.g., `<Button color="neutral">` for calm secondary buttons, `<Button color="teal" radius="pill">` for hero CTAs, and `<Button color="danger" variant="ghost">` for low-friction delete actions.
  - **`Typography` (`Heading`, `Text`)**: Separates `size`, `color`, `weight`, and `level`.
  - **`Anchor`**: Separates `color`, `underline` (`"hover" | "always" | "none"`), and `variant`.
  - **`Alert`**: Standardized on `color`, `variant` (`"soft" | "outline" | "solid"`), and `pb:rounded-2xl` corners.
  - **`Dialog`**: Standardized on `pb:rounded-2xl` and `pb:shadow-2xl`.

  ***

  ## 3. Storybook Hierarchy & Living Documentation

  - Reorganized 41 components into 7 clean categories:
    1. `Foundations/`: `Typography`, `Colors`, `Icon`, `SocialLinks`, `CodeBlock`, `Anchor`
    2. `Forms/`: `Button`, `ChipGroup`, `Input`, `NumberField`, `TextArea`, `Select`, `Switch`, `Checkbox`, `Slider`, `SliderWithNumberField`, `TabRadio`, `PeerbotsColorSelector`, `Field`, `Label`
    3. `Layout/`: `Card`, `Accordion`, `Collapsible`, `Separator`, `SettingsPanel`
    4. `Media & Files/`: `Avatar`, `Dropzone`, `FileUpload`
    5. `Feedback/`: `Alert`, `Dialog`, `Popover`, `Tooltip`, `Skeleton`, `EmptyState`, `Spinner`
    6. `Charts/`: `LineGraph`, `DistributionBarChart`, `DistributionHistogram`
    7. `Patterns/`: `Stepper`, `CopyButton`, `SearchInput`, `AuthFormUI`, `TabSelection`
  - Rewrote `DesignSystem.mdx` with responsive JSX cards, standard recipes, Do's & Don'ts, and Glassmorphism guidelines.

  ***

  ## 4. Migration & Deprecations

  - **`Button`**:
    - Deprecated `variant="marketing-teal"` / `variant="marketing-pink"`. Use `color="teal" radius="pill"` / `color="pink" radius="pill"`.
    - Deprecated `variant="secondary"`. Use `color="neutral"` (or `variant="soft"`).
    - Deprecated `variant="ghostly-danger"`. Use `variant="ghost" color="danger"`.
      _(Backward-compatibility adapters remain in place to prevent breaking existing code)._
  - **`Typography`**:
    - `Text`: Prefer `color="muted"` over `variant="muted"`, and `size="sm"` over `variant="small"`.
    - `Heading`: Prefer `color="teal"`, `color="pink"`, `color="gradient"` over `variant="marketing-*"`.

### Minor Changes

- [#14](https://github.com/PEERbots/peerbots-core/pull/14) [`aa2bfb7`](https://github.com/PEERbots/peerbots-core/commit/aa2bfb700c1e76424c44d48efa6177d9f518735c) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Add general-purpose UI components:

  - `CopyButton` and `useClipboard` hook for accessible clipboard copying with animated feedback
  - `FileUpload` for standard accessible file input selection
  - `Dropzone` for drag-and-drop file upload with visual preview support
  - `Avatar` for user, maker, and robot profile display with initials and icon fallback

- [#14](https://github.com/PEERbots/peerbots-core/pull/14) [`121f94c`](https://github.com/PEERbots/peerbots-core/commit/121f94c7f531f64210b24707680599187e81e05b) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Add new reusable UI primitives: PeerbotsColorSelector, EmptyState, SearchInput, and LineGraph

- [#14](https://github.com/PEERbots/peerbots-core/pull/14) [`7e9c4ce`](https://github.com/PEERbots/peerbots-core/commit/7e9c4ce461c552d48a36072f3773293df714f365) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Upstream core primitives, design tokens, and domain icons:
  - **Design Tokens**: Add canonical Peerbots brand colors (`--color-peerbots-*`) to `theme.css`.
  - **Card**: Add new general `Card` primitive with elevation, tint variants, hover effects, and polymorphic `as`/`href` support.
  - **Accordion**: Add new accessible multi-item `Accordion` component with single/multiple expansion modes.
  - **CodeBlock**: Add standalone `CodeBlock` component with clipboard copy, line numbers, and language/filename badges.
  - **SocialLinks**: Add standardized `SocialLinks` component with Peerbots social media icons and variant styling.
  - **Anchor / Link**: Decouple from `react-router-dom`, making it framework-agnostic with variant styles (`default`, `teal`, `pink`, `underline`, `underline-pink`, `muted`).
  - **Button**: Support polymorphic `href` rendering and add marketing variants (`marketing-teal`, `marketing-pink`, `outline`).
  - **Typography**: Support marketing color variants on `Heading` and `Text`.
  - **IconRegistry & Icon**: Add 30+ domain icons (robotics, authoring, marketplace, audio, motion) and brand social icons with alias lookup.

## 0.2.6

### Patch Changes

- [`e8744e4`](https://github.com/PEERbots/peerbots-core/commit/e8744e47d7a64bdf61b6dfcc23311b940e390b3d) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Remove BasePanel since it's more of a peerbots-controller component

## 0.2.5

### Patch Changes

- [`6df88bf`](https://github.com/PEERbots/peerbots-core/commit/6df88bf7a04905024cb6d9cbc1b6505ce3872385) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Fix basepanel border

## 0.2.4

### Patch Changes

- bd466ee: fix dark primary color

## 0.2.3

### Patch Changes

- aa2c045: Postcss bundling of css

## 0.2.2

### Patch Changes

- 932a896: Export './dist/index.css' as an explicit subpath to correctly resolve imports in external apps.

## 0.2.1

### Patch Changes

- 079e008: Fix CSS export conditions in package.json for better compatibility with Tailwind v4 and modern bundlers. This resolve the error 'is not exported under the condition "style"'.

## 0.2.0

### Minor Changes

- d2950fc: Prefix all classnames with pb: to scope classes within peerbots core

## 0.1.3

### Patch Changes

- e530bad: Add access to iconpaths
- 95e1653: Fix iconpaths export
