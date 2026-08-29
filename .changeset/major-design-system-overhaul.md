---
"@peerbots/core": major
---

# Major Release: Design System Primitives, Orthogonal Architecture, & Component Taxonomy

This major release introduces the centralized **Orthogonal Prop Architecture**, 10+ new UI primitives upstreamed from the ecosystem, hardware-accelerated animations, and a reorganized 7-category Storybook hierarchy.

---

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

---

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

---

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

---

## 4. Migration & Deprecations

- **`Button`**:
  - Deprecated `variant="marketing-teal"` / `variant="marketing-pink"`. Use `color="teal" radius="pill"` / `color="pink" radius="pill"`.
  - Deprecated `variant="secondary"`. Use `color="neutral"` (or `variant="soft"`).
  - Deprecated `variant="ghostly-danger"`. Use `variant="ghost" color="danger"`.
  *(Backward-compatibility adapters remain in place to prevent breaking existing code).*
- **`Typography`**:
  - `Text`: Prefer `color="muted"` over `variant="muted"`, and `size="sm"` over `variant="small"`.
  - `Heading`: Prefer `color="teal"`, `color="pink"`, `color="gradient"` over `variant="marketing-*"`.
