"use client";

import { useEffect, useCallback } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import { usePlaygroundData } from "@/hooks/usePlaygroundData";
import { useCodeGeneration } from "@/hooks/useCodeGeneration";

const PlayGround = () => {
  const {
    frameDetail,
    loading,
    messages,
    generatedCode,
    isGenerating: isDataGenerating,
    setMessages,
    setGeneratedCode,
    setIsGenerating: setIsDataGenerating,
    saveGeneratedCode,
    debounceTimerRef,
    codeBufferRef,
  } = usePlaygroundData();

  const { SendMessage } = useCodeGeneration({
    messages,
    setMessages,
    setGeneratedCode,
    setIsGenerating: setIsDataGenerating,
    saveGeneratedCode,
    debounceTimerRef,
    codeBufferRef,
  });

  const isGenerating = isDataGenerating || loading;

  useEffect(() => {
    if (
      frameDetail?.chatMessages?.length === 1 &&
      frameDetail.chatMessages[0].role === "user"
    ) {
      const userMsg = frameDetail.chatMessages[0].content;
      SendMessage(userMsg);
    }
  }, [frameDetail]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debounceTimerRef]);

  const handleSend = useCallback(
    (input: string) => {
      SendMessage(input);
    },
    [SendMessage]
  );

  return (
    <section>
      <PlaygroundHeader />
      <div className="flex">
        <ChatSection
          messages={messages}
          onSend={handleSend}
          loading={isGenerating}
        />
        <WebsiteDesign
          generatedCode={generatedCode}
          isGenerating={isGenerating}
        />
      </div>
    </section>
  );
};

export default PlayGround;
