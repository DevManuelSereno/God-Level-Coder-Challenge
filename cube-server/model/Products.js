cube(`Products`, {
  sql: `SELECT * FROM products`,
  
  joins: {
    ProductSales: {
      sql: `${CUBE}.id = ${ProductSales}."productId"`,
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
    
    categoryId: {
      sql: `"categoryId"`,
      type: `string`
    }
  }
});
