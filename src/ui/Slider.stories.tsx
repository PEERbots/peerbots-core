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
    <div className="pb:space-y-2">
      <div className="pb:w-80">
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
      <Text variant="small" className="pb:text-slate-500">
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
    <div className="pb:space-y-4 pb:border pb:p-4 pb:rounded-lg pb:bg-white pb:shadow-sm">
      <Slider
        {...args}
        min={min}
        max={max}
        value={val}
        onChange={(v: number | number[]) => setVal(Array.isArray(v) ? v[0] : v)}
      />
      <div className="pb:flex pb:space-x-4">
        <div className="pb:flex pb:flex-col pb:gap-1">
          <Text
            variant="small"
            className="pb:uppercase pb:text-slate-400 pb:font-bold pb:text-[10px]"
          >
            Min
          </Text>
          <Input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="pb:w-20"
          />
        </div>
        <div className="pb:flex pb:flex-col pb:gap-1">
          <Text
            variant="small"
            className="pb:uppercase pb:text-slate-400 pb:font-bold pb:text-[10px]"
          >
            Max
          </Text>
          <Input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="pb:w-20"
          />
        </div>
        <div className="pb:flex pb:flex-col pb:justify-end">
          <Text variant="small" className="pb:text-slate-600 pb:font-medium">
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
    <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Width Responsiveness
        </Heading>
        <div className="pb:space-y-6">
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:italic pb:text-black">
              Full Width (Container Default)
            </Text>
            <Slider defaultValue={30} />
          </div>
          <div className="pb:space-y-1 pb:w-40">
            <Text variant="small" className="pb:italic pb:text-black">
              Narrow (w-40)
            </Text>
            <Slider defaultValue={70} />
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Dynamic Range Test
        </Heading>
        <RangeChangeableSlider args={{}} />
      </div>
    </div>
  ),
};
