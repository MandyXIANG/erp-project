export default [
  {
    path: 'user',
    name: '用户管理',
    component: () => import('@/views/sys-user/User.vue'),
    meta: {
      tabName: '用户管理',
      activeMenu: '/main/user',
      permission: ['read_user']
    }
  },
  {
    path: 'edit-user',
    name: '编辑用户',
    component: () => import('@/views/sys-user/EditUser.vue'),
    meta: {
      tabName: '用户信息',
      activeMenu: '/main/user',
      permission: ['edit_user', 'new_user']
    }
  },
  {
    path: 'set-role',
    name: '设置角色',
    component: () => import('@/views/sys-user/SetRole.vue'),
    meta: {
      tabName: '设置角色',
      activeMenu: '/main/user',
      permission: ['set_role']
    }
  },
  {
    path: 'user-detail',
    name: '用户详情',
    component: () => import('@/views/sys-user/Detail.vue'),
    meta: {
      tabName: '用户详情',
      activeMenu: '/main/user',
      permission: ['user_detail']
    }
  }
]
