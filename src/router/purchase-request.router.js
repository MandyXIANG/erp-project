export default [
  {
    path: 'request-list',
    name: '请购清单',
    component: () => import('@/views/purchase-request/request-list/RequestList.vue'),
    meta: {
      tabName: '请购清单',
      activeMenu: '/main/request-list',
      permission: ['request_list_read']
    }
  },
  {
    path: 'edit-request-list',
    name: '新建请购单',
    component: () => import('@/views/purchase-request/request-list/NewOrEditRequest.vue'),
    meta: {
      tabName: '新建请购单',
      activeMenu: '/main/request-list',
      permission: ['request_list_new', 'request_list_edit']

    }
  },
  {
    path: 'request-detail',
    name: '请购单详情',
    component: () => import('@/views/purchase-request/request-list/Detail.vue'),
    meta: {
      tabName: '请购单详情',
      activeMenu: '/main/request-list',
      permission: ['request_list_read']
    }
  }

]
