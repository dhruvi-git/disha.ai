# AI Career Coach - Setup Guide

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Clerk account (for authentication)
- Google API key (for Gemini AI)

## Step-by-Step Setup

### 1. Environment Configuration
A `.env.local` file has been created with placeholder values. Fill in your actual credentials:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/ai_career_coach
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
NEXT_PUBLIC_GOOGLE_API_KEY=your_key
```

### 2. Get Your API Keys

**Clerk Authentication:**
1. Go to https://dashboard.clerk.com
2. Create a new application
3. Copy your Publishable Key and Secret Key to `.env.local`

**Google Generative AI:**
1. Go to https://aistudio.google.com/apikey
2. Create a new API key
3. Add it to `NEXT_PUBLIC_GOOGLE_API_KEY` in `.env.local`

### 3. Database Setup

**Local PostgreSQL:**
```bash
# Windows - using PostgreSQL installer or WSL
psql -U postgres -c "CREATE DATABASE ai_career_coach;"
```

**Or use a cloud database (Railway, Supabase, etc.):**
- Update `DATABASE_URL` in `.env.local`

### 4. Push Database Schema
```bash
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Troubleshooting

**Dependencies Issue:**
```bash
npm audit fix
npm install
```

**Prisma Client:**
```bash
npx prisma generate
```

**Database Connection:**
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Test with: `npx prisma db execute --stdin < /dev/null`

## Scripts Available

- `npm run dev` - Start development server (with Turbopack)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Next.js 15** - React framework
- **Prisma** - ORM for database
- **PostgreSQL** - Database
- **Clerk** - Authentication
- **Google Generative AI** - AI features
- **Tailwind CSS** - Styling
- **Inngest** - Background jobs
- **Radix UI** - UI components
