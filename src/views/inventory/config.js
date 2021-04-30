export const API_MAP = {
  STOCK_INFO: '/base/stockinfo',
  WAREHOUSE: '/base/stockinfo/warehouse'
}

const Params = [
  { label: '物料编码', field: 'code', placeholder: '请输入物料编码', type: 'Input' },
  { label: '物料名称', field: 'name', placeholder: '请输入物料名称', type: 'Input' }
]

export const searchParams = [
  { label: '仓库名称', field: 'warehouse_name', placeholder: '请输入仓库名称', type: 'Input' },
  { label: '区位名称', field: 'area_name', placeholder: '请输入区位名称', type: 'Input' },
  { label: '库位名称', field: 'location_name', placeholder: '请输入库位名称', type: 'Input' }
]

const InvColumn = [
  { label: '物料编码', prop: 'code' },
  { label: '物料名称', prop: 'name' },
  { label: '库存单位', prop: 'stock_unit' },
  { label: '当前库存量', prop: 'stock_amount' },
  { label: '安全库存量', prop: 'warehouse_safe_num' },
  { label: '最大库存量', prop: 'warehouse_max_num' },
  { label: '最小库存量', prop: 'warehouse_min_num' }
]

export const expandCol = [
  { prop: 'warehouse_name', label: '仓库名称' },
  { prop: 'area_name', label: '区位名称' },
  { prop: 'location_name', label: '库位名称' },
  { prop: 'amount', label: '库存数量' }
]

export const warehouseCol = [
  { prop: 'warehouse_name', label: '仓库名称' },
  { prop: 'area_name', label: '区位名称' },
  { prop: 'location_name', label: '库位名称' }
]
export const warehouseExpand = [
  { label: '物料编码', prop: 'material_code' },
  { label: '物料名称', prop: 'material_name' },
  { label: '库存单位', prop: 'stock_unit' },
  { label: '供应商代码', prop: 'supplier_code' },
  { label: '供应商名称', prop: 'supplier_name' },
  { label: '库存数量', prop: 'amount' }
]

export { Params, InvColumn }

export default { Params, InvColumn }
