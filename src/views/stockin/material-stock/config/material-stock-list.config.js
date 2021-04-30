export const TableCols = [
  {
    prop: 'id',
    label: '存料单号',
    sortable: true
  }, {
    prop: 'receipt_id',
    label: '收料单号',
    sortable: true
  }, {
    prop: 'create_at',
    label: '收料时间',
    sortable: true
  },
  {
    prop: 'owner_fullname',
    label: '创建人',
    sortable: true
  },
  {
    prop: 'state',
    label: '状态',
    sortable: true
  }
]
export const SearchParams = [{
  label: '存料单号',
  field: 'id',
  placeholder: '请输入存料单号',
  type: 'Input'
},
{
  label: '收料单号',
  field: 'recepit_id',
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
      label: '存料中',
      value: 'storing'
    }, {
      label: '完成',
      value: 'finish'
    }
  ]
}
]
