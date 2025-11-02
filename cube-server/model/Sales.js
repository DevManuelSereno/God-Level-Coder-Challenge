cube(`Sales`, {
  sql: `SELECT * FROM sales`,
  
  joins: {
    Channels: {
      sql: `${CUBE}."channelId" = ${Channels}.id`,
      relationship: `belongsTo`
    },
    Customers: {
      sql: `${CUBE}."customerId" = ${Customers}.id`,
      relationship: `belongsTo`
    },
    Products: {
      sql: `${CUBE}."productId" = ${Products}.id`,
      relationship: `belongsTo`
    },
    Stores: {
      sql: `${CUBE}."storeId" = ${Stores}.id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`
    },
    
    totalAmount: {
      sql: `"totalAmount"`,
      type: `sum`
    },
    
    avgAmount: {
      sql: `"totalAmount"`,
      type: `avg`
    },
    
    avgDeliveryTime: {
      sql: `"deliverySeconds"`,
      type: `avg`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true
    },
    
    channelId: {
      sql: `"channelId"`,
      type: `string`
    },
    
    customerId: {
      sql: `"customerId"`,
      type: `string`
    },
    
    productId: {
      sql: `"productId"`,
      type: `string`
    },
    
    storeId: {
      sql: `"storeId"`,
      type: `string`
    },
    
    orderDate: {
      sql: `"orderDate"`,
      type: `time`
    },
    
    createdAt: {
      sql: `"createdAt"`,
      type: `time`
    }
  }
});
