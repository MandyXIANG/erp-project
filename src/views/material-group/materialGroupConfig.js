const Params = [
  { label: '物料组名称', field: 'name', placeholder: '请输入物料名称', type: 'Input' }
]
const Columns = [
  { label: '物料组名称', prop: 'name', sortable: 'true' },
  { label: '备注', prop: 'remark', sortable: 'true' }
]
const infoColumn = []

export { Params, Columns, infoColumn }

export default { Params, Columns, infoColumn }
