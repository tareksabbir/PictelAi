"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
// import ElementSettingSection from "../_components/ElementSettingSection";
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

  // ---------------------- Fetch Frame Details ----------------------
  useEffect(() => {
    if (frameId && projectId) {
      GetFrameDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameId, projectId]);

  const GetFrameDetails = async () => {
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
  };

  // ---------------------- Handle User Message ----------------------
  const SendMessage = async (userInput: string) => {
    setLoading(true);
    const newUserMsg = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newUserMsg]);

    try {
      const response = await fetch("/api/ai-model", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: "user", content: prompt.replace("{userInput}", userInput) },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("AI model response error");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let aiResponse = "";
      let isCode = false;

      while (true) {
        const { value, done } = await reader?.read()!;
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;

        // Stream code updates to iframe in real-time
        if (!isCode && aiResponse.includes("```html")) {
          isCode = true;
          const index = aiResponse.indexOf("```html") + 7;
          const initialCodeChunk = aiResponse.slice(index);
          setGeneratedCode((prev) => prev + initialCodeChunk);
        } else if (isCode) {
          setGeneratedCode((prev) => prev + chunk);
        }
      }

      // Save generated code to DB
      await saveGeneratedCode(aiResponse);

      // Update chat messages
      if (!isCode) {
        setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Your code is ready below!" },
        ]);
      }
    } catch (error) {
      console.error("SendMessage error:", error);
      toast.error("Failed to generate response");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- Auto-Save Messages ----------------------
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const saveMessages = async () => {
    try {
      await axios.put("/api/chats", { messages, frameId });
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  };

  const saveGeneratedCode = async (code: string) => {
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
  };

  return (
    <section>
      <PlaygroundHeader />
      <div className="flex">
        <ChatSection
          messages={messages}
          onSend={(input: string) => SendMessage(input)}
          loading={loading}
        />
        <WebsiteDesign generatedCode={generatedCode} />
        {/* <ElementSettingSection /> */}
      </div>
    </section>
  );
};

export default PlayGround;