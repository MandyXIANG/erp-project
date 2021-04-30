export default [
  {
    path: 'supplier',
    name: '供应商管理',
    component: () => import('@/views/supplier/Supplier.vue'),
    meta: {
      tabName: '供应商管理',
      activeMenu: '/main/supplier',
      permission: ['supplier_manage_read']
    }
  },
  {
    path: 'edit-supplier',
    name: '编辑供应商',
    component: () => import('@/views/supplier/NewOrEdit.vue'),
    meta: {
      tabName: '供应商信息',
      activeMenu: '/main/supplier',
      permission: ['supplier_manage_edit', 'supplier_manage_new']
    }
  },
  {
    path: 'supplier-detail',
    name: '供应商详情',
    component: () => import('@/views/supplier/Detail.vue'),
    meta: {
      tabName: '供应商详情',
      activeMenu: '/main/supplier',
      permission: ['supplier_manage_detail']
    }
  },
  {
    path: 'supplier-concat',
    name: '供应商设置联系人',
    component: () => import('@/views/supplier/SetConcat.vue'),
    meta: {
      tabName: '设置联系人',
      activeMenu: '/main/supplier'
    }
  }
]
