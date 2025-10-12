"use client";
import { useState, useRef, useEffect, memo, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface ChatFooterProps {
  onSend: (message: string) => void;
}

const ChatFooter = ({ onSend }: ChatFooterProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  }, [input, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSend();
    },
    [handleSend]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  return (
    <div className="border-t bg-white p-3 mt-5">
      <form onSubmit={handleSubmit} className="relative flex items-end">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe your project idea here..."
          className={clsx(
            "flex-1 resize-none rounded-2xl border border-gray-200",
            "px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "max-h-32 bg-gray-50 transition-all duration-150"
          )}
          rows={5}
        />

        {/* Send Button Inside */}
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim()}
          className={clsx(
            "absolute bottom-2 right-2 rounded-full h-8 w-8 flex items-center justify-center",
            "transition-all duration-150",
            input.trim()
              ? "opacity-100 bg-primary text-white hover:opacity-90"
              : "opacity-50 cursor-not-allowed"
          )}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default memo(ChatFooter);