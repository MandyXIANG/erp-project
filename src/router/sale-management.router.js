export default [
  {
    path: 'sale-info',
    name: '销售基本信息',
    component: () => import('@/views/sale-management/sale-info/SaleInfo.vue'),
    meta: {
      tabName: '销售基本信息',
      activeMenu: '/main/sale-info',
      permission: ['sale_info_read']
    }
  },
  {
    path: 'sale-check',
    name: '审核销售订单',
    component: () => import('@/views/sale-management/check/Check.vue'),
    meta: {
      tabName: '待审核',
      activeMenu: '/main/sale-check',
      permission: ['sale_check_read']
    }
  },
  {
    path: 'sale-check-detail',
    name: '审核订单',
    component: () => import('@/views/sale-management/check/Detail.vue'),
    meta: {
      tabName: '审核订单',
      activeMenu: '/main/sale-check',
      permission: ['check_order']
    }
  },
  {
    path: 'sale-order',
    name: '销售订单',
    component: () => import('@/views/sale-management/sale-order/SaleOrder.vue'),
    meta: {
      tabName: '销售订单',
      activeMenu: '/main/sale-order',
      permission: ['sale_order_read']
    }
  },
  {
    path: 'edit-sale-order',
    name: '编辑销售订单',
    component: () => import('@/views/sale-management/sale-order/NewOrEdit.vue'),
    meta: {
      tabName: '销售订单信息',
      activeMenu: '/main/sale-order',
      permission: ['sale_order_eidt', 'sale_order_new']
    }
  },
  {
    path: 'delivery',
    name: '发货',
    component: () => import('@/views/sale-management/sale-order/Delivery.vue'),
    meta: {
      tabName: '发货',
      activeMenu: '/main/sale-order',
      permission: ['sale_order_delivery']
    }
  },
  {
    path: 'sale-detail',
    name: '销售订单详情',
    component: () => import('@/views/sale-management/sale-order/Detail.vue'),
    meta: {
      tabName: '销售订单详情',
      activeMenu: '/main/sale-order',
      permission: ['sale_order_detail']
    }
  }
]
