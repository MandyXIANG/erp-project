export const TableCols = [
  {
    prop: 'code',
    label: 'apiCode'
  },
  {
    prop: 'name',
    label: 'api名字'
  },
  {
    prop: 'description',
    label: 'api简介'
  },
  {
    prop: 'group',
    label: 'api分组'
  },
  {
    prop: 'action',
    label: '请求',
    width: '400'
  }
]
// 请求方式列表
export const ActionList = [
  {
    label: '创建(POST)',
    value: 'POST',
    title: '创建',
    type: 'success'
  },
  {
    label: '查看(GET)',
    value: 'GET',
    title: '查看',
    type: 'primary'
  },
  {
    label: '更新(PUT)',
    value: 'PUT',
    title: '更新',
    type: 'warning'
  },
  {
    label: '删除(DELETE)',
    value: 'DELETE',
    title: '删除',
    type: 'danger'
  }
]
export const SearchParams = [
  {
    label: 'apiCode',
    field: 'code',
    placeholder: '请输入apiCode',
    type: 'Input'
  },
  {
    label: 'api名字',
    field: 'name',
    placeholder: '请输入api名字',
    type: 'Input'
  },
  {
    label: 'api分组',
    field: 'group',
    placeholder: '请输入分组名',
    type: 'Input'
  },
  {
    label: '请求',
    field: 'action',
    placeholder: '请选择请求方式',
    type: 'MultiSelect',
    options: [
      { label: '创建(POST)', value: 'POST' },
      { label: '查看(GET)', value: 'GET' },
      { label: '更新(PUT)', value: 'PUT' },
      { label: '删除(DELETE)', value: 'DELETE' }
    ]
  }
]
