import React, { memo } from "react";

import ChatFooter from "./ChatFooter";
import { Messages } from "@/types/type";

type Props = {
  messages: Messages[];
  onSend: (message: string) => void;
  loading: boolean;
};

const ChatSection = ({ messages, onSend, loading }: Props) => {
  return (
    <section className="w-96 h-[calc(100vh-85px)] flex flex-col shadow-md overflow-hidden bg-white mt-3">
      {/* Messages Section */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center">No messages yet</p>
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))
        )}

        {loading && <LoadingIndicator />}
      </div>

      {/* Footer Section */}
      <ChatFooter onSend={onSend} />
    </section>
  );
};

// Memoized message bubble to prevent re-renders
const MessageBubble = memo(({ message }: { message: Messages }) => (
  <div
    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`p-3 max-w-[75%] rounded-xl break-words ${
        message.role === "user"
          ? "bg-black text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
    </div>
  </div>
));

MessageBubble.displayName = "MessageBubble";

// Memoized loading indicator
const LoadingIndicator = memo(() => (
  <div className="flex items-center justify-center mt-2">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
    <span className="ml-2 text-gray-900 text-sm">Thinking...</span>
  </div>
));

LoadingIndicator.displayName = "LoadingIndicator";

export default memo(ChatSection);