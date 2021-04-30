export const API_MAP = {
  PURCHASE_DETAIL: '/business/purchase/detail'
}

export const tableCols = [
  { prop: 'purchase_num', label: '采购订单号' },
  { prop: 'supplier_name', label: '供应商名称' },
  { prop: 'req_num', label: '请购单号' },
  { prop: 'material_name', label: '物料名称' },
  { prop: 'hscode', label: 'HS编码' },
  { prop: 'purchase_amount', label: '数量' },
  { prop: 'purchase_unit', label: '采购单位' },
  { prop: 'state', label: '状态' }

]

export const expandCols = [
  { prop: 'main_plan_date', label: '计划交货日期' },
  { prop: 'price', label: '实际单价' },
  { prop: 'total_price', label: '总价' },
  { prop: 'main_price_unit', label: '计价单位' },
  { prop: 'currency', label: '币种' },
  { prop: 'purchase_man', label: '采购员' }

]
