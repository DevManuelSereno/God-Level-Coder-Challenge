# Nola Analytics Platform

**"Power BI for Restaurants"** - A customizable analytics platform that enables restaurant owners to explore operational data and answer complex business questions.

## 🎯 Project Overview

Target User: Restaurant owners who need to analyze sales data, delivery performance, customer behavior, and operational metrics across multiple channels (in-store, iFood, Rappi, proprietary app).

**Deadline:** November 3, 2025

## 🚀 Technology Stack

- **Frontend & Backend:** Next.js 14+ (App Router) with TypeScript
- **Database:** PostgreSQL (Neon recommended)
- **Analytics Layer:** Cube.js Server (Cube Cloud recommended)
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Charts:** recharts
- **Layout:** react-grid-layout

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Cube.js server (local or Cube Cloud)

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```powershell
git clone <repository-url>
cd nola-analytics
npm install
```

### 2. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nola_analytics?schema=public"

# Cube.js API
NEXT_PUBLIC_CUBEJS_API_URL="http://localhost:4000/cubejs-api/v1"
NEXT_PUBLIC_CUBEJS_API_SECRET="your-cubejs-secret"
```

### 3. Setup Database

```powershell
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 4. Setup Cube.js Server

#### Option A: Local Development

```powershell
# Create Cube.js project in a separate directory
npx cubejs-cli create cube-server -d postgres

# Navigate to cube-server directory
cd cube-server

# Configure database connection in .env
# DATABASE_URL=postgresql://user:password@localhost:5432/nola_analytics

# Start Cube.js server
npm run dev
# Server will be available at http://localhost:4000
```

#### Option B: Cube Cloud (Recommended for Production)

1. Sign up at [https://cube.dev/cloud](https://cube.dev/cloud)
2. Create a new deployment
3. Connect your PostgreSQL database
4. Copy the API URL and Secret to your Next.js `.env` file

### 5. Run Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Cube.js Schema Setup

Create schema files in your Cube.js project (`cube-server/schema/`) based on the Prisma models.

See `WARP.md` for detailed schema examples.

## 🗂️ Project Structure

```
nola-analytics/
├── app/
│   ├── api/
│   │   └── dashboards/          # Dashboard CRUD API routes
│   ├── dashboard/               # Dashboard pages
│   ├── layout.tsx
│   └── page.tsx                 # Home page
├── components/
│   ├── Chart.tsx                # Reusable chart component
│   └── DashboardGrid.tsx        # Dashboard layout with drag-and-drop
├── lib/
│   ├── cubejs.ts                # Cube.js client configuration
│   └── prisma.ts                # Prisma client
├── prisma/
│   └── schema.prisma            # Database schema
├── .env.example
├── WARP.md                      # Project guidance
└── README.md
```

## 🎨 Key Features

### 1. Custom Dashboards
- Drag-and-drop dashboard builder
- Multiple chart types (line, bar, pie, number, table)
- Customizable metrics and dimensions

### 2. Analytics Queries
The platform enables answering questions like:
- "Which product sells most on Thursday nights on iFood?"
- "My delivery time worsened. In which regions?"
- "Which customers bought 3+ times but haven't returned in 30 days?"
- Revenue trends by time period, channel, region

### 3. Dashboard Persistence
- Save dashboard configurations to PostgreSQL
- Load and edit existing dashboards
- Share dashboard URLs

## 🧪 Development Commands

```powershell
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Prisma commands
npx prisma studio              # Open Prisma Studio
npx prisma migrate dev         # Create and apply migration
npx prisma generate            # Generate Prisma Client
```

## 📦 API Endpoints

### Dashboards
- `GET /api/dashboards` - List all dashboards
- `POST /api/dashboards` - Create new dashboard
- `GET /api/dashboards/[id]` - Get specific dashboard
- `PUT /api/dashboards/[id]` - Update dashboard
- `DELETE /api/dashboards/[id]` - Delete dashboard

## 🚢 Deployment

### Vercel (Next.js)
```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Database (Neon)
1. Sign up at [https://neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

### Cube.js (Cube Cloud)
1. Sign up at [https://cube.dev/cloud](https://cube.dev/cloud)
2. Deploy your Cube.js schema
3. Update `NEXT_PUBLIC_CUBEJS_API_URL` and `NEXT_PUBLIC_CUBEJS_API_SECRET`

## 📝 Next Steps

1. **Populate Database**: Create a data generation script to populate 500k sales records
2. **Complete Cube.js Schema**: Define all cubes (Sales, Products, Stores, Channels, Customers)
3. **Dashboard Builder UI**: Implement interactive dashboard builder
4. **Advanced Features**: Add filters, time range selectors, and more chart types
5. **Testing**: Write tests for API routes and components
6. **Documentation**: Create demo video and architectural decisions document

## 🤝 Support

- Discord: [https://discord.gg/z8pVH26j](https://discord.gg/z8pVH26j)
- Email: gsilvestre@arcca.io
- Phone: (11) 93016-3509

## 📄 License

This project is part of the Nola Analytics challenge.

## 🎯 Deliverables

1. Working solution (deployed or local)
2. Architectural decisions documentation
3. Demo video (5-10 min) explaining approach
4. Well-written, testable code

**Submit to:** gsilvestre@arcca.io
