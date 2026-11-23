---
"@peerbots/core": minor
---

Rename `CodeView` / `CodeViewProps` to `InspectView` / `InspectViewProps` (with default `"Inspect View"` heading and an optional `title` prop), while keeping the domain-neutral `Code*` subcomponents unchanged and re-exporting deprecated `CodeView` / `CodeViewProps` aliases (scheduled for removal in `v2.0.0`).
