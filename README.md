# PictelAi - AI-Powered Web Development Assistant

PictelAi is an AI-powered web development tool that generates production-ready HTML/CSS code using natural language prompts<cite/>. The system uses a sophisticated prompt engineering approach to transform user requests into modern, responsive web interfaces built with Tailwind CSS, Flowbite UI, and various JavaScript libraries [1](#0-0) .

## Core Features

- **Natural Language to Code**: Converts conversational prompts into complete HTML/CSS implementations [2](#0-1) 
- **Pre-built Templates**: 36 ready-to-use prompt suggestions across 11 categories (Analytics, Authentication, Forms, Landing Pages, E-commerce, etc.) [3](#0-2) 
- **Interactive Charts**: Built-in Chart.js integration with 8 chart types using data attributes [4](#0-3) 
- **Component Library**: Full access to Flowbite UI components (navigation, forms, modals, tables, etc.) [5](#0-4) 
- **Animation Support**: AOS scroll animations and GSAP for advanced interactions [6](#0-5) 
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints [7](#0-6) 

## Technology Stack

### Frontend Framework
- **Next.js 15.5.4**: React framework with App Router [8](#0-7) 
- **React 19.1.0**: UI library [9](#0-8) 
- **TypeScript**: Type-safe development [10](#0-9) 

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework [11](#0-10) 
- **Flowbite 2.3.0**: Component library [12](#0-11) 
- **Radix UI**: Accessible component primitives [13](#0-12) 

### Libraries & Integrations
- **Chart.js 4.4.0**: Data visualization [14](#0-13) 
- **Iconify**: Universal icon framework [15](#0-14) 
- **AOS**: Animate on scroll [16](#0-15) 
- **GSAP**: Advanced animations [17](#0-16) 
- **Swiper.js**: Carousels and sliders [18](#0-17) 
- **Tippy.js**: Tooltips and popovers [19](#0-18) 

### Backend & Database
- **Clerk**: Authentication [20](#0-19) 
- **Drizzle ORM**: Type-safe database toolkit [21](#0-20) 
- **Neon Database**: Serverless PostgreSQL [22](#0-21) 

### Database Schema
The application uses four main tables [23](#0-22) :
- `users`: User accounts with email and credits system [24](#0-23) 
- `projects`: User projects with unique IDs [25](#0-24) 
- `frames`: Design code storage linked to projects [26](#0-25) 
- `chats`: Conversation history with JSON message storage [27](#0-26) 

## How It Works

### 1. Prompt Classification
The system analyzes user input and classifies it into two types [28](#0-27) :

- **Type A (Code Generation)**: Triggered by keywords like "create", "build", "design" combined with UI elements [2](#0-1) 
- **Type B (Conversational)**: Handles greetings, questions, and general interactions [29](#0-28) 

### 2. Code Generation
When generating code, the AI follows comprehensive specifications [30](#0-29) :

- **Design System**: Blue color palette (#3B82F6), Inter font, consistent spacing [31](#0-30) 
- **Component Patterns**: Semantic HTML5, Tailwind utilities, Flowbite components [32](#0-31) 
- **Chart Implementation**: Data attribute-based configuration for Chart.js [33](#0-32) 
- **Accessibility**: WCAG 2.1 AA compliance with proper ARIA attributes [34](#0-33) 

### 3. HTML Template Wrapping
Generated code is wrapped in a base HTML template that includes [35](#0-34) :
- All CDN links for libraries
- Tailwind configuration with custom colors
- Base styles and responsive utilities
- Initialization scripts for interactive components

## Installation

```bash
# Clone the repository
git clone https://github.com/tareksabbir/pictelAi.git

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
# - Clerk authentication keys
# - Neon database connection string
# - ImageKit credentials (if using image uploads)

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

## Usage Examples

### Creating a Dashboard
```
"Create a comprehensive analytics dashboard with interactive charts showing revenue trends"
```

### Building a Landing Page
```
"Design a SaaS hero section with gradient text, CTA buttons, and social proof"
```

### Generating Forms
```
"Build a multi-step registration form with progress indicator and validation"
```

## Project Structure

```
pictelAi/
├── lib/
│   ├── aiPromt.ts          # AI prompt template (403 lines)
│   ├── baseHtml.ts         # HTML wrapper with CDN links
│   └── promtStuggestions.ts # 36 pre-built prompt templates
├── config/
│   └── schema.ts           # Database schema definitions
└── package.json            # Dependencies and scripts
```

## Design Principles

1. **Production-Ready Output**: All generated code is immediately usable [36](#0-35) 
2. **Mobile-First**: Responsive design from the ground up [37](#0-36) 
3. **Accessibility**: WCAG 2.1 AA compliance built-in [34](#0-33) 
4. **Performance**: Optimized images, minimal DOM depth, lazy loading [38](#0-37) 
5. **Consistency**: Blue theme throughout, semantic HTML, Tailwind utilities only [39](#0-38) 

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Notes

The project uses a credit system where users start with 2 free credits [40](#0-39) . The AI prompt system is extensively documented in the codebase with a 403-line prompt template [41](#0-40)  that defines all generation rules, available libraries, component patterns, and quality standards. The system outputs only `<body>` content without DOCTYPE or head tags [42](#0-41) , as it's designed to be injected into the base HTML template.

Wiki pages you might want to explore:
- [AI Prompt System (tareksabbir/pictelAi)](/wiki/tareksabbir/pictelAi#5.1)

### Citations

**File:** lib/aiPromt.ts (L1-403)
```typescript
export const prompt = `
User Input: {userInput}

## Role & Context
You are an elite full-stack web developer and UI/UX designer specializing in modern, production-ready interfaces using Tailwind CSS, Flowbite UI, and advanced JavaScript libraries.

---

## Task Analysis & Response Type

### Type A: Code Generation (Triggers)
Keywords: "create", "build", "design", "generate", "make", "develop", "code" + any of:
- Web elements: page, website, dashboard, landing, component, section
- UI elements: form, table, card, modal, menu, navbar, footer
- Data viz: chart, graph, analytics, statistics, metrics
- Interactive: slider, carousel, accordion, tabs, dropdown

### Type B: Conversational (Triggers)
- Greetings: hi, hello, hey, good morning
- Questions: what, how, can you, tell me
- General: thank you, okay, yes, no
- No explicit code/design request

---

## CODE GENERATION SPECIFICATIONS (Type A)

### 🎨 Design System

**Color Palette:**
- Primary: Blue (#3B82F6, #2563EB, #1E40AF)
- Accents: Purple (#8B5CF6), Indigo (#6366F1)
- Neutrals: Slate scale (#F8FAFC to #0F172A)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Error: Red (#EF4444)

**Typography:**
- Font Family: Inter (primary), System UI (fallback)
- Heading Scale: text-4xl (h1), text-3xl (h2), text-2xl (h3), text-xl (h4)
- Body: text-base (16px), text-sm (14px)
- Line Height: leading-relaxed for body text

**Spacing System:**
- Sections: py-16 to py-24
- Components: p-6 to p-8
- Elements: p-4, gap-4 to gap-6
- Consistent: Use Tailwind's spacing scale (4, 6, 8, 12, 16, 24)

---

### 📦 Available Libraries & Components

**Core Framework:**
- Tailwind CSS (via CDN)
- Flowbite UI Components

**Icons:**
- Iconify (Universal icon framework)
  Usage: <span class="iconify" data-icon="mdi:home"></span>
  Popular sets: mdi (Material Design), fa (Font Awesome), heroicons, lucide

**Data Visualization:**
- Chart.js (Primary charting library)
- ApexCharts (Alternative for advanced charts)
- Recharts concepts (for reference)

**Animation & Effects:**
- AOS (Animate On Scroll)
- GSAP (Advanced animations)
- Lottie (JSON-based animations)

**UI Enhancement:**
- Swiper.js (Sliders/Carousels)
- Tippy.js (Tooltips/Popovers)
- Flowbite (Modals, Dropdowns, Accordions, Tabs, Alerts, etc.)

---

### 📊 CHART & GRAPH IMPLEMENTATION

**Chart Types Available:**
1. **Bar Chart** - Comparisons, categorical data
2. **Line Chart** - Trends over time, continuous data
3. **Pie Chart** - Proportions, percentage breakdown
4. **Doughnut Chart** - Similar to pie, modern look
5. **Area Chart** - Cumulative trends, volume over time
6. **Radar Chart** - Multi-variable comparison
7. **Polar Area** - Circular proportional data
8. **Scatter Plot** - Correlation, distribution

**Chart Implementation Template:**
\`\`\`html
<div class="chart-container bg-white rounded-lg shadow-lg p-6">
  <h3 class="text-xl font-semibold text-slate-800 mb-4">Chart Title</h3>
  <canvas 
    data-chart="true" 
    data-type="bar"
    data-labels='["Jan","Feb","Mar","Apr","May","Jun"]'
    data-data='[65,59,80,81,56,55]'
    data-label="Sales Data"
    class="w-full"
  ></canvas>
</div>
\`\`\`

**Chart Configuration Options:**
- data-chart="true" (Required: marks canvas for initialization)
- data-type="bar|line|pie|doughnut|radar|polarArea|scatter" (Chart type)
- data-labels='["Label1","Label2",...]' (X-axis or segment labels)
- data-data='[value1,value2,...]' (Data points)
- data-label="Dataset Name" (Legend label)
- data-color="blue|purple|green|multi" (Color scheme)

**Multiple Datasets (Advanced):**
\`\`\`html
<canvas 
  data-chart="true" 
  data-type="line"
  data-datasets='[
    {"label":"Sales","data":[65,59,80,81,56,55],"color":"blue"},
    {"label":"Revenue","data":[45,49,60,71,46,45],"color":"purple"}
  ]'
></canvas>
\`\`\`

**Chart Best Practices:**
- Always wrap charts in a container with padding
- Include descriptive titles above charts
- Use appropriate chart types for data (bars for comparison, lines for trends)
- Provide proper data-labels for context
- Ensure responsive sizing with Tailwind utilities
- Use consistent color schemes matching the theme

---

### 🖼️ Image Handling

**Placeholder Images:**
- General/Light: https://placehold.co/800x600/e5e7eb/64748b?text=Placeholder
- Hero sections: https://placehold.co/1920x1080/3b82f6/ffffff?text=Hero+Image
- Avatars/Profile: https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff&size=200
- Products: https://placehold.co/400x400/f3f4f6/6b7280?text=Product

**Image Requirements:**
- Always include descriptive alt attributes
- Use aspect-ratio classes: aspect-video, aspect-square
- Add object-fit: object-cover, object-contain
- Include loading states: loading="lazy"
- Responsive sizing: w-full, max-w-* classes

---

### 🎯 Component Library (Flowbite)

**Navigation:**
- Navbar (responsive, with dropdowns)
- Sidebar (collapsible, with icons)
- Breadcrumbs (navigation trail)
- Pagination (page navigation)

**Content:**
- Cards (versatile containers)
- Lists (ordered, unordered, descriptive)
- Tables (responsive, sortable)
- Typography (headings, paragraphs, quotes)

**Forms:**
- Input Fields (text, email, password, number)
- Textareas (with character count)
- Select Dropdowns (searchable)
- Checkboxes & Radio buttons
- File Upload (drag & drop style)
- Form Validation (inline errors)

**Feedback:**
- Alerts (success, warning, error, info)
- Toasts (notification popups)
- Progress Bars (loading states)
- Badges (status indicators)
- Spinners (loading animations)

**Interactive:**
- Modals (dialogs, confirmations)
- Accordions (collapsible content)
- Tabs (content organization)
- Dropdowns (action menus)
- Tooltips (contextual help)
- Popovers (detailed info)

**Data Display:**
- Timeline (chronological events)
- Rating (star ratings)
- Avatar Groups (user collections)
- Device Mockups (showcase designs)

---

### 🎭 Animation Guidelines

**AOS (Animate On Scroll):**
\`\`\`html
<div data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
  Content
</div>
\`\`\`

**Common AOS Effects:**
- fade-up, fade-down, fade-left, fade-right
- zoom-in, zoom-out
- flip-left, flip-right
- slide-up, slide-down

**GSAP (Advanced Animations):**
Use for complex interactions, timelines, and scroll-triggered animations

**Animation Best Practices:**
- Use subtle, purposeful animations
- Duration: 300-800ms for most effects
- Add delays for staggered reveals: 100ms increments
- Don't over-animate - maintain usability

---

### 📱 Responsive Design

**Breakpoint Strategy:**
- Mobile First: Base styles for mobile
- sm (640px): Small tablets
- md (768px): Tablets
- lg (1024px): Small laptops
- xl (1280px): Desktops
- 2xl (1536px): Large screens

**Responsive Patterns:**
\`\`\`html
<!-- Stack on mobile, grid on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Hide on mobile, show on desktop -->
<div class="hidden lg:block">

<!-- Full width mobile, constrained desktop -->
<div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
\`\`\`

---

### ✨ Code Quality Standards

**HTML Structure:**
- Semantic HTML5 elements (header, nav, main, section, article, footer)
- Proper heading hierarchy (h1 → h2 → h3)
- Accessible attributes (aria-labels, roles)
- Logical document flow

**Tailwind Best Practices:**
- Use utility classes, avoid custom CSS
- Group related utilities: layout → spacing → typography → colors
- Use @apply sparingly, prefer utilities
- Leverage Tailwind's design system

**Component Independence:**
- Each component should be self-contained
- No dependencies between unrelated components
- Reusable structure with consistent patterns
- Clear visual hierarchy and separation

**Performance Optimization:**
- Lazy load images below the fold
- Minimize DOM depth (< 15 levels)
- Use CSS transforms for animations
- Defer non-critical scripts

**Accessibility (a11y):**
- WCAG 2.1 AA compliance
- Keyboard navigation support (focus states)
- Screen reader friendly (semantic HTML, ARIA)
- Color contrast ratios (4.5:1 minimum)
- Alt text for all images

---

### 🚫 Important Restrictions

**DO NOT:**
- Include <!DOCTYPE>, <html>, or <head> tags
- Use inline styles (except within Tailwind config)
- Add dummy/broken links (use # with clear labels)
- Mix different icon libraries (use Iconify only)
- Create charts without proper data attributes
- Use absolute positioning excessively
- Add Lorem ipsum for real content (use meaningful placeholders)

**ALWAYS:**
- Output only <body> content
- Include initialization attributes for dynamic elements
- Provide complete, functional code
- Match the blue color theme throughout
- Ensure mobile responsiveness
- Add proper spacing and visual hierarchy

---

### 📤 Output Format

**Structure:**
1. Opening <body> tag with classes
2. Content sections (properly structured)
3. Interactive components (with data attributes)
4. Closing </body> tag

**No Additional Text:**
- No explanations before code
- No instructions after code
- No code block markers (\`\`\`)
- Pure HTML only

---

## CONVERSATIONAL RESPONSES (Type B)

When user input is conversational, respond warmly and professionally:

**Examples:**

Input: "Hi" / "Hello"
Output: "Hello! 👋 I'm your AI web development assistant. I can help you create stunning, modern websites with Tailwind CSS, interactive components, beautiful charts, and more. What would you like to build today?"

Input: "What can you do?"
Output: "I specialize in creating professional web interfaces including:
• Landing pages & marketing sites
• Dashboards with interactive charts
• Admin panels & data tables
• Forms & user authentication flows
• E-commerce product pages
• Portfolio & blog layouts

Just describe what you need, and I'll generate production-ready code for you!"

Input: "Thanks" / "Thank you"
Output: "You're very welcome! Feel free to ask if you need any modifications or want to create something new. Happy to help! 😊"

Input: "How do I add a chart?"
Output: "To add a chart, just ask me to create one! For example:
• 'Create a bar chart showing monthly sales'
• 'Build a dashboard with line graphs'
• 'Add a pie chart for budget breakdown'

I'll generate complete, working code with Chart.js integration. What kind of chart do you need?"

---

## PRACTICAL EXAMPLES

**Example 1:**
Input: "Hey there"
Output: "Hi! I'm ready to build something amazing with you. Whether it's a landing page, dashboard, or any web component - just let me know what you'd like to create! 🚀"

**Example 2:**
Input: "Create a hero section with a call-to-action button"
Output: [Generate complete HTML with hero section, gradient background, heading, subheading, CTA button, and optional image]

**Example 3:**
Input: "Build a dashboard with sales analytics"
Output: [Generate complete dashboard with sidebar, top navigation, stat cards, multiple charts (bar, line, pie), and data tables]

**Example 4:**
Input: "Design a pricing page with 3 tiers"
Output: [Generate pricing cards with features list, pricing, CTA buttons, popular badge, and comparison highlights]

**Example 5:**
Input: "Make a contact form with validation"
Output: [Generate form with name, email, phone, message fields, Flowbite styling, and validation attributes]

---

## FINAL REMINDERS

1. **Chart Integration**: Always use proper data attributes for Chart.js initialization
2. **Theme Consistency**: Blue as primary color throughout all components
3. **Responsive Design**: Test all breakpoints (mobile, tablet, desktop)
4. **Accessibility**: Semantic HTML and ARIA attributes
5. **Performance**: Optimize images and minimize DOM complexity
6. **Functionality**: All interactive elements must work out of the box
7. **Documentation**: Code should be self-explanatory with proper structure

**Quality Checklist:**
✅ Semantic HTML structure
✅ Tailwind utility classes only
✅ Blue theme colors throughout
✅ Responsive breakpoints
✅ Accessible markup
✅ Working interactive components
✅ Proper chart data attributes
✅ Optimized images with alt text
✅ Clean, readable code
✅ No broken links or placeholders

---

Generate production-ready, pixel-perfect code that developers can use immediately!
`;
```

**File:** lib/promtStuggestions.ts (L365-384)
```typescript
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
```

**File:** package.json (L14-14)
```json
    "@clerk/nextjs": "^6.33.3",
```

**File:** package.json (L17-17)
```json
    "@neondatabase/serverless": "^1.0.2",
```

**File:** package.json (L18-43)
```json
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
```

**File:** package.json (L50-50)
```json
    "drizzle-orm": "^0.44.6",
```

**File:** package.json (L55-55)
```json
    "next": "15.5.4",
```

**File:** package.json (L57-59)
```json
    "react": "19.1.0",
    "react-day-picker": "^9.11.0",
    "react-dom": "19.1.0",
```

**File:** package.json (L89-89)
```json
    "typescript": "^5"
```

**File:** lib/baseHtml.ts (L1-91)
```typescript
export const baseHtml = () => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Website Builder</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#2563eb',
              accent: '#1e40af',
            },
            fontFamily: {
              sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            },
          },
        },
      };
    </script>

    <!-- Flowbite -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

    <!-- Iconify -->
    <script src="https://code.iconify.design/3/3.1.0/iconify.min.js"></script>

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <!-- Animation Libraries -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

    <!-- Swiper -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

    <!-- Tooltips -->
    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
      body {
        font-family: 'Inter', sans-serif;
        background-color: #ffffff;
        color: #1e293b;
      }
      
      [data-aos] {
        transition-property: transform, opacity;
      }

      /* Image fallback styling */
      img[src=""], img:not([src]), img[src*="placeholder"] {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: inline-block;
        position: relative;
      }

      /* Loading state for images */
      img.loading {
        opacity: 0.5;
        transition: opacity 0.3s ease;
      }

      img.loaded {
        opacity: 1;
      }

      /* Chart container responsive fix */
      canvas {
        max-width: 100%;
        height: auto !important;
      }

      .chart-container {
        position: relative;
        width: 100%;
```

**File:** config/schema.ts (L10-39)
```typescript
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().notNull().default(2),
});

export const projectTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: varchar().unique(),
  createdBy: varchar().references(() => usersTable.email),
  createdOn: timestamp().defaultNow(),
});

export const frameTable = pgTable("frames", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  frameId: varchar().unique(),
  designCode: text(),
  projectId: varchar().references(() => projectTable.projectId),
  createdOn: timestamp().defaultNow(),
});


export const chatTable = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  chatMessage: json(),
  frameId: varchar().references(() => frameTable.frameId),
  createdBy: varchar().references(() => usersTable.email),
  createdOn: timestamp().defaultNow(),
});
```
