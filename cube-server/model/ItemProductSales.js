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
    }
  },
  
  measures: {
    count: {
      type: `count`
    },
    
    totalAdditionalRevenue: {
      sql: `"additionalPrice"`,
      type: `sum`
    },
    
    totalRevenue: {
      sql: `price`,
      type: `sum`
    },
    
    totalQuantity: {
      sql: `quantity`,
      type: `sum`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true
    },
    
    productSaleId: {
      sql: `"productSaleId"`,
      type: `string`
    },
    
    itemId: {
      sql: `"itemId"`,
      type: `string`
    },
    
    optionGroupId: {
      sql: `"optionGroupId"`,
      type: `string`
    },
    
    observations: {
      sql: `observations`,
      type: `string`
    }
  }
});
