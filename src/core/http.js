/* eslint-disable no-unused-vars */
import Vue from 'vue'
import axios from 'axios'
import { Notification, Loading } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import router from '@/router'
import { errMap } from './errMap'

let envConfig = {}
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
if (IS_PROD) {
  envConfig = require('@/config/prod.json')
} else {
  envConfig = require('@/config/dev.json')
}
export const appConfig = envConfig
const url = ''
let loading

// 创建一个实例
const $axios = axios.create()
$axios.defaults.withCredentials = true // 允许携带cookie
// 请求次数
Vue.prototype.$progressInstance = 0

const codeMap = {
  0: 'ok',
  1: 'ServerError',
  2: 'BadRequest',
  3: 'LoginFailed',
  4: 'Forbidden',
  5: 'NotImplemented',
  6: 'InvalidSession',
  7: 'LoginExpired',
  8: 'NotFound',
  9: 'DBError',
  10: 'InvalidPassword',
  11: 'NoChange',
  12: 'NoParty', // 没有组织和架构部门的
  13: 'UserDisabled', // 用户被禁用
  14: 'UserExist', // 用户存在
  15: 'ContentDuplicate'
}

/**
 * 打开loading
 */
function startLoading () {
  loading = Loading.service({
    lock: true
  })
}

/**
 * 关闭loading
*/
function closeLoading () {
  if (loading) {
    loading.close()
  }
}

/**
 * Get请求
 * @param {*} api 路径
 * @param {*} options { apiName:string, timeout:number, is_loading:boolean, error_return:boolean}
 */
function get (api, options = {}) {
  options.method = 'GET'
  return priHttpRequest(api, options)
}

/**
 * POST请求
 * @param {*} api 路径
 * @param {*} options { apiName:string, timeout:number, is_loading:boolean,error_return:boolean}
 */
function post (api, options = {}) {
  options.method = 'POST'
  options.data = options.data || {}
  return priHttpRequest(api, options)
}

/**
 * PUT请求
 * @param {*} api 路径
 * @param {*} options { apiName:string, timeout:number, is_loading:boolean,error_return:boolean}
 */
function put (api, options = {}) {
  options.method = 'PUT'
  options.data = options.data || {}
  return priHttpRequest(api, options)
}

/**
 * DELETE 请求
 * @param {*} api 路径
 * @param {*} options { apiName:string, timeout:number, is_loading:boolean,error_return:boolean}
 */
function del (api, options = {}) {
  options.method = 'DELETE'
  options.data = options.data || {}
  return priHttpRequest(api, options)
}

/**
 * 私有HTTP请求方法
 * @param options - 请求传递过来的参数
 * @param options.organ 是否需要加上组织id
 */
function priHttpRequest (api, options) {
  // 1.定义默认配置参数
  const defaultOptions = {
    contentType: 'application/json;charset-utf-8',
    method: options.method,
    // 超时时间默认30s
    timeout: options.timeout || 30000,
    is_loading: options.is_loading || false,
    error_return: options.error_return || false
  }
  // 返回请求实体
  return $axios({
    ...defaultOptions,
    url: appConfig.base_url + api,
    data: options.data
  })
}

/**
 * 添加请求拦截器
 */
$axios.interceptors.request.use(function (request) {
  // 在发送请求之前做些什么
  if (request.method === 'get') {
    request.params = request.data
  }
  // 增加时间戳防止缓存
  request.params = request.params || {}
  request.params.t = Date.parse(new Date()) / 1000
  if (request.is_loading) {
    startLoading()
  }
  if (Vue.prototype.$progressInstance === 0) {
    NProgress.start()
  }
  Vue.prototype.$progressInstance += 1
  return request
}, function (error) {
  notification('请求错误')
  return Promise.reject(error)
})

/**
 * 添加响应拦截器
 */
$axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 1.关闭进度条
  Vue.prototype.$progressInstance -= 1
  if (Vue.prototype.$progressInstance === 0) {
    NProgress.done()
  }
  // 2.关闭loading
  closeLoading()
  if (response.data.code === 0 || response.data.code === 8) {
    return Promise.resolve(response.data)
  } else if (response.data.code === 6) {
    // 没有登录重定向到登录页面
    router.push('/login')
  } else if (response.data.code === 12) {
    notification('您还没有加入任何组织或部门!')
  } else {
    if (response.config.error_return) {
      return Promise.reject(response.data)
    } else {
      notification(response.data.msg || response.data.error)
      return Promise.reject(response.data)
    }
  }
}, function (error) {
  // 对响应错误做点什么
  // 1.关闭进度条
  Vue.prototype.$progressInstance -= 1
  if (Vue.prototype.$progressInstance === 0) {
    NProgress.done()
  }
  // 2.关闭loading
  closeLoading()
  // 3.对统一给出错误提示
  notification(error.message)
  return Promise.reject(error.message)
})

function notification (message) {
  Notification({
    type: 'error',
    message: errMap(message),
    duration: 1000
  })
}

export {
  get,
  post,
  put,
  del
}
