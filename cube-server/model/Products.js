cube(`Products`, {
  sql: `SELECT * FROM products`,
  
  joins: {
    Sales: {
      sql: `${CUBE}.id = ${Sales}."productId"`,
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
    
    category: {
      sql: `category`,
      type: `string`
    },
    
    price: {
      sql: `price`,
      type: `number`,
      format: `currency`
    }
  }
});
