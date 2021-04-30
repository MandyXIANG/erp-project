const contactColum = [
  { prop: 'name', label: '姓名', sortable: 'true' },
  { prop: 'department', label: '部门', sortable: 'true' },
  { prop: 'position', label: '职位', sortable: 'true' }
]

const Params = [
  { label: '姓名', field: 'name', placeholder: '请输入姓名', type: 'Input' },
  { label: '联系人关系', field: 'relation', placeholder: '请输入联系人关系', type: 'Input' }
]

export default { contactColum, Params }

export { contactColum, Params }
