const Material = [
  {
    path: 'materialList',
    name: '物料管理',
    component: () => import('@/views/material/MaterialList'),
    meta: {
      tabName: '物料管理',
      activeMenu: '/main/materialList',
      permission: ['material_manage_read']
    }
  },
  {
    path: 'editMaterial/:operation',
    name: '编辑物料',
    component: () => import('@/views/material/EditMaterial'),
    meta: {
      tabName: '物料信息',
      activeMenu: '/main/editMaterial/:operation',
      permission: ['material_manage_new', 'material_edit']
    }
  },
  {
    path: 'materialInfo',
    name: '物料详情',
    component: () => import('@/views/material/MaterialInfo'),
    meta: {
      tabName: '物料详情',
      activeMenu: '/main/materialInfo',
      permission: ['material_manage_info']
    }
  }
]
export default Material
