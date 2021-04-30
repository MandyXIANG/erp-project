export default {
  path: 'organization',
  name: '组织架构管理',
  component: () => import('@/views/sys-organization/Organization.vue'),
  meta: {
    tabName: '组织架构管理',
    activeMenu: '/main/organization',
    permission: ['read_organization']
  }
}
