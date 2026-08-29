import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Colors",
  tags: ["autodocs"],
};

export default meta;

export const Variations: StoryObj = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-8 pb:p-6 pb:bg-white pb:max-w-5xl">
      <div>
        <h3 className="pb:text-sm pb:font-bold pb:text-black pb:uppercase pb:tracking-wider pb:border-b pb:pb-2 pb:mb-4">
          Peerbots Canonical Brand Palette
        </h3>
        <p className="pb:text-xs pb:text-gray-700 pb:mb-4">
          Primary brand colors used across the marketing website, competition runner, and core apps.
        </p>
        <div className="pb:grid pb:grid-cols-2 pb:sm:grid-cols-3 pb:md:grid-cols-4 pb:gap-4">
          <ColorItem name="Peerbots Teal" hex="#5fc7cc" variable="var(--pb-color-peerbots-teal)" role="Primary brand accent" />
          <ColorItem name="Peerbots Pink" hex="#e96c8a" variable="var(--pb-color-peerbots-pink)" role="Secondary brand accent & highlights" />
          <ColorItem name="Dark Teal" hex="#3f8588" variable="var(--pb-color-peerbots-darkteal)" role="High-contrast interactive teal" />
          <ColorItem name="Dark Blue" hex="#2e3a59" variable="var(--pb-color-peerbots-darkblue)" role="Deep brand background / headings" />
          <ColorItem name="Olive" hex="#82871f" variable="var(--pb-color-peerbots-olive)" role="Tertiary earth accent" />
          <ColorItem name="Dark Neutral" hex="#1a1a1a" variable="var(--pb-color-peerbots-dark)" role="Headings and dark surfaces" />
          <ColorItem name="Light Neutral" hex="#f8f9fa" variable="var(--pb-color-peerbots-light)" role="Page & card subtle fills" />
        </div>
      </div>

      <div>
        <h3 className="pb:text-sm pb:font-bold pb:text-black pb:uppercase pb:tracking-wider pb:border-b pb:pb-2 pb:mb-4">
          Application & Controller Tokens
        </h3>
        <p className="pb:text-xs pb:text-gray-700 pb:mb-4">
          High-energy functional tokens used for controller buttons, sliders, and form active states.
        </p>
        <div className="pb:grid pb:grid-cols-2 pb:sm:grid-cols-3 pb:md:grid-cols-4 pb:gap-4">
          <ColorItem name="Primary (Electric)" hex="#46d9d9" variable="var(--pb-color-primary)" role="Controller buttons & active toggles" />
          <ColorItem name="Dark Primary" hex="#0f766e" variable="var(--pb-color-dark-primary)" role="Hover state for electric primary" />
          <ColorItem name="Secondary (Pink)" hex="#e86e8a" variable="var(--pb-color-secondary)" role="Secondary actions & badges" />
          <ColorItem name="Accent Lime" hex="#d9e021" variable="var(--pb-color-accent)" role="High-energy accent" />
          <ColorItem name="Accent Two (Blue)" hex="#4273ff" variable="var(--pb-color-accent-two)" role="Interactive blue accent" />
          <ColorItem name="Danger" hex="#e86e8a" variable="var(--pb-color-danger)" role="Destructive alerts and buttons" />
          <ColorItem name="Sidebar BG" hex="#f9ffff" variable="var(--pb-sidebar-bg)" role="App shell sidebar background" />
          <ColorItem name="Light BG" hex="#d8e7eb" variable="var(--pb-color-light-bg)" role="Soft container backdrop" />
        </div>
      </div>
    </div>
  ),
};

function ColorItem({
  name,
  hex,
  variable,
  role,
}: {
  name: string;
  hex: string;
  variable: string;
  role: string;
}) {
  return (
    <div className="pb:flex pb:flex-col pb:gap-2 pb:p-3 pb:rounded-xl pb:border pb:border-gray-100 pb:bg-gray-50/50">
      <div
        className="pb:h-16 pb:w-full pb:rounded-lg pb:shadow-xs pb:border pb:border-black/5"
        style={{ backgroundColor: variable }}
      />
      <div className="pb:flex pb:flex-col">
        <div className="pb:flex pb:items-center pb:justify-between">
          <span className="pb:text-xs pb:font-bold pb:text-gray-900">{name}</span>
          <span className="pb:text-[10px] pb:font-mono pb:text-gray-600">{hex}</span>
        </div>
        <span className="pb:text-[11px] pb:text-gray-700 pb:mt-0.5">{role}</span>
        <code className="pb:text-[10px] pb:text-gray-600 pb:font-mono pb:mt-1 truncate">{variable}</code>
      </div>
    </div>
  );
}
