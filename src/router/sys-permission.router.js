export default [
  {
    path: 'permission',
    name: '权限管理',
    component: () => import('@/views/sys-permission/Permission.vue'),
    meta: {
      tabName: '权限管理',
      activeMenu: '/main/permission',
      permission: ['read_permission']
    }
  }, {
    path: 'edit-permission',
    name: '编辑权限',
    component: () => import('@/views/sys-permission/EditPermission.vue'),
    meta: {
      tabName: '权限信息',
      activeMenu: '/main/permission',
      permission: ['edit_permission', 'new_permission']
    }
  }, {
    path: 'permission-detail',
    name: '权限详情',
    component: () => import('@/views/sys-permission/Detail.vue'),
    meta: {
      tabName: '权限详情',
      activeMenu: '/main/permission',
      permission: ['permission_detail']
    }
  }
]
