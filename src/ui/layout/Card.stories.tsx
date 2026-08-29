import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Heading, Text } from "../foundations/Typography";
import { Button } from "../forms/Button";
import { Icon } from "../foundations/Icon";
import React from "react";

const meta: Meta<typeof Card> = {
  title: "Layout/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: "default",
    padding: "md",
    hoverable: true,
    children: (
      <div className="pb:space-y-3 pb:w-80">
        <Heading level={3}>Card Title</Heading>
        <Text variant="muted">This is a standard card with elevation and rounded borders.</Text>
        <Button variant="primary" size="sm">Action</Button>
      </div>
    ),
  },
};

export const GlassInContext: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-8 pb:max-w-4xl pb:p-6">
      {/* 3D Canvas Viewport HUD Context */}
      <div>
        <h4 className="pb:text-xs pb:font-bold pb:text-gray-700 pb:uppercase pb:tracking-wider pb:mb-2">
          Recommended Use: Floating Viewport HUD / Canvas Overlays
        </h4>
        <div className="pb:relative pb:w-full pb:h-80 pb:rounded-3xl pb:overflow-hidden pb:bg-gradient-to-tr pb:from-slate-900 pb:via-slate-800 pb:to-teal-950 pb:border pb:border-slate-700 pb:p-6 pb:flex pb:items-center pb:justify-center">
          {/* Simulated 3D Model Center Graphic */}
          <div className="pb:flex pb:flex-col pb:items-center pb:justify-center pb:text-center pb:opacity-80">
            <div className="pb:w-28 pb:h-28 pb:rounded-2xl pb:bg-peerbots-teal/20 pb:border-2 pb:border-peerbots-teal/40 pb:flex pb:items-center pb:justify-center pb:shadow-lg pb:shadow-peerbots-teal/10 pb:animate-pulse">
              <Icon name="face" className="pb:w-16 pb:h-16 pb:text-peerbots-teal" />
            </div>
            <span className="pb:text-xs pb:font-mono pb:text-teal-200 pb:mt-3">
              WebGL 3D Robot Face Stage
            </span>
          </div>

          {/* Floating HUD Camera Toolbar (Glass) */}
          <div className="pb:absolute pb:left-6 pb:top-1/2 pb:-translate-y-1/2">
            <Card variant="glass" padding="none" className="pb:p-1.5 pb:flex pb:flex-col pb:gap-2 pb:shadow-2xl">
              <button aria-label="Zoom in" className="pb:w-9 pb:h-9 pb:flex pb:items-center pb:justify-center pb:rounded-xl pb:hover:bg-black/5 pb:text-gray-900 pb:font-bold pb:text-lg">
                +
              </button>
              <div className="pb:w-full pb:h-px pb:bg-black/10" />
              <button aria-label="Zoom out" className="pb:w-9 pb:h-9 pb:flex pb:items-center pb:justify-center pb:rounded-xl pb:hover:bg-black/5 pb:text-gray-900 pb:font-bold pb:text-lg">
                -
              </button>
              <div className="pb:w-full pb:h-px pb:bg-black/10" />
              <button aria-label="Reset camera" className="pb:w-9 pb:h-9 pb:flex pb:items-center pb:justify-center pb:rounded-xl pb:hover:bg-black/5 pb:text-gray-900">
                <Icon name="arrowPath" className="pb:w-4 pb:h-4" />
              </button>
            </Card>
          </div>

          {/* Floating Parameter Overlay (Glass) */}
          <div className="pb:absolute pb:right-6 pb:bottom-6 pb:max-w-xs">
            <Card variant="glass" padding="sm" className="pb:shadow-2xl pb:space-y-2">
              <div className="pb:flex pb:items-center pb:justify-between">
                <span className="pb:text-xs pb:font-bold pb:text-gray-900">Head Rotation</span>
                <span className="pb:text-[10px] pb:font-mono pb:text-teal-950 pb:bg-peerbots-teal/30 pb:px-1.5 pb:py-0.5 pb:rounded pb:font-bold">
                  Yaw: 14°
                </span>
              </div>
              <Text variant="small" className="pb:text-[11px] pb:text-gray-700 pb:block">
                Glass surfaces maintain ambient visual depth without occluding the rendered model.
              </Text>
            </Card>
          </div>
        </div>
      </div>

      {/* When NOT to use: Comparison */}
      <div>
        <h4 className="pb:text-xs pb:font-bold pb:text-gray-700 pb:uppercase pb:tracking-wider pb:mb-2">
          Standard Content vs Glass Comparison
        </h4>
        <div className="pb:grid pb:grid-cols-2 pb:gap-6 pb:p-6 pb:bg-gray-100 pb:rounded-2xl">
          <Card variant="elevated" padding="md">
            <span className="pb:text-[10px] pb:font-bold pb:uppercase pb:tracking-wider pb:text-gray-700">
              Standard Opaque Surface (Recommended for forms & text)
            </span>
            <Heading level={4} className="pb:mt-1">Account & Settings</Heading>
            <Text variant="muted" className="pb:text-xs pb:mt-1">
              Solid white opaque cards ensure maximum readability, high contrast, and crisp text rendering on light backgrounds.
            </Text>
          </Card>
          <Card variant="glass" padding="md">
            <span className="pb:text-[10px] pb:font-bold pb:uppercase pb:tracking-wider pb:text-peerbots-darkteal">
              Glass Surface (For visual layering & HUDs)
            </span>
            <Heading level={4} className="pb:mt-1">Floating Modal Panel</Heading>
            <Text variant="muted" className="pb:text-xs pb:mt-1">
              Translucent backdrop with subtle border blur creates a tactile glass feel over rich colored backgrounds.
            </Text>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="pb:grid pb:grid-cols-2 pb:gap-6 pb:max-w-3xl pb:p-6 pb:bg-gray-100 pb:rounded-2xl">
      <Card variant="default">
        <Heading level={4}>Default</Heading>
        <Text variant="muted">Default subtle shadow</Text>
      </Card>
      <Card variant="elevated">
        <Heading level={4}>Elevated</Heading>
        <Text variant="muted">Higher elevation shadow</Text>
      </Card>
      <Card variant="glass">
        <Heading level={4}>Glass</Heading>
        <Text variant="muted">Backdrop blur surface</Text>
      </Card>
      <Card variant="flat">
        <Heading level={4}>Flat</Heading>
        <Text variant="muted">Subtle background fill</Text>
      </Card>
      <Card variant="outline">
        <Heading level={4}>Outline</Heading>
        <Text variant="muted">Clean 2px border</Text>
      </Card>
      <Card variant="teal-tint">
        <Heading level={4} variant="marketing-teal">Teal Tint</Heading>
        <Text variant="muted">Brand teal tinted background</Text>
      </Card>
      <Card variant="pink-tint">
        <Heading level={4} variant="marketing-pink">Pink Tint</Heading>
        <Text variant="muted">Brand pink tinted background</Text>
      </Card>
    </div>
  ),
};
