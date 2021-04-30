export default [
  {
    path: 'unit',
    name: '单位管理',
    component: () => import('@/views/sys-unit/Unit.vue'),
    meta: {
      tabName: '单位管理',
      activeMenu: '/main/unit',
      permission: ['read_unit']
    }
  },
  {
    path: 'edit-unit',
    name: '编辑单位',
    component: () => import('@/views/sys-unit/EditUnit.vue'),
    meta: {
      tabName: '单位信息',
      activeMenu: '/main/unit',
      permission: ['edit_unit', 'new_unit']
    }
  },
  {
    path: 'unit-detail',
    name: '单位详情',
    component: () => import('@/views/sys-unit/Detail.vue'),
    meta: {
      tabName: '单位详情',
      activeMenu: '/main/unit',
      permission: ['unit_detail']
    }
  }
]
