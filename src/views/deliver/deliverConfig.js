const Params = [
  { label: '发货单号', field: 'id', placeholder: '请输入发货单号', type: 'Input' },
  {
    single: true,
    label: '状态',
    field: 'state',
    placeholder: '请选择状态',
    type: 'MultiSelect',
    operator_field: 'stateop',
    operator: 0,
    options: [
      { label: '已出库', value: 'out' },
      { label: '已送达', value: 'arrived' },
      { label: '确认收货', value: 'receipt' }
    ]
  }
]

const Columns = [
  { label: '发货单号', prop: 'id', sortable: true },
  { label: '发货时间', prop: 'delivery_time', sortable: true },
  { label: '收货方代码', prop: 'receiptor_code', sortable: true },
  { label: '收货方名称', prop: 'receiptor_name', sortable: true },
  { label: '创建人', prop: 'owner_fullname', sortable: true },
  { label: '状态', prop: 'state', sortable: true }
]
const deliverDetailColumn = [
  { label: '出库单号', prop: 'stockout_id' },
  { label: '物料编号', prop: 'material_code' },
  { label: '物料名称', prop: 'material_name' },
  { label: '发货数量', prop: 'amount' },
  { label: '状态', prop: 'state' }
]

const stateColumn = [
  { label: '操作人', prop: 'owner' },
  { label: '操作时间', prop: 'log_time' },
  { label: '动作', prop: 'log_type' },
  { label: '签收人', prop: 'operator' },
  { label: '签收时间', prop: 'operation_time' },
  { label: '备注', prop: 'remark' }
]

export { Params, Columns, deliverDetailColumn, stateColumn }

export default { Params, Columns, deliverDetailColumn, stateColumn }
