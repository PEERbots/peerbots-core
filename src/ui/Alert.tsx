import { useState } from "react";
import { Button, Icon } from ".";

export type AlertLevel = "Error" | "Warning" | "Success" | "Info";

export interface AlertAction {
  name: string;
  callback: () => void;
}

export interface AlertUIProps {
  level: AlertLevel;
  message: React.ReactNode;
  action?: AlertAction;
}

export function Alert({ level, message, action }: AlertUIProps) {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div
      className={
        "pb:flex pb:w-full pb:p-4 pb:m-1 pb:text-sm pb:rounded-lg pb:bg-white pb:border pb:border-solid pb:transition-opacity pb:ease-in-out pb:delay-150 pb:duration-300 " +
        (showAlert ? " " : " pb:hidden")
      }
    >
      <span>
        {level === "Error" && (
          <Icon
            name="exclamationCircle"
            size="lg"
            className="pb:m-2"
            stroke="red"
          />
        )}
        {level === "Warning" && (
          <Icon
            name="exclamationTriangle"
            size="lg"
            className="pb:m-2"
            stroke="yellow"
          />
        )}
        {level === "Success" && (
          <Icon name="checkCircle" size="lg" className="pb:m-2" stroke="green" />
        )}
        {level === "Info" && (
          <Icon name="megaphone" size="lg" className="pb:m-2" />
        )}
      </span>
      <span className="pb:flex pb:flex-1 pb:ml-2">{message}</span>
      {action && (
        <Button
          onClick={() => {
            action.callback();
            setShowAlert(false);
          }}
        >
          {action.name}
        </Button>
      )}
      <span
        className="pb:cursor-pointer"
        onClick={() => {
          setShowAlert(false);
        }}
      >
        <Icon name="xCircle" size="lg" className="pb:m-1" />
      </span>
    </div>
  );
}
