"use client";
import { Button } from "@/components/ui/button";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import {
  ArrowUp,
  HomeIcon,
  ImagePlus,
  Key,
  LayoutDashboard,
  Loader2Icon,
  UserIcon,
  Sparkles,
  ShoppingCart,
  Mail,
  Calendar,
  FileText,
  BarChart3,
  MessageSquare,
  CreditCard,
  Settings,
  Smartphone,
  Globe,
  Users,
  Heart,
  Search,
  Bell,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState, useCallback } from "react";
import { toast } from "sonner";

interface Suggestion {
  label: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  complexity: "simple" | "medium" | "complex";
}

const suggestions: Suggestion[] = [
  // Dashboard & Analytics
  {
    label: "Analytics Dashboard",
    prompt: "Create a comprehensive analytics dashboard with interactive charts showing revenue trends, user growth metrics, conversion rates, and top performing products. Include date range selector, export functionality, KPI cards with percentage changes, and a sidebar navigation. Use modern design with gradients and glassmorphism effects.",
    icon: LayoutDashboard,
    category: "Analytics",
    complexity: "complex",
  },
  {
    label: "Sales Dashboard",
    prompt: "Build a sales performance dashboard featuring real-time sales data, monthly targets vs actual performance, top sales representatives leaderboard, regional sales map, and recent transactions table. Include filters for date ranges and product categories. Use charts from recharts library with smooth animations.",
    icon: TrendingUp,
    category: "Analytics",
    complexity: "complex",
  },
  {
    label: "Metrics Overview",
    prompt: "Design a clean metrics overview page with 4-6 KPI cards displaying key business metrics (total users, revenue, growth rate, churn rate). Each card should show the current value, percentage change from last period, and a mini sparkline chart. Add comparison toggles for day/week/month/year views.",
    icon: BarChart3,
    category: "Analytics",
    complexity: "medium",
  },

  // Authentication & Forms
  {
    label: "Modern SignUp",
    prompt: "Create an elegant sign up form with email and password fields, password strength indicator, Google and Github OAuth buttons, terms of service checkbox, and a link to sign in. Add form validation with error messages, loading states, and smooth animations. Use a split-screen layout with a gradient background on one side and form on the other.",
    icon: Key,
    category: "Authentication",
    complexity: "medium",
  },
  {
    label: "Login Page",
    prompt: "Design a modern login page with email/password fields, 'Remember me' checkbox, forgot password link, and social login options (Google, Github, Apple). Include form validation, animated error messages, and a 'Don't have an account?' link. Add a beautiful illustration or gradient background.",
    icon: UserIcon,
    category: "Authentication",
    complexity: "medium",
  },
  {
    label: "Multi-Step Form",
    prompt: "Build a multi-step registration form with progress indicator showing 4 steps: Personal Info, Business Details, Payment Method, and Confirmation. Each step should have smooth transitions, form validation, ability to go back/forward, and a summary review before final submission. Include animated checkmarks for completed steps.",
    icon: FileText,
    category: "Forms",
    complexity: "complex",
  },

  // Landing Pages & Marketing
  {
    label: "SaaS Hero Section",
    prompt: "Create a stunning hero section for a productivity SaaS with a 'New Feature' announcement badge, bold headline with gradient text effect, compelling subtitle, two CTA buttons (primary and secondary), social proof showing customer logos or user count, and a mockup image or animated demo. Add subtle parallax effects and floating elements.",
    icon: HomeIcon,
    category: "Landing",
    complexity: "medium",
  },
  {
    label: "Pricing Page",
    prompt: "Design a modern pricing page with 3 tier options (Starter, Professional, Enterprise). Each card should display monthly/yearly toggle, price with savings badge, feature list with checkmarks, highlighted 'most popular' tier, CTA button, and 'Contact sales' for enterprise. Add comparison table below showing all features across tiers.",
    icon: CreditCard,
    category: "Landing",
    complexity: "complex",
  },
  {
    label: "Features Section",
    prompt: "Build a comprehensive features showcase section with 6-8 feature cards in a grid layout. Each card should have an icon, title, description, and 'Learn more' link. Add hover effects with subtle elevation changes. Include a main heading with subtitle and an alternating layout showing feature details with accompanying illustrations.",
    icon: Zap,
    category: "Landing",
    complexity: "medium",
  },
  {
    label: "Testimonials Grid",
    prompt: "Create an engaging testimonials section displaying customer reviews in a masonry grid layout. Each testimonial card should include customer photo, name, job title/company, star rating, review text, and company logo. Add a carousel for mobile view and subtle animations on scroll. Include a 'Trusted by 10,000+ companies' heading with logo cloud.",
    icon: MessageSquare,
    category: "Landing",
    complexity: "medium",
  },

  // E-commerce
  {
    label: "Product Card",
    prompt: "Design a modern e-commerce product card with high-quality product image, quick view button on hover, 'Add to cart' button, wishlist heart icon, product name, price with discount badge if applicable, star rating with review count, color/size variant selector, and 'Out of stock' overlay when unavailable. Include smooth hover animations.",
    icon: ShoppingCart,
    category: "E-commerce",
    complexity: "medium",
  },
  {
    label: "Shopping Cart",
    prompt: "Build a complete shopping cart page with product list showing thumbnails, names, quantities (with +/- buttons), prices, remove option, order summary sidebar with subtotal, shipping, tax, discount code input, and total. Add 'Continue shopping' and 'Proceed to checkout' buttons. Include empty cart state with illustration.",
    icon: ShoppingCart,
    category: "E-commerce",
    complexity: "complex",
  },
  {
    label: "Checkout Flow",
    prompt: "Create a streamlined checkout page with shipping address form, payment method selection (credit card, PayPal, Apple Pay), order summary sidebar, coupon code field, shipping options with delivery dates, and secure checkout badge. Add form validation, auto-fill suggestions, and progress steps showing shipping → payment → review.",
    icon: CreditCard,
    category: "E-commerce",
    complexity: "complex",
  },

  // Social & Communication
  {
    label: "User Profile Card",
    prompt: "Design a detailed user profile card with cover photo, circular profile picture, name, username, bio, location, website link, join date, follower/following counts with hover tooltips, 'Follow' button with loading state, tabs for posts/media/likes, and recent activity feed. Add verification badge for verified accounts.",
    icon: UserIcon,
    category: "Social",
    complexity: "medium",
  },
  {
    label: "Chat Interface",
    prompt: "Build a real-time chat interface with sidebar showing conversation list (with unread badges), main chat area displaying message bubbles, user typing indicators, timestamp on messages, emoji picker, file attachment button, and message input with send button. Include online status indicators and message read receipts.",
    icon: MessageSquare,
    category: "Social",
    complexity: "complex",
  },
  {
    label: "Social Feed",
    prompt: "Create a social media feed with post cards showing user avatar, name, timestamp, post content (text/images), like/comment/share buttons with counts, expandable comments section, and infinite scroll loading. Add post composer at top with text input, image upload, and emoji picker. Include skeleton loaders.",
    icon: Users,
    category: "Social",
    complexity: "complex",
  },

  // Productivity & Tools
  {
    label: "Email Template",
    prompt: "Design a responsive email newsletter template with header logo, hero image, compelling headline, body content sections with images and text, call-to-action buttons, social media links, and footer with unsubscribe link. Use a clean, professional layout optimized for all email clients with inline CSS.",
    icon: Mail,
    category: "Productivity",
    complexity: "medium",
  },
  {
    label: "Calendar View",
    prompt: "Build an interactive calendar component with month view showing dates in grid layout, current date highlighting, event dots on dates with events, sidebar showing event list for selected date, month/year navigation arrows, 'Today' quick button, and modal popup for creating new events with title, date, time, and description fields.",
    icon: Calendar,
    category: "Productivity",
    complexity: "complex",
  },
  {
    label: "Task Manager",
    prompt: "Create a kanban-style task management board with draggable cards across 'To Do', 'In Progress', and 'Done' columns. Each task card should show title, description, assignee avatar, due date, priority badge, and tag labels. Include 'Add task' button, search/filter functionality, and task detail modal with comments section.",
    icon: FileText,
    category: "Productivity",
    complexity: "complex",
  },
  {
    label: "Search Interface",
    prompt: "Design a powerful search interface with autocomplete dropdown showing recent searches and suggestions, category filters (All, Images, Videos, News), advanced search options panel, search results with titles, snippets, URLs, and thumbnails, pagination, and 'Did you mean?' spell correction. Add keyboard navigation support.",
    icon: Search,
    category: "Productivity",
    complexity: "complex",
  },

  // Settings & Admin
  {
    label: "Settings Page",
    prompt: "Build a comprehensive settings page with tabbed navigation (Account, Security, Notifications, Billing, Team). Include sections for profile photo upload, name/email editing, password change, two-factor authentication toggle, notification preferences with checkboxes, plan upgrade cards, and team member management table with invite functionality.",
    icon: Settings,
    category: "Admin",
    complexity: "complex",
  },
  {
    label: "Notification Center",
    prompt: "Create a notification dropdown panel with tabs for 'All', 'Unread', and 'Mentions'. Display notification items with icons, user avatars, message text, timestamp, and mark as read button. Include 'Mark all as read' option, notification settings link, and empty state illustration. Add unread count badge on bell icon.",
    icon: Bell,
    category: "Admin",
    complexity: "medium",
  },

  // Mobile & Responsive
  {
    label: "Mobile App Screen",
    prompt: "Design a mobile app home screen with top navigation bar, search input, category chips for horizontal scrolling, featured content carousel, grid of content cards, and bottom tab navigation with icons for Home, Search, Favorites, and Profile. Use mobile-first design principles with touch-friendly elements and smooth transitions.",
    icon: Smartphone,
    category: "Mobile",
    complexity: "medium",
  },

  // Portfolio & Blog
  {
    label: "Blog Post Layout",
    prompt: "Create a beautiful blog post page with featured image, post title, author info with avatar and social links, publish date, reading time estimate, tag badges, article content with proper typography, code syntax highlighting for code blocks, image captions, pull quotes, related posts section at bottom, and comment section with nested replies.",
    icon: FileText,
    category: "Content",
    complexity: "complex",
  },
  {
    label: "Portfolio Site",
    prompt: "Design a personal portfolio website with animated hero section showcasing name and tagline, about section with photo and bio, skills section with progress bars or badges, projects gallery with filterable categories and hover effects showing project details, contact form, and smooth scroll navigation. Use modern animations and micro-interactions.",
    icon: Globe,
    category: "Content",
    complexity: "complex",
  },
];

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
  const categories = ["All", ...Array.from(new Set(suggestions.map(s => s.category)))];

  // Filter suggestions by category
  const filteredSuggestions = selectedCategory === "All" 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

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
        const message = error.response?.data?.message || "Failed to create project";
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
  }, [userInput, canCreateProject, hasUnlimitedAccess, userDetails, router, setUserDetails]);

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
      case "simple": return "bg-gray-100 text-gray-700";
      case "medium": return "bg-gray-100 text-gray-700";
      case "complex": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
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
              <span className="text-xs font-medium text-black bg-black px-3 py-1.5 rounded-full flex items-center gap-1">
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
        
        {/* Keyboard shortcut hint */}
        {/* {user && (
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
            <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono">
              {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
            </kbd>
            +
            <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono">
              Enter
            </kbd>
            <span>to create instantly</span>
          </div>
        )} */}
      </div>

      {/* Suggestions with improved design */}
      <div className="space-y-5 md:mt-40">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-gray-500" />
            Professional Templates Library
          </h2>
          <p className="text-sm text-gray-600">
            Choose from {suggestions.length}+ detailed, production-ready templates
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
                selectedCategory === category 
                  ? "shadow-md" 
                  : "hover:bg-gray-50"
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
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getComplexityColor(item.complexity)}`}>
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