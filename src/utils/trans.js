import * as moment from 'moment'

const optionsMap = {
  draft: '草稿',
  release: '发布',
  stop: '中止',
  cancel: '取消',
  wait_check: '待审核',
  process: '进行中',
  pass: '通过',
  reject: '拒绝',
  effect: '生效',
  wait_delivery: '待发货',
  finish: '完成',
  part: '部分采购',
  purchasing: '采购中',
  part_arrival: '部分到货',
  arrival: '已到货',
  unstart: '未开始',
  receiving: '收料中',
  closed: '关闭',
  receive_end: '收料结束',
  storing: '存料中',
  wait_purchase: '待采购',
  out: '已出库',
  arrived: '已送达',
  receipt: '确认收货',
  unsend: '未发料',
  send: '已发料',
  preparing: '备料中',
  prepared: '备料完成',
  prepare_end: '备料结束',
  received: '收料完成'
}

const typeMap = {
  manual: '人工',
  mrp: 'MRP'
}

const priceUnit = {
  yuan: '元',
  wanyuan: '万元'
}

const remit = {
  telegraphic: '电汇',
  acceptance: '承兑'
}

const pay = {
  arrival: '货到付款',
  stage: '分期付款',
  prepaid: '预付款',
  cycle: '周期结算'
}
const contact = {
  delete: '删除',
  valid: '有效',
  invalid: '无效'
}

const curr = {
  cny: '人民币',
  eur: '欧元',
  usd: '美元'
}

const receiptType = {
  purchase_stockin: '采购入库',
  handle_stockin: '手动入库',
  sale_stockin: '销售退货'
}

const outType = {
  sale_out: '销售出库',
  handle_out: '手动出库'
}

const actions = {
  new: '创建',
  edit: '编辑',
  stop: '中止',
  closed: '关闭',
  pass: '通过',
  reject: '拒绝',
  effect: '生效',
  sale_out: '发货',
  restore: '恢复',
  receive: '收料',
  store: '存料',
  cancel: '取消',
  prepare: '备料',
  send: '发料',
  arrived: '已送达',
  receipt: '确认收货'
}

/**
 * 一般的翻译
 * @param {*} key
 */

export function transKey (key) {
  const obj = Object.assign(optionsMap, priceUnit, remit, contact, curr, typeMap, receiptType, outType)
  if (key !== undefined && key !== null && key.length) {
    return obj[key] || key
  } else {
    return key
  }
}

/**
 * 翻译结算方式
 * @param {*} key
 */

export function transPay (key) {
  const obj = Object.assign(pay)
  if (key !== undefined && key !== null && key.length) {
    return obj[key] || key
  } else {
    return key
  }
}

/**
 * 翻译动作
 * @param {*} key
 */

export function transAction (key) {
  const obj = Object.assign(actions)
  if (key !== undefined && key !== null && key.length) {
    return obj[key] || key
  } else {
    return key
  }
}
/**
 * 格式化日期时间
 * @param {*} date
 */
export function formatTime (date) {
  if (date !== undefined && date !== null && date.length) {
    return moment(date).utc().format('YYYY-MM-DD HH:mm:ss') || date
  } else {
    return date
  }
}

/**
 * 格式化日期
 * @param {*} date
 */

export function formatDate (date) {
  if (date !== undefined && date !== null && date.length) {
    return moment(date).utc().format('YYYY-MM-DD') || date
  } else {
    return date
  }
}
