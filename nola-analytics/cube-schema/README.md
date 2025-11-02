# Cube.js Schema Files

This directory contains the Cube.js schema definitions for the Nola Analytics platform.

## Setup Instructions

### Option 1: Use Cube Cloud (Recommended for Production)

1. Sign up at https://cube.dev/cloud
2. Create a new deployment
3. Connect to your PostgreSQL database (user: postgres, password: 1234, database: Nola)
4. Upload these schema files to your Cube Cloud deployment
5. Copy the API URL and Secret to your `.env` file:
   ```
   NEXT_PUBLIC_CUBEJS_API_URL="https://your-deployment.cubecloud.dev/cubejs-api/v1"
   NEXT_PUBLIC_CUBEJS_API_SECRET="your-secret-token"
   ```

### Option 2: Run Cube.js Server Locally

1. Install Cube.js CLI globally:
   ```powershell
   npm install -g cubejs-cli
   ```

2. Create a new Cube.js project in a separate directory:
   ```powershell
   cd ..
   cubejs create cube-server -d postgres
   cd cube-server
   ```

3. Configure the database connection in `cube-server/.env`:
   ```
   CUBEJS_DB_TYPE=postgres
   CUBEJS_DB_HOST=localhost
   CUBEJS_DB_PORT=5432
   CUBEJS_DB_NAME=Nola
   CUBEJS_DB_USER=postgres
   CUBEJS_DB_PASS=1234
   CUBEJS_API_SECRET=mysecrettoken
   ```

4. Copy the schema files from this directory to `cube-server/schema/`:
   ```powershell
   Copy-Item C:\Users\GAMER\OneDrive\Documentos\Faculdade\nola-analytics\nola-analytics\cube-schema\*.js C:\path\to\cube-server\schema\
   ```

5. Start the Cube.js development server:
   ```powershell
   npm run dev
   ```

6. The Cube.js server will be available at http://localhost:4000
   - API: http://localhost:4000/cubejs-api/v1
   - Playground: http://localhost:4000

## Schema Files

- **Sales.js** - Main sales cube with measures for revenue, quantity, delivery time
- **Products.js** - Product catalog with categories and prices
- **Stores.js** - Store locations with regions and cities
- **Channels.js** - Sales channels (In-Store, iFood, Rappi, Proprietary App)
- **Customers.js** - Customer information

## Key Features

### Sales Cube Measures
- `count` - Total number of orders
- `totalAmount` - Total revenue
- `avgAmount` - Average order value
- `totalQuantity` - Total items sold
- `avgDeliveryTime` - Average delivery time (excludes in-store orders)

### Dimensions for Analysis
- `orderDate` - Time-based analysis
- `dayOfWeek` - Day-of-week patterns
- `hourOfDay` - Hourly patterns
- Product name, category, price
- Store region, city, state
- Channel name

### Pre-aggregations
The Sales cube includes pre-aggregations for better performance on large datasets.

## Testing Queries

Once your Cube.js server is running, you can test queries in the Playground (http://localhost:4000) or use these examples:

### Total Revenue by Channel
```json
{
  "measures": ["Sales.totalAmount"],
  "dimensions": ["Channels.name"]
}
```

### Orders Over Time
```json
{
  "measures": ["Sales.count"],
  "timeDimensions": [{
    "dimension": "Sales.orderDate",
    "granularity": "day",
    "dateRange": "Last 30 days"
  }]
}
```

### Top Products by Revenue
```json
{
  "measures": ["Sales.totalAmount", "Sales.count"],
  "dimensions": ["Products.name"],
  "order": { "Sales.totalAmount": "desc" },
  "limit": 10
}
```
