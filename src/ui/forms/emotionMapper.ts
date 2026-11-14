import Concerned from "../../assets/RobotFaceIcons/Concerned.png";
import Neutral from "../../assets/RobotFaceIcons/Neutral.png";
import Sad from "../../assets/RobotFaceIcons/Sad.png";
import Sleep from "../../assets/RobotFaceIcons/Sleep.png";
import Surprised from "../../assets/RobotFaceIcons/Surprised.png";
import type { PeerbotsEmotion } from "../../templates/types";

/**
 * Canonical Peerbots robot face emotion icon mapping matching `app.peerbots.org`.
 * Note: `Happy` intentionally maps to `Neutral.png` per `app.peerbots.org/src/helpers/emotion_mapper.ts`.
 */
export const PEERBOTS_EMOTION_IMAGES: Record<PeerbotsEmotion, string> = {
  Neutral,
  Surprised,
  Happy: Neutral,
  Sad,
  Concerned,
  Sleepy: Sleep,
};

/**
 * Drop-in compatibility export matching `app.peerbots.org/src/helpers/emotion_mapper.ts`.
 */
export const emotion_mapping: Record<PeerbotsEmotion, string> =
  PEERBOTS_EMOTION_IMAGES;
