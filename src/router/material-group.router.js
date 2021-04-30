const MaterialGroup = [
  {
    path: 'groupList',
    name: '物料组管理',
    component: () => import('@/views/material-group/GroupList'),
    meta: {
      tabName: '物料组管理',
      activeMenu: '/main/groupList',
      permission: ['material_group_manage_read']
    }
  },
  {
    path: 'editGroup',
    name: '编辑物料组',
    component: () => import('@/views/material-group/EditGroup'),
    meta: {
      tabName: '物料组信息',
      activeMenu: '/main/editGroup',
      permission: ['material_group_manage_new', 'material_group_edit']
    }
  },
  {
    path: 'groupInfo',
    name: '物料组详情',
    component: () => import('@/views/material-group/GroupInfo'),
    meta: {
      tabName: '物料组详情',
      activeMenu: '/main/groupInfo',
      permission: ['material_group_manage_info']
    }
  }
]
export default MaterialGroup
