export default [
  {
    path: 'api',
    name: 'API管理',
    component: () => import('@/views/sys-api/ApiConfig.vue'),
    meta: {
      tabName: 'API管理',
      activeMenu: '/main/api',
      permission: ['read_api']
    }
  }, {
    path: 'edit-api',
    name: '编辑API',
    component: () => import('@/views/sys-api/EditApi.vue'),
    meta: {
      tabName: 'API信息',
      activeMenu: '/main/api',
      permission: ['edit_api', 'new_api']
    }
  }, {
    path: 'api-detail',
    name: 'api详情',
    component: () => import('@/views/sys-api/Detail.vue'),
    meta: {
      tabName: 'API详情',
      activeMenu: '/main/api',
      permission: ['api_detail']
    }
  }
]
