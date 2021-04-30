const Params = [
  { label: '出库单编号', field: 'id', placeholder: '请输入出库单编号', type: 'Input' },
  {
    single: true,
    label: '状态',
    field: 'state',
    placeholder: '请选择状态',
    type: 'MultiSelect',
    operator_field: 'stateop',
    operator: 0,
    options: [
      { label: '未开始', value: 'unstart' },
      { label: '进行中', value: 'process' }
    ]
  }
]

const prepareColumn = [
  { label: '出库单号', prop: 'id', sortable: true },
  { label: '仓库代码', prop: 'warehouse_code', sortable: true },
  { label: '计划备料时间', prop: 'plan_prepare_time', sortable: true },
  { label: '创建人', prop: 'owner_fullname', sortable: true },
  { label: '状态', prop: 'state', sortable: true }
]

const tableDataColumn = [
  { label: '物料名称', prop: 'material_name' },
  { label: '物料编码', prop: 'material_code' },
  { label: '库存单位', prop: 'unit' },
  { label: '需求数量', prop: 'plan_amount' },
  { label: '已备数量', prop: 'prepared_amount' },
  { label: '备料人', prop: 'preparer' },
  { label: '料盒', prop: 'box_code' },
  { label: '本次备料数量', prop: 'amount' }
]

export { Params, prepareColumn, tableDataColumn }

export default { Params, prepareColumn, tableDataColumn }
