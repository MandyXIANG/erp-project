<template>
  <div class="login-page">
    <div class="login-left">
      <div class="sys-info">
        <h2 class="info-title">ERP-Enterprise Resources Planning</h2>
        <p class="info-content">
          ERP是对企业的多种资源进行计划和实现物流、资金流、信息流（“三流”）统一的操作平台和面向供应链的管理.
        </p>
      </div>
    </div>
    <div class="login-right">
      <div class="login-container">
        <!-- <h1 class="login-title">TopLinker-ERP</h1> -->
        <div class="login-content-top">
          <div class="login-logo">
            <img src="@/assets/imgs/TopIBD-LOGO-02.png" alt="info" />
          </div>
          <h1 class="login-title">TopLinker-ERP</h1>
        </div>
        <el-form ref="userform" :model="userform">
          <el-form-item>
            <el-input
              class="login-input"
              size="large"
              v-model.trim="userform.username"
              placeholder="用户名"
              prefix-icon="el-icon-user"
              @keyup.native.enter="usernameEnter"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              size="large"
              class="login-input"
              v-model.trim="userform.password"
              placeholder="密码"
              type="password"
              prefix-icon="el-icon-lock"
              ref="password"
              @keyup.native.enter="passwordEnter"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="remember">
              <el-checkbox v-model="userform.remember">记住密码</el-checkbox>
              <div class="version">版本：{{ config.version }}</div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-input"
              size="large"
              style="width:100%"
              type="primary"
              @click="onSubmit"
              :disabled="!userform.username || !userform.password"
              ref="submitBtn"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
        <div class="login-footer">
          Copyright &copy; 2018-{{ new Date().getFullYear() }} All Rights
          Reserved无锡东领智能科技股份有限公司
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { decrypt } from '@/utils/common'
import { mapActions } from 'vuex'
import { USERNAME, PASSWORD, REMEMBER_ME } from '@/store/storageConst'
import config from '../../../package.json'
export default {
  name: 'Login',
  data () {
    return {
      userform: {
        username: '',
        password: '',
        remember: false
      },
      config
    }
  },
  computed: {},
  created () {
    if (this.$ls.get(REMEMBER_ME)) {
      this.userform = {
        username: this.$ls.get(USERNAME) || '',
        password: decrypt(this.$ls.get(PASSWORD)) || '',
        remember: this.$ls.get(REMEMBER_ME) || false
      }
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    onSubmit () {
      const params = {
        password: this.userform.password,
        remember: this.userform.remember,
        username: this.userform.username
      }
      this.login(params)
        .then(res => {
          this.$router.push('/main')
          this.$message.success('Welcome back!', 3)
        })
        .catch(err => {
          if (err.code === 3) {
            this.$message.error('用户名或密码无效')
          } else {
            this.$message.error(err.msg)
          }
        })
    },
    usernameEnter () {
      this.$refs.password.focus()
    },
    passwordEnter () {
      if (this.userform.username && this.userform.password) {
        this.onSubmit()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.login-page {
  height: 100%;
  display: flex;
  .login-left {
    flex: 1.5;
    // border-radius:0 40px 40px 0;
    background: linear-gradient(
      to right,
      $--color-primary,
      $--color-primary-light-2
    );
    display: flex;
    justify-content: center;
    align-items: center;
    .sys-info {
      width: 60%;
      .info-title {
        color: #fff;
        font-weight: normal;
        margin-bottom: 10px;
      }
      .info-content {
        color: #f3f9fe;
        line-height: 26px;
      }
    }
  }
  .login-right {
    flex: 1.2;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .login-title {
      margin-bottom: 120px;
      text-align: center;
      font-size: 32px;
      color: $--color-primary-light-3;

    }
    .login-container {
      width: 90%;
      .login-content-top {
        .login-logo {
          border: 1px solid red;
          width: 80px;
          height: 80px;
          border: 5px solid $--color-primary;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: $--color-primary;
          box-shadow: 0 0 10px #333333;
          margin: 0 auto;
          margin-bottom:50px;
          img {
            display: block;
            width: 60px;
            height: 60px;
          }
        }
      }
      .login-input {
        height: 50px;
        /deep/ .el-input__inner {
          height: 50px;
        }
      }
    }
    .login-footer {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 36px;
      text-align: center;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }
    .version {
      position: absolute;
      right: 10px;
      bottom: 5px;
      color: rgba(0, 0, 0, 0.7);
    }
  }
}
@media (max-width: $screen-md) {
  .login-page {
    flex-direction: column-reverse;
    .login-left {
      border-radius: 0;
    }
    .login-footer {
      display: none;
    }
    .login-title {
      margin-bottom: 20px !important;
    }
    .login-left {
      flex: 1;
      .sys-info {
        width: 80%;
      }
    }
    .login-right {
      flex: 3;
      .login-container {
        .login-input {
          height: 40px;
          /deep/ .el-input__inner {
            height: 40px;
          }
        }
      }
    }
  }
}
</style>
