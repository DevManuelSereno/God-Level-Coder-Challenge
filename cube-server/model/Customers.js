cube(`Customers`, {
  sql: `SELECT * FROM customers`,
  
  joins: {
    Sales: {
      sql: `${CUBE}.id = ${Sales}."customerId"`,
      relationship: `hasMany`
    }
  },
  
  measures: {
    count: {
      type: `count`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true
    },
    
    name: {
      sql: `name`,
      type: `string`
    },
    
    email: {
      sql: `email`,
      type: `string`
    },
    
    phone: {
      sql: `phone`,
      type: `string`
    },
    
    createdAt: {
      sql: `"createdAt"`,
      type: `time`
    }
  }
});
