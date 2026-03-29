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
      className={`overflow-x-auto max-h-20 text-sm whitespace-nowrap ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            className={
              "inline-block align-middle m-1 px-2 py-2 cursor-pointer rounded-sm " +
              (isActive
                ? "font-bold bg-primary/30"
                : "font-gray-300 bg-gray-200")
            }
            onClick={() => onTabClick(tab.id)}
          >
            <span className="inline-block align-middle">{tab.label}</span>

            {isActive && (tab.onEdit || tab.onClose) && (
              <span className="inline-flex items-center ml-2 align-middle">
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
                  <span className="opacity-10 align-middle mx-1">{" | "}</span>
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
          className="m-1 align-middle inline-flex"
        />
      )}
    </div>
  );
}
