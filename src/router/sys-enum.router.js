export default [
  {
    path: 'enum',
    name: '枚举管理',
    component: () => import('@/views/sys-enum/Enum.vue'),
    meta: {
      tabName: '枚举管理',
      activeMenu: '/main/enum',
      permission: ['read_enum']
    }
  },
  {
    path: 'edit-enum/:operation',
    name: '编辑枚举',
    component: () => import('@/views/sys-enum/EditEnum.vue'),
    meta: {
      tabName: '枚举信息',
      activeMenu: '/main/enum',
      permission: ['edit_enum', 'new_enum']
    }
  }, {
    path: 'enum-detail',
    name: '枚举详情',
    component: () => import('@/views/sys-enum/Detail.vue'),
    meta: {
      tabName: '枚举详情',
      activeMenu: '/main/enum',
      permission: ['enum_detail']
    }
  }
]
