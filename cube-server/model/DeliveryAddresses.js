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
      type: `count`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true
    },
    
    saleId: {
      sql: `"saleId"`,
      type: `string`
    },
    
    street: {
      sql: `street`,
      type: `string`
    },
    
    number: {
      sql: `number`,
      type: `string`
    },
    
    complement: {
      sql: `complement`,
      type: `string`
    },
    
    neighborhood: {
      sql: `neighborhood`,
      type: `string`
    },
    
    city: {
      sql: `city`,
      type: `string`
    },
    
    state: {
      sql: `state`,
      type: `string`
    },
    
    postalCode: {
      sql: `"postalCode"`,
      type: `string`
    }
  }
});
