cube(`Sales`, {
  sql: `SELECT * FROM sales`,
  
  joins: {
    Stores: {
      sql: `${CUBE}."storeId" = ${Stores}.id`,
      relationship: `belongsTo`
    },
    
    Channels: {
      sql: `${CUBE}."channelId" = ${Channels}.id`,
      relationship: `belongsTo`
    },
    
    Customers: {
      sql: `${CUBE}."customerId" = ${Customers}.id`,
      relationship: `belongsTo`
    },
    
    ProductSales: {
      sql: `${CUBE}.id = ${ProductSales}."saleId"`,
      relationship: `hasMany`
    },
    
    Payments: {
      sql: `${CUBE}.id = ${Payments}."saleId"`,
      relationship: `hasMany`
    },
    
    DeliveryAddresses: {
      sql: `${CUBE}.id = ${DeliveryAddresses}."saleId"`,
      relationship: `hasOne`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      title: `Total de Vendas`,
      drillMembers: [id, createdAt]
    },
    
    totalAmount: {
      sql: `"totalAmount"`,
      type: `sum`,
      format: `currency`,
      title: `Receita Total`
    },
    
    avgAmount: {
      sql: `"totalAmount"`,
      type: `avg`,
      format: `currency`,
      title: `Ticket Médio`
    },
    
    totalAmountItems: {
      sql: `"totalAmountItems"`,
      type: `sum`,
      format: `currency`,
      title: `Receita de Itens`
    },
    
    totalDiscount: {
      sql: `"totalDiscount"`,
      type: `sum`,
      format: `currency`,
      title: `Total de Descontos`
    },
    
    totalDeliveryFee: {
      sql: `"deliveryFee"`,
      type: `sum`,
      format: `currency`,
      title: `Receita de Taxa de Entrega`
    },
    
    avgProductionTime: {
      sql: `"productionSeconds" / 60.0`,
      type: `avg`,
      title: `Tempo Médio de Produção (min)`,
      filters: [{
        sql: `${CUBE}."productionSeconds" IS NOT NULL`
      }]
    },
    
    avgDeliveryTimeSeconds: {
      sql: `"deliverySeconds"`,
      type: `avg`,
      title: `Tempo Médio de Entrega (segundos)`,
      filters: [{
        sql: `${CUBE}."deliverySeconds" IS NOT NULL`
      }]
    },
    
    avgDeliveryTime: {
      sql: `(SUM("deliverySeconds") / COUNT(CASE WHEN "deliverySeconds" IS NOT NULL THEN 1 END)) / 60.0`,
      type: `number`,
      title: `Tempo Médio de Entrega (min)`
    },
    
    cancelledCount: {
      type: `count`,
      filters: [{
        sql: `${CUBE}."saleStatusDesc" = 'Cancelado'`
      }],
      title: `Vendas Canceladas`
    },
    
    completedCount: {
      type: `count`,
      filters: [{
        sql: `${CUBE}."saleStatusDesc" = 'Concluído'`
      }],
      title: `Vendas Concluídas`
    },
    
    avgPeopleQuantity: {
      sql: `"peopleQuantity"`,
      type: `avg`,
      title: `Média de Pessoas por Venda`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
      shown: false
    },
    
    createdAt: {
      sql: `"createdAt"`,
      type: `time`,
      title: `Data da Venda`
    },
    
    saleStatus: {
      sql: `"saleStatusDesc"`,
      type: `string`,
      title: `Status`
    },
    
    customerName: {
      sql: `"customerName"`,
      type: `string`,
      title: `Nome do Cliente`
    },
    
    origin: {
      sql: `origin`,
      type: `string`,
      title: `Origem`
    }
  },
  
  preAggregations: {
    main: {
      measures: [count, totalAmount, avgAmount],
      timeDimension: createdAt,
      granularity: `day`,
      refreshKey: {
        every: `1 hour`
      }
    }
  }
});
