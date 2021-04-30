<template>
  <div class="layout-side-menue" :class="collapsed && 'collapse'">
    <el-scrollbar>
      <el-menu
        :collapse-transition="false"
        :collapse="collapsed"
        @select="handleSelect"
        :default-active="activeMenu"
      >
        <SubMenu v-for="(item, index) in menuList" :key="index" :menu="item" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SubMenu from './SubMenu'
import { mapState } from 'vuex'
export default {
  components: {
    SubMenu
  },
  computed: {
    ...mapState('app', ['collapsed']),
    ...mapState({
      menuList: state => state.user.menuList
    }),
    activeMenu () {
      const { path, meta, query } = this.$route
      if (query.activeMenu) {
        return query.activeMenu
      }
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  data () {
    return {
      // menuList: [],
      permissions: []
    }
  },
  created () {},
  mounted () {
    // this.menuList = require('@/config/menu.config')
    // this.permissions = Vue.ls.get(PERMISSION)
    // this.getMenuByPerm(this.menuList)
    // this.hiddenParent(this.menuList)
    // this.menuList = JSON.parse(JSON.stringify(this.menuList))
    // console.log('菜单', this.menuList, this.permissions)
  },
  methods: {
    // getMenuByPerm (arr) {
    //   for (const item of arr) {
    //     if (item.permission && item.permission.length) {
    //       if (this.permissions.indexOf(item.permission) < 0) {
    //         item.hidden = true
    //       }
    //     }
    //     if (item.children && item.children.length) {
    //       this.getMenuByPerm(item.children)
    //     }
    //   }
    // },
    // hiddenParent (arr) {
    //   for (const item of arr) {
    //     if (item.children && item.children.length) {
    //       const arr2 = item.children.filter(o => {
    //         return !o.hidden
    //       })
    //       if (!arr2.length) {
    //         item.hidden = true
    //       } else {
    //         this.hiddenParent(arr2)
    //       }
    //     }
    //   }
    // },
    handleSelect (key, keyPath) {
      this.$router.push(key)
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-side-menue {
  height: calc(100% - #{$layout-header-height});
  width: $layout-nav-width;
  position: fixed;
  left: 0;
  top: $layout-header-height;
  z-index: 10;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  &.collapse {
    width: $layout-nav-collapsed-width;
    /deep/ .el-icon-arrow-right {
      right: 10px;
    }
  }
  /**重置菜单样式 */

  .el-scrollbar {
    height: 100%;
  }
  /deep/ .el-submenu,
  .el-menu-item {
    text-align: left !important;
  }
}
</style>
