
export const API_MAP = {
  PURCHASE_MAIN: '/business/purchase/main',
  USER_LIST: '/system/user/list',
  PURCHASE_MAINST: '/business/purchase/mainst',
  PURCHASE_MAINEST: '/business/purchase/mainest'

}

export const searchParams = [
  {
    label: '订单编号',
    field: 'id',
    placeholder: '请输入编号',
    type: 'Input'
  },
  {
    single: true,
    label: '状态',
    field: 'state',
    placeholder: '请选择状态',
    type: 'MultiSelect',
    operator_field: 'stateop',
    operator: 0,
    options: [
      { label: '待审核', value: 'wait_check' },
      { label: '通过', value: 'pass' }
    ]
  }

]

export const tableCols = [
  { prop: 'id', label: '订单编号' },
  { prop: 'supplier_code', label: '供应商代码' },
  { prop: 'supplier_name', label: '供应商名称' },
  // { prop: 'purchaseman_fullname', label: '采购人员' },
  { prop: 'priority', label: '优先级' },
  { prop: 'owner_fullname', label: '创建人' },
  { prop: 'state', label: '状态' }

]
