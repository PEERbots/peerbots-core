---
"@peerbots/core": patch
---

Improve FlowView mobile ergonomics and remove CodeView copy button:
- Default `FlowView` drag mode to `"pan"` on mobile/touch viewports (`pointer: coarse` or viewport width `< 768px`) while preserving `"select"` on desktop and honoring explicit `defaultDragBehavior`.
- Combine the top-left and top-right `FlowView` control panels into a responsive wrapping top bar so the layout selector no longer overlaps the selection/action toolbar on narrow screens.
- Remove the Copy button from `CodeView` so template code cannot be trivially one-click copied.
