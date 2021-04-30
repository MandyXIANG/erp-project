export default [
  {
    path: 'stockin-receive-task',
    name: '收料单',
    component: () => import('@/views/stockin/receive-task/Receive-Task'),
    meta: {
      tabName: '收料单',
      activeMenu: '/main/stockin-receive-task',
      permission: ['stockin_read_receipt_task']
    }
  }, {
    path: 'stockin-receive-task-detail',
    name: '收料单详情',
    component: () => import('@/views/stockin/receive-task/Detail'),
    meta: {
      tabName: '收料单详情',
      activeMenu: '/main/stockin-receive-task',
      permission: ['stockin_receipt_task_detail']
    }
  }, {
    path: 'stockin-edit-receive-task',
    name: '编辑收料单',
    component: () => import('@/views/stockin/receive-task/Edit-Receive-Task'),
    meta: {
      tabName: '编辑收料单',
      activeMenu: '/main/stockin-receive-task',
      permission: ['stockin_edit_receipt_task', 'stockin_new_receipt_task']
    }
  },
  {
    path: 'stockin-material-receive',
    name: '收料列表',
    component: () => import('@/views/stockin/material-receive/Material-Receive'),
    meta: {
      tabName: '收料列表',
      activeMenu: '/main/stockin-material-receive',
      permission: ['stockin_read_receipt']
    }
  },
  {
    path: 'stockin-recevice',
    name: '收料',
    component: () => import('@/views/stockin/material-receive/Receive'),
    meta: {
      tabName: '收料',
      activeMenu: '/main/stockin-material-receive',
      permission: ['stockin_receipt']
    }
  },
  {
    path: 'stockin-wait-check',
    name: '收料单待审核',
    component: () => import('@/views/stockin/wait-check/WaitCheck'),
    meta: {
      tabName: '待审核',
      activeMenu: '/main/stockin-wait-check',
      permission: ['stockin_read_wait_check']
    }
  }, {
    path: 'stockin-edit-wait-check',
    name: '编辑审核',
    component: () => import('@/views/stockin/wait-check/Edit-WaitCheck'),
    meta: {
      tabName: '审核信息',
      activeMenu: '/main/stockin-wait-check',
      permission: ['stockin_check_receipt_task']
    }
  }, {
    path: 'stockin-material-stock-list',
    name: '存料列表',
    component: () => import('@/views/stockin/material-stock/Material-Stock-List'),
    meta: {
      tabName: '存料列表',
      activeMenu: '/main/stockin-material-stock-list',
      permission: ['stockin_read_material_stock']
    }
  }, {
    path: 'stockin-material-stock-detail',
    name: '存料详情',
    component: () => import('@/views/stockin/material-stock/Detail'),
    meta: {
      tabName: '存料详情',
      activeMenu: '/main/stockin-material-stock-list',
      permission: ['stockin_read_material_stock_detail']
    }
  },
  {
    path: 'stockin-material-stock',
    name: '存料',
    component: () => import('@/views/stockin/material-stock/Material-Stock'),
    meta: {
      tabName: '存料',
      activeMenu: '/main/stockin-material-stock-list',
      permission: ['stockin_edit_material_stock']
    }
  }
]
