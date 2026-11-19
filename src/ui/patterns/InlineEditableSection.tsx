import React, { useEffect, useState } from "react";
import { Icon } from "../foundations/Icon";
import { Heading, Text } from "../foundations/Typography";
import { Button } from "../forms/Button";
import { Input } from "../forms/Input";
import { TextArea } from "../forms/TextArea";
import { cn } from "../utils";

export interface InlineEditableSectionValues {
  title: string;
  description: string;
}

export interface InlineEditableSectionProps {
  /** Optional single-line title / collection name. */
  title?: string;
  /** When `true`, renders an `<Input>` for editing `title` in edit mode. */
  editableTitle?: boolean;
  /** When `true` (default when `editableTitle` is `true`), disables saving when `title.trim()` is empty. */
  requireTitle?: boolean;
  /** Heading level used when rendering `title` in view mode (defaults to `3`). */
  titleHeadingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Optional badges or inline nodes rendered right next to the title in view mode. */
  titleBadges?: React.ReactNode;
  /** Current description text. */
  description?: string;
  /** Placeholder text displayed when `description` is empty in view mode. If omitted, empty description is hidden unless `showEmptyDescription` is `true`. */
  emptyDescriptionText?: string;
  /** When `true`, displays `emptyDescriptionText` when `description` is blank. Defaults to `true` when `emptyDescriptionText` is provided. */
  showEmptyDescription?: boolean;
  /** Controlled edit mode flag. Omit to use uncontrolled state via `defaultEditing`. */
  isEditing?: boolean;
  /** Initial edit mode flag for uncontrolled usage. */
  defaultEditing?: boolean;
  /** Callback fired whenever edit mode is toggled on or off. */
  onEditingChange?: (editing: boolean) => void;
  /** Callback fired when the user clicks Save with the trimmed title and description. */
  onSave: (values: InlineEditableSectionValues) => void;
  /** Optional callback fired when the user cancels / closes edit mode. */
  onCancel?: () => void;
  /** Optional content rendered between the title/description inputs and the Save / Close action buttons while in edit mode (e.g., Method C reorderable template grid). */
  children?: React.ReactNode;
  /** When `true`, hides the built-in Edit button in view mode (useful when the parent renders its own Edit trigger in a custom toolbar). */
  hideEditButton?: boolean;
  /** Optional character threshold above which description is clamped to 1 line with Read More / Show Less toggle in view mode. */
  clampDescriptionThreshold?: number;
  /** Placeholder for the title `<Input>`. */
  titlePlaceholder?: string;
  /** Placeholder for the description `<TextArea>`. */
  descriptionPlaceholder?: string;
  /** Accessible label for the title `<Input>`. */
  titleAriaLabel?: string;
  /** Accessible label for the description `<TextArea>`. */
  descriptionAriaLabel?: string;
  /** Label for the Edit button (defaults to `"Edit"`). */
  editLabel?: string;
  /** Accessible aria-label override for the Edit button. */
  editAriaLabel?: string;
  /** Label for the Save button (defaults to `"Save"`). */
  saveLabel?: string;
  /** Label for the Close/Cancel button (defaults to `"Close"`). */
  cancelLabel?: string;
  /** Label for "Read More" button when clamped (defaults to `"Read More"`). */
  readMoreLabel?: string;
  /** Label for "Show Less" button when expanded (defaults to `"Show Less"`). */
  showLessLabel?: string;
  /** Number of rows for the description `<TextArea>` (defaults to `3`). */
  descriptionRows?: number;
  /** Optional className applied to the root container. */
  className?: string;
}

/**
 * Reusable inline view/edit pattern component for editing a description (and optionally a title/name),
 * supporting both standalone uncontrolled usage (e.g. template description editor) and controlled
 * Method C scoped edit mode (where child items such as collection template tiles also enter edit mode).
 */
export function InlineEditableSection({
  title = "",
  editableTitle = false,
  requireTitle = true,
  titleHeadingLevel = 3,
  titleBadges,
  description = "",
  emptyDescriptionText,
  showEmptyDescription,
  isEditing: controlledIsEditing,
  defaultEditing = false,
  onEditingChange,
  onSave,
  onCancel,
  children,
  hideEditButton = false,
  clampDescriptionThreshold,
  titlePlaceholder = "Enter name...",
  descriptionPlaceholder = "Enter description...",
  titleAriaLabel = "Title",
  descriptionAriaLabel = "Description",
  editLabel = "Edit",
  editAriaLabel,
  saveLabel = "Save",
  cancelLabel = "Close",
  readMoreLabel = "Read More",
  showLessLabel = "Show Less",
  descriptionRows = 3,
  className,
}: InlineEditableSectionProps) {
  const [uncontrolledEditing, setUncontrolledEditing] =
    useState<boolean>(defaultEditing);
  const isEditing =
    controlledIsEditing !== undefined
      ? controlledIsEditing
      : uncontrolledEditing;

  const [draftTitle, setDraftTitle] = useState(title);
  const [draftDescription, setDraftDescription] = useState(description);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(title);
      setDraftDescription(description);
    }
  }, [title, description, isEditing]);

  const setEditing = (next: boolean) => {
    if (controlledIsEditing === undefined) {
      setUncontrolledEditing(next);
    }
    onEditingChange?.(next);
  };

  const handleStartEdit = () => {
    setDraftTitle(title);
    setDraftDescription(description);
    setEditing(true);
  };

  const handleSave = () => {
    const trimmedTitle = editableTitle ? draftTitle.trim() : title;
    if (editableTitle && requireTitle && trimmedTitle.length === 0) {
      return;
    }
    onSave({
      title: trimmedTitle,
      description: draftDescription,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setDraftTitle(title);
    setDraftDescription(description);
    onCancel?.();
    setEditing(false);
  };

  const isSaveDisabled =
    editableTitle && requireTitle && draftTitle.trim().length === 0;
  const shouldShowEmpty =
    showEmptyDescription ?? Boolean(emptyDescriptionText);
  const isClamped =
    typeof clampDescriptionThreshold === "number" &&
    description.length > clampDescriptionThreshold;

  return (
    <div className={cn("space-y-2", className)}>
      {isEditing ? (
        <div className="space-y-2.5">
          {editableTitle && (
            <div>
              <Input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder={titlePlaceholder}
                aria-label={titleAriaLabel}
                className="w-full font-semibold"
              />
            </div>
          )}
          <div>
            <TextArea
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              placeholder={descriptionPlaceholder}
              aria-label={descriptionAriaLabel}
              rows={descriptionRows}
              className="w-full"
            />
          </div>
          {children}
          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              disabled={isSaveDisabled}
              onClick={handleSave}
            >
              {saveLabel}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              {cancelLabel}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {(editableTitle || title || titleBadges) && (
            <div className="flex items-center flex-wrap gap-2">
              {title && <Heading level={titleHeadingLevel}>{title}</Heading>}
              {titleBadges}
            </div>
          )}

          {description ? (
            clampDescriptionThreshold !== undefined ? (
              <div className="bg-gray-50/50 p-2 rounded-xl border border-gray-100/50">
                <div
                  className={cn(
                    "leading-relaxed",
                    isClamped && !isExpanded && "line-clamp-1",
                  )}
                >
                  <Text variant="muted">{description}</Text>
                </div>
                {isClamped && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? showLessLabel : readMoreLabel}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-normal text-gray-800">{description}</div>
            )
          ) : shouldShowEmpty && emptyDescriptionText ? (
            <div className="text-gray-500 text-xs italic">
              {emptyDescriptionText}
            </div>
          ) : null}

          {children}

          {!hideEditButton && (
            <div className="mt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleStartEdit}
                aria-label={editAriaLabel}
                leftIcon={<Icon name="pencilSquare" size="sm" />}
              >
                {editLabel}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
