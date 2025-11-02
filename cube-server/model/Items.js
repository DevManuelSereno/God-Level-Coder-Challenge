cube(`Items`, {
  sql: `SELECT * FROM items`,
  
  joins: {
    ItemProductSales: {
      sql: `${CUBE}.id = ${ItemProductSales}."itemId"`,
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
    
    brandId: {
      sql: `"brandId"`,
      type: `string`
    },
    
    categoryId: {
      sql: `"categoryId"`,
      type: `string`
    }
  }
});
