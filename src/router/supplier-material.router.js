export default [
  {
    path: 'supplier-material',
    name: '供应商物料管理',
    component: () => import('@/views/supplier-material/SupplierMaterial.vue'),
    meta: {
      tabName: '供应商物料管理',
      activeMenu: '/main/supplier-material',
      permission: ['supplier_material_read']
    }
  },
  {
    path: 'supplier-add-material',
    name: '添加物料',
    component: () => import('@/views/supplier-material/AddMaterial.vue'),
    meta: {
      tabName: '添加物料',
      activeMenu: '/main/supplier-material',
      permission: ['supplier_material_add']
    }
  },
  {
    path: 'supplier-material-detail',
    name: '供应商物料详情',
    component: () => import('@/views/supplier-material/Detail.vue'),
    meta: {
      tabName: '供应商物料详情',
      activeMenu: '/main/supplier-material',
      permission: ['supplier_material_detail']
    }
  }
]
