import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InlineEditableSection } from "./InlineEditableSection";

describe("InlineEditableSection", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders description in view mode and toggles to edit mode on clicking Edit", () => {
    const onSave = vi.fn();
    render(
      <InlineEditableSection
        description="Initial description text"
        onSave={onSave}
      />,
    );

    expect(screen.getByText("Initial description text")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Initial description text");

    fireEvent.change(textarea, { target: { value: "Updated description" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith({
      title: "",
      description: "Updated description",
    });
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("shows emptyDescriptionText when description is empty and resets draft on Close", () => {
    const onSave = vi.fn();
    render(
      <InlineEditableSection
        description=""
        emptyDescriptionText="No description set."
        onSave={onSave}
      />,
    );

    expect(screen.getByText("No description set.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Temporary edit" } });
    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText("No description set.")).toBeInTheDocument();
  });

  it("supports editableTitle with required validation and controlled isEditing state", () => {
    const onSave = vi.fn();
    const onEditingChange = vi.fn();

    render(
      <InlineEditableSection
        editableTitle
        title="Classroom Greetings"
        description="Morning check-in templates"
        isEditing={true}
        onEditingChange={onEditingChange}
        onSave={onSave}
        titleAriaLabel="Collection Name"
        descriptionAriaLabel="Collection Description"
      />,
    );

    const titleInput = screen.getByLabelText("Collection Name");
    const descInput = screen.getByLabelText("Collection Description");
    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(
      screen.getByText("Collection Name", { selector: "label > div" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Collection Description", { selector: "label > div" }),
    ).toBeInTheDocument();
    expect(titleInput).toHaveValue("Classroom Greetings");
    expect(descInput).toHaveValue("Morning check-in templates");

    // Empty title disables Save when requireTitle is true (default)
    fireEvent.change(titleInput, { target: { value: "   " } });
    expect(saveButton).toBeDisabled();

    fireEvent.change(titleInput, { target: { value: "Updated Pack Name" } });
    fireEvent.change(descInput, { target: { value: "Updated overview" } });
    expect(saveButton).not.toBeDisabled();

    fireEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledWith({
      title: "Updated Pack Name",
      description: "Updated overview",
    });
    expect(onEditingChange).toHaveBeenCalledWith(false);
  });
});
