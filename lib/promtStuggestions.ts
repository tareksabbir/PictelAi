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

interface Suggestion {
  label: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  complexity: "simple" | "medium" | "complex";
}

export const suggestions: Suggestion[] = [
  {
    label: "Portfolio Site",
    prompt:
      "Design a personal portfolio website with animated hero section showcasing name and tagline, about section with photo and bio, skills section with progress bars or badges, projects gallery with filterable categories and hover effects showing project details, contact form, and smooth scroll navigation. Use modern animations and micro-interactions.",
    icon: Globe,
    category: "Content",
    complexity: "complex",
  },

  // Simple HTML/CSS Components
  {
    label: "Contact Form",
    prompt:
      "Create a simple contact form with name, email, subject, and message fields. Add a submit button and include basic styling with Tailwind CSS. Make it responsive and add hover effects.",
    icon: Mail,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Image Gallery",
    prompt:
      "Build a responsive image gallery grid with 9-12 placeholder images. Add hover effects that zoom or overlay text. Use Tailwind CSS grid layout that adapts to mobile, tablet, and desktop screens.",
    icon: ImagePlus,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Pricing Cards",
    prompt:
      "Design three simple pricing cards side by side with plan name, price, feature list, and a button. Add hover effects and make one card highlighted as 'Popular'. Use clean Tailwind CSS styling.",
    icon: CreditCard,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "About Section",
    prompt:
      "Create an about section with a profile image on one side and bio text on the other. Include social media icons at the bottom. Make it responsive with Tailwind CSS so it stacks on mobile.",
    icon: UserIcon,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Header Navigation",
    prompt:
      "Build a simple header navigation bar with logo on left and menu links on right (Home, About, Services, Contact). Add a mobile hamburger menu that shows/hides on click. Style with Tailwind CSS.",
    icon: HomeIcon,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Footer Section",
    prompt:
      "Create a website footer with three columns: About, Quick Links, and Contact Info. Add social media icons and copyright text at bottom. Use Tailwind CSS and make it responsive.",
    icon: Globe,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Feature Cards",
    prompt:
      "Design a grid of 4-6 simple feature cards with an icon, title, and short description. Add subtle hover effects. Use Tailwind CSS and make the grid responsive (1 column on mobile, 2 on tablet, 3 on desktop).",
    icon: Sparkles,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Testimonial Slider",
    prompt:
      "Create a testimonial section with customer quote, name, and photo. Add previous/next buttons to navigate between testimonials. Style with Tailwind CSS and add smooth transitions.",
    icon: Heart,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "FAQ Accordion",
    prompt:
      "Build an FAQ section with 5-7 questions that expand/collapse when clicked to show answers. Style with Tailwind CSS and add smooth animations for the expand/collapse effect.",
    icon: FileText,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Newsletter Signup",
    prompt:
      "Design a simple newsletter signup section with email input and subscribe button. Add a headline and short description. Include success message after submission. Style with Tailwind CSS.",
    icon: Mail,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Stats Counter",
    prompt:
      "Create a statistics section showing 4 numbers (like users, projects, awards, countries) with icons and labels. Arrange in a row and make responsive. Use Tailwind CSS with gradient backgrounds.",
    icon: BarChart3,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Team Grid",
    prompt:
      "Build a team members grid with photos, names, job titles, and social links. Show 3-4 team members per row. Add hover effects that reveal social icons. Style with Tailwind CSS.",
    icon: Users,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Call to Action",
    prompt:
      "Design a compelling call-to-action section with bold headline, description text, and two buttons (primary and secondary). Add a gradient or colored background. Use Tailwind CSS with modern styling.",
    icon: Zap,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Login Form",
    prompt:
      "Create a centered login form with email and password fields, remember me checkbox, forgot password link, and login button. Add simple validation styling. Use Tailwind CSS.",
    icon: Key,
    category: "Simple",
    complexity: "simple",
  },
  {
    label: "Service Cards",
    prompt:
      "Design service cards in a grid showing what you offer. Each card should have an icon, service name, short description, and 'Learn More' link. Use Tailwind CSS with hover effects.",
    icon: LayoutDashboard,
    category: "Simple",
    complexity: "simple",
  },
  // Dashboard & Analytics
  {
    label: "Analytics Dashboard",
    prompt:
      "Create a comprehensive analytics dashboard with interactive charts showing revenue trends, user growth metrics, conversion rates, and top performing products. Include date range selector, export functionality, KPI cards with percentage changes, and a sidebar navigation. Use modern design with gradients and glassmorphism effects.",
    icon: LayoutDashboard,
    category: "Analytics",
    complexity: "complex",
  },
  {
    label: "Sales Dashboard",
    prompt:
      "Build a sales performance dashboard featuring real-time sales data, monthly targets vs actual performance, top sales representatives leaderboard, regional sales map, and recent transactions table. Include filters for date ranges and product categories. Use charts from recharts library with smooth animations.",
    icon: TrendingUp,
    category: "Analytics",
    complexity: "complex",
  },
  {
    label: "Metrics Overview",
    prompt:
      "Design a clean metrics overview page with 4-6 KPI cards displaying key business metrics (total users, revenue, growth rate, churn rate). Each card should show the current value, percentage change from last period, and a mini sparkline chart. Add comparison toggles for day/week/month/year views.",
    icon: BarChart3,
    category: "Analytics",
    complexity: "medium",
  },

  // Authentication & Forms
  {
    label: "Modern SignUp",
    prompt:
      "Create an elegant sign up form with email and password fields, password strength indicator, Google and Github OAuth buttons, terms of service checkbox, and a link to sign in. Add form validation with error messages, loading states, and smooth animations. Use a split-screen layout with a gradient background on one side and form on the other.",
    icon: Key,
    category: "Authentication",
    complexity: "medium",
  },
  {
    label: "Login Page",
    prompt:
      "Design a modern login page with email/password fields, 'Remember me' checkbox, forgot password link, and social login options (Google, Github, Apple). Include form validation, animated error messages, and a 'Don't have an account?' link. Add a beautiful illustration or gradient background.",
    icon: UserIcon,
    category: "Authentication",
    complexity: "medium",
  },
  {
    label: "Multi-Step Form",
    prompt:
      "Build a multi-step registration form with progress indicator showing 4 steps: Personal Info, Business Details, Payment Method, and Confirmation. Each step should have smooth transitions, form validation, ability to go back/forward, and a summary review before final submission. Include animated checkmarks for completed steps.",
    icon: FileText,
    category: "Forms",
    complexity: "complex",
  },

  // Landing Pages & Marketing
  {
    label: "SaaS Hero Section",
    prompt:
      "Create a stunning hero section for a productivity SaaS with a 'New Feature' announcement badge, bold headline with gradient text effect, compelling subtitle, two CTA buttons (primary and secondary), social proof showing customer logos or user count, and a mockup image or animated demo. Add subtle parallax effects and floating elements.",
    icon: HomeIcon,
    category: "Landing",
    complexity: "medium",
  },
  {
    label: "Pricing Page",
    prompt:
      "Design a modern pricing page with 3 tier options (Starter, Professional, Enterprise). Each card should display monthly/yearly toggle, price with savings badge, feature list with checkmarks, highlighted 'most popular' tier, CTA button, and 'Contact sales' for enterprise. Add comparison table below showing all features across tiers.",
    icon: CreditCard,
    category: "Landing",
    complexity: "complex",
  },
  {
    label: "Features Section",
    prompt:
      "Build a comprehensive features showcase section with 6-8 feature cards in a grid layout. Each card should have an icon, title, description, and 'Learn more' link. Add hover effects with subtle elevation changes. Include a main heading with subtitle and an alternating layout showing feature details with accompanying illustrations.",
    icon: Zap,
    category: "Landing",
    complexity: "medium",
  },
  {
    label: "Testimonials Grid",
    prompt:
      "Create an engaging testimonials section displaying customer reviews in a masonry grid layout. Each testimonial card should include customer photo, name, job title/company, star rating, review text, and company logo. Add a carousel for mobile view and subtle animations on scroll. Include a 'Trusted by 10,000+ companies' heading with logo cloud.",
    icon: MessageSquare,
    category: "Landing",
    complexity: "medium",
  },

  // E-commerce
  {
    label: "Product Card",
    prompt:
      "Design a modern e-commerce product card with high-quality product image, quick view button on hover, 'Add to cart' button, wishlist heart icon, product name, price with discount badge if applicable, star rating with review count, color/size variant selector, and 'Out of stock' overlay when unavailable. Include smooth hover animations.",
    icon: ShoppingCart,
    category: "E-commerce",
    complexity: "medium",
  },
  {
    label: "Shopping Cart",
    prompt:
      "Build a complete shopping cart page with product list showing thumbnails, names, quantities (with +/- buttons), prices, remove option, order summary sidebar with subtotal, shipping, tax, discount code input, and total. Add 'Continue shopping' and 'Proceed to checkout' buttons. Include empty cart state with illustration.",
    icon: ShoppingCart,
    category: "E-commerce",
    complexity: "complex",
  },
  {
    label: "Checkout Flow",
    prompt:
      "Create a streamlined checkout page with shipping address form, payment method selection (credit card, PayPal, Apple Pay), order summary sidebar, coupon code field, shipping options with delivery dates, and secure checkout badge. Add form validation, auto-fill suggestions, and progress steps showing shipping → payment → review.",
    icon: CreditCard,
    category: "E-commerce",
    complexity: "complex",
  },

  // Social & Communication
  {
    label: "User Profile Card",
    prompt:
      "Design a detailed user profile card with cover photo, circular profile picture, name, username, bio, location, website link, join date, follower/following counts with hover tooltips, 'Follow' button with loading state, tabs for posts/media/likes, and recent activity feed. Add verification badge for verified accounts.",
    icon: UserIcon,
    category: "Social",
    complexity: "medium",
  },
  {
    label: "Chat Interface",
    prompt:
      "Build a real-time chat interface with sidebar showing conversation list (with unread badges), main chat area displaying message bubbles, user typing indicators, timestamp on messages, emoji picker, file attachment button, and message input with send button. Include online status indicators and message read receipts.",
    icon: MessageSquare,
    category: "Social",
    complexity: "complex",
  },
  {
    label: "Social Feed",
    prompt:
      "Create a social media feed with post cards showing user avatar, name, timestamp, post content (text/images), like/comment/share buttons with counts, expandable comments section, and infinite scroll loading. Add post composer at top with text input, image upload, and emoji picker. Include skeleton loaders.",
    icon: Users,
    category: "Social",
    complexity: "complex",
  },

  // Productivity & Tools
  {
    label: "Email Template",
    prompt:
      "Design a responsive email newsletter template with header logo, hero image, compelling headline, body content sections with images and text, call-to-action buttons, social media links, and footer with unsubscribe link. Use a clean, professional layout optimized for all email clients with inline CSS.",
    icon: Mail,
    category: "Productivity",
    complexity: "medium",
  },
  {
    label: "Calendar View",
    prompt:
      "Build an interactive calendar component with month view showing dates in grid layout, current date highlighting, event dots on dates with events, sidebar showing event list for selected date, month/year navigation arrows, 'Today' quick button, and modal popup for creating new events with title, date, time, and description fields.",
    icon: Calendar,
    category: "Productivity",
    complexity: "complex",
  },
  {
    label: "Task Manager",
    prompt:
      "Create a kanban-style task management board with draggable cards across 'To Do', 'In Progress', and 'Done' columns. Each task card should show title, description, assignee avatar, due date, priority badge, and tag labels. Include 'Add task' button, search/filter functionality, and task detail modal with comments section.",
    icon: FileText,
    category: "Productivity",
    complexity: "complex",
  },
  {
    label: "Search Interface",
    prompt:
      "Design a powerful search interface with autocomplete dropdown showing recent searches and suggestions, category filters (All, Images, Videos, News), advanced search options panel, search results with titles, snippets, URLs, and thumbnails, pagination, and 'Did you mean?' spell correction. Add keyboard navigation support.",
    icon: Search,
    category: "Productivity",
    complexity: "complex",
  },

  // Settings & Admin
  {
    label: "Settings Page",
    prompt:
      "Build a comprehensive settings page with tabbed navigation (Account, Security, Notifications, Billing, Team). Include sections for profile photo upload, name/email editing, password change, two-factor authentication toggle, notification preferences with checkboxes, plan upgrade cards, and team member management table with invite functionality.",
    icon: Settings,
    category: "Admin",
    complexity: "complex",
  },
  {
    label: "Notification Center",
    prompt:
      "Create a notification dropdown panel with tabs for 'All', 'Unread', and 'Mentions'. Display notification items with icons, user avatars, message text, timestamp, and mark as read button. Include 'Mark all as read' option, notification settings link, and empty state illustration. Add unread count badge on bell icon.",
    icon: Bell,
    category: "Admin",
    complexity: "medium",
  },

  // Mobile & Responsive
  {
    label: "Mobile App Screen",
    prompt:
      "Design a mobile app home screen with top navigation bar, search input, category chips for horizontal scrolling, featured content carousel, grid of content cards, and bottom tab navigation with icons for Home, Search, Favorites, and Profile. Use mobile-first design principles with touch-friendly elements and smooth transitions.",
    icon: Smartphone,
    category: "Mobile",
    complexity: "medium",
  },

  // Portfolio & Blog
  {
    label: "Blog Post Layout",
    prompt:
      "Create a beautiful blog post page with featured image, post title, author info with avatar and social links, publish date, reading time estimate, tag badges, article content with proper typography, code syntax highlighting for code blocks, image captions, pull quotes, related posts section at bottom, and comment section with nested replies.",
    icon: FileText,
    category: "Content",
    complexity: "complex",
  },
  {
    label: "Portfolio Site",
    prompt:
      "Design a personal portfolio website with animated hero section showcasing name and tagline, about section with photo and bio, skills section with progress bars or badges, projects gallery with filterable categories and hover effects showing project details, contact form, and smooth scroll navigation. Use modern animations and micro-interactions.",
    icon: Globe,
    category: "Content",
    complexity: "complex",
  },
];
