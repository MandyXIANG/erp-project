export const API_MAP = {
  SUPPLIER_LIST: '/base/supplier/list',
  SUPPLIER_CONTACTS: '/base/supplier/contact',
  USER_LIST: '/system/user/list',
  SUPPLIER_MATERIALS: '/base/supplier/materials',
  PURCHASE_FILTER: '/business/purchase/filter',
  BASE_CONTACT: '/base/contact',
  MATERIAL_SELF: '/base/material/self',
  BASE_SUPPLIER: '/base/supplier/self'
}

export const orderMaterialTableCols = [
  {
    prop: 'material_code',
    label: '物料编码',
    width: 150
  },
  {
    prop: 'material_name',
    label: '物料名称',
    width: 150
  },
  {
    prop: 'purchase_unit',
    label: '采购单位',
    width: 120
  },
  {
    prop: 'req_num',
    label: '请购单号',
    width: 200
  },
  {
    prop: 'supplier_material_code',
    label: '供方物料编码',
    width: 150
  },
  {
    prop: 'supplier_material_name',
    label: '供方物料名称',
    width: 150
  },
  {
    prop: 'hscode.code',
    label: 'HS编码',
    width: 150
  },
  {
    prop: 'purchase_amount',
    label: '采购数量',
    width: 120
  },
  {
    prop: 'supplier_price',
    label: '原始单价',
    width: 150
  },
  {
    prop: 'price',
    label: '实际单价',
    width: 150
  }
  // {
  //   prop: 'total_price',
  //   label: '实际总价'
  // },

]

export const requestMaterialCols = [
  {
    prop: 'req_id',
    label: '请购单号',
    width: '180'
  },
  {
    prop: 'material_code',
    label: '物料编码',
    width: '120'
  },
  {
    prop: 'material_name',
    label: '物料名称',
    width: '120'
  }, {
    prop: 'demand_time_formatter',
    label: '需求时间',
    width: '100'
  }
]

export const expandCols = [
  {
    prop: 'req_amount',
    label: '请购数量:'
  },
  {
    prop: 'finish_amount',
    label: '已购数量:'
  },
  {
    prop: 'raw_price',
    label: '默认单价:'
  },
  {
    prop: 'raw_unit',
    label: '默认计价单位:'
  },
  {
    prop: 'req_unit',
    label: '采购单位:'
  }
]

// 货到付款
export const arrivalConf = {
  arrival: {
    name: 'arrival',
    max_day: null, // 付款上限天数
    start_time: '签收日期' // 开始计算日期
  }
}
// 分期付款
export const stageConf = {
  stage: {
    name: 'stage',
    stage_conf: [ // ratio:付款比例  time:付款时机
      { ratio: null, time: '' }
    ]
  }
}
// 预付款
export const prepaidConf = {
  prepaid: {
    name: 'prepaid',
    delivery: null, // 付款后发货周期
    unit: '' // 周期的单位：天、周、月
  }
}
// 周期结算
export const cycleConf = {
  cycle: {
    name: 'cycle',
    cycle_conf: [ // unit:周期结算单位  value:周期结算值
      { unit: '', value: '' }
    ]
  }
}
