<template>
  <div class="pwd-page-wraper">
    <Title :title="'修改密码'"></Title>
    <el-form
      :rules="rules"
      :model="pwdform"
      ref="pwdform"
      label-width="100px"
      label-position="left"
    >
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xs="14"
          :sm="12"
          :md="10"
          :lg="8"
          :xl="6"
        >
          <el-form-item
            label="旧密码"
            prop="oldPwd"
          >
            <el-input
              v-model="pwdform.oldPwd"
              type="password"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xs="14"
          :sm="12"
          :md="10"
          :lg="8"
          :xl="6"
        >
          <el-form-item
            label="新密码"
            prop="newPwd"
          >
            <el-input
              v-model="pwdform.newPwd"
              type='password'
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xs="14"
          :sm="12"
          :md="10"
          :lg="8"
          :xl="6"
        >
          <el-form-item
            label="确认密码"
            prop="rePwd"
          >
            <el-input
              v-model="pwdform.rePwd"
              type='password'
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xs="14"
          :sm="12"
          :md="10"
          :lg="8"
          :xl="6"
        >
          <el-form-item class="position">
            <el-button @click="onBack">返回</el-button>
            <el-button
              type="primary"
              @click="onSubmit('pwdform')"
            >修改密码</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Title from '@/components/title/Title'
import { mapActions } from 'vuex'
export default {
  components: {
    Title
  },
  name: 'ChangePwd',
  data () {
    const validateNewPwd = (rule, value, callback) => {
      if (value.length < 5 || value.length > 16) {
        return callback(new Error('密码长度5到16位'))
      } else if (this.pwdform.rePwd) {
        this.$refs.pwdform.validateField('rePwd')
      }
      callback()
    }
    const validateRePwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入新密码'))
      }
      if (value.length < 5 || value.length > 16) {
        return callback(new Error('密码长度5到16位'))
      }
      if (value !== this.pwdform.newPwd) {
        return callback(new Error('两次输入密码不一致'))
      }
      callback()
    }
    return {
      pwdform: {
        oldPwd: '',
        newPwd: '',
        rePwd: ''
      },
      /**
       * 自定义规则
       */
      rules: {
        oldPwd: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'change' },
          { validator: validateNewPwd, trigger: 'change' }
        ],
        rePwd: [
          { required: true, message: '请再次输入新密码', trigger: 'change' },
          { validator: validateRePwd, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions('user', ['logOut']),
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            new: this.pwdform.newPwd,
            old: this.pwdform.oldPwd
          }
          this.$http.put('/system/user/self/pass', { data: params, error_return: true }).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.logOut().then(res => {
              this.$router.push('/login')
            })
          }, err => {
            console.log(err, 'errr')
            if (err.code === 10) {
              this.$message.error('旧密码无效')
            } else {
              this.$message.error(err.code.msg)
            }
          })
        } else {
          this.$message({
            message: '验证不通过',
            type: 'error'
          })
        }
      })
    },
    onBack () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.pwd-page-wraper {
  width: 100%;
  .position {
    text-align: center;
  }
}
</style>
