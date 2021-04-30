export const API_MAP = {
  CUSTOMER_LIST: '/base/customer/list',
  CUSTOMER_CONTACT: '/base/customer/contact',
  MATERIAL_LIST: '/base/material/list',
  SYS_CONF: '/system/conf/sale_base',
  USER_LIST: '/system/user/list',
  SALES_MAIN: '/business/sales/main',
  SALES_MAINS: '/business/sales/mains',
  SALES_DETAILS: '/business/sales/details',
  SALES_OUT: '/business/sales/out',
  SALES_STATE: '/business/sales/state',
  SALES_OUTS: '/business/sales/outs',
  BASE_CONTACT: '/base/contact',
  OP_LOGS: '/system/oplogs',
  BASE_SUPPLIER: '/base/supplier/self'
}

export const stateMap = {
  draft: { label: '草稿', value: 'draft' },
  stop: { label: '中止', value: 'stop' },
  cancel: { label: '取消', value: 'cancel' },
  wait_check: { label: '待审核', value: 'wait_check' },
  process: { label: '进行中', value: 'process' },
  reject: { label: '拒绝', value: 'reject' }
}
export const priceUnit = [
  { label: '元', value: 'yuan' },
  { label: '万元', value: 'wanyuan' }
]
export const remit = [
  { label: '电汇', value: 'telegraphic' },
  { label: '承兑', value: 'acceptance' }
]
// 搜索框配置
export const searchParams = [
  {
    label: '订单编号',
    field: 'id',
    placeholder: '请输入订单编号',
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
      { label: '草稿', value: stateMap.draft.value },
      { label: '待审核', value: stateMap.wait_check.value },
      { label: '通过', value: 'pass' },
      { label: '拒绝', value: stateMap.reject.value },
      { label: '生效', value: 'effect' },
      { label: '进行中', value: stateMap.process.value },
      { label: '中止', value: stateMap.stop.value }

    ]
  }
]

// 主界面表头配置
export const tableCols = [

  {
    prop: 'id',
    label: '订单编号'
  },

  {
    prop: 'customer_code',
    label: '客户代码'
  },
  {
    prop: 'customer_name',
    label: '客户名称'
  },
  {
    prop: 'owner_fullname',
    label: '创建人'
  },
  {
    prop: 'state',
    label: '状态'
  }
]
// 详情界面：订单明细表头配置

export const materialTableCols = [
  { prop: 'material_code', label: '物料编号' },
  { prop: 'material_name', label: '物料名称' },
  { prop: 'sale_unit', label: '销售单位' },
  { prop: 'count', label: '销售数量' },
  { prop: 'sale_price', label: '原始单价' },
  { prop: 'real_price', label: '实际单价' },
  { prop: 'real_discount', label: '折扣' },
  { prop: 'real_total_price', label: '实际总价' },
  { prop: 'sent_sum', label: '已发数量' }
  // { prop: 'origin_total_price', label: '原始总价' }
  // { prop: 'state', label: '状态' }
]
// 新建或编辑、订单明细表头配置
export const editMaterialTableCols = [
  { prop: 'material_code', label: '物料编号' },
  { prop: 'material_name', label: '物料名称' },
  { prop: 'sale_unit', label: '销售单位' },
  { prop: 'count', label: '销售数量' },
  { prop: 'sale_price', label: '原始单价' },
  { prop: 'real_price', label: '实际单价' },
  { prop: 'real_discount', label: '折扣' },
  { prop: 'real_total_price', label: '实际总价' }
  // { prop: 'origin_total_price', label: '原始总价' }
]
// 发货界面表格配置
export const deliveryTableCols = [
  { prop: 'order_num', label: '订单编号' },
  { prop: 'material_code', label: '物料编号' },
  { prop: 'material_name', label: '物料名称' },
  { prop: 'count', label: '订单数量' },
  { prop: 'sale_unit', label: '销售单位' },
  { prop: 'sent_sum', label: '已发数量' }
]

// 历史记录表头配置
export const historyTableCols = [
  { prop: 'owner', label: '操作人' },
  { prop: 'log_time', label: '操作时间' },
  { prop: 'log_type', label: '动作' },
  { prop: 'remark', label: '备注' }
]

export const deliverHistoryTableCols = [
  { prop: 'main_id', label: '出库单号' },
  { prop: 'owner', label: '发货人' },
  { prop: 'plan_stockout_time', label: '计划发货时间' },
  { prop: 'unit', label: '库存单位' },
  { prop: 'plan_amount', label: '发货数量' },
  { prop: 'state', label: '状态' }
]

export const payMethods = [
  { label: '货到付款', value: 'arrival' },
  { label: '分期付款', value: 'stage' },
  { label: '预付款', value: 'prepaid' },
  { label: '周期结算', value: 'cycle' }
]
// 货到付款
export const arrivalConf = {
  arrival: {
    name: 'arrival',
    max_day: null, // 付款上限天数
    start_time: '签收日期' // 开始计算日期
  }
}
// 分期付款
export const stageConf = {
  stage: {
    name: 'stage',
    stage_conf: [ // ratio:付款比例  time:付款时机
      { ratio: null, time: '' }
    ]
  }
}
// 预付款
export const prepaidConf = {
  prepaid: {
    name: 'prepaid',
    delivery: null, // 付款后发货周期
    unit: '' // 周期的单位：天、周、月
  }
}
// 周期结算
export const cycleConf = {
  cycle: {
    name: 'cycle',
    cycle_conf: [ // unit:周期结算单位  value:周期结算值
      { unit: '', value: '' }
    ]
  }
}
