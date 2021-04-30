import CryptoJS from 'crypto-js'
import * as Http from '@/core/http.js'
import { USER, PERMISSION } from '@/store/storageConst'
import Vue from 'vue'

/**
 * 加密
 */
export const encrypt = (password) => {
  const key = CryptoJS.enc.Utf8.parse('abcdsxyzhkj12345')
  const srcs = CryptoJS.enc.Utf8.parse(password)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString()
  return encrypted
}

/**
 * 解密
 */
export const decrypt = (password) => {
  const key = CryptoJS.enc.Utf8.parse('abcdsxyzhkj12345')
  const decrypt = CryptoJS.AES.decrypt(password, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  const srcs = CryptoJS.enc.Utf8.stringify(decrypt).toString()
  return srcs
}

/**
 * @param {*} key 需要判断的权限名
 */
export const permission = (key) => {
  const permissionList = Vue.ls.get(PERMISSION) || []
  const username = Vue.ls.get(USER)

  // 如果用户是admin 那么不设置权限 都能操作
  if (username === 'admin' || !key) {
    return true
  }
  let pass = false
  for (let index = 0; index < permissionList.length; index++) {
    const element = permissionList[index]
    if (element === key || element === key.toUpperCase() || element === key.toLocaleLowerCase()) {
      pass = true
    }
  }
  return pass
}

/**
 * 获取cookie
 * @param {*} key
 */
export const getCookie = (key) => {
  if (document.cookie.length > 0) {
    let cookieStart = document.cookie.indexOf(key + '=')
    if (cookieStart !== -1) {
      cookieStart = cookieStart + key.length + 1
      let cookieEnd = document.cookie.indexOf(';', cookieStart)
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length
      }
      return unescape(document.cookie.substring(cookieStart, cookieEnd))
    }
  }
  return ''
}

/**
 * 获取枚举
 * @param {*} category
 */

export const getEnumGroup = (category) => {
  return new Promise((resolve, reject) => {
    if (category === undefined || category === null || !category.length) {
      category = []
    }
    Http.get(`/system/enums?group=${category.join(',')}`).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
