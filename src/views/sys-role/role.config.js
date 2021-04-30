// 表头
export const TableCols = [
  {
    prop: 'code',
    label: '角色编码',
    sortable: true
  },
  {
    prop: 'name',
    label: '角色名',
    sortable: true
  }, {
    prop: 'state',
    label: '状态',
    sortable: true
  }
]
export const SearchParams = [
  {
    label: '角色编码',
    field: 'code',
    placeholder: '请输入角色编码',
    type: 'Input'
  },
  {
    label: '角色名',
    field: 'name',
    placeholder: '请输入角色名',
    type: 'Input'
  }
]
export const StatusList = [
  {
    label: '激活',
    value: 'active'
  },
  {
    label: '失效',
    value: 'disable'
  }
]
