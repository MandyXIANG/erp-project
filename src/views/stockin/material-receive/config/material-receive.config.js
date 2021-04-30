export const API_MAP = {
  STOCKIN_RECEIPTS2: '/business/stockin/receipts2'
}

export const SearchParams = [{
  label: '收料单号',
  field: 'id',
  placeholder: '请输入收料单号',
  type: 'Input'
},
{
  single: true,
  label: '状态',
  field: 'state',
  placeholder: '请选择状态',
  type: 'MultiSelect',
  operator_field: 'stateop',
  operator: 0,
  options: [
    {
      label: '未开始',
      value: 'unstart'
    }, {
      label: '收料中',
      value: 'receiving'
    }
  ]
}
]

export const TableCols = [{
  prop: 'id',
  label: '收料单号'
}, {
  prop: 'class',
  label: '收料类型'
},
{
  prop: 'owner_fullname',
  label: '创建人'
},
{
  prop: 'state',
  label: '状态'
}]
