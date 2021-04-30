const Params = [
  { label: '出库单编号', field: 'stockout_id', placeholder: '请输入出库单编号', type: 'Input' },
  { label: '收货方', field: 'receiptor_name', placeholder: '请输入收货方', type: 'Input' }
]

const IssueColumn = [
  { label: '出库单号', prop: 'stockout_id', sortable: true },
  { label: '收货方', prop: 'receiptor_name', sortable: true },
  { label: '库存单位', prop: 'unit', sortable: true },
  { label: '数量', prop: 'amount', sortable: true },
  { label: '计划发料时间', prop: 'plan_ship_time', sortable: true },
  { label: '备料时间', prop: 'prepared_time', sortable: true },
  { label: '创建人', prop: 'owner_fullname', sortable: true },
  { label: '发料状态', prop: 'state', sortable: true }
]

const expandColumn = [
  { label: '物料编码', prop: 'material_code' },
  { label: '物料名称', prop: 'material_name' },
  { label: '库位代码', prop: 'location_code' },
  { label: '料盒代码', prop: 'box_code' },
  { label: '供应商代码', prop: 'supplier_code', sortable: true },
  { label: '供应商名称', prop: 'supplier_name', sortable: true }
]

const distrList = [
  { label: '快递', value: 'courier' },
  { label: '物流', value: 'logistics' },
  { label: '自取', value: 'selfcollection' }
]

export { Params, IssueColumn, expandColumn, distrList }

export default { Params, IssueColumn, expandColumn, distrList }
