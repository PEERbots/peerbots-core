import type { RobotControlButton } from "../../../templates/types";

export type PeerbotsControlAction =
  | { type: "CLICK" }
  | { type: "SELECT" }
  | { type: "ADD TO SELECTION" }
  | { type: "REMOVE FROM SELECTION" }
  | { type: "DELETE" }
  | {
      type: "SAVE";
      newButton: RobotControlButton;
      /** Alias for `newButton` */
      newButtonInfo?: RobotControlButton;
    }
  | { type: "MOVE"; direction: "BACK" | "FORWARD" };

export type RobotControlButtonAction = PeerbotsControlAction;

export type PeerbotsButtonActionHandler = (
  button: RobotControlButton,
  buttonId: string,
  action: PeerbotsControlAction,
) => void;

export type PeerbotsTemplateView =
  | "Buttons"
  | "Table"
  | "Flow"
  | (string & {});

/**
 * Helper to create a `SAVE` control action with both `newButton` and `newButtonInfo` populated.
 */
export function createSaveAction(
  updatedButton: RobotControlButton,
): Extract<PeerbotsControlAction, { type: "SAVE" }> {
  return {
    type: "SAVE",
    newButton: updatedButton,
    newButtonInfo: updatedButton,
  };
}
