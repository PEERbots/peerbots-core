---
"@peerbots/core": minor
---

Add pure, controlled, store-agnostic Peerbots domain UI components, PR #26 `TableView` suite, `@peerbots/core/flow` graph editor, and inlined robot face PNG icons:

- `emotionMapper` (`PEERBOTS_EMOTION_IMAGES`, `emotion_mapping`), `EmotionSelector`, & `PeerbotsEmotionIcon` using inlined `app.peerbots.org` robot face PNGs (`Happy` -> `Neutral.png`, `Sleepy` -> `Sleep.png`) with neutral hover/border styling
- `PeerbotsControlAction` & `RobotControlButtonAction` in `control-views/types`
- `ButtonView` (`PeerbotsButtonView`), `TableView` (`PeerbotsTableView`) built on the `Table` component suite (`TableBulkActionBar`, `TableColumnApplyAllPopover`, Shift+Click range selection, Sync Speech with Title), and `PeerbotsButtonDisplay` orchestrator
- `@peerbots/core/flow` subpath (`FlowView` / `PeerbotsFlowView`, `templateToFlowElements`, `FlowDirection`) with optional `@xyflow/react` and `@dagrejs/dagre` peer dependencies
- `VoiceSelector` + `voiceHelpers` and `LanguageSelector` + `languageUtils`
