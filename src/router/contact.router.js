const CONTACT = [
  {
    path: 'contactList',
    name: '联系人管理',
    component: () => import('@/views/contact/ContactList'),
    meta: {
      tabName: '联系人管理',
      activeMenu: '/main/contactList',
      permission: ['contact_manager_read']
    }
  },
  {
    path: 'editContact/:operation',
    name: '编辑联系人',
    component: () => import('@/views/contact/EditContact'),
    meta: {
      tabName: '编辑联系人',
      activeMenu: '/main/contactList',
      permission: ['contact_manager_new', 'contact_edit']
    }
  },
  {
    path: 'contactInfo',
    name: '联系人详情',
    component: () => import('@/views/contact/ContactInfo'),
    meta: {
      tabName: '联系人详情',
      activeMenu: '/main/contactList',
      permission: ['contact_manage_info']
    }
  }
]
export default CONTACT
