# 🌍 GlobeTrotter — Smart Multi-City Travel & Expense Management Platform

<div align="center">

<img src="client/public/globetrotter-banner.jpg" alt="GlobeTrotter Banner" width="600" style="border-radius: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);" />

<br />
<br />

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

**Design Multi-City Journeys • Track Travel Budgets & Log Expenses • Share & Fork Community Routes • Role-Based Executive Monitoring**

[Key Features](#-key-features) • [RBAC Role Comparison](#-role-based-access-control-rbac) • [Tech Stack](#%EF%B8%8F-technology-stack) • [Getting Started](#-getting-started) • [Future Scope & Roadmap](#-future-scope--roadmap) • [Demo Accounts](#-demo-accounts)

</div>

---

## ✨ Key Features

### 🗺️ 1. Multi-City Itinerary Builder & Stop Reordering
- **Custom City Stops**: Add multiple destination stops with constrained arrival/departure dates (`min`/`max` auto-validation).
- **Stop Reordering & Budget Allocation**: Up (`▲`) and Down (`▼`) stop reordering controls with live budget progress bars.
- **Searchable Combobox & Cover Photo Gallery**: 6-preset Unsplash travel gallery or custom image URL picker with live thumbnail previews.

### 💰 2. Dynamic Budget Tracker & Expense Logging
- **Allocated vs Actual Spend**: Real-time progress bar tracking total allocated budget vs logged receipts with remaining balance.
- **Recharts Expense Distribution**: Donut & Area chart visualizations categorized into *Stays*, *Transfers*, *Activities*, and *Meals*.
- **Interactive Expense Logger**: Log expenses on the fly with live Donut chart synchronization and instant toast notifications.

### 📅 3. Google Calendar Timeline View
- **Google Calendar Top Bar**: Integrated `[Today]` button, chevron month navigators, and active view switcher (`Month`, `Week`, `Day`, `Agenda`).
- **7-Column Calendar Grid Matrix**: Exact leading and trailing date offsets (July starts Wednesday, September starts Tuesday) with faded numbers and active today circle badges (`#714B67`).
- **Category-Colored Event Chips**: Visual schedule chips for stays, transfers, activities, and meals with hover `+ Add Event` modal triggers.

### 🌐 4. Community Hub & 1-Click Trip Forking
- **Public Itinerary Sharing**: Explore curated community guides with multi-city tag pills (`New Delhi`, `Agra`, `Jaipur`).
- **1-Click Trip Cloning**: Fork popular community itineraries directly into personal traveler accounts with single-click cloning.

### 🛡️ 5. Executive Admin & Analytics Dashboard
- **Platform Analytics**: Total users, total trips created, catalog growth, and community fork rates.
- **Growth Trend Area Chart**: Unclipped SVG canvas padding (`margin={{ top: 25 }}`), Y-axis max padding, and smooth projected August volume.
- **Top Destination Donut Chart**: Centered donut chart (`cy="42%"`) with inner hole label displaying `35 Cities`.
- **User Directory Table & Safety Deletion Modal**: Clarified header count (`Showing 7 of 8 users`), pagination footer bar, and safety confirmation modals.

---

## 🛡️ Role-Based Access Control (RBAC)

Built specifically for the **Odoo Hackathon Travel & Expense Management Workflow**, GlobeTrotter enforces strict RBAC separation between **Travelers** and **Administrators**:

| Feature Area | 🎒 **Traveler Persona View** | 🛡️ **Admin (Manager) Persona View** |
| --- | --- | --- |
| **Primary Top Navigation** | `Dashboard` • `My Trips` • `Explore Destinations` • `Community Hub` • `Calendar View` | `Overview` • `All Trips & Approvals` • `Destination Master` • `User Management` • `Admin Analytics` |
| **Profile Badge** | Standard Traveler Avatar | **`🛡️ ADMIN BADGE`** tag with purple highlight |
| **Hero Welcome Banner** | *"Welcome back, Jiyan! Track countdowns & budgets"* | *"System Status: Healthy • 8 Users • 35 Active Cities"* |
| **Primary Quick CTAs** | `[+ Plan New Trip]`, `[Export Itinerary]` | `[⚡ Executive Admin Panel]`, `[+ Add Destination]`, `[Audit Report]` |
| **Financial Widgets** | Personal Allocated Budget vs Logged Receipts | **Total Gross Platform Volume (`₹12,85,000`)**, Avg Spend (`₹1,83,571`), Booked Items |
| **Activity Stream** | Personal Upcoming Trips & Packing List | **Real-Time Traveler Activity Feed Across All Users** |
| **Destination Catalog** | `[+ Add Destination]` to personal itinerary | **`[✏️ Edit City Data]`**, **`[💰 Update Pricing Tier]`**, **`[+ Add New City]`** |

> 💡 **Hackathon Demo Feature**: Click the **`Role: [ Traveler ▾ / Admin ]`** toggle pill in the top header to switch personas instantly without logging out!

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

## 🔮 Future Scope & Roadmap

```
  ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
  │  AI Route Generator    │ ───► │ Live Flight/Hotel APIs │ ───► │ Splitwise Expense Engine│
  └────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

1. **🤖 AI-Powered Itinerary Generator (LLM Integration)**
   - Integration with Gemini AI to generate auto-populated day-wise itineraries based on travel budget, duration, and vibe preference.
2. **✈️ Real-Time Flight & Hotel Booking API Integration**
   - Live integration with Amadeus / Sabre / Booking.com APIs for real-time price comparisons and direct voucher generation.
3. **💸 Splitwise-Style Group Expense & Multi-Currency Settlement Engine**
   - Peer-to-peer expense splitting between co-travelers with automatic currency conversion and settlement balances.
4. **📱 Offline-First PWA & Mobile Native Support**
   - Progressive Web App (PWA) offline support for viewing trip vouchers and interactive maps without internet connection.
5. **🏢 Odoo ERP Expense Module Connector**
   - Seamless REST API synchronization with Odoo ERP for automated corporate travel policy compliance and receipt voucher verification.

---

## 🚀 Getting Started

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

# Create environment configuration (.env)
# Create a .env file inside server/ with:
# PORT=5000
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="globetrotter_super_secret_jwt_key_2026"

# Push schema to SQLite
npx prisma db push

# Seed demo travel data and user accounts
npx ts-node prisma/seed.ts

# Start backend server
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

# Start Vite client
npm run dev:client
```
> Web Application will open at `http://localhost:3000`

---

## 🔑 Demo Accounts

Use these credentials to test the platform:

| User Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@globetrotter.com` | `password123` | ADMIN |
| **Traveler (Jiyan Mansuri)** | `jiyan@globetrotter.com` | `password123` | USER |
| **Traveler (Elena Rostova)** | `elena@globetrotter.com` | `password123` | USER |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">

Made with ❤️ for passionate travelers worldwide.

</div>
