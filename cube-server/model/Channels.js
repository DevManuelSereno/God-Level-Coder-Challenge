cube(`Channels`, {
  sql: `SELECT * FROM channels`,
  
  joins: {
    Sales: {
      sql: `${CUBE}.id = ${Sales}."channelId"`,
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
    }
  }
});
