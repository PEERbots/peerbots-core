import { ReactNode } from "react";
import { Heading, Button, Icon } from "./";

export interface BasePanelProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  headerClassName?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  setPanel: (panel: string) => void;
}

export function BasePanel({
  title,
  children,
  onClose,
  className = "",
  headerClassName = "",
  headingLevel = 2,
  setPanel = (panel: string) => { }
}: BasePanelProps) {

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setPanel("None");
    }
  };

  return (
    <div className={`pb:space-y-1 pb:p-1 ${className}`}>
      <div
        className={`pb:flex pb:items-center pb:justify-between pb:px-1 pb:mb-1 pb:border pb:border-solid pb:border-gray-400 pb:pb-1 ${headerClassName}`}
      >
        <Heading level={headingLevel} className="pb:text-lg">
          {title}
        </Heading>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="pb:p-1 pb:rounded pb:hover:bg-gray-100 pb:h-auto"
          aria-label={`Close ${title} Panel`}
        >
          <Icon size="md" className="pb:h-5 pb:w-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </Icon>
        </Button>
      </div>
      {children}
    </div>
  );
}
