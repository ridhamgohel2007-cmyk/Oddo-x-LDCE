# 🌍 GlobeTrotter — Smart Multi-City Travel Planner

<div align="center">

![GlobeTrotter Banner](https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https/img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

**Design Your Next Journey. Track Travel Budgets. Share & Clone Public Itineraries.**

[Features](#-key-features) • [Tech Stack](#%EF%B8%8F-technology-stack) • [Getting Started](#-getting-started) • [Demo Credentials](#-demo-accounts) • [Project Structure](#-project-structure)

</div>

---

## ✨ Key Features

### 🗺️ 1. Multi-City Trip & Itinerary Builder
- **Custom Destination Route**: Add multiple city stops with arrival and departure dates.
- **Day-by-Day Activity Schedule**: Organize sightseeing, dining, accommodation, and transport experiences per day.
- **Visual Timelines**: Interactive itinerary interface with real-time budget calculation and duration tracking.

### 💰 2. Financial View & Cost Breakdown
- **Allocated vs Actual Spending**: Compare initial budget estimates against logged receipts in real time.
- **Category Cost Distribution**: Recharts-powered pie charts breaking down expenses into *Stay*, *Transport*, *Activities*, and *Meals*.
- **Smart Overbudget Alerts**: Instant warning banners when logged receipts exceed the trip budget.

### 📅 3. Interactive Calendar View
- **Visual Month Grid**: Overview showing scheduled trip dates, destination tags, and active timelines.
- **Month-by-Month Navigation**: Easily filter and view upcoming, ongoing, and completed trips across months.

### 🌐 4. Community Hub & Itinerary Cloning
- **Public Itinerary Sharing**: Share custom-crafted travel guides with the GlobeTrotter traveler community.
- **1-Click Trip Cloning**: Discover popular itineraries, view author reviews, and clone entire trip structures into your own account.
- **Engagement & Likes**: Like posts, search by destination keywords, and filter by top-copied itineraries.

### 🛡️ 5. Role-Based Admin Panel
- **User Management Table**: View registered travelers, email addresses, joined dates, and assigned roles.
- **KPI Metrics Dashboard**: Monitor total system users, active itineraries, logged community posts, and overall system activity.
- **Role Escalation**: Upgrade users to Administrator status or perform administrative moderation.

### 🎨 6. High-Contrast Premium UI/UX
- **Vibrant Modern Aesthetics**: Crisp typography, high-contrast text styling, gradient headings, and smooth micro-interactions.
- **Responsive Layout**: Seamless UI designed for desktop, tablet, and mobile browsers.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (TypeScript)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with [SQLite](https://www.sqlite.org/)
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

### 1. Clone the Repository
```bash
git clone https://github.com/ridhamgohel2007-cmyk/Oddo-x-LDCE.git
cd Oddo-x-LDCE
```

---

### 2. Backend Setup (`server/`)
```bash
# Navigate to backend folder
cd server

# Install dependencies
npm install

# Create local environment configuration (.env)
# Create a .env file inside server/ with the following content:
# PORT=5000
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="globetrotter_super_secret_jwt_key_2026"

# Run Prisma migrations & push schema to SQLite
npx prisma db push

# Seed demo travel data and user accounts
npx ts-node prisma/seed.ts

# Start backend server in development mode
npm run dev:server
```
> Server will start listening on `http://localhost:5000`

---

### 3. Frontend Setup (`client/`)
Open a new terminal window in the root directory:

```bash
# Navigate to frontend folder
cd client

# Install dependencies
npm install

# Start Vite development client
npm run dev:client
```
> Web Application will open at `http://localhost:3000`

---

## 🔑 Demo Accounts

Use these pre-seeded credentials to explore the platform:

| User Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@globetrotter.com` | `admin123` | ADMIN |
| **Demo Traveler** | `john@example.com` | `password123` | USER |

---

## 📁 Project Structure

```
Oddo-x-LDCE/
├── client/                     # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI components (CityCard, TripCard, ActivityCard, StatusBadge, Layout)
│   │   ├── context/            # Global Auth & Theme contexts
│   │   ├── lib/                # Axios API client configuration
│   │   ├── pages/              # Main application pages
│   │   │   ├── AdminDashboard.tsx # Role-based admin panel & KPI analytics
│   │   │   ├── BudgetPage.tsx     # Cost breakdown, charts & expense logging
│   │   │   ├── CalendarView.tsx   # Timeline month grid view
│   │   │   ├── Community.tsx      # Public posts & trip cloning hub
│   │   │   ├── CreateTrip.tsx     # Trip initiation form
│   │   │   ├── Dashboard.tsx      # Traveler home & regional selections
│   │   │   ├── ItineraryBuilder.tsx # Day-wise stop manager
│   │   │   ├── Login.tsx          # Authentication screen
│   │   │   ├── MyTrips.tsx        # User trip listing (Ongoing, Upcoming, Completed)
│   │   │   └── SearchPage.tsx     # Destination catalog & activity filters
│   │   ├── App.tsx             # Route definitions & guards
│   │   └── main.tsx            # React application entry point
│   ├── package.json
│   └── vite.config.ts          # API Proxy configuration (/api -> localhost:5000)
│
├── server/                     # Node.js + Express Backend Server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema definition
│   │   └── seed.ts             # Demo data seeder script
│   ├── src/
│   │   ├── middleware/         # Auth & RBAC access control middleware
│   │   ├── routes/             # REST API Endpoints (/auth, /trips, /cities, /expenses, /community, /admin)
│   │   └── server.ts           # Express server setup & database connection
│   └── package.json
└── README.md
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">

Made with ❤️ for passionate travelers worldwide.

</div>
