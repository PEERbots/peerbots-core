import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Slider } from "./Slider";
import { Input } from "./Input";
import { Heading, Text } from "./Typography";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  argTypes: {
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

const InteractiveSlider = (props: React.ComponentProps<typeof Slider>) => {
  const [value, setValue] = useState(
    Array.isArray(props.value) ? props.value[0] : (props.value ?? 0),
  );

  return (
    <div className="space-y-2">
      <div className="w-80">
        <Slider
          {...props}
          value={value}
          onChange={(v) => {
            const newVal = Array.isArray(v) ? v[0] : v;
            setValue(newVal);
            props.onChange?.(v, null as unknown as Event);
          }}
        />
      </div>
      <Text variant="small" className="text-slate-500">
        Value: {value}
      </Text>
    </div>
  );
};

const RangeChangeableSlider = ({
  args,
}: {
  args: React.ComponentProps<typeof Slider>;
}) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [val, setVal] = useState(50);

  return (
    <div className="space-y-4 border p-4 rounded-lg bg-white shadow-sm">
      <Slider
        {...args}
        min={min}
        max={max}
        value={val}
        onChange={(v: number | number[]) => setVal(Array.isArray(v) ? v[0] : v)}
      />
      <div className="flex space-x-4">
        <div className="flex flex-col gap-1">
          <Text
            variant="small"
            className="uppercase text-slate-400 font-bold text-[10px]"
          >
            Min
          </Text>
          <Input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-20"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text
            variant="small"
            className="uppercase text-slate-400 font-bold text-[10px]"
          >
            Max
          </Text>
          <Input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-20"
          />
        </div>
        <div className="flex flex-col justify-end">
          <Text variant="small" className="text-slate-600 font-medium">
            Current: {val}
          </Text>
        </div>
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    value: 50,
  },
  render: (args) => <InteractiveSlider {...args} />,
};

export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-4">
      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Width Responsiveness
        </Heading>
        <div className="space-y-6">
          <div className="space-y-1">
            <Text variant="small" className="italic text-black">
              Full Width (Container Default)
            </Text>
            <Slider defaultValue={30} />
          </div>
          <div className="space-y-1 w-40">
            <Text variant="small" className="italic text-black">
              Narrow (w-40)
            </Text>
            <Slider defaultValue={70} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Dynamic Range Test
        </Heading>
        <RangeChangeableSlider args={{}} />
      </div>
    </div>
  ),
};
