# 🌍 GlobeTrotter — Empowering Personalized Travel Planning

> **Odoo × LDCE Hackathon Project**  
> **Team Name:** Alpha Protocol  
> **Product Name:** GlobeTrotter  

GlobeTrotter is a full-stack, production-grade travel planning web application built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase**. It empowers travelers to create multi-city itineraries, manage daily activities, track trip budgets, discover global destinations, and share public travel plans seamlessly.

---

## ✨ Features

- **🔐 Supabase Authentication & User Profiles**
  - Email/Password Authentication & User Session Management.
  - Automatic profile generation and personalized travel preferences (`profiles`, `profile_preferences`).

- **🗺️ Multi-City Trip Planner**
  - Custom trip creation with date pickers, multi-city selection, budget estimations, and custom cover image uploads.
  - Dynamic status tracking (`upcoming`, `active`, `completed`, `draft`) with planning progress percentage.

- **📅 Interactive Day-by-Day Itineraries**
  - Automatically generates daily itineraries based on trip start/end date ranges.
  - Add, edit, remove, and reorder activities with custom notes and costs.

- **💰 Comprehensive Budget & Expense Tracker**
  - Track category breakdown expenses (Food, Accommodation, Transport, Activities, Flights, Misc).
  - Financial analytics and real-time expense calculations compared against target budgets.

- **📊 Dynamic Travel Analytics & Insights**
  - Calculates unique countries visited, planned budget totals, upcoming adventures, and total trip counts in real-time.
  - AI-assisted travel recommendations, packing checklists, and safety advisories.

- **🔗 Public Itinerary Sharing**
  - Toggle trip privacy and generate unique shareable public URLs (`/shared/[slug]`).
  - Allows friends and family to view public travel plans without logging in.

- **🔍 Global Search & Exploration**
  - Instant real-time search across Trips, Destinations (city, country, region), and Activities.
  - Filter destinations by popularity, rating, budget tier, and category.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database & Auth:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`)
- **Database Engine:** PostgreSQL with Row Level Security (RLS)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayushpatel2007/odoo-alpha-protocol.git
   cd odoo-alpha-protocol
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

---

## 🗄️ Database Setup (Supabase SQL Migrations)

To set up your live database on Supabase:

1. Go to your **[Supabase Dashboard](https://supabase.com/dashboard)** → **SQL Editor**.
2. Run the migration scripts in order:

   - **`supabase/migrations/001_initial_globetrotter_schema.sql`**  
     *Creates `profiles`, `profile_preferences`, `trips`, `destinations`, `trip_destinations`, `saved_destinations` tables, storage buckets (`avatars`, `trip-covers`), and RLS policies.*

   - **`supabase/migrations/002_itinerary_activity_budget_sharing.sql`**  
     *Creates `trip_days`, `activities`, `trip_activities`, `expenses` tables and sharing fields (`share_slug`, `is_public`).*

   - **`supabase/seed.sql` & `supabase/seed_part2.sql`**  
     *Populates the master destinations catalog (Paris, Tokyo, Dubai, London, Singapore, Rome, Bali, Bangkok, Mumbai, New Delhi) and activity choices.*

---

## 🏃 Running the Project

### Development Server

Run the development server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Type Checking & Linting

```bash
npx tsc --noEmit
npm run lint
```

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Repository Structure

```text
GlobeTrotter/
├── app/                      # Next.js 14 App Router pages & API routes
│   ├── dashboard/            # User Dashboard with Analytics
│   ├── explore/              # Destinations & Activities Search
│   ├── login/                # Sign In page
│   ├── profile/              # User Profile page
│   ├── register/             # Registration page
│   ├── shared/[slug]/        # Public Shareable Itinerary view
│   ├── trips/                # Trips listing & creation
│   └── trips/[id]/           # Trip Details (Itinerary, Budget, Insights)
├── components/               # Reusable React UI Components
│   ├── auth/                 # Auth Context Provider
│   ├── budget/               # Budget & Expense components
│   ├── dashboard/            # Dashboard Analytics & Widgets
│   ├── itinerary/            # Day-by-Day Itinerary components
│   ├── layout/               # App Shell, TopNavbar, Sidebar
│   ├── sharing/              # Share Button & Modal
│   └── trips/                # Trip Cards & Badges
├── lib/                      # Helper Libraries & API Clients
│   ├── api/                  # API Layer (trips, destinations, budget, auth)
│   ├── mock-data/            # Catalog Seed Data
│   └── supabase/             # Supabase Client, Server & Config helpers
├── supabase/                 # Database Migrations & Seeds
│   ├── migrations/           # DDL SQL Schema files
│   └── seed.sql              # Database seed data
└── README.md
```

---

## 🏆 Hackathon Submission Details

- **Hackathon:** Odoo × LDCE Hackathon
- **Team Name:** Alpha Protocol
- **Product Name:** GlobeTrotter
- **Tagline:** Empowering Personalized Travel Planning

---

## 📄 License

This project is open-source and created for the Odoo × LDCE Hackathon.
