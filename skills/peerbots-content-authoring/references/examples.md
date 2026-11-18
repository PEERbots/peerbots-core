# Canonical PTTF Examples

## 1. Classroom Check-In (5 Categories + Color Legend + Ethical Logs + Loop)

```text
// Color Legend: [Green] = Small Talk, [Yellow] = Question, [Blue] = Feedback, [Grey] = Log/Utility
- #check-in [Green] :) Hi! | Hi everyone! I'm Peerbot. How are you feeling today?
  - [Yellow] :) Feeling good? | Are you feeling happy or excited today?
    - [Blue] :) Glad to hear! | That's awesome! Let's get started.
    ! [Grey] Student shared positive mood
  - [Yellow] :( Need a break? | Feeling tired or overwhelmed? That's okay!
    - [Blue] [Concerned] Take a breath | Let's take a slow breath together.
    ! [Grey] Student requested or needed a break
  - [Yellow] -> #check-in
- [Grey] :/ Not sure | Hmm, I'm not sure about that one! Let me think for a second.
- [Grey] :) Eyes here | Hey friends, let's bring our attention back over here!
- [Green] :z Low battery | My battery is getting sleepy. Let's wave goodbye for today!
```

## 2. Book Reading / Guided Story (`Title | Speech` + Phonetics)

```text
// Color Legend: [Purple] = Story Page, [Yellow] = Comprehension Prompt, [Blue] = Kind Feedback
- [Purple] Page 1 | Once upon a time, a little robot named Ayy-Bot loved stargazing.
  - [Yellow] :) What do you see? | What shapes do you see in the night sky?
    - [Blue] :) Great guess | Awesome guess! Let's see what happens next.
    - [Blue] :) Clue | I can tell you were thinking hard! Here's a clue: look near the moon.
    ! [Grey] Student used multimodal response
- [Purple] Page 2 | Ayy-Bot waved at the bright crescent moon.
```

## 3. Entertainment / Comedy Set (Observable Logging)

```text
// Color Legend: [Orange] = Joke Setup/Punchline, [Grey] = Audience Reaction Log
- [Orange] :) Setup | Why did the robot go to school?
  - [Orange] :) Punchline | To improve its byte-sized reading!
  ! [Grey] Big laughter
  ! [Grey] Subtle chuckle
  ! [Grey] No reaction
```
