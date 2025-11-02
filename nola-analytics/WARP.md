# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Nola Analytics Platform** - A customizable analytics platform ("Power BI for Restaurants") that enables restaurant owners to explore operational data and answer complex business questions.

**Target User:** Restaurant owners who need to analyze sales data, delivery performance, customer behavior, and operational metrics across multiple channels (in-store, iFood, Rappi, proprietary app).

**Repository:** https://github.com/lucasvieira94/nola-god-level

**Deadline:** November 3, 2025

## Technology Stack

### Unified Architecture Decision

**Backend & Frontend:** Next.js 14+ (App Router) with TypeScript

**Why Next.js as unified stack:**
- ✅ Single codebase for frontend + backend API = faster development
- ✅ Simplified deployment (one service instead of two)
- ✅ Type safety end-to-end with TypeScript
- ✅ Server Components for optimal performance
- ✅ Built-in API routes for dashboard persistence
- ✅ Perfect for the deadline (03/11/2025)
- ✅ Vercel deployment is zero-config and free

### Database
- **PostgreSQL** - Contains 500k sales records over 6 months, 50 stores, multiple sales channels
- **Recommended provider:** Neon (free tier with generous limits)
- **ORM:** Prisma (for dashboard configurations storage)

### Analytics Layer (The Brain)
- **Cube.js Server** - Semantic layer that connects to PostgreSQL, creates metrics/dimensions schema, generates high-performance REST/GraphQL API
- Handles complex SQL generation, caching, and pre-aggregations
- **Recommended:** Cube Cloud (free tier) to avoid self-hosting complexity

### Backend (Integrated with Next.js)
- **Next.js 14+ App Router** - TypeScript-based
- **API Routes:** `/app/api/dashboards/*` for CRUD operations
- **ORM:** Prisma for type-safe database access
- **Server Actions:** For mutations (optional, alternative to API routes)

### Frontend
- **Framework:** Next.js 14+ with TypeScript
- **Styling:** Tailwind CSS (utility-first, fast prototyping)
- **Charts:** recharts (simpler) or nivo (more polished)
- **Layout:** react-grid-layout (drag-and-drop dashboards)
- **Data Client:** @cubejs-client/react (consumes Cube.js API)
- **Components:** React Server Components + Client Components

### Deployment Platforms
- **PostgreSQL:** Neon (recommended) / Railway / Supabase
- **Cube.js Server:** Cube Cloud (recommended) / Render
- **Next.js:** Vercel (optimized for Next.js, zero-config)

## Development Commands

### Database Setup
```powershell
# Run data generation script to populate PostgreSQL locally
# (Command will be added once data generation script is available)
```

### Cube.js Server
```powershell
# Create new Cube.js project
npx cube-cli create -d postgres

# Start Cube.js development server
npm run dev
# Access Cube Playground at http://localhost:4000
```

### Next.js Application
```powershell
# Create Next.js project with TypeScript and Tailwind CSS
npx create-next-app@latest . --typescript --tailwind --app --eslint

# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Install Core Dependencies
```powershell
# Cube.js client for data fetching
npm install @cubejs-client/core @cubejs-client/react

# Prisma for database ORM
npm install prisma @prisma/client
npx prisma init

# Chart library (choose one)
npm install recharts
# OR for more advanced charts:
npm install @nivo/core @nivo/bar @nivo/line @nivo/pie

# Dashboard layout (drag-and-drop)
npm install react-grid-layout
npm install --save-dev @types/react-grid-layout

# Tailwind CSS plugins (optional but useful)
npm install @tailwindcss/forms @tailwindcss/typography
```

## Architecture & Key Concepts

### Three-Layer Architecture
1. **Data Layer (PostgreSQL)** - Raw operational data (sales, products, stores, customers, channels)
2. **Semantic Layer (Cube.js)** - Business logic, metrics definitions, dimensions, relationships
3. **Presentation Layer (Next.js + React + TypeScript + Tailwind)** - User interface, dashboard builder, visualizations

### Stack Integration
```
PostgreSQL (Neon)
    ↓
Cube.js (Cube Cloud) - Analytics API
    ↓
Next.js 14+ App Router (TypeScript)
    ├── /app/api/* - API Routes (dashboard CRUD)
    ├── /app/(dashboard)/* - Dashboard pages
    ├── /components/* - React components
    ├── /lib/* - Utilities, Prisma client, Cube.js client
    └── Tailwind CSS - Styling
```

### Cube.js Schema Structure
- **Measures** - Aggregated calculations (totalRevenue, countOrders, avgDeliveryTime)
- **Dimensions** - Attributes for filtering/grouping (productName, channelName, storeRegion, orderDate)
- **Joins** - Relationships between cubes (Sales -> Products, Sales -> Stores, Sales -> Channels)
- Schema files are in `.js` format in the `schema/` directory

### Data Flow
```
PostgreSQL → Cube.js Server → API (REST/GraphQL) → @cubejs-client/react → React Components → recharts/nivo
```

### Dashboard Persistence
- Dashboard configurations stored as JSON in PostgreSQL
- JSON structure includes: layout positions, chart types, selected metrics/dimensions, time ranges
- API routes: `POST /api/dashboards` (save), `GET /api/dashboards` (load)

## Development Phases

### Phase 1: Setup & Data Modeling (Current Priority)
1. Setup PostgreSQL with generated data (500k sales records)
2. Initialize Cube.js project with PostgreSQL connection
3. Define Cube.js schema:
   - Create measures (totalRevenue, countOrders, etc.)
   - Create dimensions (productName, channelName, storeRegion, etc.)
   - Define joins between cubes
4. Validate using Cube Playground to answer key business questions:
   - "Which product sells most on Thursday nights on iFood?"
   - "My delivery time worsened. In which regions?"
   - "Which customers bought 3+ times but haven't returned in 30 days?"

### Phase 2: Frontend Proof of Concept
1. Initialize Next.js project
2. Install and configure @cubejs-client/react
3. Render first static chart (e.g., Sales by Channel) to validate React ↔ Cube.js connection

### Phase 3: Dashboard Builder (Core UX)
1. Create builder UI allowing users to:
   - Select chart type (line, bar, number/KPI)
   - Select metrics and dimensions dynamically
   - Select time period
2. Dynamic rendering using `useCubeQuery` hook
3. Integrate react-grid-layout for drag-and-drop positioning

### Phase 4: Persistence & Deployment
1. Create Next.js API routes for dashboard CRUD operations
2. Create PostgreSQL table for storing dashboard configurations
3. Deploy all services (PostgreSQL, Cube.js, Next.js)

## Key Business Questions to Answer

The platform must enable answering questions like:
- "Which product sells most on [day] at [time] on [channel]?"
- "My delivery time worsened. In which regions?"
- "Which customers bought 3+ times but haven't returned in 30 days?"
- Revenue trends by time period, channel, region
- Peak hours and best-selling products

## Evaluation Criteria

- Architectural thinking and technical decisions
- Solution quality for user problems
- Performance and scalability
- UX and usability
- Work methodology and delivery

## Deliverables

1. Working solution (deployed or local)
2. Architectural decisions documentation
3. Demo video (5-10 min) explaining approach
4. Well-written, testable code

**Submission to:** gsilvestre@arcca.io
- Repository link
- Demo video link
- Deployment link (optional but valued)
- Architectural decisions document

## Support

- Discord: https://discord.gg/z8pVH26j
- Email: gsilvestre@arcca.io
- Phone: (11) 93016-3509

## Notes

- Full freedom to choose technologies, architecture, and AI/code generation tools
- Focus on delivering value to "Maria" (restaurant owner persona)
- Prioritize usability - the platform should be intuitive for non-technical users
- Performance matters - handling 500k records efficiently
