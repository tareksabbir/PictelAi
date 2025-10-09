"use client";

import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import ElementSettingSection from "../_components/ElementSettingSection";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
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
  const [generatedCode, setGeneratedCode] = useState<any>("");

  useEffect(() => {
    if (frameId) {
      GetFrameDetails();
    }
  }, [frameId, projectId]);

  const GetFrameDetails = async () => {
    try {
      const result = await axios.get(
        `/api/frames?frameId=${frameId}&projectId=${projectId}`
      );
      setFrameDetail(result.data);
      if (result.data?.chatMessages?.length === 1) {
        const userMsg = result.data?.chatMessages[0].content;
        SendMessage(userMsg);
      }
    } catch (error) {
      console.error("Error fetching frame details:", error);
    }
  };

  const SendMessage = async (userInput: string) => {
    setLoading(true);
    //add user input to messages
    setMessages([...messages, { role: "user", content: userInput }]);

    const result = await fetch("/api/ai-model", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          ...messages,
          { role: "user", content: prompt.replace("{userInput}", userInput) },
        ],
      }),
    });

    const reader = result.body?.getReader();
    const decoder = new TextDecoder();

    let aiResponse = "";
    let isCode = false;
    while (true) {
      // @ts-ignore
      const { value, done } = await reader?.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });

      aiResponse += chunk;

      // check if the chunk contains code

      if (!isCode && aiResponse.includes("```html")) {
        isCode = true;
        const index = aiResponse.indexOf("```html") + 7;
        const initialCodeChunk = aiResponse.slice(index);
        setGeneratedCode((prev: any) => prev + initialCodeChunk);
      } else if (isCode) {
        setGeneratedCode((prev: any) => prev + chunk);
      }
    }
    // after stream ends
    if (!isCode) {
      setMessages((prev: any) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } else {
      setMessages((prev: any) => [
        ...prev,
        { role: "assistant", content: "Your code is here!" },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(generatedCode);
  }, [generatedCode]);
  return (
    <section>
      <PlaygroundHeader />
      <div className="flex ">
        <ChatSection
          messages={messages ?? []}
          onSend={(input: string) => SendMessage(input)}
          loading={loading}
        />
        <WebsiteDesign />
        {/* <ElementSettingSection /> */}
      </div>
    </section>
  );
};

export default PlayGround;
