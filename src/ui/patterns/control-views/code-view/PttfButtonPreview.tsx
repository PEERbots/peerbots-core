import React from "react";
import type { PeerbotsEmotion } from "../../../../templates/types";
import { Icon, type IconName } from "../../../foundations/Icon";
import { PeerbotsButton } from "../../PeerbotsButton";
import type { PeerbotsButtonActionHandler } from "../types";
import type { ExplainedPttfLine } from "./pttfAdapter";

export interface PttfButtonPreviewProps {
  line: ExplainedPttfLine;
  disabled: boolean;
  logIcon: IconName;
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  emotionLabels?: Partial<Record<PeerbotsEmotion, string>>;
  onButtonAction?: PeerbotsButtonActionHandler;
}

/**
 * Peerbots-specific button preview card rendered inside `CodeExplainerPanel`'s
 * `renderPreview` slot.
 */
export function PttfButtonPreview({
  line,
  disabled,
  logIcon,
  emotionIcons,
  emotionLabels,
  onButtonAction,
}: PttfButtonPreviewProps) {
  if (!line.button) return null;

  return (
    <div className="pb:rounded-xl pb:bg-white pb:border pb:border-gray-200 pb:p-3 pb:flex pb:flex-col pb:items-center pb:gap-2">
      {line.kind === "jump" && (
        <div className="pb:inline-flex pb:items-center pb:gap-1.5 pb:text-xs pb:font-medium pb:px-2.5 pb:py-0.5 pb:rounded-full pb:bg-cyan-50 pb:text-cyan-800 pb:border pb:border-cyan-200">
          <Icon name="arrowPath" className="pb:w-3.5 pb:h-3.5" />
          <span>
            {line.isCycle
              ? `Loops back to ${line.anchor}`
              : `Jumps to ${line.anchor}`}
          </span>
        </div>
      )}

      <PeerbotsButton
        button={line.button}
        logIcon={logIcon}
        emotionIcons={emotionIcons}
        emotionLabels={emotionLabels}
        onClick={() => {
          if (!disabled && onButtonAction && line.buttonId && line.button) {
            onButtonAction(line.button, line.buttonId, { type: "CLICK" });
          }
        }}
      />

      {line.button.type === "Message" ? (
        <p className="pb:text-xs pb:text-gray-600 pb:text-center">
          Robot speaks:{" "}
          <span className="pb:font-medium pb:text-gray-900">
            &ldquo;{line.button.details.speech}&rdquo;
          </span>
        </p>
      ) : (
        <p className="pb:text-xs pb:text-gray-600 pb:text-center">
          Logs event
          {line.button.details.details
            ? `: "${line.button.details.details}"`
            : " (no robot speech)"}
        </p>
      )}
    </div>
  );
}
