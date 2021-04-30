export default [
  {
    path: 'purchase-info',
    name: '采购基本信息',
    component: () => import('@/views/purchase-management/purchase-info/PurchaseInfo.vue'),
    meta: {
      tabName: '采购基本信息',
      activeMenu: '/main/purchase-info'
    }
  },
  {
    path: 'purchase-search',
    name: '采购查询',
    component: () => import('@/views/purchase-management/purchase-search/PurchaseSearch.vue'),
    meta: {
      tabName: '采购查询',
      activeMenu: '/main/purchase-search'
    }
  },
  {
    path: 'purchase-wait-check',
    name: '待审核采购订单',
    component: () => import('@/views/purchase-management/wait-check/WaitCheck.vue'),
    meta: {
      tabName: '待审核采购订单',
      activeMenu: '/main/purchase-wait-check',
      permission: ['purchase_order_check_read']
    }
  },
  {
    path: 'purchase-check',
    name: '审核采购订单',
    component: () => import('@/views/purchase-management/wait-check/Check.vue'),
    meta: {
      tabName: '审核采购订单',
      activeMenu: '/main/purchase-wait-check',
      permission: ['purchase_order_check_opt']

    }
  },

  {
    path: 'purchase-order',
    name: '采购订单',
    component: () => import('@/views/purchase-management/purchase-order/PurchaseOrder.vue'),
    meta: {
      tabName: '采购订单',
      activeMenu: '/main/purchase-order',
      permission: ['purchase_order_read']

    }
  },
  {
    path: 'new-purchase',
    name: '新建采购订单',
    component: () => import('@/views/purchase-management/purchase-order/NewOrEdit.vue'),
    meta: {
      tabName: '新建采购订单',
      activeMenu: '/main/purchase-order',
      permission: ['purchase_order_new', 'purchase_order_edit']

    }
  },
  {
    path: 'purchase-detail',
    name: '采购订单详情',
    component: () => import('@/views/purchase-management/purchase-order/Detail.vue'),
    meta: {
      tabName: '采购订单详情',
      activeMenu: '/main/purchase-order',
      permission: ['purchase_order_read']

    }
  },
  {
    path: 'purchase-track',
    name: '订单跟踪',
    component: () => import('@/views/purchase-management/purchase-order/OrderTrack.vue'),
    meta: {
      tabName: '订单跟踪',
      activeMenu: '/main/purchase-order',
      permission: ['purchase_order_track']

    }
  }

]
