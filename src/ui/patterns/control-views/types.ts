import type { RobotControlButton } from "../../../templates/types";

/**
 * Discriminated union of user/authoring actions emitted by Peerbots template
 * control views (`ButtonView`, `TableView`, `FlowView`, `PeerbotsButtonDisplay`, and `PeerbotsButtonRow`).
 *
 * Pair with {@link applyControlActionToTemplate} to immutably update `Template` state
 * for `"SAVE"`, `"MOVE"`, and `"DELETE"` actions.
 */
export type PeerbotsControlAction =
  /** Dispatched when a user activates/triggers a button (e.g. clicking Play or pressing a grid button). */
  | { type: "CLICK" }
  /** Dispatched when a button becomes the active/focused primary selection. */
  | { type: "SELECT" }
  /** Dispatched when a button is checked into multi-selection (`TableView` / `PeerbotsButtonRow`). */
  | { type: "ADD TO SELECTION" }
  /** Dispatched when a button is unchecked from multi-selection. */
  | { type: "REMOVE FROM SELECTION" }
  /** Dispatched when deleting a button from the template. */
  | { type: "DELETE" }
  /** Dispatched when saving inline edits to a button's title, speech/details, colors, type, or emotion. */
  | {
      type: "SAVE";
      /** Updated button payload. */
      newButton: RobotControlButton;
      /** Alias for `newButton` preserved for `app.peerbots.org` compatibility. */
      newButtonInfo?: RobotControlButton;
    }
  /** Dispatched when moving a button `"BACK"` (up/earlier) or `"FORWARD"` (down/later) among siblings. */
  | { type: "MOVE"; direction: "BACK" | "FORWARD" };

/**
 * Alias for {@link PeerbotsControlAction} preserved for backward compatibility with `app.peerbots.org`.
 */
export type RobotControlButtonAction = PeerbotsControlAction;

/**
 * Callback signature invoked by Peerbots template views (`ButtonView`, `TableView`,
 * `FlowView`, and `PeerbotsButtonDisplay`) whenever a user triggers, selects, edits,
 * reorders, or deletes a template button.
 */
export type PeerbotsButtonActionHandler = (
  button: RobotControlButton,
  buttonId: string,
  action: PeerbotsControlAction,
) => void;

/**
 * Canonical template presentation mode identifier (`"Buttons"`, `"Table"`, `"Flow"`,
 * or a consumer-defined custom view string).
 */
export type PeerbotsTemplateView =
  | "Buttons"
  | "Table"
  | "Flow"
  | "Code"
  | (string & {});

/**
 * Helper to create a `"SAVE"` {@link PeerbotsControlAction} with both `newButton`
 * and `newButtonInfo` populated for seamless compatibility.
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
