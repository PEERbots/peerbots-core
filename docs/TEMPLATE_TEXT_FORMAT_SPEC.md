# Peerbots Template Text Format (PTTF) Specification

> **Status:** Draft (v1)  
> **Scope:** `@peerbots/core` (`src/templates/codeFormat.ts`, `CodeView`) and `app.peerbots.org` bulk authoring / template import-export.

---

## 1. Overview & Design Goals

Peerbots templates (`Template`) are **ordered directed graphs** (`buttons` + `hierarchy`) where:
- Each button is either a **`Message`** (with `title`, `speech`, `labelColor`, robot face `color`, `emotion`, and optional `metadata`) or a **`Log`** event (with `title`, `details`, `labelColor`, and optional `metadata`).
- `hierarchy` defines an ordered list of top-level buttons (`root`) and ordered child lists (`hierarchy[buttonId]`), **allowing shared targets (DAGs) and cycles**.

The **Peerbots Template Text Format (PTTF)** is a plain-text, human-readable representation designed for two audiences:
1. **Laypeople (teachers, therapists, researchers):** Pasting or typing simple lines works with zero special syntax.
2. **Round-trip tooling (`Template ↔ Text`):** Any valid `Template` can be formatted to text and parsed back into an equivalent `Template` without losing colors, emotions, distinct speech, `Log` buttons, hierarchy order, cycles, or unlinked buttons.

### Design Principles
- **Progressive disclosure:** Default values (`Message` type, `Light Blue` colors, `Neutral` emotion, `speech === title`) are omitted when formatting so simple templates read like plain outlines.
- **Backward-compatible with `bulkAuthor`:** Existing emoticon prefixes (`:)`, `:(`, `:/`, `:o`, `:z`) and `Title: Speech` syntax continue to work.
- **Trees stay indented; cycles stay explicit:** Indentation expresses hierarchy naturally; `#anchor` + `-> #anchor` handles cycles and shared branches without forcing users to write raw adjacency lists.

---

## 2. Syntax & Grammar

Each non-empty line in PTTF represents either a **button definition**, a **jump reference** (`-> #anchor`), a **section header** (`## Unlinked`), or a **comment** (`// ...`).

### 2.1 Line Structure (Button Definition)

```text
[indent][- ] [#anchor] [[Log]] [[LabelColor -> RobotColor]] [emotion] Title [| Speech] [{ metadata }]
```

Every part except `Title` is optional:

| Element | Syntax | Default if Omitted | Example |
| :--- | :--- | :--- | :--- |
| **Indent** | `2 spaces` per depth level | Depth `0` (`root`) | `  - Hello` (child of previous depth `0` line) |
| **Bullet** | `- ` (optional on depth 0, standard on format) | — | `- Who can show me a sad face` |
| **Anchor** | `#slug` (letters, digits, `-`, `_`) | Auto-generated only if needed for a jump | `#sad-q` |
| **Type** | `[Log]` (case-insensitive) | `"Message"` | `[Log] Session started` |
| **Colors** | `[LabelColor]` / `[-> RobotColor]` / `[LabelColor -> RobotColor]` | `Light Blue` for both | `[Green -> Blue]` |
| **Emotion** | `:)`, `:(`, `:/`, `:o`, `:z` or `[Emotion]` | `"Neutral"` | `:)`, `[Concerned]` |
| **Title & Speech** | `Title \| Speech` (or `Title: Speech` if no `\|`) | `speech = title` | `Greeting \| Hello there!` |
| **Metadata** | `{ key: value, ... }` at end of line | `undefined` | `{ goal: "Turn-taking", score: 2 }` |

---

### 2.2 Colors (`[Label -> Robot]`)

Peerbots buttons have **two** independent colors from the canonical 11-color palette (`Light Blue`, `Blue`, `Green`, `Red`, `Purple`, `Pink`, `Yellow`, `Orange`, `Grey`, `Black`, `White`):
- **`[Green]`** → Sets `labelColor = "Green"`, keeps robot `color = "Light Blue"`.
- **`[-> Red]`** → Keeps `labelColor = "Light Blue"`, sets robot `color = "Red"`.
- **`[Green -> Red]`** → Sets `labelColor = "Green"` and robot `color = "Red"`.
- For `[Log]` buttons, `[Log, Grey]` or `[Log] [Grey]` sets `labelColor = "Grey"` (Log buttons have no robot face color).

Color names are matched case-insensitively during parsing and emitted in canonical Title Case during formatting.

---

### 2.3 Emotions

Supported `PeerbotsEmotion` values:
- `Neutral` (default, omitted when formatting)
- `Happy` → `:)` (or `[Happy]`)
- `Sad` → `:(` (or `[Sad]`)
- `Surprised` → `:o` (also parses `:/` or `[Surprised]`)
- `Sleepy` → `:z` (or `[Sleepy]`)
- `Concerned` → `[Concerned]` (also parses `:\` or `[Concerned]`)

---

### 2.4 Title, Speech, and Log Details

- **`Title | Speech`**: Unambiguous separator. Left side is `details.title`; right side is `details.speech` (for `Message`) or `details.details` (for `Log`).
- **`Title: Speech`** (fallback when no `|` is present): Supported for compatibility with `bulkAuthor` when `:` separates a short label from spoken text. When formatting, if `speech !== title`, PTTF always emits `|` so colons inside sentences (e.g. `"Time: 3:00"`) round-trip safely.

---

### 2.5 Hierarchy, Cycles, and Unlinked Buttons

1. **Tree edges via indentation:**
   - A line at depth `d` becomes a child of the most recent button definition at depth `d - 1` (or `hierarchy.root` when `d === 0`).
   - Sibling order in `hierarchy` matches top-to-bottom line order.
2. **Cycles & shared nodes via `#anchor` + `-> #anchor`:**
   - When formatting a `Template`, the first time a button is visited in depth-first order from `root`, its full definition is emitted.
   - If that button is referenced again (either as a **back-edge cycle** to an ancestor or a **shared DAG child** from another parent), the formatter:
     1. Ensures the target button line has an `#anchor` (derived from its slugified title or ID, guaranteed unique).
     2. Emits `-> #anchor` at the referencing child's indentation level.
   - When parsing, `-> #anchor` adds `targetButtonId` to the parent's `hierarchy` array without creating a duplicate button.
3. **Unlinked buttons:**
   - Buttons present in `template.buttons` that are not reachable from `hierarchy.root` are emitted under a `## Unlinked` section at the end of the document, preserving them across round-trips.

---

## 3. Complete Example

```text
// Social Check-In Template
- #check-in [Green] Who can show me a sad face
  - :( That's sad
    - [Green] :) Ok, what about a happy face?
      - :) That's happy
        - -> #check-in
- Thanks!
- [Yellow] Let's learn about colors!
  - [-> Light Blue] Light Blue
  - [-> Red] Red
  - [-> Purple] Purple
- [Log] [Grey] Session Marker | Child initiated greeting
```

---

## 4. `CodeView` Interactive Explainer

In `@peerbots/core`, `CodeView` (`src/ui/patterns/control-views/CodeView.tsx`) complements `ButtonView`, `TableView`, and `FlowView`:
- **Shorthand (PTTF) & JSON Switcher:** Switch seamlessly between the layman-friendly **Shorthand** outline and raw **JSON** (`buttons` + `hierarchy`), both with token-level syntax highlighting.
- **Inspect Mode + Interactive Hover / Focus Explainer:** Hovering or focusing any line or token (in either Shorthand or JSON) displays:
  1. A **live `PeerbotsButton` preview** showing the exact button appearance (label color, robot face badge, emotion icon, or `Log` zap badge).
  2. A **plain-English breakdown** of each token on that line (e.g., *"Button color: Green • Robot face: Red"*, *"Nested inside 'Who can show me a sad face'"*, *"Jumps back to 'Who can show me a sad face' (loop)"*, or JSON key explanations).
- **Edit & Format Mode:** Allows editing Shorthand or JSON directly with layered syntax highlighting, clicking **Format** to tidy/canonicalize it, viewing live parse diagnostics, and applying changes back to the `Template`.
