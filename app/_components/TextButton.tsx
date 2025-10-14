"use client";
import { Button } from "@/components/ui/button";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { suggestions } from "@/lib/promtStuggestions";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import {
  ArrowUp,
  ImagePlus,
  Loader2Icon,
  Sparkles,
  Search,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState, useCallback } from "react";
import { toast } from "sonner";

const TextButton = () => {
  const [userInput, setUserInput] = useState<string>("");
  const { user } = useUser();
  const router = useRouter();
  const { has } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);

  const hasUnlimitedAccess = has && has({ plan: "unlimited" });
  const hasCredits = (userDetails?.credits ?? 0) > 0;
  const canCreateProject = hasUnlimitedAccess || hasCredits;

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(suggestions.map((s) => s.category))),
  ];

  // Filter suggestions by category
  const filteredSuggestions =
    selectedCategory === "All"
      ? suggestions
      : suggestions.filter((s) => s.category === selectedCategory);

  // Create new project with improved error handling
  const createNewProject = useCallback(async () => {
    if (!userInput.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!canCreateProject) {
      toast.error("You are out of credits", {
        description: "Please upgrade your plan to continue",
        action: {
          label: "Upgrade",
          onClick: () => router.push("/pricing"),
        },
      });
      return;
    }

    const projectId = crypto.randomUUID();
    const frameId = Math.floor(Math.random() * 10000);
    const messages = [{ role: "user", content: userInput.trim() }];

    try {
      setLoading(true);

      await axios.post("/api/projects", {
        projectId,
        frameId,
        messages,
        credits: userDetails?.credits,
      });

      toast.success("Project created successfully!", {
        description: "Redirecting to your new project...",
      });

      // Update credits optimistically
      if (!hasUnlimitedAccess && userDetails) {
        setUserDetails((prev: any) => ({
          ...prev,
          credits: Math.max((prev?.credits ?? 1) - 1, 0),
        }));
      }

      // Clear input
      setUserInput("");

      // Redirect to the project page
      router.push(`/playground/${projectId}?frameId=${frameId}`);
    } catch (error) {
      console.error("Project creation error:", error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to create project";
        toast.error(message, {
          description: "Please try again or contact support",
        });
      } else {
        toast.error("An unexpected error occurred", {
          description: "Please try again later",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [
    userInput,
    canCreateProject,
    hasUnlimitedAccess,
    userDetails,
    router,
    setUserDetails,
  ]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (user && canCreateProject && !loading) {
        createNewProject();
      }
    }
  };

  // Get complexity badge color
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "bg-gray-100 text-gray-700";
      case "medium":
        return "bg-gray-100 text-gray-700";
      case "complex":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Input box with enhanced styling */}
      <div className="relative w-full border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 hover:border-blue-200 focus-within:border-blue-400 focus-within:shadow-blue-100">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to create in detail. Include specific features, layout preferences, colors, interactions, and any technical requirements..."
          className="w-full h-32 bg-transparent focus:outline-none resize-none text-gray-800 placeholder:text-gray-400 pt-6"
          aria-label="Project description"
          maxLength={2000}
        />

        <div className="flex justify-between items-center gap-3 mt-2">
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100"
              aria-label="Add image"
            >
              <ImagePlus className="w-5 h-5" />
            </Button>

            {/* Character count */}
            <span className="text-xs text-gray-500">
              {userInput.length}/2000
            </span>

            {/* Credits indicator */}
            {user && !hasUnlimitedAccess && (
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {userDetails?.credits ?? 0} credits left
              </span>
            )}

            {user && hasUnlimitedAccess && (
              <span className="text-xs font-medium text-white bg-black px-3 py-1.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Unlimited
              </span>
            )}
          </div>

          {!user ? (
            <SignInButton mode="redirect" forceRedirectUrl="/workspaces">
              <Button
                size="icon"
                disabled={!userInput.trim()}
                className="rounded-xl hover:scale-105 transition-transform"
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </SignInButton>
          ) : (
            <Button
              size="icon"
              disabled={!userInput.trim() || loading || !canCreateProject}
              onClick={createNewProject}
              className="rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
              aria-label="Create project"
            >
              {loading ? (
                <Loader2Icon className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions with improved design */}
      <div className="space-y-5 md:mt-40">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-gray-500" />
            Professional Templates Library
          </h2>
          <p className="text-sm text-gray-600">
            Choose from {suggestions.length}+ detailed, production-ready
            templates
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category ? "shadow-md" : "hover:bg-gray-50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuggestions.map((item, i) => (
            <button
              key={i}
              onClick={() => setUserInput(item.prompt)}
              className="group relative p-5 rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300 text-left bg-white hover:bg-blue-50/30"
              aria-label={`Use ${item.label} template`}
            >
              {/* Icon and Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-gray-500 to-black text-white group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getComplexityColor(
                    item.complexity
                  )}`}
                >
                  {item.complexity}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-gray-800 transition-colors">
                {item.label}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                {item.prompt}
              </p>

              {/* Category Tag */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.category}
                </span>
                <ArrowUp className="w-3 h-3 text-gray-400 group-hover:text-gray-500 group-hover:translate-x-1 transition-all ml-auto" />
              </div>
            </button>
          ))}
        </div>

        {filteredSuggestions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No templates found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextButton;
