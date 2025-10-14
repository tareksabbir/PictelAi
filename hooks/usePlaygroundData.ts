// hooks/usePlaygroundData.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { Frame, Messages } from "@/types/type";
import { extractCode } from "@/lib/extractCode";

interface PlaygroundData {
  frameDetail: Frame | undefined;
  loading: boolean;
  messages: Messages[];
  generatedCode: string;
  isGenerating: boolean;
  debounceTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  codeBufferRef: React.MutableRefObject<string>;
  setMessages: React.Dispatch<React.SetStateAction<Messages[]>>;
  setGeneratedCode: React.Dispatch<React.SetStateAction<string>>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  saveGeneratedCode: (code: string) => Promise<void>;
  SendMessage: (userInput: string, retryCount?: number) => Promise<void>;
}

export const usePlaygroundData = (): PlaygroundData => {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");

  const [frameDetail, setFrameDetail] = useState<Frame | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const codeBufferRef = useRef<string>("");

  // ---------------------- Persistence Logic ----------------------

  // Save Messages to DB
  const saveMessages = useCallback(
    async (messagesToSave: Messages[]) => {
      if (!frameId) return;
      try {
        await axios.put("/api/chats", { messages: messagesToSave, frameId });
      } catch (error) {
        console.error("Failed to save messages:", error);
      }
    },
    [frameId]
  );

  // Save Generated Code to DB
  const saveGeneratedCode = useCallback(
    async (fullAiResponse: string) => {
      if (!frameId || !projectId) return;
      try {
        // Extracting just the clean code snippet from the full response for display/save
        const codeSnippet = extractCode(fullAiResponse);

        if (codeSnippet && codeSnippet.length > 50) {
            await axios.put("/api/frames", {
                designCode: fullAiResponse, // Save the full response with markdown syntax
                frameId,
                projectId,
            });
            toast.success("Website designed successfully!");
            return;
        }
        // If no code, we still successfully called the function, but nothing to save here.
      } catch (error) {
        console.error("Failed to save generated code:", error);
        toast.error("Failed to save generated website code.");
      }
    },
    [frameId, projectId]
  );


  // ---------------------- Fetch Frame Details ----------------------

  const GetFrameDetails = useCallback(async () => {
    if (!frameId || !projectId) return;

    setLoading(true);
    try {
      const result = await axios.get(
        `/api/frames?frameId=${frameId}&projectId=${projectId}`
      );
      const data = result.data;
      setFrameDetail(data);

      // Clean and extract code for initial display
      const designCode = data?.designCode || "";
      const formatted = designCode
        .replaceAll("```html", "")
        .replaceAll("```", "")
        .trim();
      setGeneratedCode(formatted);

      // Set chat messages
      const chatMessages: Messages[] = data?.chatMessages ?? [];
      setMessages(chatMessages);

      // If only one user message exists, trigger AI (to handle initial creation)
      if (chatMessages.length === 1 && chatMessages[0].role === "user") {
        const userMsg = chatMessages[0].content;
        // Don't call SendMessage directly here to avoid circular dependency in useEffect
        // The calling component or another hook should handle the initial call
      }
    } catch (error) {
      console.error("Error fetching frame details:", error);
      toast.error("Failed to load frame details");
    } finally {
      setLoading(false);
    }
  }, [frameId, projectId]);

  // Initial Data Fetch Effect
  useEffect(() => {
    if (frameId && projectId) {
      GetFrameDetails();
    }
  }, [frameId, projectId, GetFrameDetails]);

  // Auto-Save Messages Effect
  useEffect(() => {
    // Debounce save for a moment to prevent excessive writes during chat stream
    const saveTimer = setTimeout(() => {
        if (messages.length > 0) {
            saveMessages(messages);
        }
    }, 1000); // 1 second debounce

    return () => clearTimeout(saveTimer);
  }, [messages, saveMessages]);


  // ---------------------- AI Message Sending Logic (Placeholder) ----------------------
  // This logic is too complex for a simple data hook and will be moved to useCodeGeneration.
  // We include a placeholder function to satisfy the return type until the other hook is integrated.
  const SendMessage = useCallback(
    async (userInput: string) => {
      // Logic will be implemented in useCodeGeneration and passed down via context or props
      // For now, it's just a mock to satisfy the interface.
      setLoading(true);
      setIsGenerating(true);
      const newUserMsg = { role: "user", content: userInput };
      setMessages((prev) => [...prev, newUserMsg]);

      // Placeholder for streaming logic
      await new Promise(resolve => setTimeout(resolve, 3000));

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "..." },
      ]);
      setLoading(false);
      setIsGenerating(false);
    },
    []
  );


  return {
    frameDetail,
    loading,
    messages,
    generatedCode,
    isGenerating,
    debounceTimerRef,
    codeBufferRef,
    setMessages,
    setGeneratedCode,
    setIsGenerating,
    saveGeneratedCode,
    SendMessage, // Will be overridden by useCodeGeneration
  };
};