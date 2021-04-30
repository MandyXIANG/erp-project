export default [
  {
    path: 'customer',
    name: '客户管理',
    component: () => import('@/views/customer/Customer.vue'),
    meta: {
      tabName: '客户管理',
      activeMenu: '/main/customer',
      permission: ['customer_manage_read']
    }
  },
  {
    path: 'edit-cusromer',
    name: '编辑客户',
    component: () => import('@/views/customer/NewOrEdit.vue'),
    meta: {
      tabName: '客户信息',
      activeMenu: '/main/customer',
      permission: ['customer_manage_new', 'customer_manage_edit']
    }
  },
  {
    path: 'cusromer-detail',
    name: '客户详情',
    component: () => import('@/views/customer/Detail.vue'),
    meta: {
      tabName: '客户详情',
      activeMenu: '/main/customer',
      permission: ['customer_manage_detail']
    }
  },
  {
    path: 'cusromer-concat',
    name: '设置联系人',
    component: () => import('@/views/customer/SetConcat.vue'),
    meta: {
      tabName: '设置联系人',
      activeMenu: '/main/customer'
    }
  }
]
