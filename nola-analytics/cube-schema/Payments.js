cube(`Payments`, {
  sql: `SELECT * FROM payments`,
  
  joins: {
    Sales: {
      sql: `${CUBE}."saleId" = ${Sales}.id`,
      relationship: `belongsTo`
    },
    
    PaymentTypes: {
      sql: `${CUBE}."paymentTypeId" = ${PaymentTypes}.id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      title: `Total de Pagamentos`
    },
    
    totalValue: {
      sql: `value`,
      type: `sum`,
      format: `currency`,
      title: `Valor Total de Pagamentos`
    },
    
    avgValue: {
      sql: `value`,
      type: `avg`,
      format: `currency`,
      title: `Valor Médio de Pagamento`
    },
    
    onlineCount: {
      type: `count`,
      filters: [{
        sql: `${CUBE}."isOnline" = true`
      }],
      title: `Pagamentos Online`
    },
    
    offlineCount: {
      type: `count`,
      filters: [{
        sql: `${CUBE}."isOnline" = false`
      }],
      title: `Pagamentos Presenciais`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true
    },
    
    isOnline: {
      sql: `"isOnline"`,
      type: `boolean`,
      title: `É Online`
    }
  }
});
