cube(`Stores`, {
  sql: `SELECT * FROM stores`,
  
  measures: {
    count: {
      type: `count`,
      title: `Total de Lojas`
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
      title: `Nome da Loja`
    },
    
    city: {
      sql: `city`,
      type: `string`,
      title: `Cidade`
    },
    
    state: {
      sql: `state`,
      type: `string`,
      title: `Estado`
    },
    
    isActive: {
      sql: `"isActive"`,
      type: `boolean`,
      title: `Ativa`
    },
    
    isOwn: {
      sql: `"isOwn"`,
      type: `boolean`,
      title: `Própria`
    }
  }
});
