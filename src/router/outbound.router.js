const Outbound = [
  {
    path: 'outbound-order',
    name: '出库单',
    component: () => import('@/views/outbound/outbound-order/Outbound'),
    meta: {
      tabName: '出库单',
      activeMenu: '/main/outbound-order',
      permission: ['outbound_manage_read']
    }
  },
  {
    path: 'outbound-edit',
    name: '编辑出库单',
    component: () => import('@/views/outbound/outbound-order/Edit'),
    meta: {
      tabName: '出库单信息',
      activeMenu: '/main/outbound-order',
      permission: ['outbound_manage_new', 'outbound_edit']
    }
  },
  {
    path: 'outbound-detail',
    name: '出库单详情',
    component: () => import('@/views/outbound/outbound-order/Detail'),
    meta: {
      tabName: '出库单详情',
      activeMenu: '/main/outbound-order',
      permission: ['outbound_manage_info']
    }
  },
  {
    path: 'prepare-material',
    name: '备料',
    component: () => import('@/views/outbound/prepare-material/Prepare'),
    meta: {
      tabName: '备料',
      activeMenu: '/main/prepare-material',
      permission: ['prepare_manage_read']
    }
  },
  {
    path: 'prepare-Detail',
    name: '备料详情',
    component: () => import('@/views/outbound/prepare-material/Detail'),
    meta: {
      tabName: '备料详情',
      activeMenu: '/main/prepare-material',
      permission: ['prepare_manage_info']
    }
  },
  {
    path: 'store-issue',
    name: '发料',
    component: () => import('@/views/outbound/store-issue/Issue'),
    meta: {
      tabName: '发料',
      activeMenu: '/main/store-issue',
      permission: ['outbound_read_store_issue']
    }
  },
  {
    path: 'wait-check',
    name: '待审核',
    component: () => import('@/views/outbound/wait-check/Check'),
    meta: {
      tabName: '待审核',
      activeMenu: '/main/wait-check',
      permission: ['outbound_check_manage_read']
    }
  },
  {
    path: 'check-detail',
    name: '审核详情',
    component: () => import('@/views/outbound/wait-check/Detail'),
    meta: {
      tabName: '待审核',
      activeMenu: '/main/wait-check',
      permission: ['outbound_check_manage_info']
    }
  }
]

export default Outbound
