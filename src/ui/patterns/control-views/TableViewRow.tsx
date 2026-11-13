import React, { useRef } from "react";
import type { ControlLabels } from "../../../i18n";
import type { PeerbotsColor, PeerbotsEmotion } from "../../../templates/types";
import { Button } from "../../forms/Button";
import { Checkbox } from "../../forms/Checkbox";
import { PeerbotsEmotionIcon } from "../../forms/EmotionSelector";
import { Input } from "../../forms/Input";
import {
  PEERBOTS_COLOR_MAP,
  PEERBOTS_FONT_COLOR_MAP,
} from "../../forms/PeerbotsColorSelector";
import { Select, type SelectOption } from "../../forms/Select";
import { Icon } from "../../foundations/Icon";
import { TableCell, TableCellField, TableRow } from "../../layout/Table";
import type { TableDensity } from "../../layout/useTableState";
import { cn } from "../../utils";
import type { FlattenedTableEntry } from "./tableViewHelpers";
import { createSaveAction, type PeerbotsButtonActionHandler } from "./types";

export interface TableViewRowProps {
  entry: FlattenedTableEntry;
  rowIndex: number;
  density: TableDensity;
  disabled: boolean;
  syncActive: boolean;
  isSelected: boolean;
  isActiveRow: boolean;
  colorOptions: SelectOption[];
  emotionOptions: SelectOption[];
  emotionIcons?: Partial<Record<PeerbotsEmotion, string | React.ReactNode>>;
  resolvedLabels: ControlLabels;
  onButtonAction: PeerbotsButtonActionHandler;
  onToggleRow: (
    entry: FlattenedTableEntry,
    rowIndex: number,
    checked: boolean,
    shiftKey: boolean,
  ) => void;
  onDeleteRow: (buttonId: string) => void;
}

/**
 * Renders a single row in {@link TableView}, including selection checkbox,
 * color-accented title pill, button type, speech/details, color selectors,
 * emotion preview tile, and reorder/delete actions.
 */
export function TableViewRow({
  entry,
  rowIndex,
  density,
  disabled,
  syncActive,
  isSelected,
  isActiveRow,
  colorOptions,
  emotionOptions,
  emotionIcons,
  resolvedLabels,
  onButtonAction,
  onToggleRow,
  onDeleteRow,
}: TableViewRowProps) {
  const shiftKeyRef = useRef<boolean>(false);
  const { buttonId, button, depth, isFirstSibling, isLastSibling } = entry;
  const rowName = button.details.title || buttonId;
  const labelColorHex =
    PEERBOTS_COLOR_MAP[button.labelColor] ?? button.labelColor;
  const labelFontColorHex =
    PEERBOTS_FONT_COLOR_MAP[button.labelColor] ?? "#020307";

  const robotColorHex =
    button.type === "Message"
      ? (PEERBOTS_COLOR_MAP[button.details.color] ?? button.details.color)
      : undefined;
  const robotFontColorHex =
    button.type === "Message"
      ? (PEERBOTS_FONT_COLOR_MAP[button.details.color] ?? "#020307")
      : undefined;

  return (
    <TableRow
      selected={isSelected}
      disabled={disabled}
      data-active={isActiveRow ? "true" : undefined}
      className={cn(
        isActiveRow &&
          !isSelected &&
          "pb:bg-peerbots-teal/10 pb:hover:bg-peerbots-teal/15",
      )}
    >
      {/* 1. Row Selection Checkbox */}
      <TableCell
        density={density}
        hasLabel={false}
        align="center"
        className="pb:w-11 pb:px-3"
      >
        <div
          className="pb:flex pb:items-center pb:justify-center"
          onClickCapture={(e) => {
            shiftKeyRef.current = e.shiftKey;
          }}
        >
          <Checkbox
            aria-label={`${resolvedLabels.selectButton}: ${rowName}`}
            checked={isSelected}
            disabled={disabled}
            onCheckedChange={(checked) => {
              const isShift = shiftKeyRef.current;
              shiftKeyRef.current = false;
              onToggleRow(entry, rowIndex, checked, isShift);
            }}
          />
        </div>
      </TableCell>

      {/* 2. Row Left Color Accent + Play Trigger + Button-Colored Title Pill */}
      <TableCell density={density} className="pb:relative pb:ps-3.5">
        <span
          aria-hidden="true"
          data-row-accent={buttonId}
          className="pb:absolute pb:inset-y-1 pb:start-0 pb:w-1 pb:rounded-e-sm"
          style={{
            width: "4px",
            backgroundColor: labelColorHex,
          }}
        />
        <div
          className="pb:flex pb:items-center pb:gap-1.5 pb:min-w-0"
          style={
            depth > 0 ? { paddingInlineStart: `${depth * 20}px` } : undefined
          }
        >
          {depth > 0 && (
            <span
              aria-hidden="true"
              className="pb:text-gray-400 pb:text-xs pb:select-none pb:shrink-0"
            >
              ↳
            </span>
          )}
          <Button
            size="xs"
            variant="soft"
            color="teal"
            isIconOnly
            disabled={disabled}
            title={resolvedLabels.sendMessage}
            aria-label={`${resolvedLabels.sendMessage}: ${rowName}`}
            onClick={() => {
              if (disabled) return;
              onButtonAction(button, buttonId, { type: "SELECT" });
              onButtonAction(button, buttonId, { type: "CLICK" });
            }}
            className="pb:shrink-0"
          >
            <Icon name="play" size="sm" aria-hidden="true" />
          </Button>

          <div className="pb:flex-1 pb:min-w-0">
            <TableCellField
              cellVariant="compact"
              label={`${resolvedLabels.buttonTitle}: ${rowName}`}
            >
              <Input
                size="sm"
                variant="compact"
                disabled={disabled}
                placeholder={resolvedLabels.buttonTitle}
                value={button.details.title}
                style={{
                  backgroundColor: labelColorHex,
                  color: labelFontColorHex,
                }}
                className="pb:font-semibold pb:ring-black/20 placeholder:pb:text-current/60"
                onFocus={() => {
                  if (!disabled) {
                    onButtonAction(button, buttonId, { type: "SELECT" });
                  }
                }}
                onChange={(e) => {
                  if (disabled) return;
                  const nextTitle = e.target.value;
                  if (button.type === "Log") {
                    onButtonAction(
                      button,
                      buttonId,
                      createSaveAction({
                        ...button,
                        details: {
                          ...button.details,
                          title: nextTitle,
                          ...(syncActive && { details: nextTitle }),
                        },
                      }),
                    );
                  } else {
                    onButtonAction(
                      button,
                      buttonId,
                      createSaveAction({
                        ...button,
                        details: {
                          ...button.details,
                          title: nextTitle,
                          ...(syncActive && { speech: nextTitle }),
                        },
                      }),
                    );
                  }
                }}
              />
            </TableCellField>
          </div>
        </div>
      </TableCell>

      {/* 3. Button Type (Message vs Log) */}
      <TableCell density={density}>
        <TableCellField
          cellVariant="compact"
          label={`${resolvedLabels.buttonType}: ${rowName}`}
        >
          <Select
            size="sm"
            variant="compact"
            disabled={disabled}
            aria-label={`${resolvedLabels.buttonType}: ${rowName}`}
            value={button.type}
            options={[
              { label: resolvedLabels.message, value: "Message" },
              { label: resolvedLabels.log, value: "Log" },
            ]}
            onChange={(val) => {
              if (disabled || !val) return;
              if (button.type === "Message" && val === "Log") {
                onButtonAction(
                  button,
                  buttonId,
                  createSaveAction({
                    type: "Log",
                    labelColor: button.labelColor,
                    details: {
                      title: button.details.title,
                      details: button.details.speech,
                    },
                  }),
                );
              } else if (button.type === "Log" && val === "Message") {
                onButtonAction(
                  button,
                  buttonId,
                  createSaveAction({
                    type: "Message",
                    labelColor: button.labelColor,
                    details: {
                      title: button.details.title,
                      speech: button.details.details || button.details.title,
                      color: button.labelColor,
                      emotion: "Neutral",
                    },
                  }),
                );
              }
            }}
          />
        </TableCellField>
      </TableCell>

      {/* 4. Speech / Details (Disabled when Sync Speech with Title is ON) */}
      <TableCell density={density}>
        {button.type === "Message" ? (
          <TableCellField
            cellVariant="compact"
            label={`${resolvedLabels.speech}: ${rowName}`}
          >
            <Input
              size="sm"
              variant="compact"
              disabled={disabled || syncActive}
              placeholder={resolvedLabels.speech}
              value={button.details.speech}
              onFocus={() => {
                if (!disabled) {
                  onButtonAction(button, buttonId, { type: "SELECT" });
                }
              }}
              onChange={(e) => {
                if (disabled || syncActive) return;
                onButtonAction(
                  button,
                  buttonId,
                  createSaveAction({
                    ...button,
                    details: {
                      ...button.details,
                      speech: e.target.value,
                    },
                  }),
                );
              }}
            />
          </TableCellField>
        ) : (
          <TableCellField
            cellVariant="compact"
            label={`${resolvedLabels.details}: ${rowName}`}
          >
            <Input
              size="sm"
              variant="compact"
              disabled={disabled || syncActive}
              placeholder={resolvedLabels.details}
              value={button.details.details ?? ""}
              onFocus={() => {
                if (!disabled) {
                  onButtonAction(button, buttonId, { type: "SELECT" });
                }
              }}
              onChange={(e) => {
                if (disabled || syncActive) return;
                onButtonAction(
                  button,
                  buttonId,
                  createSaveAction({
                    ...button,
                    details: {
                      ...button.details,
                      details: e.target.value,
                    },
                  }),
                );
              }}
            />
          </TableCellField>
        )}
      </TableCell>

      {/* 5. Label Color (Color-Filled Select Pill) */}
      <TableCell density={density}>
        <TableCellField
          cellVariant="compact"
          label={`${resolvedLabels.labelColor}: ${rowName}`}
        >
          <Select
            size="sm"
            variant="compact"
            disabled={disabled}
            aria-label={`${resolvedLabels.labelColor}: ${rowName}`}
            value={button.labelColor}
            options={colorOptions}
            style={{
              backgroundColor: labelColorHex,
              color: labelFontColorHex,
            }}
            className="pb:font-semibold pb:ring-black/20"
            onChange={(val) => {
              if (!val || disabled) return;
              onButtonAction(
                button,
                buttonId,
                createSaveAction({
                  ...button,
                  labelColor: val as PeerbotsColor,
                }),
              );
            }}
          />
        </TableCellField>
      </TableCell>

      {/* 6. Robot Color (Color-Filled Select Pill for Message rows) */}
      <TableCell density={density}>
        {button.type === "Message" ? (
          <TableCellField
            cellVariant="compact"
            label={`${resolvedLabels.robotColor}: ${rowName}`}
          >
            <Select
              size="sm"
              variant="compact"
              disabled={disabled}
              aria-label={`${resolvedLabels.robotColor}: ${rowName}`}
              value={button.details.color}
              options={colorOptions}
              style={{
                backgroundColor: robotColorHex,
                color: robotFontColorHex,
              }}
              className="pb:font-semibold pb:ring-black/20"
              onChange={(val) => {
                if (!val || disabled) return;
                onButtonAction(
                  button,
                  buttonId,
                  createSaveAction({
                    ...button,
                    details: {
                      ...button.details,
                      color: val as PeerbotsColor,
                    },
                  }),
                );
              }}
            />
          </TableCellField>
        ) : (
          <span className="pb:text-xs pb:text-gray-400">—</span>
        )}
      </TableCell>

      {/* 7. Emotion with 28x28 Robot Face Expression Preview Tile (Message rows) */}
      <TableCell density={density}>
        {button.type === "Message" ? (
          <div className="pb:flex pb:items-center pb:gap-1.5">
            <span
              aria-hidden="true"
              data-emotion-tile={buttonId}
              className="pb:h-7 pb:w-7 pb:p-1 pb:rounded-lg pb:border pb:border-black/20 pb:shadow-2xs pb:shrink-0 pb:flex pb:items-center pb:justify-center"
              style={{
                backgroundColor: robotColorHex,
              }}
            >
              <PeerbotsEmotionIcon
                emotion={button.details.emotion}
                customIcon={emotionIcons?.[button.details.emotion]}
                decorative
                className={
                  button.details.color === "Black" ? "pb:invert" : undefined
                }
              />
            </span>
            <div className="pb:flex-1 pb:min-w-0">
              <TableCellField
                cellVariant="compact"
                label={`${resolvedLabels.emotion}: ${rowName}`}
              >
                <Select
                  size="sm"
                  variant="compact"
                  disabled={disabled}
                  aria-label={`${resolvedLabels.emotion}: ${rowName}`}
                  value={button.details.emotion}
                  options={emotionOptions}
                  onChange={(val) => {
                    if (!val || disabled) return;
                    onButtonAction(
                      button,
                      buttonId,
                      createSaveAction({
                        ...button,
                        details: {
                          ...button.details,
                          emotion: val as PeerbotsEmotion,
                        },
                      }),
                    );
                  }}
                />
              </TableCellField>
            </div>
          </div>
        ) : (
          <span className="pb:text-xs pb:text-gray-400">—</span>
        )}
      </TableCell>

      {/* 8. Row Actions (Move Back, Move Forward, Delete) */}
      <TableCell density={density} align="end">
        <div className="pb:inline-flex pb:items-center pb:gap-0.5">
          <Button
            size="xs"
            variant="ghost"
            color="neutral"
            isIconOnly
            disabled={disabled || isFirstSibling}
            aria-label={`${resolvedLabels.moveUp}: ${rowName}`}
            title={resolvedLabels.moveUp}
            onClick={() => {
              if (disabled || isFirstSibling) return;
              onButtonAction(button, buttonId, { type: "SELECT" });
              onButtonAction(button, buttonId, {
                type: "MOVE",
                direction: "BACK",
              });
            }}
          >
            <Icon name="arrowUp" size="sm" aria-hidden="true" />
          </Button>

          <Button
            size="xs"
            variant="ghost"
            color="neutral"
            isIconOnly
            disabled={disabled || isLastSibling}
            aria-label={`${resolvedLabels.moveDown}: ${rowName}`}
            title={resolvedLabels.moveDown}
            onClick={() => {
              if (disabled || isLastSibling) return;
              onButtonAction(button, buttonId, { type: "SELECT" });
              onButtonAction(button, buttonId, {
                type: "MOVE",
                direction: "FORWARD",
              });
            }}
          >
            <Icon name="arrowDown" size="sm" aria-hidden="true" />
          </Button>

          <Button
            size="xs"
            variant="ghost"
            color="danger"
            isIconOnly
            disabled={disabled}
            aria-label={`${resolvedLabels.deleteButton}: ${rowName}`}
            title={resolvedLabels.deleteButton}
            onClick={() => {
              if (disabled) return;
              onButtonAction(button, buttonId, { type: "DELETE" });
              onDeleteRow(buttonId);
            }}
          >
            <Icon name="close" size="sm" aria-hidden="true" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
