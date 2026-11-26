# @peerbots/core

## 1.7.0

### Minor Changes

- [#46](https://github.com/PEERbots/peerbots-core/pull/46) [`567131f`](https://github.com/PEERbots/peerbots-core/commit/567131f415e02b072d543ad1c250e5c27c4838f7) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Redesign `DistributionBarChart` and `DistributionHistogram` with a cohesive Peerbots card style (pill horizontal bars with subtle vertical X-axis gridlines, clean rounded columns with subtle horizontal Y-axis gridlines, line-anchored `Avg`/`Reference` pills, axis titles, and crisp floating tooltips) using zero Victory/Lodash dependencies.

  Also add `@peerbots/core/charts` as a dedicated subpath export (matching `@peerbots/core/flow`) while keeping root `@peerbots/core` exports 100% backwards-compatible, mark `victory` as an optional peer dependency, declare `"sideEffects": ["**/*.css"]`, and enable ESM code splitting.

## 1.6.0

### Minor Changes

- [#44](https://github.com/PEERbots/peerbots-core/pull/44) [`00cb7ff`](https://github.com/PEERbots/peerbots-core/commit/00cb7ff76b89d6bfaf4dfd643e8bab05a980b45e) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Rename `CodeView` / `CodeViewProps` to `InspectView` / `InspectViewProps` (with default `"Inspect View"` heading and an optional `title` prop), while keeping the domain-neutral `Code*` subcomponents unchanged and re-exporting deprecated `CodeView` / `CodeViewProps` aliases (scheduled for removal in `v2.0.0`).

## 1.5.0

### Minor Changes

- [#42](https://github.com/PEERbots/peerbots-core/pull/42) [`18bd2b9`](https://github.com/PEERbots/peerbots-core/commit/18bd2b9899fefab87adfc1125306ed1107015a54) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Add a FlowView-style Lock/Unlock toggle (`defaultLocked` prop, `lockClosed`/`lockOpen` icon) and per-line left-gutter Play buttons (with `Ctrl/Cmd+Enter` shortcut and malformed/erroring code safeguards) to `CodeView` in both Shorthand and expanded JSON views.

## 1.4.3

### Patch Changes

- [#40](https://github.com/PEERbots/peerbots-core/pull/40) [`e068c7c`](https://github.com/PEERbots/peerbots-core/commit/e068c7cee90e2207eba663ccb3e8adbfcda5cc2f) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Fix Tailwind v4 `pb:` prefix ordering across `@peerbots/core` and make the `CodeView` side-by-side explainer panel resizable:
  - Audit and fix all Tailwind v4 prefix-order typos (`<variant>:pb:*` → `pb:<variant>:*` and `pb:pb:*` → `pb:*`) across `CodeView`, `CodeExplainerPanel`, `CodeEditorSurface`, `CodeInteractiveLines`, `CodeAutocompletePopup`, `FlowView`, `Dialog`, `Popover`, `Button`, `EmotionSelector`, `Input`, `NumberField`, `Select`, `Slider`, `Switch`, `CodeBlock`, `Icon`, `Typography`, `Accordion`, `Card`, `Collapsible`, `TableChrome`, `TablePrimitives`, `TableViewRow`, `Stepper`, `TabSelection`, and docs/stories so responsive, hover, focus, disabled, data-state, and RTL utilities compile properly.
  - Replace the fixed `CodeView` split with a dependency-free resizable desktop split (`role="separator"`, pointer drag, keyboard `ArrowLeft`/`ArrowRight`/`Home`, double-click reset, RTL-aware) and cap `CodeEditorSurface` (`pb:max-h-[32rem]`) and `CodeExplainerPanel` (`pb:lg:max-h-[36rem] pb:lg:overflow-y-auto`) so long templates scroll inside the editor while the explainer stays visible beside it without vertical page scrolling.

## 1.4.2

### Patch Changes

- [#38](https://github.com/PEERbots/peerbots-core/pull/38) [`ee19d8b`](https://github.com/PEERbots/peerbots-core/commit/ee19d8b2d73d8d8de8253390f9c96c56ae822c94) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Use `@theme static` in `src/styles/theme.css` so Tailwind v4 emits all Peerbots theme CSS custom properties in both the standalone `@peerbots/core/theme` stylesheet (`dist/styles/theme.css`) and the prefixed `--pb-*` tokens in the main bundle instead of tree-shaking unused theme tokens.

## 1.4.1

### Patch Changes

- [#36](https://github.com/PEERbots/peerbots-core/pull/36) [`b97003d`](https://github.com/PEERbots/peerbots-core/commit/b97003def51b9a47b449bf7113c88235b86af35f) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Improve FlowView mobile ergonomics, wire lock toggle, and remove CodeView copy button:
  - Default `FlowView` drag mode to `"pan"` on mobile/touch viewports (`pointer: coarse` or viewport width `< 768px`) while preserving `"select"` on desktop and honoring explicit `defaultDragBehavior`.
  - Combine the top-left and top-right `FlowView` control panels into a responsive wrapping top bar so the layout selector no longer overlaps the selection/action toolbar on narrow screens.
  - Wire React Flow's `<Controls />` lock button (`onInteractiveChange`) so locking toggles full read-only/control mode (hiding the edit toolbar, node edit popovers, and connection handles while keeping pan/zoom and button clicks active), and hide the lock toggle when `disabled={true}`.
  - Remove the Copy button from `CodeView` so template code cannot be trivially one-click copied.

## 1.4.0

### Minor Changes

- [#34](https://github.com/PEERbots/peerbots-core/pull/34) [`a9cac12`](https://github.com/PEERbots/peerbots-core/commit/a9cac12d2b85e52ebb4a7371c2d82db887fd4eee) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Add single-JSON collection export/import with paid Marketplace copy protection, template & collection reordering/archiving helpers, `InlineEditableSection` with accessible `<Label>` fields, and `CodeView` identity locks:

  - **Collection Export/Import & Marketplace Copy Guards**: Add `PeerbotsCollectionFile`, `isCollectionJson`, `serializeCollectionJson` (excluding archived templates by default unless `includeArchived: true`), `exportCollectionAsJson`, `parseCollectionJson`, `isPaidMarketplaceCopy`, and `canExportCollection`, plus multi-template collection auto-detection in `parseTemplateText` / `parseTemplateFile`.
  - **Template & Collection Reordering and Archiving**: Add `archived?: boolean` to `TemplateInfo`, `Template`, and `Content["data"]`, along with pure helpers `partitionByArchived`, `reorderTemplatesInfo`, `moveTemplateInList`, and `setTemplateInfoArchived`.
  - **`InlineEditableSection` Pattern Component**: Add reusable inline view/edit pattern component with associated `<Label>` elements (`titleLabel`, `descriptionLabel`, `titleTooltip`, `descriptionTooltip`) supporting both standalone description editing and Method C scoped collection editing.
  - **`CodeView` Identity Preservation**: Lock `template.id` and `template.contentID` during `CodeView` edits (`useCodeViewDraft`) and `parseCodeToTemplate` so pasted PTTF/JSON cannot overwrite template identity or collection provenance.
  - **Icons & `FlowView` Lazy Import**: Add `archiveBox` and `gripVertical` icons to `IconRegistry`, and restore Vite-resolvable `import("@peerbots/core/flow")` in `PeerbotsButtonDisplay`.

## 1.3.0

### Minor Changes

- [#29](https://github.com/PEERbots/peerbots-core/pull/29) [`2210210`](https://github.com/PEERbots/peerbots-core/commit/221021015f37d24fbd59a71f05f8b11626166246) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Add pure, controlled, store-agnostic Peerbots domain UI components, PR [#26](https://github.com/PEERbots/peerbots-core/issues/26) `TableView` suite, `@peerbots/core/flow` graph editor, and inlined robot face PNG icons:

  - `emotionMapper` (`PEERBOTS_EMOTION_IMAGES`, `emotion_mapping`), `EmotionSelector`, & `PeerbotsEmotionIcon` using inlined `app.peerbots.org` robot face PNGs (`Happy` -> `Neutral.png`, `Sleepy` -> `Sleep.png`) with neutral hover/border styling
  - `PeerbotsControlAction` & `RobotControlButtonAction` in `control-views/types`
  - `ButtonView` (`PeerbotsButtonView`), `TableView` (`PeerbotsTableView`) built on the `Table` component suite (`TableBulkActionBar`, `TableColumnApplyAllPopover`, Shift+Click range selection, Sync Speech with Title), and `PeerbotsButtonDisplay` orchestrator
  - `@peerbots/core/flow` subpath (`FlowView` / `PeerbotsFlowView`, `templateToFlowElements`, `FlowDirection`) with optional `@xyflow/react` and `@dagrejs/dagre` peer dependencies
  - `VoiceSelector` + `voiceHelpers` and `LanguageSelector` + `languageUtils`

- [#31](https://github.com/PEERbots/peerbots-core/pull/31) [`3270ee7`](https://github.com/PEERbots/peerbots-core/commit/3270ee79d1b26286ec4301053cb59411819cc882) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Add modeless `FlowView` authoring, `!` `Log` buttons, right-click `ButtonView` edit popover, PTTF spec/formatter/parser with `templateIO` `.pttf` auto-detection, interactive `CodeView`, UI refinements, and the `peerbots-content-authoring` skill:

  - **FlowView & ButtonView (`[#30](https://github.com/PEERbots/peerbots-core/issues/30)`)**: Modeless `FlowView` authoring with stabilized layout preservation, inline node editing, `Log` button support with `pencilNote` default `logIcon` (and `chatBubble` for Message), right-click `ButtonEditPopoverContent`, `ButtonView` `columns` option (`1 | 2 | 3 | 4 | "responsive"`), `PeerbotsButtonEditor`, `TemplateAnalysisPanel`, and `BasePanel`.
  - **PTTF & `templateIO` (`[#31](https://github.com/PEERbots/peerbots-core/issues/31)`)**: `docs/TEMPLATE_TEXT_FORMAT_SPEC.md`, `src/templates/pttf/*` (`formatTemplateToCode`, `analyzeTemplateCode`, `parseCodeToTemplate`, `getCodeAutocompleteContext`), and `parseTemplatePttf` / `serializeTemplatePttf` + `.pttf` auto-detection in `parseTemplateText` / `parseTemplateFile`.
  - **Code UI & `CodeView` (`[#31](https://github.com/PEERbots/peerbots-core/issues/31)`)**: Domain-neutral `src/ui/patterns/code/*` (`CodeExplainerPanel`, `CodeEditorSurface`, `CodeInteractiveLines`, `CodeAutocompletePopup`, `CodeStatusBar`) and unified `CodeView` with live syntax highlighting, inline autocomplete, line diagnostics, `Unsaved` / `Discard`, and `Ctrl/Cmd+Z` undo.
  - **UI & Forms (`[#31](https://github.com/PEERbots/peerbots-core/issues/31)`)**: `PasswordInput` (with visibility toggle, used in `AuthFormUI`), `Alert` floating overlay placement (`placement="floating"`), `CodeBlock` syntax highlighting, `VoiceSelector` auto-populating `window.speechSynthesis.getVoices()` and passing `VoiceDescriptor` in `onVoiceChange`, `TableView` auto-growing `TextArea` cells & selection-gated `Apply All`, and compact collapsed `LanguageSelector` (`β` indicator).
  - **Content Authoring Skill (`[#31](https://github.com/PEERbots/peerbots-core/issues/31)`)**: Bundled `skills/peerbots-content-authoring` (`@peerbots/core/skills/peerbots-content-authoring`) and Storybook `Content Authoring Skill` guide covering PTTF and the Peerbots Content Authoring Guidelines.

- [#29](https://github.com/PEERbots/peerbots-core/pull/29) [`1e99505`](https://github.com/PEERbots/peerbots-core/commit/1e995059e5c9e7e0426a8a90916d1486a3a7ab25) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Add responsive `Table` / `DataTable` component suite with decoupled state management (`useTableState`), `TableCellField` (`ghost`, `compact`, `default` variants), column header `Apply all` popovers, row selection with range support, and Storybook examples.

- [#29](https://github.com/PEERbots/peerbots-core/pull/29) [`5659d6d`](https://github.com/PEERbots/peerbots-core/commit/5659d6de32ec3dc770fd2a68e116d778f6fc38b0) Thanks [@sbeleidy](https://github.com/sbeleidy)! - Add canonical Peerbots template, message, palette, and hierarchy types (`Template`, `Message`, `RobotControlButton`, `PeerbotsEmotion`, `ProvenanceRef`), cycle-safe hierarchy traversal helpers (`flattenHierarchy`, `getRootButtonIds`, `getDirectChildIds`, `extractMessageButtons`), and zero-dependency RFC-4180 CSV & JSON template/palette I/O (`parseTemplateJson`, `parseTemplateCsv`, `parsePaletteCsv`, `convertPaletteToCSV`, `convertPaletteToTemplate`, `convertTemplateToPalette`, `parseTemplateFile`).

## 1.2.0

### Minor Changes

- [#24](https://github.com/PEERbots/peerbots-core/pull/24) [`f892786`](https://github.com/PEERbots/peerbots-core/commit/f892786fd09aebdbcb724cd173fbf7ed472f0d65) Thanks [@sbeleidy](https://github.com/sbeleidy)! - - Add `eye` and `eyeSlash` (`eye-slash`) icons to `iconPaths` and `Icon` ([#19](https://github.com/PEERbots/peerbots-core/issues/19))
  - Add `inline` prop to `Field` and configure `cn()` / stylesheet injection precedence so unprefixed consumer classes override `pb:` defaults without `!important` ([#21](https://github.com/PEERbots/peerbots-core/issues/21))
  - Add `size` presets (`sm`, `md`, `lg`, `xl`, `2xl`, `full`, `auto`) to `Dialog` ([#22](https://github.com/PEERbots/peerbots-core/issues/22))
  - Pass normalized `items` to `Select.Root` so closed `<Select.Trigger>` displays the human-readable option `label` instead of raw `value` ([#23](https://github.com/PEERbots/peerbots-core/issues/23))

## 1.1.0

### Minor Changes

- [#20](https://github.com/PEERbots/peerbots-core/pull/20) [`ee7e675`](https://github.com/PEERbots/peerbots-core/commit/ee7e6759328c2a24f5b9878d9c62f17a864fb063) Thanks [@sbeleidy](https://github.com/sbeleidy)! - feat(i18n): add internationalization, bidirectional (LTR/RTL) layout, and translation injection support

### Patch Changes

- [`265acb5`](https://github.com/PEERbots/peerbots-core/commit/265acb5f0f7e6c49bb04e114937bc7913aa0737d) Thanks [@sbeleidy](https://github.com/sbeleidy)! - fix(ui): update Bluesky social link to bsky.app/profile/peerbots.org

- [`9cd0943`](https://github.com/PEERbots/peerbots-core/commit/9cd09439378a3001dfb2bb17d49afa73cf1ce91c) Thanks [@sbeleidy](https://github.com/sbeleidy)! - fix(ui): update Twitter social link to x.com/peerbotsinc

## 1.0.1

### Patch Changes

- [#16](https://github.com/PEERbots/peerbots-core/pull/16) [`646cfd3`](https://github.com/PEERbots/peerbots-core/commit/646cfd32b5c89f2f53aa6a2dd91565bf2569f709) Thanks [@sbeleidy](https://github.com/sbeleidy)! - fix(a11y): assign unique IDs to Slider and NumberField in SliderWithNumberField to prevent duplicate ARIA IDs

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
