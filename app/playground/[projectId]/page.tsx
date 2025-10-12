"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import { prompt } from "@/lib/aiPromt";

type Messages = {
  role: string;
  content: string;
};

type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatMessages: Messages[];
};

export type { Frame, Messages };

const PlayGround = () => {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");

  const [frameDetail, setFrameDetail] = useState<Frame>();
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Refs for debouncing and buffering
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const codeBufferRef = useRef<string>("");

  // ---------------------- Fetch Frame Details ----------------------
  const GetFrameDetails = useCallback(async () => {
    try {
      const result = await axios.get(`/api/frames?frameId=${frameId}&projectId=${projectId}`);
      const data = result.data;
      setFrameDetail(data);

      // Clean and extract code
      const designCode = data?.designCode || "";
      const formatted = designCode
        .replaceAll("```html", "")
        .replaceAll("```", "")
        .trim();
      setGeneratedCode(formatted);

      // If only one user message exists, trigger AI
      if (data?.chatMessages?.length === 1) {
        const userMsg = data.chatMessages[0].content;
        SendMessage(userMsg);
      } else {
        setMessages(data?.chatMessages ?? []);
      }
    } catch (error) {
      console.error("Error fetching frame details:", error);
      toast.error("Failed to load frame details");
    }
  }, [frameId, projectId]);

  useEffect(() => {
    if (frameId && projectId) {
      GetFrameDetails();
    }
  }, [frameId, projectId, GetFrameDetails]);

  // ---------------------- Save Messages ----------------------
  const saveMessages = useCallback(
    async (messagesToSave: Messages[]) => {
      try {
        await axios.put("/api/chats", { messages: messagesToSave, frameId });
      } catch (error) {
        console.error("Failed to save messages:", error);
      }
    },
    [frameId]
  );

  const saveGeneratedCode = useCallback(
    async (code: string) => {
      try {
        await axios.put("/api/frames", {
          designCode: code,
          frameId,
          projectId,
        });
        toast.success("Website designed successfully!");
      } catch (error) {
        console.error("Failed to save generated code:", error);
      }
    },
    [frameId, projectId]
  );

  // ---------------------- Auto-Save Messages ----------------------
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages, saveMessages]);

  // ---------------------- Debounced Code Update ----------------------
  const updateGeneratedCodeDebounced = useCallback((newCode: string) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Buffer the code
    codeBufferRef.current = newCode;

    // Set new timer - update after 500ms of no new chunks
    debounceTimerRef.current = setTimeout(() => {
      setGeneratedCode(codeBufferRef.current);
    }, 500);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // ---------------------- Extract Code from Response ----------------------
  const extractCode = (text: string): string => {
    const codeMatch = text.match(/```html\n?([\s\S]*?)```/);
    if (codeMatch) {
      return codeMatch[1].trim();
    }
    return text.replaceAll("```html", "").replaceAll("```", "").trim();
  };

  // ---------------------- Handle User Message ----------------------
  const SendMessage = useCallback(
    async (userInput: string, retryCount = 0) => {
      const MAX_RETRIES = 2;
      
      setLoading(true);
      setIsGenerating(true);
      
      const newUserMsg = { role: "user", content: userInput };
      
      // Only add user message if this is the first attempt
      if (retryCount === 0) {
        setMessages((prev) => [...prev, newUserMsg]);
      }

      let fullAiResponse = "";

      try {
        const response = await fetch("/api/ai-model", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              ...messages,
              { role: "user", content: prompt.replace("{userInput}", userInput) },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`AI model response error: ${response.status} - ${errorText}`);
        }

        if (!response.body) {
          throw new Error("Response body is empty");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          fullAiResponse += chunk;

          // Debounced update for preview (only if contains code)
          if (fullAiResponse.includes("```html")) {
            const extractedCode = extractCode(fullAiResponse);
            if (extractedCode) {
              updateGeneratedCodeDebounced(extractedCode);
            }
          }
        }

        // Final update - ensure we have the complete code
        const finalCode = extractCode(fullAiResponse);
        
        if (finalCode && finalCode.length > 50) {
          // Clear any pending debounce and update immediately
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          setGeneratedCode(finalCode);
          
          // Save to DB
          await saveGeneratedCode(fullAiResponse);

          // Add success message to chat
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Your website has been generated successfully! 🎉" },
          ]);
        } else {
          // No code, just text response
          setMessages((prev) => [...prev, { role: "assistant", content: fullAiResponse }]);
        }
      } catch (error) {
        console.error("SendMessage error:", error);
        
        // Retry logic for network errors
        if (retryCount < MAX_RETRIES && error instanceof Error && 
            (error.message.includes("Failed to fetch") || error.message.includes("Network"))) {
          console.log(`Retrying... Attempt ${retryCount + 1}/${MAX_RETRIES}`);
          toast.error(`Connection failed. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return SendMessage(userInput, retryCount + 1);
        }
        
        // More specific error messages
        if (error instanceof Error) {
          if (error.message.includes("Failed to fetch")) {
            toast.error("Network error. Please check your connection.");
          } else if (error.message.includes("AI model response error")) {
            toast.error("AI service is unavailable. Please try again.");
          } else {
            toast.error(error.message || "Failed to generate response");
          }
        } else {
          toast.error("An unexpected error occurred");
        }
        
        // Remove the optimistically added user message on error (only on final failure)
        if (retryCount === 0) {
          setMessages((prev) => prev.slice(0, -1));
        }
      } finally {
        setLoading(false);
        setIsGenerating(false);
        codeBufferRef.current = "";
      }
    },
    [messages, saveGeneratedCode, updateGeneratedCodeDebounced]
  );

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
          loading={loading}
        />
        <WebsiteDesign 
          generatedCode={generatedCode} 
          isGenerating={isGenerating || loading}
        />
      </div>
    </section>
  );
};

export default PlayGround;


// http://localhost:3000/playground/9bb06895-a2e0-4700-aab7-3c825a114d97?frameId=1849