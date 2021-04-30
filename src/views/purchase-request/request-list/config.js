export const API_MAP = {
  MATERIAL_LIST: '/base/material/list',
  USER_LIST: '/system/user/list',
  PURCHASE_REQ: '/business/purchase/req',
  PURCHASE_REQST: '/business/purchase/reqst',
  CHECK_REQ: '/business/purchase/check_req',
  OP_LOGS: '/system/oplogs',
  REP_EXTRA: '/business/purchase/req/extra'

}

export const stateMap = {
  draft: { label: '草稿', value: 'draft' },
  wait_purchase: { label: '待采购', value: 'wait_purchase' },
  cancel: { label: '取消', value: 'cancel' }
}

export const tableCols = [
  {
    prop: 'id',
    label: '请购单号'
  },
  {
    prop: 'class',
    label: '类型'
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
export const searchParams = [
  {
    label: '请购单号',
    field: 'id',
    placeholder: '请输入请购单号',
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
      { label: '待采购', value: 'wait_purchase' },
      { label: '部分采购', value: 'part' },
      { label: '完成', value: 'finish' }
    ]
  }
]

export const materialTableCols = [
  {
    prop: 'material_code',
    label: '物料编码'
  },
  {
    prop: 'material_name',
    label: '物料名称'
  },
  {
    prop: 'unit',
    label: '采购单位'
  },
  {
    prop: 'req_amount',
    label: '请购数量'
  },
  {
    prop: 'demand_time',
    label: '需求时间'
  },
  {
    prop: 'remark',
    label: '备注'
  }
]

export const detailMaterialCols = [
  {
    prop: 'material_code',
    label: '物料编码'
  },
  {
    prop: 'material_name',
    label: '物料简称'
  },
  {
    prop: 'unit',
    label: '采购单位'
  },
  {
    prop: 'req_amount',
    label: '请购数量'
  },
  {
    prop: 'demand_time',
    label: '需求时间'
  },
  {
    prop: 'finish_amount',
    label: '采购数量'
  },
  {
    prop: 'remark',
    label: '备注'
  }
]

// 历史记录表头配置
export const historyTableCols = [
  { prop: 'owner', label: '操作人' },
  { prop: 'log_time', label: '操作时间' },
  { prop: 'log_type', label: '动作' },
  { prop: 'remark', label: '备注' }
]
