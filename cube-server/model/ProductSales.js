cube(`ProductSales`, {
  sql: `SELECT * FROM product_sales`,
  
  joins: {
    Sales: {
      sql: `${CUBE}."saleId" = ${Sales}.id`,
      relationship: `belongsTo`
    },
    Products: {
      sql: `${CUBE}."productId" = ${Products}.id`,
      relationship: `belongsTo`
    },
    // Multi-hop joins through Sales
    Channels: {
      sql: `${Sales}."channelId" = ${Channels}.id`,
      relationship: `belongsTo`
    },
    Stores: {
      sql: `${Sales}."storeId" = ${Stores}.id`,
      relationship: `belongsTo`
    },
    Customers: {
      sql: `${Sales}."customerId" = ${Customers}.id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`
    },
    
    totalRevenue: {
      sql: `"totalPrice"`,
      type: `sum`
    },
    
    avgRevenue: {
      sql: `"totalPrice"`,
      type: `avg`
    },
    
    totalQuantity: {
      sql: `quantity`,
      type: `sum`
    },
    
    avgPrice: {
      sql: `"totalPrice"`,
      type: `avg`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true
    },
    
    saleId: {
      sql: `"saleId"`,
      type: `string`
    },
    
    productId: {
      sql: `"productId"`,
      type: `string`
    },
    
    observations: {
      sql: `observations`,
      type: `string`
    }
  }
});
