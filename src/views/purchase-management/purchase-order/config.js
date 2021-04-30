export const API_MAP = {
  PURCHASE_MAIN: '/business/purchase/main',
  PURCHASER_TRACE: '/business/purchase/trace',
  PURCHASE_MAINST: '/business/purchase/mainst',
  OP_LOGS: '/system/oplogs',
  BASE_SUPPLIER: '/base/supplier/self',
  UNPAID: '/business/purchase/unpaid',
  PURCHASE_F: '/business/purchase/f',
  SYSTEM_FT: '/system/ft/'

}

export const stateMap = {
  draft: { label: '草稿', value: 'draft' },
  wait_check: { label: '待审核', value: 'wait_check' },
  cancel: { label: '取消', value: 'cancel' },
  process: { label: '进行中', value: 'process' },
  finish: { label: '完成', value: 'finish' },
  reject: { label: '拒绝', value: 'reject' }
}

export const searchParams = [
  {
    label: '订单编号',
    field: 'id',
    placeholder: '请输入编号',
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
      { label: '草稿', value: 'draft' },
      { label: '待审核', value: 'wait_check' },
      { label: '生效', value: 'effect' },
      { label: '通过', value: 'pass' },
      { label: '拒绝', value: 'reject' },
      { label: '进行中', value: 'process' },
      { label: '完成', value: 'finish' }
    ]
  }

]

export const tableCols = [
  { prop: 'id', label: '订单编号' },
  { prop: 'supplier_code', label: '供应商代码' },
  { prop: 'supplier_name', label: '供应商名称' },
  { prop: 'priority', label: '优先级' },
  { prop: 'plan_date', label: '计划交货时间' },
  { prop: 'owner_fullname', label: '创建人' },
  { prop: 'state', label: '状态' }
]

export const detailTableCols = [
  { prop: 'material_code', label: '物料编码', width: 120 },
  { prop: 'material_name', label: '物料名称', width: 120 },
  { prop: 'purchase_unit', label: '采购单位', width: 100 },
  { prop: 'req_num', label: '请购单号', width: 180 },
  { prop: 'supplier_material_code', label: '供方物料编码', width: 150 },
  { prop: 'supplier_material_name', label: '供方物料名称', width: 150 },
  { prop: 'hscode.code', label: 'HS编码', width: 120 },
  { prop: 'purchase_amount', label: '计划采购数量', width: 120 },
  { prop: 'supplier_price', label: '原始单价', width: 120 },
  // { prop: 'supplier_price_unit', label: '原始金额单位' },
  { prop: 'price', label: '实际单价', width: 120 },
  // { prop: 'total_price', label: '总价' },
  { prop: 'state', label: '状态', width: 70 },
  { prop: 'purchased_amount', label: '到货数量', width: 100 }
]

export const trackCols = [
  { prop: 'material_code', label: '物料编码' },
  { prop: 'material_name', label: '物料名称' },
  { prop: 'purchase_unit', label: '采购单位' },
  { prop: 'req_num', label: '请购单号' },
  { prop: 'state', label: '状态' },
  { prop: 'purchase_amount', label: '计划采购数量' },
  { prop: 'purchased_amount', label: '已到货数量' }

]

export const statusTableCols = [
  { prop: 'owner', label: '操作人' },
  { prop: 'log_time', label: '操作时间' },
  { prop: 'log_type', label: '动作' },
  { prop: 'remark', label: '备注' }
]

export const receiveHistoryTableCols = [
  { prop: 'owner', label: '收货人' },
  { prop: 'operation_time', label: '收货时间' },
  { prop: 'amount', label: '收货数量' }

]

export const surplusCols = [
  { prop: 'req_num', label: '请购单号', width: 170 },
  { prop: 'material_code', label: '物料编码', width: 130 },
  { prop: 'material_name', label: '物料名称', width: 150 },
  { prop: 'req_unit', label: '采购单位', width: 80 },
  { prop: 'req_amount', label: '请购数量', width: 100 },
  { prop: 'finish_amount', label: '已采购数量', width: 100 },
  { prop: 'purchase_amount', label: '本次采购数量', width: 120 }
]
