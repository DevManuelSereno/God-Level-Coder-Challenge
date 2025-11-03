cube(`Payments`, {
  sql: `SELECT * FROM payments`,
  
  joins: {
    Sales: {
      sql: `${CUBE}."saleId" = ${Sales}.id`,
      relationship: `belongsTo`
    },
    PaymentTypes: {
      sql: `${CUBE}."paymentTypeId" = ${PaymentTypes}.id`,
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
    
    totalValue: {
      sql: `value`,
      type: `sum`
    },
    
    avgValue: {
      sql: `value`,
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
    
    paymentTypeId: {
      sql: `"paymentTypeId"`,
      type: `string`
    },
    
    isOnline: {
      sql: `"isOnline"`,
      type: `boolean`
    }
  }
});
