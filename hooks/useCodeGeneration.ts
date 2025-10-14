// hooks/useCodeGeneration.ts
import { useCallback } from "react";
import { toast } from "sonner";
import { Messages } from "@/types/type";
import { prompt } from "@/lib/aiPromt";
import { extractCode } from "@/lib/extractCode";

interface CodeGenerationProps {
  messages: Messages[];
  setMessages: React.Dispatch<React.SetStateAction<Messages[]>>;
  setGeneratedCode: React.Dispatch<React.SetStateAction<string>>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  saveGeneratedCode: (code: string) => Promise<void>;
  debounceTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  codeBufferRef: React.MutableRefObject<string>;
}

export const useCodeGeneration = ({
  messages,
  setMessages,
  setGeneratedCode,
  setIsGenerating,
  saveGeneratedCode,
  debounceTimerRef,
  codeBufferRef,
}: CodeGenerationProps) => {
  // ---------------------- Debounced Code Update ----------------------
  const updateGeneratedCodeDebounced = useCallback(
    (newCode: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Buffer the code
      codeBufferRef.current = newCode;

      // Set new timer - update after 500ms of no new chunks
      debounceTimerRef.current = setTimeout(() => {
        setGeneratedCode(codeBufferRef.current);
      }, 500);
    },
    [debounceTimerRef, codeBufferRef, setGeneratedCode]
  );

  // ---------------------- Handle User Message and AI Stream ----------------------
  const SendMessage = useCallback(
    async (userInput: string, retryCount = 0) => {
      const MAX_RETRIES = 2;

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
              ...messages, // Pass current history
              {
                role: "user",
                // Inject the AI prompt system message along with the user's input
                content: prompt.replace("{userInput}", userInput),
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `AI model response error: ${response.status} - ${errorText}`
          );
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

          // Debounced update for preview (only if the stream starts generating code)
          if (fullAiResponse.includes("```html")) {
            const extractedCode = extractCode(fullAiResponse);
            if (extractedCode) {
              updateGeneratedCodeDebounced(extractedCode);
            }
          }
        }

        // Final update - ensure we have the complete, clean code
        const finalCode = extractCode(fullAiResponse);

        if (finalCode && finalCode.length > 50) {
          // Clear any pending debounce and update immediately with the final clean code
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          setGeneratedCode(finalCode);

          // Save the full response (which includes the markdown structure) to DB
          await saveGeneratedCode(fullAiResponse);

          // Add success message to chat history
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Your website has been generated successfully! 🎉",
            },
          ]);
        } else {
          // No code, just text response
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: fullAiResponse },
          ]);
        }
      } catch (error) {
        console.error("SendMessage error:", error);

        // --- Retry Logic ---
        if (
          retryCount < MAX_RETRIES &&
          error instanceof Error &&
          (error.message.includes("Failed to fetch") ||
            error.message.includes("Network"))
        ) {
          console.log(`Retrying... Attempt ${retryCount + 1}/${MAX_RETRIES}`);
          toast.error(
            `Connection failed. Retrying... (${retryCount + 1}/${MAX_RETRIES})`
          );

          // Wait before retrying
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (retryCount + 1))
          );
          return SendMessage(userInput, retryCount + 1);
        }

        // --- Final Error Handling ---
        const errorMsg =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        if (errorMsg.includes("Failed to fetch")) {
          toast.error("Network error. Please check your connection.");
        } else if (errorMsg.includes("AI model response error")) {
          toast.error("AI service is unavailable. Please try again.");
        } else {
          toast.error(errorMsg || "Failed to generate response");
        }

        // Remove the optimistically added user message on final failure
        if (retryCount === 0) {
          setMessages((prev) => prev.slice(0, -1));
        }
      } finally {
        setIsGenerating(false);
        codeBufferRef.current = ""; // Clear buffer
      }
    },
    [
      messages,
      saveGeneratedCode,
      setMessages,
      setIsGenerating,
      setGeneratedCode,
      updateGeneratedCodeDebounced,
      debounceTimerRef,
      codeBufferRef,
    ]
  );

  return { SendMessage };
};
