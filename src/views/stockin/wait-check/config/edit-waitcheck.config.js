export const ResultType = [{
  label: '通过',
  value: 'unstart'
}, {
  label: '拒绝',
  value: 'reject'
}]

export const TableCols = [
  {
    prop: 'material_code',
    label: '物料编码'
  }, {
    prop: 'material_name',
    label: '物料名称'
  }, {
    prop: 'stock_unit',
    label: '库存单位'
  },
  {
    prop: 'purchase_num',
    label: '订单号'
  }, {
    prop: 'plan_date',
    label: '计划收料时间'
  }, {
    prop: 'plan_amount',
    label: '计划收料数量'
  }, {
    prop: 'received_amount',
    label: '实际收料数量'
  }, {
    prop: 'state',
    label: '状态'
  }]

export const StateTableCols = [
  {
    prop: 'operator',
    label: '操作人'
  },
  {
    prop: 'operation_time',
    label: '操作时间'
  },
  {
    prop: 'state',
    label: '状态'
  },
  {
    prop: 'remark',
    label: '备注'
  }
]

export const ReceiptTableCols = [
  {
    prop: 'operator',
    label: '操作人'
  }, {
    prop: 'date',
    label: '操作时间'
  }, {
    prop: 'amount',
    label: '收料数量'
  }
]
