/**
 * Canonical 11-color Peerbots palette used across the ecosystem for both:
 * - Controller UI button accents (`RobotControlButton.labelColor`), and
 * - Physical or on-screen robot face illumination (`Message.color`).
 */
export type PeerbotsColor =
  | "Light Blue"
  | "Blue"
  | "Green"
  | "Red"
  | "Purple"
  | "Pink"
  | "Yellow"
  | "Orange"
  | "Grey"
  | "Black"
  | "White";

/**
 * Alias for backward compatibility with `app.peerbots.org` `Message` types.
 */
export type Color = PeerbotsColor;

/**
 * Ordered list of all valid {@link PeerbotsColor} values.
 * Indices `0` through `7` correspond to legacy Peerbots CSV color codes (`COLOR(0-7)`).
 */
export const PEERBOTS_COLORS: readonly PeerbotsColor[] = [
  "Light Blue",
  "Blue",
  "Green",
  "Red",
  "Purple",
  "Pink",
  "Yellow",
  "Orange",
  "Grey",
  "Black",
  "White",
] as const;

/**
 * Canonical facial expression states supported by Peerbots robot characters
 * (such as Hugo) on screen-based and hardware faces.
 */
export type PeerbotsEmotion =
  | "Neutral"
  | "Surprised"
  | "Happy"
  | "Sad"
  | "Concerned"
  | "Sleepy";

/**
 * Ordered list of all valid {@link PeerbotsEmotion} values.
 * Indices `0` through `5` correspond to legacy Peerbots CSV emotion codes (`EMOTION(0-7)`).
 */
export const PEERBOTS_EMOTIONS: readonly PeerbotsEmotion[] = [
  "Neutral",
  "Surprised",
  "Happy",
  "Sad",
  "Concerned",
  "Sleepy",
] as const;

/**
 * Alias for backward compatibility with `app.peerbots.org` `Message` types.
 */
export type Emotion = PeerbotsEmotion;

/**
 * Structural reference interface compatible with Firestore `DocumentReference`
 * without introducing any `firebase/firestore` dependency in `@peerbots/core`.
 */
export interface ProvenanceRef {
  /** Document identifier of the referenced source record. */
  readonly id?: string;
  /** Full collection/document path of the referenced source record. */
  readonly path?: string;
}

/**
 * Flat key-value dictionary of custom string or numeric tags attached to a
 * {@link Message} or {@link LoggedEvent} (e.g., `goal`, `subgoal`, `proficiency`, or rubric scores).
 */
export type MetaData = {
  [key: string]: string | number;
};

/**
 * Schema definition describing custom {@link MetaData} fields and validation constraints
 * for template authoring UIs (`select` options, bounded `number` ranges, or free-form `string`).
 */
export type MetaDataDefinition = {
  [key: string]:
    | {
        /** Enumerated dropdown field restricted to `options`. */
        type: "select";
        /** Allowed string choices for this metadata key. */
        options: string[];
      }
    | {
        /** Numeric metadata field constrained to `[min, max]`. */
        type: "number";
        /** Minimum allowed numeric value (inclusive). */
        min: number;
        /** Maximum allowed numeric value (inclusive). */
        max: number;
      }
    | {
        /** Free-form string metadata field. */
        type: "string";
      };
};

/**
 * Spoken and expressive robot action payload triggered by a `"Message"` {@link RobotControlButton}.
 */
export type Message = {
  /** Short human-readable label displayed on the controller button in the UI. */
  title: string;
  /** Exact utterance spoken aloud by the robot (via TTS or hardware speaker). */
  speech: string;
  /**
   * Background/LED color displayed on the physical or screen-based robot face when spoken.
   * Distinct from `RobotControlButton.labelColor`, which styles the controller UI button.
   */
  color: PeerbotsColor;
  /** Facial expression displayed by the robot while delivering `speech`. */
  emotion: PeerbotsEmotion;
  /** Optional key-value metadata (such as curriculum `goal`, `subgoal`, and `proficiency`). */
  metadata?: MetaData;
  /** Optional thematic grouping label (e.g., `"Greetings"`, `"Self-Regulation"`) for UI filtering. */
  category?: string;
  /** Optional lexical/semantic trigger phrases used by constrained response matchers. */
  keywords?: string[];
  /**
   * When `true`, marks this message as a gentle clarification/fallback option triggered
   * when a constrained response matcher's confidence falls below threshold.
   */
  isFallback?: boolean;
};

/**
 * Default placeholder {@link Message} used during initial controller-to-robot connection handshakes.
 */
export const connectionMessage: Message = {
  title: "Connecting",
  speech: "Connecting",
  color: "Light Blue",
  emotion: "Neutral",
};

/**
 * Silent facilitator observation marker recorded by a `"Log"` {@link RobotControlButton}.
 * Writes structured notes to the session log without triggering robot speech or face changes.
 */
export type LoggedEvent = {
  /** Short label identifying the logged observation or event on the controller button. */
  title: string;
  /** Optional descriptive notes elaborating on the observed participant or session event. */
  details?: string;
  /** Optional structured key-value metrics or tags recorded alongside the event. */
  metadata?: MetaData;
};

/**
 * Interactive button entry inside a Peerbots {@link Template}.
 *
 * Discriminated by `type`:
 * - `"Message"`: Speaks `details.speech` and sets the robot face to `details.color` and `details.emotion`.
 * - `"Log"`: Silently records a facilitator `LoggedEvent` in session history without robot output.
 *
 * Note: `labelColor` controls the button's visual accent in the controller UI, whereas
 * `details.color` (on `"Message"` buttons) controls the physical/screen robot face color.
 */
export type RobotControlButton =
  | {
      /** Spoken robot dialogue button that triggers speech, face color, and facial emotion. */
      type: "Message";
      /** Controller UI button accent color (distinct from `details.color` on the robot face). */
      labelColor: PeerbotsColor;
      /** Robot speech, face color, emotion, and matcher metadata payload. */
      details: Message;
    }
  | {
      /** Silent facilitator observation button that logs an event without robot speech. */
      type: "Log";
      /** Controller UI button accent color. */
      labelColor: PeerbotsColor;
      /** Observation title, notes, and structured metadata to record in the session log. */
      details: LoggedEvent;
    };

/**
 * Default starter `"Message"` {@link RobotControlButton} used for empty inspector states and blank templates.
 */
export const blankMessageButton: RobotControlButton = {
  type: "Message",
  labelColor: "Light Blue",
  details: {
    title: "Select a button to see its info",
    speech: "Select a button to see its info",
    color: "Light Blue",
    emotion: "Neutral",
  },
};

/**
 * Adjacency map defining button display order and parent-child nesting within a {@link Template}.
 *
 * - `root` is the ordered entry-point array of top-level button IDs.
 * - Each additional key is a parent button ID mapped to an ordered array of its direct child button IDs,
 *   enabling multi-turn conversational follow-ups and collapsible sub-trees.
 */
export type TemplateHierarchy = {
  /** Ordered list of top-level button keys rendered at depth `0`. */
  root: string[];
  /** Maps any parent `buttonId` to its ordered list of direct child `buttonId`s. */
  [key: string]: string[];
};

/**
 * Lightweight summary descriptor for a {@link Template} referenced inside a {@link Content} bundle.
 */
export type TemplateInfo<TRef = ProvenanceRef> = {
  /** Unique identifier of the template document. */
  id: string;
  /** Human-readable title of the template. */
  title: string;
  /** Optional summary of the template's purpose or activity context. */
  description?: string;
  /** Optional provenance reference to the original template this was cloned from. */
  copyOf?: TRef;
  /** Optional timestamp recording when this template was copied. */
  copyDate?: Date;
};

/**
 * Canonical Peerbots template combining a dictionary of {@link RobotControlButton} items
 * with a {@link TemplateHierarchy} adjacency map and optional catalog provenance metadata.
 */
export type Template<TRef = ProvenanceRef> = {
  /** Optional unique identifier for the template (e.g., Firestore document ID or slug). */
  id?: string;
  /** Human-readable template name displayed in template switchers and headers. */
  title: string;
  /** Optional description explaining the template's clinical, classroom, or social scenario. */
  description?: string;
  /** Optional ID of the parent {@link Content} collection this template belongs to. */
  contentID?: string;
  /** Optional display name of the parent {@link Content} collection. */
  contentName?: string;
  /** Dictionary mapping button IDs referenced in `hierarchy` to {@link RobotControlButton} definitions. */
  buttons: { [key: string]: RobotControlButton };
  /** Adjacency list with `"root"` entry point defining top-level order and nested child buttons. */
  hierarchy: TemplateHierarchy;
  /** Optional provenance reference to the upstream template this copy was derived from. */
  copyOf?: TRef;
  /** Optional timestamp when this template was duplicated from `copyOf`. */
  copyDate?: Date;
  /** Optional identifier of the originating content package when imported or remixed. */
  sourceContentId?: string;
};

/**
 * Minimal valid {@link Template} containing a single `"blank"` root message button,
 * used when initializing a new template in authoring tools.
 */
export const blankTemplate: Template = {
  title: "Blank Template",
  buttons: {
    blank: {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Select a button to see its info",
        speech: "Select a button to see its info",
        color: "Light Blue",
        emotion: "Neutral",
      },
    },
  },
  hierarchy: { root: ["blank"] },
};

/**
 * Structural subset of a {@link Template} containing only its `buttons` dictionary and `hierarchy`,
 * produced by authoring helpers (such as bulk authoring) prior to attaching template-level metadata.
 */
export type TemplateDetails = {
  /** Dictionary mapping button IDs to {@link RobotControlButton} definitions. */
  buttons: { [key: string]: RobotControlButton };
  /** Adjacency map defining root and nested button ordering. */
  hierarchy: TemplateHierarchy;
};

/**
 * Dictionary of {@link Template} records keyed by template ID.
 */
export type TemplatesObject<TRef = ProvenanceRef> = {
  [key: string]: Template<TRef>;
};

/**
 * Collection of {@link Template} records paired with an explicit template display order.
 */
export type OrderedTemplatesObject<TRef = ProvenanceRef> = {
  /** Dictionary mapping each template ID to its {@link Template} definition. */
  templates: TemplatesObject<TRef>;
  /** Ordered array of template IDs controlling tab/list sequence in the UI. */
  order: string[];
};

/**
 * Flat tabular button record used in Peerbots CSV palettes and curriculum spreadsheets.
 * Maps directly to a `"Message"` {@link RobotControlButton} with `goal`, `subgoal`, and `proficiency` metadata.
 */
export type PaletteButton = {
  /** Short label displayed on the controller button. */
  title: string;
  /** Spoken text delivered by the robot when triggered. */
  speech: string;
  /** Robot face and button color from the canonical {@link PeerbotsColor} palette. */
  color: PeerbotsColor;
  /** Facial expression from the canonical {@link PeerbotsEmotion} set. */
  emotion: PeerbotsEmotion;
  /** High-level educational or therapeutic goal tag (or `"None"`). */
  goal: string;
  /** Specific subgoal tag nested under `goal` (or `"None"`). */
  subgoal: string;
  /** Target learner proficiency level tag (or `"None"`). */
  proficiency: string;
};

/**
 * Flat sequence of {@link PaletteButton} rows paired with a title, used for CSV import/export
 * and flat palette-to-template conversions.
 */
export type Palette = {
  /** Display title of the palette (used as the template title on conversion). */
  title: string;
  /** Ordered flat list of dialogue buttons in the palette. */
  buttons: PaletteButton[];
};

/**
 * Shareable Peerbots content package grouping multiple templates with ownership,
 * visibility, and catalog metadata.
 */
export type Content<TRef = ProvenanceRef> = {
  /** Unique identifier of the content package. */
  id: string;
  /** Content package attributes and template index. */
  data: {
    /** Display name of the content package. */
    name: string;
    /** Optional overview of the content package's curriculum or use case. */
    description?: string;
    /** Reference to the user or organization that owns this content package. */
    owner: TRef;
    /** Optional catalog price (in platform currency units, or `0` / omitted for free content). */
    price?: number;
    /** Whether the content package is publicly discoverable in the Peerbots library. */
    public: boolean;
    /** References to category/topic tag documents associated with this package. */
    tags: TRef[];
    /** Whether the package is verified/trusted by Peerbots moderators. */
    trusted: boolean;
    /** Optional provenance reference if this package was cloned from another package. */
    copyOf?: TRef;
    /** Optional timestamp recording when this package was cloned. */
    copyDate?: Date;
    /** Ordered summary list of templates included in this content package. */
    templatesInfo: TemplateInfo<TRef>[];
  };
};
