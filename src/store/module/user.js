import { SET_PERMISSION, SET_ROLES, SET_USER_ID, SET_USER_INFO } from '../storeConst'
import { USER_ID, PERMISSION, USER, USER_INFO } from '../storageConst'
import Vue from 'vue'
import * as http from '@/core/http'
import * as _ from 'lodash'

const state = {
  roles: [],
  permission: [],
  id: null,
  menuList: [],
  userInfo: {}
}

const mutations = {
  // 设置权限
  [SET_PERMISSION] (state, permission) {
    state.permission = permission
  },
  //   设置角色
  [SET_ROLES] (state, roles) {
    state.roles = roles
  },
  // 登录
  [SET_USER_ID] (state, id) {
    state.id = id
    Vue.ls.set(USER_ID, id)
  },
  [SET_USER_INFO] (state) {
    state.userInfo = Vue.ls.get(USER_INFO)
  }
}

const actions = {
  // 登录
  login ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      http.post('/login', { data: payload, error_return: true })
        .then(res => {
          const a = dispatch('getUserInfo')
          Promise.all([a]).then(res => {
            resolve(res)
          })
          dispatch('getUserInfo')
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  logOut ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      http.del('/login', { data: {} }).then((res) => {
        commit(SET_PERMISSION, [])
        commit(SET_ROLES, [])
        commit('multitab/removeTagNav', null, { root: true })
        Vue.ls.remove(PERMISSION)
        resolve()
      })
        .catch(err => {
          reject(err)
        })
    })
  },
  getUserInfo ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      http.get('/system/user/self').then((res) => {
        Vue.ls.set(USER, res.data.name)
        Vue.ls.set(USER_INFO, { id: res.data.id, username: res.data.name, fullname: res.data.fullname })
        commit(SET_USER_ID, res.data.id)
        commit(SET_USER_INFO)
        const a = dispatch('getPermissionByUser', res.data.id)
        Promise.all([a]).then(res => {
          resolve(2)
        })
      })
    })
  },
  getPermissionByUser ({ dispatch, state }, id) {
    return new Promise((resolve, reject) => {
      http.get(`/system/roleperm/user/${id}`).then(res => {
        const perms = []
        if (res && res.code === 0 && res.data) {
          for (const item of res.data) {
            for (const jtem of item.perms) {
              perms.push(jtem.code)
            }
          }
        }
        state.permission = _.uniq(perms)
        Vue.ls.remove(PERMISSION)
        Vue.ls.set(PERMISSION, _.uniq(perms))
        dispatch('generateMenu')
        resolve(1)
      })
    })
  },
  generateMenu ({ dispatch, state }) {
    const menuList = require('@/config/menu.config')

    if (Vue.ls.get(USER) === 'admin') {
      state.menuList = JSON.parse(JSON.stringify(menuList))
      return
    }
    const arr = JSON.parse(JSON.stringify(menuList))
    dispatch('getMenuByPerm', arr)
    for (const item of arr) {
      filterMenu(item)
    }
    state.menuList = JSON.parse(JSON.stringify(arr))
  },

  getMenuByPerm ({ dispatch, state }, arr) {
    for (const item of arr) {
      if (item.permission && item.permission.length) {
        if (state.permission.indexOf(item.permission) < 0) {
          item.hidden = true
        }
      }
      if (item.children && item.children.length) {
        dispatch('getMenuByPerm', item.children)
      }
    }
  },
  hiddenParent ({ dispatch, state }, arr) {
    for (const item of arr) {
      if (item.children && item.children.length) {
        const arr2 = item.children.filter(o => {
          return !o.hidden
        })
        if (!arr2.length) {
          item.hidden = true
        } else {
          dispatch('hiddenParent', arr2)
        }
      }
    }
  }

}

function filterMenu (item) {
  if (item.children && item.children.length) {
    for (const ele of item.children) {
      if (ele.children && ele.children.length) { // 不是最下面的一层
        filterMenu(ele)
      } else {
        const arr2 = item.children.filter(o => {
          return !o.hidden
        })
        if (!arr2.length) {
          item.hidden = true
        }
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
