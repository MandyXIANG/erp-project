export const API_MAP = {
  USER_LIST: '/system/user/list',
  MATERIAL_LIST: '/base/material/list',
  WAREHOUSE_SELF: '/base/warehouse/self',
  TREE_DATA: '/base/warehouse/tree',
  WAREHOUSE_LIST: '/base/warehouse/list',
  WAREHOUSR_MATERIAL: '/base/warehouse/material',
  NODE_MATERIAL: '/base/warehouse/materials',
  GET_USER: '/system/user/get'
}

export const ENUM_MAP = {
  warehouse_type: 'warehouse_type', // 仓库类型
  location_type: 'location_type' // 库位类型
}

export const classMap = {
  warehouse: 'warehouse',
  area: 'area',
  location: 'location'
}

export const classOptions = [
  { label: '仓库', value: classMap.warehouse },
  { label: '区位', value: classMap.area },
  { label: '库位', value: classMap.location }
]
export const classI18n = {
  [classMap.warehouse]: '仓库',
  [classMap.area]: '区位',
  [classMap.location]: '库位'
}

export const TableCols = [
  {
    label: '仓库代码',
    prop: 'code'
  },
  {
    label: '仓库名称',
    prop: 'name'
  },
  {
    label: '仓库类型',
    prop: 'kind'
  }
]

export const SearchParams = [
  {
    label: '仓库代码',
    field: 'code',
    placeholder: '请输入仓库代码',
    type: 'Input'
  },
  {
    label: '仓库名称',
    field: 'name',
    placeholder: '请输入仓库名称',
    type: 'Input'
  }
]

export const TableColsW = [
  {
    label: '物料编码',
    prop: 'code'
  }, {
    label: '物料名称',
    prop: 'name'
  }
]

export const TableColsD = [
  {
    label: '物料编码',
    prop: 'code'
  }, {
    label: '物料名称',
    prop: 'name'
  },
  {
    label: '物料描述',
    prop: 'description'
  }, {
    label: '物料简称',
    prop: 'abbr'
  },
  {
    label: '基本单位名称',
    prop: 'basic_unit'
  }
]
