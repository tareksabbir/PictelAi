"use client";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

const ChatFooter = ({ onSend }: any) => {
  const [input, setInput] = useState<string>("");
  const handleSend = () => {
    if (!input?.trim()) return;
    onSend(input);
    setInput("");
  };
  return (
    <div className="p-3 border-t flex items-center gap-2">
      <textarea
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your project idea here..."
        className="flex-1 resize-none border rounded-xl px-3 py-2 focus:outline-none focus:ring-2"
      ></textarea>
      <Button onClick={handleSend}>
        <ArrowUp />
      </Button>
    </div>
  );
};

export default ChatFooter;
