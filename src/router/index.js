import Vue from 'vue'
import VueRouter from 'vue-router'
import { USER } from '@/store/storageConst'
import { appConfig } from '@/core/http'
import { getCookie, permission } from '@/utils/common.js'

import SYS_USER from './sys-user.router'
import SYS_ROLE from './sys-role.router'
import SYS_PERMISSION from './sys-permission.router'
import SYS_API from './sys-api.router'
import SYS_ENUM from './sys-enum.router'
import SYS_UNIT from './sys-unit.router'
import SYS_ORGANIZATION from './sys-organization.router'
import PERSON_CENTER from './person-center.router'
import CHANGE_PWD from './change-pwd.router'
import CUSTOMER from './customer.router'
import MATERIAL from './material.router'
import INVENTORY from './inventory.router'
import HS from './hs.router'
import WAREHOUSE from './warehouse.router'
import SUPPLIER from './supplier.router'
import SUPPLIER_MATERIAL from './supplier-material.router'
import PURCHASE_PROCESS from './purchase-management.router'
import STOCKIN from './stockin.router'
import CONTACT from './contact.router'
import SALE_MANAGEMENT from './sale-management.router'
import OUT_BOUND from './outbound.router'
import DELIVER from './deliver.router'
import REQUEST_MANAGEMENT from './purchase-request.router'
import MATERIAL_GROUP from './material-group.router'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'INDEX',
    redirect: '/login'
  },
  {
    path: '/main',
    component: () => import('@/views/layout/Layout.vue'),
    children: [
      {
        path: '',
        name: '首页',
        component: () => import('@/views/home/Home.vue'),
        meta: {
          tabName: '首页'
        }
      },
      ...SYS_USER,
      ...SYS_ROLE,
      ...SYS_PERMISSION,
      ...SYS_API,
      ...SYS_ENUM,
      ...SYS_UNIT,
      SYS_ORGANIZATION,
      PERSON_CENTER,
      CHANGE_PWD,
      ...CUSTOMER,
      ...SUPPLIER_MATERIAL,
      ...MATERIAL,
      ...INVENTORY,
      ...HS,
      ...WAREHOUSE,
      ...SUPPLIER,
      ...PURCHASE_PROCESS,
      ...STOCKIN,
      ...CONTACT,
      ...SALE_MANAGEMENT,
      ...OUT_BOUND,
      ...DELIVER,
      ...REQUEST_MANAGEMENT,
      ...MATERIAL_GROUP
    ]
  },
  {
    path: '/login',
    name: 'LOGIN',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/403',
    name: 'FORBID',
    component: () => import('@/views/exception/403.vue')
  },
  {
    path: '/500',
    name: 'SERVER_ERROR',
    component: () => import('@/views/exception/500.vue')
  },
  {
    path: '*',
    name: 'NOT_FOUND',
    component: () => import('@/views/exception/404.vue')
  }
]

const router = new VueRouter({
  mode: '',
  base: process.env.BASE_URL,
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const whiteList = ['首页']
// 路由守卫
router.beforeEach((to, from, next) => {
  var username = Vue.ls.get(USER)
  if (to.matched.length === 0) { // 如果未匹配到路由
    next({ name: 'NOT_FOUND' })
  } else {
    if (appConfig.login) { // 必须要登录
      if (to.path === '/login') { // 默认跳转至登录页时，判断是否记住密码
        if (getCookie('session_id')) {
          next('/main')
        } else {
          next()
        }
      } else {
        if (getCookie('session_id')) { // 已经登录了
          if (whiteList.includes(to.name)) { // 白名单，全通过
            next()
          } else {
            if (username === 'admin') {
              next()
            } else {
              if (to.meta.permission && to.meta.permission.length) {
                let pass = false
                for (const item of to.meta.permission) {
                  if (permission(item)) {
                    pass = true
                  }
                }
                if (pass) {
                  next()
                } else {
                  next('/403')
                }
              } else { // 没有配置权限的直接通过
                next()
              }
            }
          }
        } else { // 跳转至登录
          next('/login')
        }
      }
    } else {
      next()
    }
  }
})

export default router
