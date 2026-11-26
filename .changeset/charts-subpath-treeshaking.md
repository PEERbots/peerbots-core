---
"@peerbots/core": minor
---

Add `@peerbots/core/charts` subpath export, declare `"sideEffects": ["**/*.css"]`, mark `victory` as an optional peer dependency, and enable ESM code splitting so consumers that do not render Victory charts can tree-shake `victory` and `lodash` out of their initial bundle.
