
export const API_MAP = {
  USER_LIST: '/system/user/list',
  SALES_MAINS: '/business/sales/mains',
  SALES_STATE: '/business/sales/state',
  SALES_ESTATE: '/business/sales/estate'
}

// 主界面表头配置
export const tableCols = [

  {
    prop: 'id',
    label: '订单编号'
  },

  {
    prop: 'customer_code',
    label: '客户代码'
  },
  {
    prop: 'customer_name',
    label: '客户简称'
  },
  {
    prop: 'owner_fullname',
    label: '创建人'
  },
  {
    prop: 'state',
    label: '状态'
  }
]

// 搜索框配置
export const searchParams = [
  {
    label: '订单编号',
    field: 'id',
    placeholder: '请输入订单编号',
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

// 假数据

export const tableData = [
  { id: 1, order: 'SO20200921001', create_time: '2020-09-21', customer_code: 'xxxx', customer_name: 'xxxx', status: '待审核' },
  { id: 1, order: 'SO20200921002', create_time: '2020-09-22', customer_code: 'xxxx', customer_name: 'xxxx', status: '通过' }
]
