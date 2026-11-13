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
 * Alias for backward compatibility with `app.peerbots.org` Message types.
 */
export type Color = PeerbotsColor;

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

export type PeerbotsEmotion =
  | "Neutral"
  | "Surprised"
  | "Happy"
  | "Sad"
  | "Concerned"
  | "Sleepy";

export const PEERBOTS_EMOTIONS: readonly PeerbotsEmotion[] = [
  "Neutral",
  "Surprised",
  "Happy",
  "Sad",
  "Concerned",
  "Sleepy",
] as const;

/**
 * Alias for backward compatibility with `app.peerbots.org` Message types.
 */
export type Emotion = PeerbotsEmotion;

/**
 * Structural reference interface compatible with Firestore `DocumentReference`
 * without introducing any `firebase/firestore` dependency in `@peerbots/core`.
 */
export interface ProvenanceRef {
  readonly id?: string;
  readonly path?: string;
}

export type MetaData = {
  [key: string]: string | number;
};

export type MetaDataDefinition = {
  [key: string]:
    | {
        type: "select";
        options: string[];
      }
    | {
        type: "number";
        min: number;
        max: number;
      }
    | {
        type: "string";
      };
};

export type Message = {
  title: string;
  speech: string;
  color: PeerbotsColor;
  emotion: PeerbotsEmotion;
  metadata?: MetaData;
  category?: string;
  keywords?: string[];
  isFallback?: boolean;
};

export const connectionMessage: Message = {
  title: "Connecting",
  speech: "Connecting",
  color: "Light Blue",
  emotion: "Neutral",
};

export type LoggedEvent = {
  title: string;
  details?: string;
  metadata?: MetaData;
};

export type RobotControlButton =
  | {
      type: "Message";
      labelColor: PeerbotsColor;
      details: Message;
    }
  | {
      type: "Log";
      labelColor: PeerbotsColor;
      details: LoggedEvent;
    };

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

export type TemplateHierarchy = {
  root: string[];
  [key: string]: string[];
};

export type TemplateInfo<TRef = ProvenanceRef> = {
  id: string;
  title: string;
  description?: string;
  copyOf?: TRef;
  copyDate?: Date;
};

export type Template<TRef = ProvenanceRef> = {
  id?: string;
  title: string;
  description?: string;
  contentID?: string;
  contentName?: string;
  buttons: { [key: string]: RobotControlButton };
  hierarchy: TemplateHierarchy;
  copyOf?: TRef;
  copyDate?: Date;
  sourceContentId?: string;
};

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

export type TemplateDetails = {
  buttons: { [key: string]: RobotControlButton };
  hierarchy: TemplateHierarchy;
};

export type TemplatesObject<TRef = ProvenanceRef> = {
  [key: string]: Template<TRef>;
};

export type OrderedTemplatesObject<TRef = ProvenanceRef> = {
  templates: TemplatesObject<TRef>;
  order: string[];
};

export type PaletteButton = {
  title: string;
  speech: string;
  color: PeerbotsColor;
  emotion: PeerbotsEmotion;
  goal: string;
  subgoal: string;
  proficiency: string;
};

export type Palette = {
  title: string;
  buttons: PaletteButton[];
};

export type Content<TRef = ProvenanceRef> = {
  id: string;
  data: {
    name: string;
    description?: string;
    owner: TRef;
    price?: number;
    public: boolean;
    tags: TRef[];
    trusted: boolean;
    copyOf?: TRef;
    copyDate?: Date;
    templatesInfo: TemplateInfo<TRef>[];
  };
};
