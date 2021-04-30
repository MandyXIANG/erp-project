import Vue from 'vue'
import { THEME_COLOR, COLLAPSED, USER_ID } from '@/store/storageConst'
import { SET_THEME_COLOR, SET_COLLAPESD, GET_MENU, SET_USER_INFO } from '@/store/storeConst'
import { appConfig } from './http'
import store from '@/store'
export default () => {
  const themeColor = Vue.ls.get(THEME_COLOR) || appConfig.themeColor
  const collapsed = Vue.ls.get(COLLAPSED)
  store.commit('app/' + SET_THEME_COLOR, themeColor)
  store.commit('app/' + SET_COLLAPESD, collapsed)
  store.dispatch('user/' + GET_MENU, Vue.ls.get(USER_ID))
  store.commit('user/' + SET_USER_INFO)
}
