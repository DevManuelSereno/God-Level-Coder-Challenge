cube(`ItemProductSales`, {
  sql: `SELECT * FROM item_product_sales`,
  
  joins: {
    ProductSales: {
      sql: `${CUBE}."productSaleId" = ${ProductSales}.id`,
      relationship: `belongsTo`
    },
    
    Items: {
      sql: `${CUBE}."itemId" = ${Items}.id`,
      relationship: `belongsTo`
    },
    
    OptionGroups: {
      sql: `${CUBE}."optionGroupId" = ${OptionGroups}.id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      title: `Total de Customizações`
    },
    
    totalAdditionalRevenue: {
      sql: `price`,
      type: `sum`,
      format: `currency`,
      title: `Receita de Customizações`
    },
    
    avgAdditionalPrice: {
      sql: `price`,
      type: `avg`,
      format: `currency`,
      title: `Preço Médio de Customização`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true
    }
  }
});
