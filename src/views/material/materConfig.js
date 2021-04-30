const Columns = [
  { label: '物料编码', prop: 'code', sortable: 'true' },
  { label: '物料名称', prop: 'name', sortable: 'true' },
  { label: '物料组', prop: 'group_name', sortable: 'true' },
  { label: '基本单位', prop: 'basic_unit', sortable: 'true' }
]
const Params = [
  { label: '物料编码', field: 'code', placeholder: '请输入物料编码', type: 'Input' },
  { label: '物料名称', field: 'name', placeholder: '请输入物料名称', type: 'Input' },
  { label: '物料组', field: 'group_name', placeholder: '请输入物料组', type: 'Input' }
]

const taxOptions = [
  { label: '13%', value: 0.13 },
  { label: '9%', value: 0.09 },
  { label: '6%', value: 0.06 },
  { label: '0%', value: 0 }
]

const saleUnit = [
  { label: '元', value: 'yuan' },
  { label: '万元', value: 'wanyuan' }
]

const SettleList = [
  { label: '不可超收', value: 0 },
  { label: '一次超收', value: 1 },
  { label: '多次超收', value: 2 }
]

const overSaleList = [
  { label: '不可超发', value: 0 },
  { label: '一次超发', value: 1 }
  // { label: '多次超发', value: 2 }
]

const Curr = [
  { label: '人民币', value: 'cny' },
  { label: '欧元', value: 'eur' },
  { label: '美元', value: 'usd' }
]
export { Columns, Params, taxOptions, saleUnit, SettleList, overSaleList, Curr }

export default { Columns, Params, taxOptions, saleUnit, SettleList, overSaleList, Curr }
