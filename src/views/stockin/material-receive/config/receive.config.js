export const API_MAP = {
  STOCKIN_RECEIPT: '/business/stockin/receipt/self',
  STOCKIN_RECEIPT_OP: '/business/stockin/receipt/op',
  USER_LIST: '/system/user/list'
}

// 收料页面的查询
export const SearchParams = [
  {
    label: '物料编码',
    field: 'code',
    placeholder: '请输入物料编码',
    type: 'Input'
  }, {
    label: '物料名称',
    field: 'name',
    placeholder: '请输入物料名称',
    type: 'Input'
  }
]

// 收料页面的表格
export const TableCols = [
  {
    prop: 'material_code',
    label: '物料编码'
  },
  {
    prop: 'material_name',
    label: '物料名称'
  },
  {
    prop: 'stock_unit',
    label: '库存单位'
  },
  {
    prop: 'purchase_num',
    label: '订单号'
  },
  {
    prop: 'plan_amount',
    label: '计划收料数量'
  },
  {
    prop: 'plan_date',
    label: '计划收料时间'
  },
  {
    prop: 'received_amount',
    label: '已收数量'
  },
  {
    prop: 'amount',
    label: '本次收料数量'
  },
  {
    prop: 'date',
    label: '本次收料时间'
  }

]
