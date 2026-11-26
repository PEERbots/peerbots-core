---
"@peerbots/core": minor
---

Redesign `DistributionBarChart` and `DistributionHistogram` with a cohesive Peerbots card style (pill horizontal bars with subtle vertical X-axis gridlines, clean rounded columns with subtle horizontal Y-axis gridlines, line-anchored `Avg`/`Reference` pills, axis titles, and crisp floating tooltips) using zero Victory/Lodash dependencies.

Also add `@peerbots/core/charts` as a dedicated subpath export (matching `@peerbots/core/flow`) while keeping root `@peerbots/core` exports 100% backwards-compatible, mark `victory` as an optional peer dependency, declare `"sideEffects": ["**/*.css"]`, and enable ESM code splitting.
