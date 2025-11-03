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
    Stores: {
      sql: `${CUBE}."storeId" = ${Stores}.id`,
      relationship: `belongsTo`
    },
    ProductSales: {
      sql: `${CUBE}.id = ${ProductSales}."saleId"`,
      relationship: `hasMany`
    },
    Payments: {
      sql: `${CUBE}.id = ${Payments}."saleId"`,
      relationship: `hasMany`
    },
    DeliveryAddresses: {
      sql: `${CUBE}.id = ${DeliveryAddresses}."saleId"`,
      relationship: `hasOne`
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
    
    storeId: {
      sql: `"storeId"`,
      type: `string`
    },
    
    saleStatusDesc: {
      sql: `"saleStatusDesc"`,
      type: `string`,
      title: `Status da Venda`
    },
    
    createdAt: {
      sql: `"createdAt"`,
      type: `time`
    }
  }
});
