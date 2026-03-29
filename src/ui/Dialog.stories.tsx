import type { Meta, StoryObj } from "@storybook/react";
import { Dialog, DialogTitle, DialogDescription, DialogClose } from "./Dialog";
import { Button } from "./Button";

const meta: Meta<typeof Dialog> = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog trigger={<Button>Open Default Dialog</Button>}>
      <DialogTitle className="text-xl font-bold mb-2">Dialog Title</DialogTitle>
      <DialogDescription className="text-black mb-6">
        This is a description of the dialog content.
      </DialogDescription>
      <div className="flex justify-end gap-2">
        <DialogClose render={<Button variant="secondary">Cancel</Button>} />
        <DialogClose render={<Button variant="primary">Confirm</Button>} />
      </div>
    </Dialog>
  ),
};
