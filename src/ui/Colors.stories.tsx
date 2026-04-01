import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/Colors",
  tags: ["autodocs"],
};

export default meta;

export const Variations: StoryObj = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-8 pb:p-4 pb:bg-white">
      <div>
        <h3 className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider pb:border-b pb:pb-1 pb:mb-4">
          Theme Colors
        </h3>
        <div className="pb:grid pb:grid-cols-2 pb:md:grid-cols-3 pb:lg:grid-cols-5 pb:gap-4">
          <ColorItem name="Primary" variable="var(--pb-color-primary)" />
          <ColorItem name="Secondary" variable="var(--pb-color-secondary)" />
          <ColorItem name="Accent" variable="var(--pb-color-accent)" />
          <ColorItem name="Danger" variable="var(--pb-color-danger)" />
          <ColorItem name="Light BG" variable="var(--pb-color-light-bg)" />
        </div>
      </div>

      <div>
        <h3 className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider pb:border-b pb:pb-1 pb:mb-4">
          Extended Accent Colors
        </h3>
        <div className="pb:grid pb:grid-cols-2 pb:md:grid-cols-3 pb:lg:grid-cols-4 pb:gap-4">
          <ColorItem name="Accent HC" variable="var(--pb-color-accent-hc)" />
          <ColorItem name="Accent Two" variable="var(--pb-color-accent-two)" />
          <ColorItem
            name="Accent Two HC"
            variable="var(--pb-color-accent-two-hc)"
          />
          <ColorItem name="Accent Three" variable="var(--pb-color-accent-three)" />
        </div>
      </div>

      <div>
        <h3 className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider pb:border-b pb:pb-1 pb:mb-4">
          UI Elements
        </h3>
        <div className="pb:grid pb:grid-cols-2 pb:md:grid-cols-3 pb:lg:grid-cols-4 pb:gap-4">
          <ColorItem name="Sidebar BG" variable="var(--pb-sidebar-bg)" />
          <ColorItem name="Dark Primary" variable="var(--pb-color-dark-primary)" />
        </div>
      </div>
    </div>
  ),
};

function ColorItem({ name, variable }: { name: string; variable: string }) {
  return (
    <div className="pb:flex pb:flex-col pb:gap-2">
      <div
        className="pb:h-20 pb:w-full pb:rounded-md pb:shadow-inner pb:border pb:border-gray-100"
        style={{ backgroundColor: variable }}
      />
      <div className="pb:flex pb:flex-col">
        <span className="pb:text-sm pb:font-bold pb:text-gray-900">{name}</span>
        <code className="pb:text-xs pb:text-gray-500">{variable}</code>
      </div>
    </div>
  );
}
