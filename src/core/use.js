import Vue from 'vue'
import Storage from 'vue-ls'
import './element'
import * as http from '@/core/http'
import * as directives from '@/utils/directives' // 自定义指令
import { appConfig } from '@/core/http'
import { permission } from '@/utils/common'
import { confirmMsg, confirmDelete, tipMessage } from '@/core/message'
import '@/assets/font/iconfont.css'
import { tableCode } from '@/core/common'

const options = {
  namespace: appConfig.productName + '__$KEY$__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
}

// 注册指令
const dirKeys = Object.keys(directives)
dirKeys.forEach((key) => {
  Vue.use(directives[key])
})

// ==================use 区域==================
Vue.use(Storage, options)

// ==================prototype挂载区域================
Vue.prototype.$http = http
Vue.prototype.$appConfig = appConfig
Vue.prototype.$permission = permission
Vue.prototype.$confirmMsg = confirmMsg
Vue.prototype.$confirmDelete = confirmDelete
Vue.prototype.$tipMessage = tipMessage
Vue.prototype.$tableCode = tableCode
