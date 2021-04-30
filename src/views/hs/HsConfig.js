const HsColumn = [
  { prop: 'code', label: 'HS编码', sortable: 'true' },
  { prop: 'import_tax', label: '关税%', sortable: 'true' }
]
const Params = [
  { label: 'HS编码', field: 'code', placeholder: '请输入HS编码', type: 'Input' }
]
export { HsColumn, Params }

export default { HsColumn, Params }
