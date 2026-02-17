# 🚀 Disha AI: AI Powered Career Coach

An AI-powered career intelligence platform that provides personalized industry insights, salary trends, and skill recommendations tailored to users in the Indian job market.

Built using a modern full-stack architecture with Next.js, Prisma, Neon PostgreSQL, Clerk authentication, and Google Gemini AI.

---

# 📌 Features

* 🔐 Secure authentication with Clerk
* 🧠 AI-generated industry insights using Google Gemini
* 📊 Salary trend analysis (INR - Lakhs Per Annum)
* 📈 Market growth & demand analysis
* 🎯 Personalized skill recommendations
* 🗂 PostgreSQL database with Prisma ORM
* ⚡ Server Actions (No separate backend required)
* 🎨 Modern UI built with Tailwind CSS

---

# 🏗 Tech Stack

## Frontend & Fullstack Framework

* **Next.js 15 (App Router + Server Components)**

  * Handles routing, UI rendering, and backend logic
  * Uses Server Actions instead of REST APIs

## Language

* **JavaScript (ES Modules)**

## Styling

* **Tailwind CSS**

## Authentication

* **Clerk**

  * User authentication
  * Session management
  * Secure route protection

## Database

* **PostgreSQL**
* Hosted on **Neon (Serverless Postgres)**

## ORM

* **Prisma**

  * Database schema management
  * Type-safe database queries
  * Migration handling

## AI Integration

* **Google Gemini API (@google/generative-ai)**

  * Industry trend analysis
  * Salary range generation
  * Skill recommendations
  * Market outlook insights

## Runtime

* **Node.js**

---

# 🧠 System Architecture

```
User → Clerk Auth → Next.js Server Action → Prisma → Neon PostgreSQL
                                   ↓
                               Google Gemini AI
```

---

# 🗂 Project Structure

```
ai-career-coach/
│
├── app/                 # Next.js App Router pages
│   ├── dashboard/
│   ├── onboarding/
│   └── layout.jsx
│
├── actions/             # Server Actions (business logic)
│   ├── user.js
│   └── dashboard.js
│
├── lib/
│   ├── prisma.js        # Prisma client
│   └── checkUser.js     # Auto user creation logic
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── .env
├── package.json
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory and add:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/dbname?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

---

# 🛠 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd ai-career-coach
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Setup Database

Apply Prisma migrations:

```bash
npx prisma migrate deploy
```

Or for fresh development:

```bash
npx prisma migrate dev
```

## 4️⃣ Run Development Server

```bash
npm run dev
```

App will run on:

```
http://localhost:3000
```

---

# 🔄 Application Flow

## Onboarding Flow

1. User signs in via Clerk
2. `checkUser()` creates DB user if not exists
3. User submits onboarding form
4. Profile is saved in PostgreSQL
5. AI generates industry insights (if not already stored)
6. User is redirected to dashboard

## Dashboard Flow

1. Fetch stored industry insights
2. Regenerate AI data if expired (7-day refresh logic)
3. Display salary, skills, growth trends

---

# 📊 Database Models (High-Level)

### User

* id
* clerkUserId
* email
* industry
* experience
* bio
* skills

### IndustryInsight

* id
* industry
* salaryRanges
* growthRate
* demandLevel
* topSkills
* marketOutlook
* keyTrends
* recommendedSkills
* nextUpdate

---

# 🚀 Deployment

Recommended platform: **Vercel**

Steps:

1. Push project to GitHub
2. Import into Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

---

# 🧩 Future Improvements

* Add subscription billing (Stripe)
* Add resume analysis feature
* Add AI-powered mock interviews
* Improve caching for AI responses
* Add analytics dashboard
* Optimize Gemini API usage & fallback handling

---

# 🧑‍💻 Author

Built as a modern AI SaaS-style full-stack application using 2025 best practices.

---

# 📄 License

This project is for educational and demonstration purposes.

---

# ⭐ Summary

AI Career Coach is a production-style full-stack AI application that combines authentication, database management, and generative AI to deliver personalized career insights for the Indian job market.

Built with scalability, modularity, and modern architecture in mind.
