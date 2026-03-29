import type { Meta, StoryObj } from "@storybook/react";
import { AuthFormUI } from "./AuthFormUI";
import { useState } from "react";

const meta: Meta<typeof AuthFormUI> = {
  title: "UI/AuthFormUI",
  component: AuthFormUI,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof AuthFormUI>;

export const Default: Story = {
  render: function Render() {
    const [mode, setMode] = useState<
      "signing up" | "signing in" | "resetting password"
    >("signing in");
    return (
      <div className="w-[400px]">
        <AuthFormUI
          mode={mode}
          onModeChange={setMode}
          formAction={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
          actionState={{ error: "", message: "" }}
          onGoogleSignIn={() => alert("Google Sign In clicked")}
          description="Sign in to simplify connecting to robots, and synchronize your work across devices."
        />
      </div>
    );
  },
};

export const Variations: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-10 w-[400px]">
        <AuthFormUI
          mode="signing up"
          onModeChange={() => {}}
          formAction={async () => {}}
          actionState={{ error: "", message: "" }}
          onGoogleSignIn={() => {}}
          description="Sign up description"
        />
        <AuthFormUI
          mode="resetting password"
          onModeChange={() => {}}
          formAction={async () => {}}
          actionState={{ error: "", message: "Email sent!" }}
        />
        <AuthFormUI
          mode="signing in"
          onModeChange={() => {}}
          formAction={async () => {}}
          actionState={{ error: "Invalid email or password", message: "" }}
          description="Sign in description"
        />
      </div>
    );
  },
};
