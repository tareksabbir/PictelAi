"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { set } from "date-fns";
import {
  ArrowUp,
  HomeIcon,
  ImagePlus,
  Key,
  LayoutDashboard,
  Loader2Icon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // create new project
  const createNewProject = async () => {
    const projectId = crypto.randomUUID();
    const frameId = Math.floor(Math.random() * 10000);
    const messages = [{ role: "user", content: userInput }];

    try {
      setLoading(true);
      const result = axios.post("/api/projects", {
        projectId,
        frameId,
        messages,
      });
      toast.success("New project created successfully");
      // redirect to the project page or playgroud
      router.push(`/playground/${projectId}?frameId=${frameId}`);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to create a new project");
      console.log(error);
      setLoading(false);
    }
  };
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
          {!user ? (
            <SignInButton mode="redirect" forceRedirectUrl={"/workspaces"}>
              <Button size={"icon"} disabled={!userInput}>
                <ArrowUp />
              </Button>
            </SignInButton>
          ) : (
            <Button
              size={"icon"}
              disabled={!userInput || loading}
              onClick={createNewProject}
            >
              {loading ? <Loader2Icon className="animate-spin" /> : <ArrowUp />}
            </Button>
          )}
        </div>
      </div>
      {/* suggestions */}
      <div className="flex flex-wrap items-center justify-center md:flex-nowrap gap-3">
        {suggestion.map((item, i) => (
          <Button
            key={i}
            variant={"outline"}
            onClick={() => setUserInput(item.prompt)}
            className="rounded-full"
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
