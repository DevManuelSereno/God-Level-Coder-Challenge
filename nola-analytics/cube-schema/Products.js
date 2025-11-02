cube(`Products`, {
  sql: `SELECT * FROM products`,
  
  measures: {
    count: {
      type: `count`,
      title: `Total de Produtos`
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
      title: `Nome do Produto`
    },
    
    categoryId: {
      sql: `"categoryId"`,
      type: `string`,
      title: `ID da Categoria`
    }
  }
});
