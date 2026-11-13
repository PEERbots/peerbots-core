import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { Button } from "../forms/Button";
import { Input } from "../forms/Input";
import { Text } from "../foundations/Typography";
import { TabSelection } from "./TabSelection";

const TAB_SELECTION_DECISION_MD = `
Accessible dynamic workspace tab strip (\`role="tablist"\` + \`role="tab"\` with Left/Right/Home/End keyboard navigation) where active tabs expose sibling **Rename (\`onEdit\`)** and **Close (\`onClose\`)** icon actions alongside a trailing **Add Tab (\`onAddClick\`)** button—with zero nested \`<button>\` elements and WCAG 2.1 AA inactive/active contrast.

| Control | Option Count | Selection Mode | Layout & Lifecycle | Typical Use Case |
|---|---|---|---|---|
| **\`<TabSelection>\`** | **1–10+ dynamic** | Single active workspace tab | \`tablist\`/\`tab\` strip with \`+\` Add, Rename (\`onEdit\`), and \`×\` Close (\`onClose\`) | Editable template collections, multi-session workspaces |
| **\`<TabRadio>\`** | **2–5 static** | Single-select | Compact bordered segmented track | Fixed view/mode switchers (\`Buttons \\| Table \\| Flow\`) |
| **\`<ChipGroup>\`** | **3–12+ static/dynamic** | Single **or** Multi-select (\`multiple\`) | Wrapping or scrolling filter pills + badges | Multi-select search facets, tag filters |
`.trim();

const meta: Meta<typeof TabSelection> = {
  title: "Forms/Selection Controls/TabSelection",
  component: TabSelection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: TAB_SELECTION_DECISION_MD,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TabSelection>;

interface EditableTab {
  id: string;
  label: string;
}

const INITIAL_TABS: EditableTab[] = [
  { id: "tab-1", label: "Morning Check-In" },
  { id: "tab-2", label: "Calm Down Routine" },
  { id: "tab-3", label: "Storytime Prompts" },
];

export const Default: Story = {
  render: function Render() {
    const [tabs, setTabs] = useState<EditableTab[]>(INITIAL_TABS);
    const [activeTabId, setActiveTabId] = useState<string>("tab-1");
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameDraft, setRenameDraft] = useState<string>("");
    const [nextCounter, setNextCounter] = useState<number>(4);

    const handleAddTab = () => {
      const newId = `tab-${nextCounter}`;
      const newTab: EditableTab = {
        id: newId,
        label: `Template ${nextCounter}`,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newId);
      setNextCounter((c) => c + 1);
    };

    const handleStartRename = (tab: EditableTab) => {
      setRenamingId(tab.id);
      setRenameDraft(tab.label);
    };

    const handleCommitRename = () => {
      if (!renamingId) return;
      const trimmed = renameDraft.trim();
      if (trimmed) {
        setTabs((prev) =>
          prev.map((t) => (t.id === renamingId ? { ...t, label: trimmed } : t)),
        );
      }
      setRenamingId(null);
    };

    const handleCloseTab = (tabId: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.id === tabId);
        const next = prev.filter((t) => t.id !== tabId);
        if (activeTabId === tabId) {
          const fallback = next[Math.min(idx, next.length - 1)];
          setActiveTabId(fallback?.id ?? "");
        }
        return next;
      });
      if (renamingId === tabId) {
        setRenamingId(null);
      }
    };

    const tabsWithActions = tabs.map((tab) => ({
      ...tab,
      onEdit: () => handleStartRename(tab),
      onClose: () => handleCloseTab(tab.id),
    }));

    const activeTab = tabs.find((t) => t.id === activeTabId);

    return (
      <div className="pb:max-w-2xl pb:space-y-4 pb:rounded-2xl pb:border pb:border-gray-200 pb:bg-white pb:p-5 pb:shadow-xs">
        <TabSelection
          ariaLabel="Template workspaces"
          tabs={tabsWithActions}
          activeTabId={activeTabId}
          onTabClick={setActiveTabId}
          onAddClick={handleAddTab}
        />

        {renamingId && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCommitRename();
            }}
            className="pb:flex pb:items-center pb:gap-2 pb:rounded-xl pb:border pb:border-teal-200 pb:bg-teal-50/50 pb:p-3"
          >
            <Input
              aria-label="Rename active tab"
              size="sm"
              value={renameDraft}
              onChange={(e) => setRenameDraft(e.target.value)}
              className="pb:max-w-xs pb:bg-white"
            />
            <Button type="submit" size="sm" color="primary">
              Save Name
            </Button>
            <Button
              type="button"
              size="sm"
              color="neutral"
              onClick={() => setRenamingId(null)}
            >
              Cancel
            </Button>
          </form>
        )}

        <div className="pb:rounded-xl pb:border pb:border-gray-100 pb:bg-gray-50 pb:p-4">
          {activeTab ? (
            <Text size="sm">
              Active workspace: <strong>{activeTab.label}</strong> (use the
              pencil icon to rename inline, <code>×</code> to close, or{" "}
              <code>+</code> to create a new tab).
            </Text>
          ) : (
            <div className="pb:flex pb:items-center pb:justify-between pb:gap-3">
              <Text size="sm" color="muted">
                All tabs closed. Click <code>+</code> or restore defaults.
              </Text>
              <Button
                size="xs"
                color="neutral"
                onClick={() => {
                  setTabs(INITIAL_TABS);
                  setActiveTabId("tab-1");
                }}
              >
                Restore Default Tabs
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  },
};

export const ReadOnlySwitchableTabs: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When `onEdit`, `onClose`, and `onAddClick` are omitted, `TabSelection` renders a clean switch-only workspace tab bar.",
      },
    },
  },
  render: function Render() {
    const [activeTabId, setActiveTabId] = useState<string>("tab-1");
    return (
      <div className="pb:max-w-xl pb:rounded-2xl pb:border pb:border-gray-200 pb:bg-white pb:p-4">
        <TabSelection
          ariaLabel="Session stages"
          tabs={INITIAL_TABS}
          activeTabId={activeTabId}
          onTabClick={setActiveTabId}
        />
      </div>
    );
  },
};
