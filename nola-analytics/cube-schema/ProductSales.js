cube(`ProductSales`, {
  sql: `SELECT * FROM product_sales`,
  
  joins: {
    Sales: {
      sql: `${CUBE}."saleId" = ${Sales}.id`,
      relationship: `belongsTo`
    },
    
    Products: {
      sql: `${CUBE}."productId" = ${Products}.id`,
      relationship: `belongsTo`
    },
    
    ItemProductSales: {
      sql: `${CUBE}.id = ${ItemProductSales}."productSaleId"`,
      relationship: `hasMany`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      title: `Total de Produtos Vendidos`
    },
    
    totalQuantity: {
      sql: `quantity`,
      type: `sum`,
      title: `Quantidade Total`
    },
    
    totalRevenue: {
      sql: `"totalPrice"`,
      type: `sum`,
      format: `currency`,
      title: `Receita de Produtos`
    },
    
    avgPrice: {
      sql: `"totalPrice"`,
      type: `avg`,
      format: `currency`,
      title: `Preço Médio`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true
    },
    
    observations: {
      sql: `observations`,
      type: `string`,
      title: `Observações`
    }
  }
});
