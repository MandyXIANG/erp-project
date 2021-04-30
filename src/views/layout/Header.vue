<template>
  <div class="layout-header">
    <div
      class="nav-logo"
      :class="collapsed && 'collapse'"
    >
      <span class="vertical">{{!collapsed ? 'TopLinker-ERP':'ERP'}}</span>
    </div>
    <div
      class="main-tab"
      :class="collapsed && 'collapse'"
    >
      <i
        @click="SET_COLLAPESD(!collapsed)"
        v-if="!collapsed"
        class="el-icon-s-fold"
      ></i>
      <i
        @click="SET_COLLAPESD(!collapsed)"
        v-if="collapsed"
        class="el-icon-s-unfold"
      >
      </i>
    </div>
    <div class="system-list">
      <ul>
        <li>
          <el-dropdown>
            <span class="el-dropdown-link">
              <img
                width="30"
                src="@/assets/imgs/2.jpg"
              >
              <span>{{fullname}}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-user-solid"
                @click.native="goToWorkcenter"
              >个人中心</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-unlock"
                @click.native="goToPwd"
              >修改密码</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-switch-button"
                @click.native="loginOut"
                divided
              >退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import { SET_COLLAPESD } from '@/store/storeConst'
export default {
  components: {
  },
  computed: {
    ...mapState('app', ['collapsed'])
  },
  data () {
    return {
      fullname: null
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    ...mapActions('user', ['logOut']),
    ...mapMutations('app', [SET_COLLAPESD]),
    loginOut () {
      this.logOut()
        .then(res => {
          this.$router.push('/login')
        })
    },
    goToWorkcenter () {
      if (this.$route.path !== '/main') {
        this.$router.push('person-center')
      } else {
        this.$router.push('main/person-center')
      }
      console.log(this.$route, 'router')
    },
    goToPwd () {
      if (this.$route.path === '/main') {
        this.$router.push('main/change-pwd')
      } else {
        this.$router.push('change-pwd')
      }
    },
    getUserInfo () {
      this.$http.get('/system/user/self').then((res) => {
        this.fullname = res.data.fullname
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.layout-header {
  height: $layout-header-height;
  background-color: #fff;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 11;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 5px 12px 0 rgba(0, 0, 0, 0.1);
  .nav-logo {
    width: $layout-nav-width;
    color: $--color-primary;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    font-size: 24px;
    box-sizing: border-box;
    letter-spacing: 3px;
    &.collapse {
      width: $layout-nav-collapsed-width;
    }
  }
  .main-tab {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 $padding-md;
    flex-wrap: nowrap;
    i {
      cursor: pointer;
      font-size: 30px;
      color: #acacac;
    }
  }
  .system-list {
    min-width: 250px;
    ul {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 20px;
      li {
        margin-left: $padding-xs;
        cursor: pointer;
        .el-dropdown-link {
          color: #000;
          font-size: 16px;
          display: flex;
          align-items: center;
          img {
            margin-right: 6px;
            border-radius: 50%;
          }
          &:hover {
            color: $--color-primary;
          }
        }
      }
    }
  }
}
</style>
