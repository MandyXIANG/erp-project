export default [
  {
    path: 'warehouse',
    name: '仓库管理',
    component: () => import('@/views/warehouse/Warehouse.vue'),
    meta: {
      tabName: '仓库管理',
      activeMenu: '/main/warehouse',
      permission: ['warehouse_read']
    }
  },
  {
    path: 'edit-warehouse',
    name: '编辑仓库',
    component: () => import('@/views/warehouse/NewOrEdit.vue'),
    meta: {
      tabName: '仓库信息',
      activeMenu: '/main/warehouse',
      permission: ['warehouse_new', 'warehouse_edit']
    }
  },
  {
    path: 'warehouse-detail',
    name: '仓库详情',
    component: () => import('@/views/warehouse/Detail.vue'),
    meta: {
      tabName: '仓库详情',
      activeMenu: '/main/warehouse',
      permission: ['warehouse_detail']
    }
  }
]
