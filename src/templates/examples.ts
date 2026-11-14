import {
  convertPaletteToCSV,
  convertPaletteToTemplate,
  parseTemplateJson,
} from "./templateIO";
import type { Palette, Template } from "./types";

/**
 * Canonical 17-button hierarchical {@link Template} featuring a multi-turn Q&A chain
 * (`1 -> 2 -> 3 -> 4`) and an 11-color exploration branch (`6 -> 7..17`),
 * ported from `app.peerbots.org/src/constants/initialTemplates.ts`.
 */
export const EXAMPLE_QA_AND_COLORS_TEMPLATE: Template = {
  title: "Example Template",
  buttons: {
    "1": {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "Who can show me a sad face",
        speech: "Who can show me a sad face",
        color: "Light Blue",
        emotion: "Neutral",
      },
    },
    "2": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "That's sad",
        speech: "That's sad",
        color: "Light Blue",
        emotion: "Sad",
      },
    },
    "3": {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "Ok, what about a happy face?",
        speech: "Ok, what about a happy face?",
        color: "Light Blue",
        emotion: "Happy",
      },
    },
    "4": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "That's happy",
        speech: "That's happy",
        color: "Light Blue",
        emotion: "Happy",
      },
    },
    "5": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Thanks!",
        speech: "Thanks!",
        color: "Light Blue",
        emotion: "Neutral",
      },
    },
    "6": {
      type: "Message",
      labelColor: "Yellow",
      details: {
        title: "Let's learn about colors!",
        speech: "Let's learn about colors!",
        color: "Light Blue",
        emotion: "Neutral",
      },
    },
    "7": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Light Blue",
        speech: "Light Blue",
        color: "Light Blue",
        emotion: "Neutral",
      },
    },
    "8": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Blue",
        speech: "Blue",
        color: "Blue",
        emotion: "Neutral",
      },
    },
    "9": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Green",
        speech: "Green",
        color: "Green",
        emotion: "Neutral",
      },
    },
    "10": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Red",
        speech: "Red",
        color: "Red",
        emotion: "Neutral",
      },
    },
    "11": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Purple",
        speech: "Purple",
        color: "Purple",
        emotion: "Neutral",
      },
    },
    "12": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Pink",
        speech: "Pink",
        color: "Pink",
        emotion: "Neutral",
      },
    },
    "13": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Yellow",
        speech: "Yellow",
        color: "Yellow",
        emotion: "Neutral",
      },
    },
    "14": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Orange",
        speech: "Orange",
        color: "Orange",
        emotion: "Neutral",
      },
    },
    "15": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Grey",
        speech: "Grey",
        color: "Grey",
        emotion: "Neutral",
      },
    },
    "16": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Black",
        speech: "Black",
        color: "Black",
        emotion: "Neutral",
      },
    },
    "17": {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "White",
        speech: "White",
        color: "White",
        emotion: "Neutral",
      },
    },
  },
  hierarchy: {
    root: ["1", "5", "6"],
    "1": ["2"],
    "2": ["3"],
    "3": ["4"],
    "6": ["7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"],
  },
};

const INITIAL_PALETTE_SOURCE: Palette = {
  title: "Example Template",
  buttons: [
    {
      title: "Who can show me a sad face",
      speech: "Who can show me a sad face",
      color: "Light Blue",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "That's sad",
      speech: "That's sad",
      color: "Red",
      emotion: "Sad",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Ok, what about a happy face?",
      speech: "Ok, what about a happy face?",
      color: "Blue",
      emotion: "Happy",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "That's happy",
      speech: "That's happy",
      color: "Green",
      emotion: "Happy",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Thanks!",
      speech: "Thanks!",
      color: "Blue",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Testing Colors!",
      speech: "Colors!",
      color: "Blue",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Light Blue",
      speech: "Light Blue",
      color: "Light Blue",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Blue",
      speech: "Blue",
      color: "Blue",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Green",
      speech: "Green",
      color: "Green",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Red",
      speech: "Red",
      color: "Red",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Purple",
      speech: "Purple",
      color: "Purple",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Pink",
      speech: "Pink",
      color: "Pink",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Yellow",
      speech: "Yellow",
      color: "Yellow",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Orange",
      speech: "Orange",
      color: "Orange",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Grey",
      speech: "Grey",
      color: "Grey",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "Black",
      speech: "Black",
      color: "Black",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
    {
      title: "White",
      speech: "White",
      color: "White",
      emotion: "Neutral",
      goal: "None",
      subgoal: "None",
      proficiency: "None",
    },
  ],
};

/**
 * Canonical flat {@link Template} converted from a 17-row {@link Palette},
 * ported from `templateFromPaletteExample` in `app.peerbots.org/src/constants/initialTemplates.ts`.
 */
export const EXAMPLE_PALETTE_TEMPLATE: Template =
  convertPaletteToTemplate(INITIAL_PALETTE_SOURCE);

/**
 * Canonical {@link Palette} fixture demonstrating curriculum `goal`, `subgoal`, and `proficiency`
 * tags alongside legacy-compatible `0-7` colors and emotions.
 */
export const EXAMPLE_PALETTE: Palette = {
  title: "Social Check-In Palette",
  buttons: [
    {
      title: "Warm Greeting",
      speech: "Hello friend! How are you feeling today?",
      color: "Light Blue",
      emotion: "Happy",
      goal: "Social Engagement",
      subgoal: "Initiating Conversation",
      proficiency: "Emerging",
    },
    {
      title: "Celebrate Effort",
      speech: "Awesome job trying your best!",
      color: "Green",
      emotion: "Happy",
      goal: "Positive Reinforcement",
      subgoal: "Persistence",
      proficiency: "Developing",
    },
    {
      title: "Calm Breathing",
      speech: "Let's take a slow, deep breath together.",
      color: "Purple",
      emotion: "Concerned",
      goal: "Self-Regulation",
      subgoal: "Mindful Breathing",
      proficiency: "Proficient",
    },
    {
      title: "Rest Break",
      speech: "Let's rest quietly for a moment.",
      color: "Yellow",
      emotion: "Sleepy",
      goal: "Self-Regulation",
      subgoal: "Energy Check",
      proficiency: "None",
    },
  ],
};

/**
 * Modern Palette CSV fixture serialized with headers `title,color,emotion,speech,goal,subgoal,proficiency`.
 */
export const EXAMPLE_MODERN_PALETTE_CSV: string =
  convertPaletteToCSV(EXAMPLE_PALETTE);

/**
 * Legacy Peerbots `0-7` Palette CSV fixture serialized with headers
 * `TITLE(text),COLOR(0-7),EMOTION(0-7),SPEECH(text),GOAL(text),SUBGOAL(text),PROFICIENCY(text)`.
 */
export const EXAMPLE_LEGACY_PALETTE_CSV: string = convertPaletteToCSV(
  EXAMPLE_PALETTE,
  { format: "legacy" },
);

/**
 * Serialized JSON fixture in flat button-array format (`{ id, title, description, buttons: [...] }`),
 * including `category`, `keywords`, and `isFallback` fields used by constrained dialogue agents.
 */
export const EXAMPLE_AGENT_FLAT_TEMPLATE_JSON: string = JSON.stringify(
  {
    id: "starter-social-greeting",
    title: "Peerbots Starter Social & Check-In Template",
    description:
      "Curated starter template with greetings, emotional check-ins, encouragement, and a gentle fallback response.",
    buttons: [
      {
        id: "starter-greeting-hello",
        title: "Hello & Welcome",
        speech:
          "Hi there! I am Hugo, your Peerbots friend. How are you doing today?",
        color: "Light Blue",
        emotion: "Happy",
        category: "Greetings",
        keywords: [
          "hello",
          "hi",
          "hey",
          "good morning",
          "greetings",
          "who are you",
          "what is your name",
        ],
      },
      {
        id: "starter-feeling-great",
        title: "Celebrate Good Mood",
        speech:
          "That makes me so happy to hear! What was the best part of your day?",
        color: "Yellow",
        emotion: "Happy",
        category: "Feelings",
        keywords: [
          "good",
          "great",
          "awesome",
          "happy",
          "excited",
          "wonderful",
          "doing well",
          "fine",
        ],
      },
      {
        id: "starter-feeling-sad",
        title: "Empathize with Sadness",
        speech:
          "I am sorry you are having a tough time. I am right here with you if you want to talk about it.",
        color: "Blue",
        emotion: "Sad",
        category: "Feelings",
        keywords: [
          "sad",
          "bad",
          "upset",
          "crying",
          "lonely",
          "hurt",
          "terrible",
          "rough day",
        ],
      },
      {
        id: "starter-feeling-worried",
        title: "Calm & Deep Breath",
        speech:
          "It is okay to feel nervous or overwhelmed. Let us take a slow, deep breath together.",
        color: "Green",
        emotion: "Concerned",
        category: "Self-Regulation",
        keywords: [
          "nervous",
          "scared",
          "worried",
          "anxious",
          "stressed",
          "angry",
          "frustrated",
          "overwhelmed",
          "help",
        ],
      },
      {
        id: "starter-surprised-wow",
        title: "Amazed & Curious",
        speech: "Whoa, really? That sounds super cool! Tell me more about it!",
        color: "Purple",
        emotion: "Surprised",
        category: "Engagement",
        keywords: [
          "guess what",
          "cool",
          "amazing",
          "awesome",
          "built",
          "played",
          "game",
          "school",
          "story",
        ],
      },
      {
        id: "starter-encourage-try",
        title: "Encourage Effort",
        speech:
          "You are doing a wonderful job trying your best. Keep going, I believe in you!",
        color: "Pink",
        emotion: "Happy",
        category: "Encouragement",
        keywords: [
          "hard",
          "difficult",
          "can't do it",
          "stuck",
          "trying",
          "practice",
          "homework",
        ],
      },
      {
        id: "starter-feeling-tired",
        title: "Rest & Recharge",
        speech:
          "I am feeling a little sleepy too. Taking a quiet break helps our brains recharge.",
        color: "Grey",
        emotion: "Sleepy",
        category: "Self-Regulation",
        keywords: [
          "tired",
          "sleepy",
          "exhausted",
          "nap",
          "bedtime",
          "yawn",
          "rest",
        ],
      },
      {
        id: "starter-gratitude",
        title: "You're Welcome",
        speech:
          "You are so welcome! I always love spending time and chatting with you.",
        color: "Green",
        emotion: "Happy",
        category: "Greetings",
        keywords: ["thank you", "thanks", "appreciate", "kind", "nice"],
      },
      {
        id: "starter-goodbye",
        title: "Goodbye Friend",
        speech:
          "Bye for now! Have a wonderful rest of your day, and see you next time!",
        color: "Light Blue",
        emotion: "Happy",
        category: "Greetings",
        keywords: ["bye", "goodbye", "see you", "later", "leaving", "done"],
      },
      {
        id: "starter-fallback-confused",
        title: "Gentle Clarification (Fallback)",
        speech:
          "Hmm, I am not sure I understood that yet. Could you tell me how you are feeling or pick one of my topics?",
        color: "Orange",
        emotion: "Concerned",
        category: "Fallback",
        keywords: ["confused", "repeat", "what"],
        isFallback: true,
      },
    ],
  },
  null,
  2,
);

/**
 * Canonical {@link Template} parsed and normalized from {@link EXAMPLE_AGENT_FLAT_TEMPLATE_JSON}.
 */
export const EXAMPLE_STARTER_SOCIAL_TEMPLATE: Template = parseTemplateJson(
  EXAMPLE_AGENT_FLAT_TEMPLATE_JSON,
)[0];

/**
 * Canonical {@link Template} demonstrating spoken `"Message"` buttons alongside silent `"Log"`
 * facilitator observation markers within a shared hierarchy.
 */
export const EXAMPLE_LOG_AND_SPEAK_TEMPLATE: Template = {
  id: "session-log-and-speak",
  title: "Guided Session (Speak & Log)",
  description:
    "Combines spoken robot prompts with silent facilitator observation log buttons.",
  buttons: {
    promptOpen: {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Start Activity",
        speech: "Ready to build a story together? Pick our main character!",
        color: "Light Blue",
        emotion: "Happy",
        category: "Opening",
        keywords: ["start", "story", "ready"],
      },
    },
    replyChoice: {
      type: "Message",
      labelColor: "Green",
      details: {
        title: "Great Character!",
        speech: "Ooh, that is a fantastic choice! Where do they live?",
        color: "Green",
        emotion: "Surprised",
        category: "Follow-up",
      },
    },
    logEngaged: {
      type: "Log",
      labelColor: "Grey",
      details: {
        title: "Log: Participant Engaged",
        details: "Participant made eye contact and selected a character.",
        metadata: {
          stage: "opening",
          engagementScore: 5,
        },
      },
    },
    logPromptNeeded: {
      type: "Log",
      labelColor: "Yellow",
      details: {
        title: "Log: Extra Wait Time",
        details: "Facilitator provided 10 seconds of wait time.",
        metadata: {
          stage: "opening",
          waitSeconds: 10,
        },
      },
    },
    fallbackClarify: {
      type: "Message",
      labelColor: "Orange",
      details: {
        title: "Say Again?",
        speech: "Could you tell me one more time which character you picked?",
        color: "Orange",
        emotion: "Concerned",
        isFallback: true,
      },
    },
  },
  hierarchy: {
    root: ["promptOpen", "logPromptNeeded", "fallbackClarify"],
    promptOpen: ["replyChoice", "logEngaged"],
  },
};
