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
      type: `count`,
      title: `Total de Items`
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
      type: `string`,
      title: `Nome do Item`
    }
  }
});
