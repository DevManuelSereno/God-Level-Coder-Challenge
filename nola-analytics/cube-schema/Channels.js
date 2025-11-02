cube(`Channels`, {
  sql: `SELECT * FROM channels`,
  
  measures: {
    count: {
      type: `count`,
      title: `Total de Canais`
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
      title: `Nome do Canal`
    },
    
    type: {
      sql: `type`,
      type: `string`,
      title: `Tipo`
    }
  }
});
