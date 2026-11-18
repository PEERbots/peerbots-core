---
name: peerbots-content-authoring
description: Author, review, and refine Peerbots interactive robot scripts in PTTF (Peerbots Template Text Format) following the Peerbots Content Authoring Guidelines. Use when creating, editing, converting, or reviewing Peerbots templates, conversation trees, or robot scripts for education, therapy, edutainment, or entertainment.
---

# Peerbots Content Authoring

Author and review Peerbots interactive robot templates using **PTTF (Peerbots Template Text Format)** while applying the **Peerbots Content Authoring Guidelines**.

## When to Use

- Drafting a new Peerbots template or conversation tree from a scenario, lesson, story, or prompt
- Converting scripts, outlines, or JSON templates into PTTF
- Reviewing or improving an existing PTTF template for pacing, button design, color organization, TTS pronunciation, or logging ethics

## References

- [PTTF Syntax & Grammar](references/pttf-spec.md) — Line structure, 11-color palette, emotions, `#anchor` / `-> #anchor` cycles, `Log` (`!`) syntax, and `## Unlinked`.
- [Content Authoring Guidelines](references/authoring-guidelines.md) — General, Education, and Entertainment guidelines (character, 5 core categories, color coding, phonetic spelling, and logging ethics).
- [Canonical PTTF Examples](references/examples.md) — Complete, valid PTTF templates demonstrating conversation trees, color legends, `Title | Speech`, `Log` placement, and graceful low-battery wind-down.

## Authoring Workflow

1. **Clarify context & character:** Identify the audience (age/chronological level, setting such as education, therapy, or entertainment) and give the robot a consistent character, backstory, and tone.
2. **Cover the 5 essential conversation categories:**
   - **Small talk:** Greetings, introductions, getting-to-know-you, goodbyes
   - **Feedback:** Warm, constructive follow-ups (never perfection-gated)
   - **Ignorance / stalling:** Honest fallback lines that buy the controller time (e.g., `"Hmm, I'm not sure! Let me think..."`)
   - **Focusing attention:** Gentle prompts to re-engage a drifting audience
   - **Interaction topic:** The main lesson, story, or activity
3. **Keep expressions short & interruptible:** Split multi-sentence monologues into short, sequential or nested buttons so the controller can pause, adapt, or interject naturally.
4. **Use `Title | Speech` purposefully:**
   - Keep button titles short and scannable for a live controller (e.g., `Page 1 | ...`, `Hint | ...` to hide spoken content until pressed).
   - Use phonetic spelling in the spoken text when TTS voices mispronounce words or single letters (e.g., `"Ayy"` instead of `"A"`).
5. **Separate `LabelColor` (organization) from `RobotColor` (expression):**
   - Use `[LabelColor]` to tag button roles (e.g., Questions, Feedback, Small Talk, Topic) and document the mapping in a `// Color Legend:` comment at the top of the file.
   - Use `[-> RobotColor]` or `[LabelColor -> RobotColor]` for the robot's face/light expression.
   - Never assign a robot face color to a `!` (`Log`) button (only `[LabelColor]` is valid on `Log` buttons).
6. **Add a graceful wind-down:** Include a low-battery / end-of-session branch using `:z` (`Sleepy`) so interactions end smoothly rather than abruptly.
7. **Author ethical, observable `Log` (`!`) buttons:**
   - Place `!` log buttons **inline/adjacent** to the interaction buttons whose outcomes they record, or in a reusable `## Reusable Logs` section.
   - **Track *what*, not *why*:** Record observable events (`! Some laughter`) rather than subjective judgments (`! Joke was funny`).
   - **No logging is better than bad logging:** Logs exist to improve content and support learner goals — never to punish or grade students.

## Hard Guardrails (Education & Accessibility)

When authoring or reviewing **Education** (or **Therapy**) content:
- **Presume competence** and use **chronologically age-appropriate** language.
- **Refuse or flag inappropriate logging / prompts** that track:
  - **Compliance/obedience** (e.g., following instructions without questioning, Discrete Trial Training drills, or consent-violating tasks).
  - **Neurotypical conformity** (e.g., eye contact, suppressing stimming / `"quiet hands"`, `"safe hands"` / `"safe body"`).
- **Prefer appropriate goals:** IEP goals, whole-class/group goals, student-identified goals, amount of support/feedback given, neurodiversity-affirming observations, and multimodal communication.

## PTTF Quick Check Before Returning Output

- 2-space indentation per nesting level (no tabs)
- `- ` for `Message` buttons, `! ` for `Log` buttons
- Every `-> #anchor` points to an existing `#anchor` definition
- Colors come from the 11 canonical names (`Light Blue`, `Blue`, `Green`, `Red`, `Purple`, `Pink`, `Yellow`, `Orange`, `Grey`, `Black`, `White`)
- Emotions use valid tokens (`:)`, `:(`, `:o`, `:z`, `[Concerned]`, etc.)
- `Log` (`!`) buttons do not specify `-> RobotColor`
