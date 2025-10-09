"use client";
import React, { useState } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import ElementSettingSection from "../_components/ElementSettingSection";
import { useEffect } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { set } from "date-fns";

type Messages = {
  role: string;
  content: string;
};

type Frame = {
  projectId: string;
  frameId: string;
  chatMessages: Messages[];
};

export type { Frame, Messages };

const PlayGround = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const projectId = params.projectId;
  const frameId = searchParams.get("frameId");

  const [frameDetails, setFrameDetails] = useState<Frame | null>(null);

  useEffect(() => {
    if (frameId) GetFrameDetails();
  }, [frameId]);

  const GetFrameDetails = async () => {
    try {
      const result = await axios.get(
        `/api/frames?frameId=${frameId}&projectId=${projectId}`
      );
      setFrameDetails(result.data);
    } catch (error) {
      console.error("Error fetching frame details:", error);
    }
  };
  return (
    <section>
      <PlaygroundHeader />
      <div className="flex ">
        <ChatSection messages={frameDetails?.chatMessages ?? []} />
        <WebsiteDesign />
        {/* <ElementSettingSection /> */}
      </div>
    </section>
  );
};

export default PlayGround;
