cube(`Customers`, {
  sql: `SELECT * FROM customers`,
  
  measures: {
    count: {
      type: `count`,
      title: `Total de Clientes`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true
    },
    
    customerName: {
      sql: `"customerName"`,
      type: `string`,
      title: `Nome`
    },
    
    email: {
      sql: `email`,
      type: `string`,
      title: `Email`
    },
    
    phoneNumber: {
      sql: `"phoneNumber"`,
      type: `string`,
      title: `Telefone`
    },
    
    birthDate: {
      sql: `"birthDate"`,
      type: `time`,
      title: `Data de Nascimento`
    }
  }
});
