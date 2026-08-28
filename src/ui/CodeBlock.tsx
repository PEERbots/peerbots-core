import React, { useState } from "react";
import { cn } from "./utils";
import { Icon } from "./Icon";

export interface CodeBlockProps {
  code: string;
  language?: string;
  fileName?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code = "",
  language = "bash",
  fileName,
  showLineNumbers = false,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code to clipboard", err);
    }
  };

  const codeLines = code.trim().split("\n");

  return (
    <div
      className={cn(
        "pb:rounded-2xl pb:overflow-hidden pb:shadow-xl pb:border pb:border-gray-800 pb:bg-[#1e222b] pb:text-gray-100 pb:font-mono pb:text-sm",
        className,
      )}
    >
      {/* Header Bar */}
      <div className="pb:flex pb:items-center pb:justify-between pb:px-4 pb:py-3 pb:bg-[#161920] pb:border-b pb:border-gray-800/80">
        <div className="pb:flex pb:items-center pb:gap-2">
          <span className="pb:w-3 pb:h-3 pb:rounded-full pb:bg-red-500/80 pb:inline-block" />
          <span className="pb:w-3 pb:h-3 pb:rounded-full pb:bg-yellow-500/80 pb:inline-block" />
          <span className="pb:w-3 pb:h-3 pb:rounded-full pb:bg-green-500/80 pb:inline-block" />
          {fileName && (
            <span className="pb:ml-2 pb:text-xs pb:text-gray-400 pb:font-sans pb:font-medium">
              {fileName}
            </span>
          )}
        </div>

        <div className="pb:flex pb:items-center pb:gap-3">
          {language && (
            <span className="pb:text-xs pb:uppercase pb:font-bold pb:text-gray-400 pb:bg-gray-800/80 pb:px-2.5 pb:py-0.5 pb:rounded-md">
              {language}
            </span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="pb:flex pb:items-center pb:gap-1.5 pb:px-3 pb:py-1 pb:text-xs pb:font-semibold pb:text-gray-300 pb:hover:text-white pb:bg-gray-800 pb:hover:bg-gray-700 pb:rounded-lg pb:transition-colors pb:cursor-pointer"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Icon name="check" className="pb:w-3.5 pb:h-3.5 pb:text-peerbots-teal" />
                <span className="pb:text-peerbots-teal">Copied!</span>
              </>
            ) : (
              <>
                <Icon name="clipboard" className="pb:w-3.5 pb:h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Block Body */}
      <div className="pb:p-5 pb:overflow-x-auto pb:text-sm sm:pb:text-base pb:leading-relaxed pb:bg-[#1e222b]">
        <pre className="pb:font-mono">
          <code>
            {showLineNumbers ? (
              codeLines.map((line, idx) => (
                <div key={idx} className="pb:table-row">
                  <span className="pb:table-cell pb:pr-4 pb:text-right pb:select-none pb:text-gray-500 pb:text-xs">
                    {idx + 1}
                  </span>
                  <span className="pb:table-cell">{line}</span>
                </div>
              ))
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};
