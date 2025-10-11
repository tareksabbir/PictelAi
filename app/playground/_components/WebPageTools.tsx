"use client";
import { Button } from "@/components/ui/button";

import {
  Code,
  Download,
  Monitor,
  Smartphone,
  SquareArrowOutUpRight,
} from "lucide-react";
import ViewCodeBlock from "./ViewCodeBlock";
import { useEffect, useState } from "react";
import { htmlContentFunction } from "@/lib/htmlContent";

const WebPageTools = ({
  selectedScreenSize,
  setSelectedScreenSize,
  code,
}: any) => {
  const [cleanedCode, setCleanedCode] = useState<string>("");

  useEffect(() => {
    const cleaned = code.replace(/```(html)?/g, "").trim();
    setCleanedCode(cleaned);
  }, [code]);

  const viewOnNewTab = () => {
    if (!cleanedCode) return;
    // Clean the code
    const htmlContent = htmlContentFunction(cleanedCode);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

const downloadCode = () => {
  const htmlContent = htmlContentFunction(cleanedCode); // Add this line
  const blob = new Blob([htmlContent], { type: "text/html" }); // Use htmlContent instead of cleanedCode
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "code.html";
  a.click();
  URL.revokeObjectURL(url);
};

  return (
    <section className="p-2 shadow rounded-xl h-[5vh] flex items-center justify-between mt-2 border w-full">
      <div className="flex ">
        <Button
          variant={"ghost"}
          onClick={() => setSelectedScreenSize("web")}
          className={`${
            selectedScreenSize === "web" ? " border border-promary" : ""
          }`}
        >
          <Monitor />
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => setSelectedScreenSize("mobile")}
          className={`${
            selectedScreenSize === "mobile" ? " border border-promary" : ""
          }`}
        >
          <Smartphone />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant={"outline"} onClick={viewOnNewTab}>
          {" "}
          View <SquareArrowOutUpRight />
        </Button>
        <ViewCodeBlock code={cleanedCode}>
          <Button>
            Code <Code />
          </Button>
        </ViewCodeBlock>

        <Button onClick={downloadCode}>
          Download <Download />
        </Button>
      </div>
    </section>
  );
};

export default WebPageTools;
