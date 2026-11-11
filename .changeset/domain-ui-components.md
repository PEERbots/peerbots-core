---
"@peerbots/core": minor
---

Add pure, controlled, store-agnostic Peerbots domain UI components and voice/language helpers:

- `EmotionSelector` & `PeerbotsEmotionIcon` (paired with `PeerbotsColorSelector` with crisp vector face icons and optional `emotionIcons` override)
- `PeerbotsButton`, `PeerbotsButtonRow`, `PeerbotsButtonDisplay`, and `useSelectionInput` (supporting `"Buttons"` controller grid, `"Table"` hierarchy/bulk editor, RTL-safe logical layout, and unique accessible control IDs)
- `VoiceSelector` + `voiceHelpers` (`formatVoiceDisplayName`, `findMatchingVoice`, `VoiceDescriptor`)
- `LanguageSelector` (`"default"`, `"topbar"`, and `"sidebar"` variants) + `languageUtils` (`getLanguageName`, `LanguageOption`, `DEFAULT_SUPPORTED_LANGUAGES`)
