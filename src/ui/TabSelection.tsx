import { Button, Icon } from ".";
import React from "react";

export interface TabItem {
  id: string;
  label: string;
  onClose?: () => void;
  onEdit?: () => void;
}

export interface TabSelectionProps {
  tabs: TabItem[];
  activeTabId: string | null;
  onTabClick: (id: string) => void;
  onAddClick?: () => void;
  className?: string;
}

export function TabSelection({
  tabs,
  activeTabId,
  onTabClick,
  onAddClick,
  className = "",
}: TabSelectionProps) {
  return (
    <div
      className={`pb:overflow-x-auto pb:max-h-20 pb:text-sm pb:whitespace-nowrap ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            className={
              "pb:inline-block pb:align-middle pb:m-1 pb:px-2 pb:py-2 pb:cursor-pointer pb:rounded-sm " +
              (isActive
                ? "pb:font-bold pb:bg-primary/30"
                : "pb:font-gray-300 pb:bg-gray-200")
            }
            onClick={() => onTabClick(tab.id)}
          >
            <span className="pb:inline-block pb:align-middle">{tab.label}</span>

            {isActive && (tab.onEdit || tab.onClose) && (
              <span className="pb:inline-flex pb:items-center pb:ml-2 pb:align-middle">
                {tab.onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Edit Tab"
                    onClick={(e) => {
                      e.stopPropagation();
                      tab.onEdit!();
                    }}
                    leftIcon={<Icon name="edit" size="sm" />}
                  />
                )}
                {tab.onEdit && tab.onClose && (
                  <span className="pb:opacity-10 pb:align-middle pb:mx-1">{" | "}</span>
                )}
                {tab.onClose && (
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Close Tab"
                    onClick={(e) => {
                      e.stopPropagation();
                      tab.onClose!();
                    }}
                    leftIcon={<Icon name="close" size="sm" />}
                  />
                )}
              </span>
            )}
          </div>
        );
      })}
      {onAddClick && (
        <Button
          variant="primary"
          size="sm"
          aria-label="Create New Tab"
          onClick={onAddClick}
          leftIcon={<Icon name="plus" size="sm" />}
          className="pb:m-1 pb:align-middle pb:inline-flex"
        />
      )}
    </div>
  );
}
