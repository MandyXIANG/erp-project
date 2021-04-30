const Params = [
  { label: '出库单编号', field: 'id', placeholder: '请输入出库单编号', type: 'Input' }
]

const checkColumn = [
  { label: '出库单号', prop: 'id', sortable: true },
  { label: '订单号', prop: 'order_id', sortable: true },
  { label: '收货方名称', prop: 'receiptor_name', sortable: true },
  { label: '收货方代码', prop: 'receiptor_code', sortable: true },
  { label: '创建人', prop: 'owner_fullname', sortable: true },
  { label: '状态', prop: 'state', sortable: true }
]

const resultList = [
  { label: '通过', value: 'unstart' },
  { label: '拒绝', value: 'reject' }
]
export { Params, checkColumn, resultList }

export default { Params, checkColumn, resultList }
