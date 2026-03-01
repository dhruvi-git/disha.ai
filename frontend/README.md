# Disha AI — Your AI-Powered Career Coach

Disha AI is a full-stack career coaching platform that helps job seekers prepare for interviews, build resumes, generate cover letters, plan career roadmaps, and discover job opportunities — all powered by AI.

**Live Preview:** [View App](https://id-preview--99fe201f-af61-4e76-895e-b0bc06a27ee4.lovable.app)

---

## ✨ Features

### 🤖 AI Career Coach (Chat)
- Real-time streaming chat with an AI career advisor
- Get personalized career advice, job search strategies, and skill development tips
- Markdown-rendered responses for rich formatting

### 🎤 Interview Preparation
- Generate role-specific interview questions by difficulty level
- Type or **voice-record** your answers with a built-in audio recorder
- Receive AI-powered feedback with scores, strengths, and improvement areas

### 📄 Resume Builder & Analyzer
- Generate ATS-optimized resumes from your details (name, role, experience, skills, education)
- Analyze existing resumes for feedback and improvement suggestions
- Copy generated resumes to clipboard instantly

### ✉️ Cover Letter Generator
- Create tailored cover letters for specific roles and companies
- Optionally include job descriptions for better personalization
- One-click copy to clipboard

### 🗺️ Career Roadmap
- Get a phased career transition plan (Foundation → Building → Transition)
- Includes skill requirements, resources, certifications, and salary expectations
- Supports any current-role → target-role combination

### 🔍 Job Finder
- AI-powered job search by role, location, and job type (Full-time, Part-time, Remote, Internship)
- Returns structured job listings with company, description, and type

### 👤 User Profile
- Store and manage your career profile (name, target role, experience level, skills, bio)
- Profile data persists across sessions

### 📊 Dashboard
- Overview of tool usage with interactive bar charts
- Recent activity feed with quick links
- Tool cards with usage counts

---

## 🛠️ Tech Stack

| Layer          | Technology                                                     |
| -------------- | -------------------------------------------------------------- |
| **Framework**  | [React 18](https://react.dev) + [Vite 5](https://vitejs.dev)  |
| **Language**   | [TypeScript](https://www.typescriptlang.org/)                  |
| **Styling**    | [Tailwind CSS 3](https://tailwindcss.com/) + custom design tokens |
| **UI Library** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)     |
| **Animations** | [Framer Motion](https://www.framer.com/motion/)                |
| **Charts**     | [Recharts](https://recharts.org/)                              |
| **Markdown**   | [react-markdown](https://github.com/remarkjs/react-markdown)  |
| **Routing**    | [React Router v6](https://reactrouter.com/)                    |
| **State**      | [TanStack React Query](https://tanstack.com/query)             |
| **Forms**      | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Backend**    | Supabase (Auth, Database, Edge Functions)                      |
| **AI Models**  | Google Gemini 3 Flash (via Lovable AI Gateway)                 |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── landing/          # Landing page sections (Hero, Features, FAQ, CTA, etc.)
│   ├── ui/               # shadcn/ui components (button, card, dialog, etc.)
│   ├── DashboardLayout.tsx  # Authenticated layout with sidebar navigation
│   └── NavLink.tsx
├── hooks/
│   ├── use-activity-log.ts  # Logs user actions to the database
│   ├── use-mobile.tsx       # Mobile breakpoint detection
│   └── use-toast.ts
├── integrations/
│   └── supabase/
│       ├── client.ts     # Supabase client (auto-generated)
│       └── types.ts      # Database types (auto-generated)
├── pages/
│   ├── Index.tsx          # Landing page
│   ├── AuthPage.tsx       # Login / Sign up (Email + Google OAuth)
│   ├── DashboardHome.tsx  # Dashboard overview with charts
│   ├── ChatPage.tsx       # AI career coach chat
│   ├── InterviewPage.tsx  # Mock interview practice
│   ├── ResumePage.tsx     # Resume generator & analyzer
│   ├── CoverLetterPage.tsx # Cover letter generator
│   ├── RoadmapPage.tsx    # Career roadmap planner
│   ├── JobFinderPage.tsx  # AI job search
│   ├── ProfilePage.tsx    # User profile management
│   └── NotFound.tsx
├── index.css              # Design tokens & global styles
├── App.tsx                # Route definitions
└── main.tsx               # Entry point

supabase/
└── functions/
    ├── ai-chat/           # Streaming career coach chat
    ├── ai-interview/      # Question generation & answer feedback
    ├── ai-resume/         # Resume generation & analysis
    ├── ai-cover-letter/   # Cover letter generation
    ├── ai-roadmap/        # Career roadmap generation
    └── ai-jobs/           # Job listing search
```

---

## 🗄️ Database Schema

### `profiles`
| Column           | Type       | Description                        |
| ---------------- | ---------- | ---------------------------------- |
| id               | UUID (PK)  | Auto-generated                     |
| user_id          | UUID       | References authenticated user      |
| full_name        | text       | User's display name                |
| target_role      | text       | Desired career role                |
| experience_level | text       | Junior / Mid / Senior / Lead       |
| skills           | text[]     | Array of skill tags                |
| bio              | text       | Short bio                          |
| created_at       | timestamptz | Record creation time              |
| updated_at       | timestamptz | Last update time                  |

### `activity_logs`
| Column     | Type        | Description                       |
| ---------- | ----------- | --------------------------------- |
| id         | UUID (PK)   | Auto-generated                    |
| user_id    | UUID        | References authenticated user     |
| tool       | text        | Tool used (chat, interview, etc.) |
| action     | text        | Action performed                  |
| created_at | timestamptz | Timestamp of the action           |

---

## 🔐 Authentication

- **Email/Password** sign up and sign in via Supabase Auth
- **Google OAuth** via Lovable Cloud managed social login
- Protected dashboard routes — unauthenticated users are redirected to `/auth`
- Row Level Security (RLS) on all database tables

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Available Scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start development server with HMR    |
| `npm run build`  | Production build                     |
| `npm run preview`| Preview production build locally     |
| `npm run lint`   | Run ESLint                           |
| `npm run test`   | Run tests with Vitest                |
| `npm run test:watch` | Run tests in watch mode          |

---

## 🎨 Design System

The app uses a custom dark theme with HSL-based CSS variables defined in `src/index.css`:

- **Fonts:** Inter (body) + Space Grotesk (headings)
- **Colors:** Purple-accent dark theme with glass-morphism effects
- **Effects:** Grid patterns, radial gradients, glow shadows, blurred glass cards
- **Animations:** Framer Motion page transitions, floating elements, pulse glows

All colors are tokenized as CSS custom properties and mapped through `tailwind.config.ts` for consistent theming.

---

## 📝 License

This project is private and not licensed for redistribution.
