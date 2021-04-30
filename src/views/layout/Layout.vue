<template>
  <div class="layout">
    <Header />
    <SideMenu />
    <div class="layout-content" :class="collapsed && 'collapse'">
      <keep-alive >
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view  v-if="!$route.meta.keepAlive" />

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from './Header'
import SideMenu from './SideMenu'

export default {
  components: {
    Header,
    SideMenu
  },
  computed: {
    ...mapState('app', ['collapsed'])
  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #f5f7fa;
  .layout-content {
    padding: $padding-md;
    position: relative;
    width: calc(100% - #{($layout-nav-width)});
    background: #fff;
    top: $layout-header-height;
    left: $layout-nav-width;
    min-height: calc(100% - #{($layout-header-height)});
    box-sizing: border-box;
    transition: width 0.2s;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &.collapse {
      width: calc(100% - #{($layout-nav-collapsed-width)});
      left: $layout-nav-collapsed-width;
    }
  }
}
</style>
