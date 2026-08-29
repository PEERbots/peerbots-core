import { useState, useCallback, useRef, useEffect } from "react";

export interface UseClipboardOptions {
  /**
   * Duration in milliseconds for the `copied` state to remain `true`.
   * @default 2000
   */
  timeout?: number;
  /** Callback fired after successfully copying to clipboard. */
  onSuccess?: (text: string) => void;
  /** Callback fired if copying fails. */
  onError?: (error: Error) => void;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000, onSuccess, onError } = options;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for non-secure / legacy contexts
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          const successful = document.execCommand("copy");
          document.body.removeChild(textarea);
          if (!successful) {
            throw new Error("execCommand copy failed");
          }
        }

        setCopied(true);
        setError(null);
        onSuccess?.(text);

        timerRef.current = setTimeout(() => {
          setCopied(false);
        }, timeout);

        return true;
      } catch (err) {
        const copyError = err instanceof Error ? err : new Error(String(err));
        setError(copyError);
        setCopied(false);
        onError?.(copyError);
        return false;
      }
    },
    [timeout, onSuccess, onError],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { copy, copied, error };
}
