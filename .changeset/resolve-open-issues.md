---
"@peerbots/core": minor
---

- Add `eye` and `eyeSlash` (`eye-slash`) icons to `iconPaths` and `Icon` (#19)
- Add `inline` prop to `Field` and configure `cn()` / stylesheet injection precedence so unprefixed consumer classes override `pb:` defaults without `!important` (#21)
- Add `size` presets (`sm`, `md`, `lg`, `xl`, `2xl`, `full`, `auto`) to `Dialog` (#22)
- Pass normalized `items` to `Select.Root` so closed `<Select.Trigger>` displays the human-readable option `label` instead of raw `value` (#23)
