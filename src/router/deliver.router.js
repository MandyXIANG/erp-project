const Deliver = [
  {
    path: 'deliver',
    name: '发货管理',
    component: () => import('@/views/deliver/Deliver'),
    meta: {
      tabName: '发货管理',
      activeMenu: '/main/deliver',
      permission: ['deliver_manager_read']
    }
  },
  {
    path: 'deliverInfo',
    name: '发货详情',
    component: () => import('@/views/deliver/DeliverInfo'),
    meta: {
      tabName: '发货详情',
      activeMenu: '/main/deliverInfo',
      permission: ['deliver_manager_info']
    }
  }
]

export default Deliver
