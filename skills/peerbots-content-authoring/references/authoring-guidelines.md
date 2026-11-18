# Peerbots Content Authoring Guidelines

Distilled from the Peerbots Content Authoring Guidelines (with contributions from Tess Lojacono / Fine Art Miracles, Molly K. Rearick Day / Educators and Advocates, and Jacob Roberts & Nathan Wilcox / SVVSD Innovation Center).

---

## General Guidelines

### 1. Character
- Give the robot a consistent character, backstory, or attitude to maintain narrative flow and identity across repeat interactions.

### 2. Necessary Content in Conversation
Most interactions should include these 5 categories:
1. **Small talk:** Introductions, getting to know the audience, hellos, and goodbyes.
2. **Feedback:** Follow-up responses whenever the robot asks a question.
3. **Ignorance:** Fallback phrases when the robot doesn't know an answer, giving the controller time to respond.
4. **Focusing attention:** Prompts to gently bring a drifting audience back.
5. **Interaction topic:** The core lesson, story, or activity.

### 3. Short Expressions Per Button
- Keep expressions to short sentences per button. It is easy to press multiple buttons in sequence, and short buttons keep the character interruptible.

### 4. Naming (`Title | Speech`)
- Name collections descriptively so controllers can recognize them quickly under pressure.
- Use `Title | Speech` to separate what the controller sees from what the robot says:
  - Prefix titles for ordered scripts (e.g., `Page 1 | ...`).
  - Use cue titles to hide spoken text when helpful (e.g., `Hint | ...`).

### 5. Handling a Low Battery Device
- Use the `Sleepy` (`:z`) face and gentle wind-down lines to end an interaction smoothly rather than abruptly when a device battery is low.

### 6. Colors: Robot Expression vs. Organization
- **Button Color (`LabelColor`):** Organizes and tags button roles (e.g., Questions, Feedback, Small Talk, Topic-specific). Document your color legend in the collection description or a `// Color Legend:` PTTF comment.
- **Robot Color (`RobotColor`):** Controls the color expressed on the robot's face/light.

### 7. Logging
- **Think about who uses and reviews logs:** Design clear, unambiguous log buttons.
- **No logging is better than bad logging:** Logs should improve content, not inaccurately evaluate people.
- **Track *what*, not *why*:** Prefer observable facts (`! Some laughter`) over subjective judgments (`! Joke was funny`).
- **Organizing logs:** Place `!` log buttons near the interaction buttons that produce those outcomes, or group domain-agnostic logs in a reusable collection.

### 8. Spelling Phonetically & Practicing
- Spell words phonetically when TTS voices mispronounce them (e.g., `"Ayy"` instead of `"A"`).
- Practice scripts aloud to uncover missing responses and pacing gaps.

---

## Topic-Specific Guidelines

### Education
- **Philosophy:** Center learners and practical skills. Presume competence—if a learner struggles, adapt the instruction rather than blaming the learner. Avoid abstract, repetitive Discrete Trial Training (DTT) drills when real-world, contextual learning is possible.
- **Feedback:** Be kind, flexible, and constructive; perfection is not required for positive feedback. Examples:
  - *"Awesome guess! Let's try again."*
  - *"I can tell you were thinking hard! Here's a clue."*
  - *"That's close! I'll give you a hint this time."*
  - *"Nice try! Let's think about it some more."*
- **Age-appropriateness:** Use natural, chronologically age-appropriate language.
- **Appropriate Logging:** IEP goals, whole-class/group goals, student-identified goals, amount of support/feedback given, neurodiversity-affirming observations, multimodal communication.
- **Inappropriate Logging (Avoid / Flag):**
  - Compliance-based "skills" (following instructions without questioning, consent-violating tasks, trial drills, obedience metrics).
  - Conforming to neurotypical behaviors (eye contact, suppressing stimming / "quiet hands", "safe hands" / "safe body").

### Entertainment
- Consider logging observable audience emotional reactions (e.g., degrees of laughter or surprise) to iterate on timing and jokes.
