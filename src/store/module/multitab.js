import Vue from 'vue'
import { CACHE_PAGE_NAME, OPEN_PAGE_LIST } from '../storageConst'

const state = {
  // 是否要缓存页面,false不缓存, true缓存
  cachePage: false,
  // 已经打开的页面
  openedPageList: [],
  // 当前打开的标签页面
  currentTagNav: {},
  // 缓存的页面
  cachedPageName: []
}

const mutations = {
  // 打开标签页面
  addTagNav (state, data) {
    // 判断全路径完全相等不执行
    if (state.openedPageList.some(v => v.fullpath === data.fullpath)) return
    // 判断组件路径是否已经存在,存在更新原有数据
    if (state.openedPageList.some(v => v.path === data.path)) {
      state.openedPageList.forEach((v, i) => {
        if (v.path === data.path) {
          state.openedPageList[i] = data
        }
      })
    } else {
      if (state.cachedPageName.includes(data.name)) {
        console.error(`${data.name} 组件出现命名重复，请检查组件中的name字段。当前组件所在的路由地址为：${data.path}`)
        return
      }
      state.openedPageList.push(data)
      if (state.cachePage) {
        if (data.name) {
          state.cachedPageName.push(data.name)
          Vue.ls.set(CACHE_PAGE_NAME, JSON.stringify(state.cachedPageName))
        }
      }
    }
    if (state.cachePage) {
      Vue.ls.set(OPEN_PAGE_LIST, JSON.stringify(state.openedPageList))
    }
  },
  // 删除标签页面
  removeTagNav (state, data) {
    if (data) {
      for (const [i, v] of state.openedPageList.entries()) {
        if (v.path === data.path) {
          state.openedPageList.splice(i, 1)
        }
      }
      if (state.cachePage) {
        const index = state.cachedPageName.indexOf(data.name)
        if (index >= 0) {
          state.cachedPageName.splice(index, 1)
        }
      }
    } else {
      state.openedPageList = []
      state.cachedPageName = []
    }
    // 判断是否开启浏览器刷新保留已打开标签
    if (state.cachePage) {
      Vue.ls.set(OPEN_PAGE_LIST, JSON.stringify(state.openedPageList))
      Vue.ls.set(CACHE_PAGE_NAME, JSON.stringify(state.cachedPageName))
    }
  },
  // 删除其他标签
  deleteOtherTags (state, data) {
    // const arr = state.openedPageList.filter(ele => {
    //   return ele.title === '首页' || ele.title === data.title
    // })
    state.openedPageList = [data]
    if (state.cachePage) {
      state.cachedPageName = [data.name]
    }
    // 判断是否开启浏览器刷新保留已打开标签
    if (state.cachePage) {
      Vue.ls.set(OPEN_PAGE_LIST, JSON.stringify(state.openedPageList))
      Vue.ls.set(CACHE_PAGE_NAME, JSON.stringify(state.cachedPageName))
    }
  },
  // 更新当前访问标签页面
  setCurrentTagNav (state, data) {
    state.currentTagNav = data
  },
  // 更新打开标签数据列表
  setOpenedPageList (state, data) {
    if (data) {
      state.openedPageList = data
    }
  },
  // 更新标签页面缓存数据列表
  setCachedPageName (state, data) {
    if (data) {
      state.cachedPageName = data
    }
  }

}

const actions = {
  // 初始化页面数据缓存数据
  initPageList: ({ commit, state }) => {
    if (state.cachePage) {
      // 读取打开标签列表数据
      const dataList = JSON.parse(Vue.ls.get(OPEN_PAGE_LIST))
      commit('setOpenedPageList', dataList)
      // 读取缓存标签页面数据
      let dataCache = JSON.parse(Vue.ls.get(CACHE_PAGE_NAME))
      if (dataCache) {
        dataCache = dataCache.filter(v => {
          if (v !== null) { return true }
        })
        commit('setCachedPageName', dataCache)
      }
    }
  },
  // 快捷关闭当前访问标签
  closeCurrentTag: ({ commit, state }) => {
    if (state.currentTagNav) {
      const data = state.currentTagNav
      commit('removeTagNav', data)
    }
  },
  // 快捷关闭所有标签
  clearAllTag: ({ commit }) => {
    commit('removeTagNav')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
