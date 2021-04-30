export const TableReceiveCols = [{
  prop: 'id',
  label: '收料单号',
  sortable: true
}, {
  prop: 'class',
  label: '类型',
  sortable: true
}, {
  prop: 'owner_fullname',
  label: '创建人',
  sortable: true
}, {
  prop: 'state',
  label: '状态',
  sortable: true
}]

export const TableMaterialCols = [{
  prop: 'code',
  label: '物料编码'
}, {
  prop: 'name',
  label: '物料名称'
}, {
  prop: 'unit',
  label: '单位'
}, {
  prop: 'price',
  label: '单价'
}, {
  prop: 'count1',
  label: '采购数量'
}, {
  prop: 'count2',
  label: '到货数量'
}, {
  prop: 'pay',
  label: '付款状态'
}]

export const SearchParams = [{
  label: '收料单号',
  field: 'id',
  placeholder: '请输入收料单号',
  type: 'Input'
}, {
  single: true,
  label: '状态',
  field: 'state',
  placeholder: '请选择状态',
  type: 'MultiSelect',
  operator_field: 'stateop',
  operator: 0,
  options: [
    {
      label: '草稿',
      value: 'draft'
    },
    {
      label: '待审核',
      value: 'wait_check'
    },
    {
      label: '拒绝',
      value: 'reject'
    }, {
      label: '未开始',
      value: 'unstart'
    }, {
      label: '收料中',
      value: 'receiving'
    }, {
      label: '完成',
      value: 'finish'
    }
  ]
}
]
