cube(`Stores`, {
  sql: `SELECT * FROM stores`,
  
  joins: {
    Sales: {
      sql: `${CUBE}.id = ${Sales}."storeId"`,
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
    
    
    city: {
      sql: `city`,
      type: `string`
    },
    
    state: {
      sql: `state`,
      type: `string`
    }
  }
});
