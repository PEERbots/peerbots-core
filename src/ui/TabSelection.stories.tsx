import type { Meta, StoryObj } from "@storybook/react";
import { TabSelection } from "./TabSelection";
import React, { useState } from "react";

const meta: Meta<typeof TabSelection> = {
  title: "UI/TabSelection",
  component: TabSelection,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof TabSelection>;

const mockTabs = [
  { id: "1", label: "Default Template" },
  { id: "2", label: "Robot Calibration" },
  { id: "3", label: "Experimental Sequence" },
];

export const Default: Story = {
  render: function Render() {
    const [activeTab, setActiveTab] = useState<string>("1");

    const tabsWithActions = mockTabs.map((tab) => ({
      ...tab,
      onEdit: () => alert(`Editing ${tab.label}`),
      onClose: () => alert(`Closing ${tab.label}`),
    }));

    return (
      <div className="pb:w-[600px] pb:border pb:p-4 pb:bg-gray-50">
        <TabSelection
          tabs={tabsWithActions}
          activeTabId={activeTab}
          onTabClick={setActiveTab}
          onAddClick={() => alert("Add new tab clicked!")}
        />
      </div>
    );
  },
};
