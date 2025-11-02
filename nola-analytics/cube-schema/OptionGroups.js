cube(`OptionGroups`, {
  sql: `SELECT * FROM option_groups`,
  
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
    
    name: {
      sql: `name`,
      type: `string`,
      title: `Grupo de Opções`
    }
  }
});
