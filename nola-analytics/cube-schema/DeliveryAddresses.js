cube(`DeliveryAddresses`, {
  sql: `SELECT * FROM delivery_addresses`,
  
  joins: {
    Sales: {
      sql: `${CUBE}."saleId" = ${Sales}.id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      title: `Total de Entregas`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true
    },
    
    neighborhood: {
      sql: `neighborhood`,
      type: `string`,
      title: `Bairro`
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
    }
  }
});
