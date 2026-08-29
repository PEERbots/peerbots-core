import React, { useState } from "react";
import { cn } from "../utils";
import { Icon } from "./Icon";

export interface CodeBlockProps {
  /** The code string to display */
  code: string;
  /** Programming language for syntax/badge (e.g. bash, tsx, json) */
  language?: string;
  /** Optional file name displayed in the window header */
  fileName?: string;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Style variant: 'default' (clean block) or 'window' (macOS window with colored dots) */
  variant?: "default" | "window" | "flat";
  /** Whether to show the copy button */
  showCopyButton?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code = "",
  language,
  fileName,
  showLineNumbers = false,
  variant = "default",
  showCopyButton = true,
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
  const isWindow = variant === "window";

  return (
    <div
      className={cn(
        "pb:relative pb:group pb:rounded-xl pb:overflow-hidden pb:font-mono pb:text-sm pb:transition-all",
        isWindow
          ? "pb:shadow-xl pb:border pb:border-gray-800 pb:bg-[#1e222b] pb:text-gray-100"
          : variant === "flat"
            ? "pb:bg-[#1e222b]/90 pb:text-gray-100"
            : "pb:border pb:border-gray-800 pb:bg-[#1e222b] pb:text-gray-100 pb:shadow-md",
        className,
      )}
    >
      {/* Window Header Bar (Only in window variant) */}
      {isWindow ? (
        <div className="pb:flex pb:items-center pb:justify-between pb:px-4 pb:py-3 pb:bg-[#161920] pb:border-b pb:border-gray-800/80">
          <div className="pb:flex pb:items-center pb:gap-2">
            <span className="pb:w-3 pb:h-3 pb:rounded-full pb:bg-red-500/80 pb:inline-block" />
            <span className="pb:w-3 pb:h-3 pb:rounded-full pb:bg-yellow-500/80 pb:inline-block" />
            <span className="pb:w-3 pb:h-3 pb:rounded-full pb:bg-green-500/80 pb:inline-block" />
            {fileName && (
              <span className="pb:ml-2 pb:text-xs pb:text-gray-300 pb:font-sans pb:font-medium">
                {fileName}
              </span>
            )}
          </div>

          <div className="pb:flex pb:items-center pb:gap-3">
            {language && (
              <span className="pb:text-xs pb:uppercase pb:font-bold pb:text-gray-200 pb:bg-gray-800/80 pb:px-2.5 pb:py-0.5 pb:rounded-md">
                {language}
              </span>
            )}
            {showCopyButton && (
              <button
                type="button"
                onClick={handleCopy}
                className="pb:flex pb:items-center pb:gap-1.5 pb:px-3 pb:py-1 pb:text-xs pb:font-semibold pb:text-gray-200 pb:hover:text-white pb:bg-gray-800 pb:hover:bg-gray-700 pb:rounded-lg pb:transition-colors pb:cursor-pointer"
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
            )}
          </div>
        </div>
      ) : (
        /* Floating Copy & Language badge for default / simple variant */
        (showCopyButton || language) && (
          <div className="pb:absolute pb:top-3 pb:right-3 pb:flex pb:items-center pb:gap-2 pb:z-10">
            {language && (
              <span className="pb:text-[11px] pb:uppercase pb:font-bold pb:text-gray-200 pb:bg-gray-800/80 pb:px-2 pb:py-0.5 pb:rounded-md pb:select-none">
                {language}
              </span>
            )}
            {showCopyButton && (
              <button
                type="button"
                onClick={handleCopy}
                className="pb:p-1.5 pb:rounded-md pb:bg-gray-800/70 pb:hover:bg-gray-700 pb:text-gray-300 pb:hover:text-white pb:transition-all pb:duration-150 pb:cursor-pointer pb:border pb:border-gray-700/50"
                aria-label="Copy code to clipboard"
                title={copied ? "Copied!" : "Copy code"}
              >
                {copied ? (
                  <Icon name="check" className="pb:w-4 pb:h-4 pb:text-peerbots-teal" />
                ) : (
                  <Icon name="clipboard" className="pb:w-4 pb:h-4" />
                )}
              </button>
            )}
          </div>
        )
      )}

      {/* Code Block Body */}
      <div className="pb:p-4 sm:pb:p-5 pb:overflow-x-auto pb:text-sm sm:pb:text-base pb:leading-relaxed">
        <pre className="pb:font-mono pb:m-0">
          <code>
            {showLineNumbers ? (
              codeLines.map((line, idx) => (
                <div key={idx} className="pb:table-row">
                  <span className="pb:table-cell pb:pr-4 pb:text-right pb:select-none pb:text-gray-400 pb:text-xs">
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
