---
"@peerbots/core": major
---

Move chart components (`DistributionBarChart`, `DistributionHistogram`) into the `@peerbots/core/charts` subpath export (matching `@peerbots/core/flow`), lazy-load them inside `TemplateAnalysisPanel`, redesign them with a cohesive Peerbots card style (pill horizontal bars with subtle vertical X-axis gridlines, clean rounded columns with subtle horizontal Y-axis gridlines, non-overlapping header pills, and crisp floating tooltips) with zero Victory/Lodash runtime dependencies, declare `"sideEffects": ["**/*.css"]`, and enable ESM code splitting.

### Migration
Update runtime imports of distribution charts from `@peerbots/core` to `@peerbots/core/charts`:

```ts
// Before
import { DistributionBarChart, DistributionHistogram } from "@peerbots/core";

// After
import { DistributionBarChart, DistributionHistogram } from "@peerbots/core/charts";
```

`LineGraph` and all chart TypeScript types remain exported from `@peerbots/core`.
