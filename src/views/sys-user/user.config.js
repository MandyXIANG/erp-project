// 状态
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
// 性别
export const GenderList = [
  {
    label: '男',
    value: 'male'
  },
  {
    label: '女',
    value: 'female'
  }
]
// 表头
export const TableCols = [
  {
    prop: 'name',
    label: '用户名',
    sortable: true
  },
  {
    prop: 'fullname',
    label: '全名',
    sortable: true
  },
  {
    prop: 'code',
    label: '工号',
    sortable: true
  },
  {
    prop: 'gender',
    label: '性别',
    sortable: true
  },
  {
    prop: 'state',
    label: '状态',
    sortable: true
  }
]

export const SearchParams = [
  {
    label: '用户名',
    field: 'name',
    placeholder: '请输入用户名',
    type: 'Input'
  },
  {
    label: '全名',
    field: 'fullname',
    placeholder: '请输入全名',
    type: 'Input'
  },
  {
    label: '工号',
    field: 'code',
    placeholder: '请输入工号',
    type: 'Input'
  }
  // {
  //   label: '状态',
  //   field: 'state',
  //   placeholder: '请选择状态',
  //   type: 'MultiSelect',
  //   options: [
  //     { label: '激活', value: 'active' },
  //     { label: '失效', value: 'disabled' },
  //     { label: '删除', value: 'deleted' }
  //   ]
  // },
  // {
  //   label: '性别',
  //   field: 'gender',
  //   placeholder: '请选择性别',
  //   type: 'MultiSelect',
  //   options: [
  //     { label: '女', value: 'female' },
  //     { label: '男', value: 'male' }
  //   ]
  // }
]
