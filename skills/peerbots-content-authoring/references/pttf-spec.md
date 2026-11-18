# Peerbots Template Text Format (PTTF) Quick Reference

PTTF is the plain-text, round-trippable representation of a Peerbots `Template` (`buttons` + `hierarchy`).

## Line Structure

```text
[indent][- | !] [#anchor] [[LabelColor -> RobotColor]] [emotion] Title [| Speech] [{ metadata }]
```

Every part except `Title` is optional:

| Element | Syntax | Default if Omitted | Example |
| :--- | :--- | :--- | :--- |
| **Indent** | `2 spaces` per depth level | Depth `0` (`root`) | `  - Hello` |
| **Bullet / Type** | `- ` for `Message`, `! ` for `Log` (`- ` optional at depth 0) | `"Message"` | `! Session started` |
| **Anchor** | `#slug` (letters, digits, `-`, `_`) | Auto-generated only if referenced | `#check-in` |
| **Colors** | `[LabelColor]` / `[-> RobotColor]` / `[LabelColor -> RobotColor]` | `Light Blue` for both | `[Green -> Blue]` |
| **Emotion** | `:)`, `:(`, `:/`, `:o`, `:z`, or `[Emotion]` | `"Neutral"` | `:)`, `[Concerned]` |
| **Title & Speech** | `Title \| Speech` (or `Title: Speech` if no `\|`) | `speech = title` | `Hint \| Try looking at the color` |
| **Metadata** | `{ key: value, ... }` at end of line | `undefined` | `{ goal: "Turn-taking" }` |

## Canonical 11-Color Palette

`Light Blue`, `Blue`, `Green`, `Red`, `Purple`, `Pink`, `Yellow`, `Orange`, `Grey`, `Black`, `White`

- `[Green]` → `labelColor = "Green"`, `color = "Light Blue"`
- `[-> Red]` → `labelColor = "Light Blue"`, `color = "Red"`
- `[Green -> Red]` → `labelColor = "Green"`, `color = "Red"`
- `! [Grey] Marker` → `Log` button with `labelColor = "Grey"` (**never** use `-> RobotColor` on `!` Log buttons)

## Supported Emotions (`PeerbotsEmotion`)

- `Neutral` (default, omitted when formatting)
- `Happy` → `:)` or `[Happy]`
- `Sad` → `:(` or `[Sad]`
- `Surprised` → `:o` (also parses `:/` or `[Surprised]`)
- `Sleepy` → `:z` or `[Sleepy]`
- `Concerned` → `[Concerned]` (also parses `:\`)

## Hierarchy, Cycles, and Unlinked Buttons

- **Nesting:** A line at depth `d` becomes a child of the most recent button definition at depth `d - 1`.
- **Cycles & shared branches:** Define `#anchor` on the target line, then reference it with `-> #anchor` at the child indentation level.
- **Comments:** Lines starting with `//` are comments (great for documenting color legends).
- **Unlinked buttons:** Buttons not reachable from `root` live under `## Unlinked`.
