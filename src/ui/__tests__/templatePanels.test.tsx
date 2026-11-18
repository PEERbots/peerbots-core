import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EXAMPLE_LOG_AND_SPEAK_TEMPLATE } from "../../templates/examples";
import type { RobotControlButton } from "../../templates/types";
import { BasePanel } from "../layout/BasePanel";
import { PeerbotsButtonEditor } from "../patterns/control-views/PeerbotsButtonEditor";
import { TemplateAnalysisPanel } from "../patterns/control-views/TemplateAnalysisPanel";

describe("BasePanel, PeerbotsButtonEditor, and TemplateAnalysisPanel", () => {
  it("renders BasePanel title, children, and optional close button", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <BasePanel title="Inspector" onClose={onClose}>
        <div>Panel Body</div>
      </BasePanel>,
    );

    expect(screen.getByRole("heading", { name: "Inspector" })).toBeInTheDocument();
    expect(screen.getByText("Panel Body")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close Inspector" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <BasePanel title="Readonly Panel">
        <div>Panel Body</div>
      </BasePanel>,
    );
    expect(
      screen.queryByRole("button", { name: /Close/i }),
    ).not.toBeInTheDocument();
  });

  it("renders PeerbotsButtonEditor with live preview, reorder, save, and Delete actions", () => {
    const onButtonAction = vi.fn();
    const onClose = vi.fn();
    const sampleButton: RobotControlButton = {
      type: "Message",
      labelColor: "Light Blue",
      details: {
        title: "Hello",
        speech: "Hello",
        color: "Light Blue",
        emotion: "Happy",
      },
    };

    render(
      <PeerbotsButtonEditor
        buttonId="btn-1"
        button={sampleButton}
        onButtonAction={onButtonAction}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole("heading", { name: "Edit Button" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Backwards" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Forwards" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Backwards" }));
    expect(onButtonAction).toHaveBeenCalledWith(sampleButton, "btn-1", {
      type: "MOVE",
      direction: "BACK",
    });

    fireEvent.click(screen.getByRole("button", { name: "Delete button" }));
    expect(onButtonAction).toHaveBeenCalledWith(sampleButton, "btn-1", {
      type: "DELETE",
    });

    fireEvent.click(screen.getByRole("button", { name: "Close Edit Button" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders PeerbotsButtonEditor empty state when button is null", () => {
    render(<PeerbotsButtonEditor buttonId="" button={null} />);
    expect(
      screen.getByText("Select a button to edit its properties."),
    ).toBeInTheDocument();
  });

  it("renders TemplateAnalysisPanel metrics and empty state", () => {
    const onClose = vi.fn();
    const sampleTemplate = EXAMPLE_LOG_AND_SPEAK_TEMPLATE;
    const totalButtons = Object.keys(sampleTemplate.buttons).length;

    const { rerender } = render(
      <TemplateAnalysisPanel template={sampleTemplate} onClose={onClose} />,
    );

    expect(
      screen.getByRole("heading", { name: "Analyze Template" }),
    ).toBeInTheDocument();
    expect(screen.getByText(`${totalButtons} buttons`)).toBeInTheDocument();
    expect(screen.getAllByText("Title Length").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Speech Length").length).toBeGreaterThanOrEqual(1);

    rerender(<TemplateAnalysisPanel template={null} onClose={onClose} />);
    expect(screen.getByText("No template selected.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
