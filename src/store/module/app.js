import Vue from 'vue'
import { SET_THEME_COLOR, SET_COLLAPESD } from '../storeConst'
import { THEME_COLOR, COLLAPSED } from '@/store/storageConst'
const appConfig = require('@/core/http')
const state = {
  themeColor: appConfig.themeColor,
  collapsed: false
}

const mutations = {
  // 设置主题
  [SET_THEME_COLOR] (state, color) {
    state.themeColor = color
    Vue.ls.set(THEME_COLOR, color)
  },
  // 设置菜单折叠
  [SET_COLLAPESD] (state, collapsed) {
    state.collapsed = collapsed
    Vue.ls.set(COLLAPSED, collapsed)
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
