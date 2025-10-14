

# 🧠 PictelAI — Full-Stack AI-Powered UI Generator

**PictelAI** is a **full-stack AI-driven web application** that generates **production-ready UI components and full web layouts** through natural language conversation.
It integrates **LLM-based code generation** with a **real-time iframe rendering system**, enabling users to design, edit, and preview live web interfaces instantly.

---

## 🚀 Key Features

* 💬 **Conversational UI Design** — Generate HTML/CSS/Tailwind-based interfaces from natural language prompts.
* ⚡ **Real-Time Rendering** — Instantly preview generated UIs in an interactive iframe sandbox.
* 🔁 **Auto-Save System** — Automatically stores design changes with a debounce mechanism.
* 🔐 **User Authentication** — Secure login and credits management via **Clerk**.
* 🧩 **Component Libraries** — Flowbite, AOS, Swiper, Chart.js, and Tippy.js integrated for generated code.
* 🧠 **LLM Integration** — Uses **OpenRouter.ai** with `tongyi-deepresearch-30b` model for intelligent UI generation.
* ☁️ **Serverless Backend** — Built on **Next.js 14**, **Neon PostgreSQL**, and **Drizzle ORM**.
* 🧱 **Modular Architecture** — Clear separation between playground, generation pipeline, and persistence layer.

---

## 🧩 Technology Stack

| Layer                    | Technology                                    | Purpose                                      |
| ------------------------ | --------------------------------------------- | -------------------------------------------- |
| Frontend Framework       | **Next.js 15+ (App Router)**                   | SSR, routing, API routes                     |
| UI Components            | **Radix UI, Tailwind CSS**                    | Accessible primitives, utility-first styling |
| Authentication           | **Clerk**                                     | Secure auth and session management           |
| Database                 | **Neon PostgreSQL**                           | Scalable serverless database                 |
| ORM                      | **Drizzle ORM**                               | Type-safe SQL queries                        |
| AI Service               | **OpenRouter.ai (Tongyi DeepResearch 30B)**   | LLM code generation                          |
| Image Processing         | **ImageKit**                                  | Image upload and optimization                |
| Generated Code Libraries | **Flowbite, AOS, Swiper, Chart.js, Tippy.js** | Animations and UI interactions               |

---

## ⚙️ Installation & Setup

### 🧠 Prerequisites

Make sure you have installed:

* Node.js **>=18**
* npm or yarn
* PostgreSQL (Neon DB or local)
* Clerk account (for authentication)
* OpenRouter API key
* ImageKit credentials

---

### 🔧 1. Clone the Repository

```bash
git clone https://github.com/tareksabbir/pictelai.git
cd pictelai
```

---

### 📦 2. Install Dependencies

```bash
npm install
# or
yarn install
```

---

### 🔑 3. Environment Variables

Create a `.env.local` file in the project root and add:

```bash
DATABASE_URL="postgresql://<your_neon_connection_string>"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>
OPENROUTER_API_KEY=<your_openrouter_api_key>
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=<your_imagekit_url>
IMAGEKIT_PRIVATE_KEY=<your_imagekit_private_key>
IMAGEKIT_PUBLIC_KEY=<your_imagekit_public_key>
```

---

### 🧱 4. Database Migration

Run Drizzle migration to sync schema:

```bash
npm run db:push
```

---

### ▶️ 5. Start Development Server

```bash
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**

---

## 🧠 System Architecture

PictelAI’s architecture consists of **five main layers**:

1. **Frontend Playground (User Interface)**
   Handles chat, AI interaction, and iframe rendering.

2. **AI Code Generation Pipeline**
   Uses `lib/aiPromt.ts` and OpenRouter API to stream HTML/CSS/JS code via Server-Sent Events (SSE).

3. **Database Persistence Layer**
   Built with Neon PostgreSQL and Drizzle ORM, maintaining hierarchical relationships:

   * `usersTable` → `projectTable` → `frameTable` → `chatTable`

4. **API Layer (Next.js API Routes)**
   Handles CRUD operations for projects, frames, and messages.

5. **Authentication & Authorization Layer**
   Managed by **Clerk** with credit-based access control.

---

## 🏗️ Core Components Overview

### 1. **Playground System**

📁 `app/playground/[projectId]/page.tsx`

* Main workspace where users chat and see generated code.
* Uses custom hooks:

  * `usePlaygroundData()` — manages project/frame state.
  * `useCodeGeneration()` — streams and buffers code from AI.

### 2. **AI Code Generation Pipeline**

📁 `lib/aiPromt.ts`

* Builds detailed prompt from user input.
* Calls OpenRouter API for LLM output.
* Streams response via **SSE**.
* Cleans markdown fences and injects code into iframe.

### 3. **WebsiteDesign Iframe Renderer**

📁 `app/playground/_components/WebsiteDesign.tsx`

* Injects base HTML and scripts into iframe.
* Initializes libraries sequentially (AOS, Swiper, Chart.js, Flowbite).
* Enables live inline editing with auto-save debounce (2s).

### 4. **API Routes**

| Route                | Description                                 |
| -------------------- | ------------------------------------------- |
| `POST /api/projects` | Creates new project & frame, deducts credit |
| `GET /api/frames`    | Fetches frame data and chat history         |
| `PUT /api/frames`    | Updates frame’s designCode after editing    |

---

## 🔐 Authentication & Credits System

* Managed by **Clerk**.
* New users receive **2 free credits**.
* Each project creation deducts **1 credit** unless on unlimited plan.
* Users with unlimited plans can create projects without restriction.

---

## 🧮 Data Model

**Tables:**

* `usersTable`: stores user info, credits
* `projectTable`: maps to a single project
* `frameTable`: stores design iterations & generated code
* `chatTable`: stores conversation messages as JSON

**Relationships:**

```
User → Project → Frame → Chat
```

**Fields of Interest:**

* `frameTable.designCode`: stores generated HTML/CSS
* `chatTable.chatMessage`: stores AI conversation history

---

## 🔄 Workflow Summary

### 🧩 Project Creation Flow

1. Check credits or unlimited plan
2. Create `projectId` and `frameId`
3. Save initial user message
4. Call AI model → stream code
5. Render inside iframe and auto-save changes

### ⚡ Real-Time Streaming

* AI response streamed via **SSE**
* Chunks accumulated in `codeBufferRef`
* Cleaned HTML injected into iframe root
* Libraries initialized dynamically
* Debounced auto-save triggered after edits

---

## ⚡ Performance Optimizations

| Technique           | Purpose                            |
| ------------------- | ---------------------------------- |
| `React.memo`        | Prevents re-renders                |
| `useCallback`       | Stable function references         |
| `useRef`            | Persistent state storage           |
| Debounce            | Limits auto-save calls             |
| Lazy Initialization | Delays library loading until ready |
| Code Buffering      | Smooth streaming experience        |

---

## 🧠 Prompt Engineering

The core logic inside `lib/aiPromt.ts` defines the AI’s behavior:

* Defines generation rules for UI, layout, and interactivity.
* Instructs LLM to output **clean HTML/CSS/JS** (not markdown).
* Provides CDN-based imports for Flowbite, Swiper, AOS, etc.

---

## 📸 Screenshots (Optional Section)

*(You can later add screenshots or GIFs showing AI conversation, live preview, and editing.)*

---

## 🧰 Commands Reference

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build production bundle  |
| `npm run start`   | Run production server    |
| `npm run db:push` | Apply database schema    |
| `npm run lint`    | Run ESLint checks        |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch

   ```bash
   git checkout -b feature/awesome-idea
   ```
3. Commit your changes

   ```bash
   git commit -m "Add awesome idea"
   ```
4. Push and create a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute it with attribution.

---

## ✨ Author

**Md. Tarek Rahman**
🏠 Chittagong, Bangladesh
💻 Full-Stack Developer | AI & Web Enthusiast
🔗 [GitHub](https://github.com/tareksabbir) | [LinkedIn](https://linkedin.com/in/tareksabbir)


