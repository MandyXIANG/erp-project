<template>
  <div>
    <template v-if="!menu.children && !menu.hidden">
      <el-menu-item :index="menu.path">
        <i v-if="menu.icon" :class="menu.icon"></i>
        <span slot="title" class="menu-text">{{ menu.name }}</span>
      </el-menu-item>
    </template>
    <template v-else>
      <el-submenu v-if="!menu.hidden" :index="menu.path">
        <template slot="title">
          <i v-if="menu.icon" :class="menu.icon"></i>
          <span slot="title" class="menu-text">{{ menu.name }}</span>
        </template>
        <template v-for="item in menu.children">
          <el-menu-item
            v-if="!item.children && !item.hidden"
            :key="item.name"
            :index="item.path"
          >
            <i v-if="item.icon" :class="item.icon"></i>
            <span slot="title" class="menu-text">{{ item.name }}</span>
          </el-menu-item>
          <SubMenu v-else :key="item.name" :menu="item" />
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SubMenu',
  props: ['menu']
}
</script>

<style lang="scss" scoped>
.el-menu--collapse {
  .menu-text {
    display: none;
  }
}
.el-menu-item.is-active {
    background-color: $--color-primary-light-3;
    color: #fff;
}
.el-submenu {
  .el-menu-item {
    i{
      margin-right: 20px;
    }
  }
  .el-submenu__title{
    .menu-text{
      font-size: 14px;
    }
  }
}
.el-menu-item {
  font-size: 14px;
}
i {
  font-size: 14px;
  margin-right: 20px;
  font-style: normal;
  // font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  display: inline-block;
  // color:#000;
  color: #303133;
}
</style>
