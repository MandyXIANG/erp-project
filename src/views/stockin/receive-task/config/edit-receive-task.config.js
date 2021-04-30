export const TableCols = [
  {
    prop: 'material_code',
    label: '物料编码'
  }, {
    prop: 'material_name',
    label: '物料名称'
  }, {
    prop: 'stock_unit',
    label: '库存单位'
  },
  {
    prop: 'purchase_num',
    label: '订单号'
  }, {
    prop: 'plan_amount',
    label: '计划收料数量'
  }, {
    prop: 'plan_date',
    label: '计划收料时间'
  }
]

export const PurchaseTableCols = [
  {
    prop: 'purchase_num',
    label: '采购单号'
  },
  {
    prop: 'material_code',
    label: '物料编号'
  }, {
    prop: 'material_name',
    label: '物料名称'
  }, {
    prop: 'purchase_unit',
    label: '采购单位'
  },
  {
    prop: 'purchase_amount',
    label: '计划采购数量'
  }, {
    prop: 'purchased_amount',
    label: '到货数量'
  }, {
    prop: 'state',
    label: '状态'
  }
]

export const ReceiptType = [{
  label: '采购入库',
  value: 'purchase_stockin'
}, {
  label: '手动入库',
  value: 'handle_stockin'
}, {
  label: '销售退货',
  value: 'sale_stockin'
}]
