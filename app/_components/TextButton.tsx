"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  HomeIcon,
  ImagePlus,
  Key,
  LayoutDashboard,
  UserIcon,
} from "lucide-react";
import { useState } from "react";

const suggestion = [
  {
    label: "Dashboard",
    prompt:
      "Create an analytics dashboard to track customers and revenue data for a SaaS",
    icon: LayoutDashboard,
  },
  {
    label: "SignUp Form",
    prompt:
      "Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox",
    icon: Key,
  },
  {
    label: "Hero",
    prompt:
      "Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a title with a subtle gradient effect, subtitle, CTA, small social proof and an image.",
    icon: HomeIcon,
  },
  {
    label: "User Profile Card",
    prompt:
      "Create a modern user profile card component for a social media website",
    icon: UserIcon,
  },
];
const TextButton = () => {
  const [userInput, setUserInput] = useState<string>("");

  return (
    <>
      {/* inputbox */}
      <div className="w-full max-w-2xl border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Just type in a brief description of what you need, and let AI do the
        rest ...."
          className="w-full h-24 focus:outline-none focus:right-0 resize-none"
        ></textarea>
        <div className="flex justify-between items-center gap-2">
          <Button variant={"ghost"}>
            <ImagePlus />
          </Button>
          <Button size={"icon"}>
            <ArrowUp />
          </Button>
        </div>
      </div>
      {/* suggestions */}
      <div className="flex flex-wrap items-center justify-center md:flex-nowrap gap-3">
        {suggestion.map((item, i) => (
          <Button
            key={i}
            variant={"outline"}
            onClick={() => setUserInput(item.prompt)}
          >
            <item.icon />
            {item.label}
          </Button>
        ))}
      </div>
    </>
  );
};

export default TextButton;
