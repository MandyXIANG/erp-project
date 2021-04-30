export default [
  {
    path: 'role',
    name: '角色管理',
    component: () => import('@/views/sys-role/Role.vue'),
    meta: {
      tabName: '角色管理',
      activeMenu: '/main/role',
      permission: ['read_role']
    }
  }, {
    path: 'edit-role',
    name: '编辑角色',
    component: () => import('@/views/sys-role/EditRole.vue'),
    meta: {
      tabName: '角色信息',
      activeMenu: '/main/role',
      permission: ['edit_role', 'new_role']
    }
  }, {
    path: 'role-detail',
    name: '角色详情',
    component: () => import('@/views/sys-role/Detail.vue'),
    meta: {
      tabName: '角色详情',
      activeMenu: '/main/role',
      permission: ['role_detail']
    }
  }, {
    path: 'set-user',
    name: '设置用户',
    component: () => import('@/views/sys-role/SetUser.vue'),
    meta: {
      tabName: '设置用户',
      activeMenu: '/main/role',
      permission: ['set_user']
    }
  }
]
