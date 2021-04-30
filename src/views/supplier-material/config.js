export const API_MAP = {
  MATERIAL_LIST: '/base/material/list',
  SUPPLIER_LIST: '/base/supplier/list',
  SUPPLIER_MATERIAL: '/base/supplier/material',
  SUPPLIER_MATERIALS: '/base/supplier/materials',
  MATERIAL_SELF: '/base/material/self'
}

// 搜索参数配置
export const searchParams = [
  {
    label: '供应商代码',
    field: 'code',
    placeholder: '请输入供应商代码',
    type: 'Input'
  },

  {
    label: '简称',
    field: 'name',
    placeholder: '请输入供应商简称',
    type: 'Input'
  }

]

// 供应商表头配置
export const tableCols = [

  {
    prop: 'code',
    label: '供应商代码'
  },
  {
    prop: 'name',
    label: '简称'
  },
  {
    prop: 'fullname',
    label: '全称'
  }
]

// 物料表头配置

export const materialTableCols = [
  {
    prop: 'sm_code',
    label: '物料编码'
  },
  {
    prop: 'sm_name',
    label: '物料名称'
  },
  {
    prop: 'sm_state',
    label: '状态'
  },
  {
    prop: 'code',
    label: '供方物料编码'
  },
  {
    prop: 'name',
    label: '供方物料名称'
  },
  {
    prop: 'sm_unit',
    label: '供方物料单位'
  }

]

export const detailsTableCols = [
  {
    prop: 'sm_code',
    label: '物料编码'
  },
  {
    prop: 'sm_name',
    label: '物料名称'
  },
  {
    prop: 'sm_state',
    label: '状态'
  },
  {
    prop: 'price',
    label: '供方单价'
  },

  {
    prop: 'unit',
    label: '供方金额单位'
  },
  {
    prop: 'trans_curr',
    label: '供方币种'
  }

]

export const detailExpandCols = [
  {
    prop: 'code',
    label: '供方物料编码'
  },
  {
    prop: 'name',
    label: '供方物料名称'
  },
  {
    prop: 'description',
    label: '供方物料描述'
  },
  {
    prop: 'sm_unit',
    label: '供方物料单位'
  },
  {
    prop: 'remark',
    label: '备注'
  }
]

export const unitMap = {
  yuan: '元',
  wanyuan: '万元'
}
export const currMap = {
  cny: '人民币',
  eur: '欧元',
  usd: '美元'
}

const priceUnit = [{ label: '元', value: 'yuan' }, { label: '万元', value: 'wanyuan' }]
const currency = [
  { label: '人民币', value: 'cny' },
  { label: '欧元', value: 'eur' },
  { label: '美元', value: 'usd' }
]
export const editMaterialForm = [
  { label: '供方物料单位', field: 'sm_unit', placeholder: '', type: 'Input', disabled: true, validate: false },
  { label: '供方币种', field: 'trans_curr', placeholder: '', type: 'Select', disabled: true, validate: false, options: currency },
  { label: '供方物料编码', field: 'code', placeholder: '请输入供方物料编码', type: 'Input', validate: false },
  { label: '供方物料名称', field: 'name', placeholder: '请输入供方物料名称', type: 'Input', validate: false },
  { label: '供方物料描述', field: 'description', placeholder: '请输入供方物料描述', type: 'Input', validate: false },
  { label: '供方单价', field: 'price', placeholder: '请输入供方单价', type: 'Number', validate: false },
  { label: '供方计价单位', field: 'unit', placeholder: '请选择供方计价单位', type: 'Select', options: priceUnit, validate: false },
  { label: '备注', field: 'remark', placeholder: '请输入备注', type: 'Textarea', row: 3, validate: false }
]
