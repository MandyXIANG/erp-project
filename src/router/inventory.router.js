const INVENTORY = [
  {
    path: 'inventoryList',
    name: '库存信息',
    component: () => import('@/views/inventory/InventoryMain'),
    meta: {
      tabName: '库存信息',
      activeMenu: '/main/inventoryList',
      permission: ['inventory_manage_read']
    }
  }
]
export default INVENTORY
