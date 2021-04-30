const HS = [
  {
    path: 'hsList',
    name: 'HS编码',
    component: () => import('@/views/hs/HsList'),
    meta: {
      tabName: 'HS编码',
      activeMenu: '/main/hsList',
      permission: ['hs_manager_read']
    }
  },
  {
    path: 'editHs/:operation',
    name: 'HS编码信息',
    component: () => import('@/views/hs/EditHs'),
    meta: {
      tabName: '编辑HS',
      activeMenu: '/main/editHs/:operation',
      permission: ['hs_manager_new', 'edit_hs']
    }
  }
]
export default HS
