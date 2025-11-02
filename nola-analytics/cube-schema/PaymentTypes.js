cube(`PaymentTypes`, {
  sql: `SELECT * FROM payment_types`,
  
  joins: {
    Payments: {
      sql: `${CUBE}.id = ${Payments}."paymentTypeId"`,
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
    
    description: {
      sql: `description`,
      type: `string`,
      title: `Tipo de Pagamento`
    }
  }
});
