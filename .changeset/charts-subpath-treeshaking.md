---
"@peerbots/core": major
---

Move Victory-backed chart components (`DistributionBarChart`, `DistributionHistogram`) out of the root `@peerbots/core` entrypoint into the new `@peerbots/core/charts` subpath export (matching `@peerbots/core/flow`), lazy-load them inside `TemplateAnalysisPanel`, mark `victory` as an optional peer dependency, declare `"sideEffects": ["**/*.css"]`, and enable ESM code splitting.

### Migration
Update runtime imports of Victory charts from `@peerbots/core` to `@peerbots/core/charts`:

```ts
// Before
import { DistributionBarChart, DistributionHistogram } from "@peerbots/core";

// After
import { DistributionBarChart, DistributionHistogram } from "@peerbots/core/charts";
```

`LineGraph` (zero external dependencies) and all chart TypeScript types remain exported from `@peerbots/core`.
