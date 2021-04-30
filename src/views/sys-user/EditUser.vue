<template>
  <div class="edit-user-page-wraper">
    <Title
      :title="title"
      :back="true"
      @back="onBack"
    ></Title>
    <el-form
      ref="userform"
      :model="userform"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xs="24"
          :sm="16"
          :md="14"
          :lg="10"
          :xl="8"
        >
          <el-form-item
            label="用户名"
            prop="name"
          >
            <el-input
              v-model.trim="userform.name"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xs="24"
          :sm="16"
          :md="14"
          :lg="10"
          :xl="8"
        >
          <el-form-item
            label="全名"
            prop="fullname"
          >
            <el-input
              placeholder="请输入全名"
              v-model.trim="userform.fullname"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xs="24"
          :sm="16"
          :md="14"
          :lg="10"
          :xl="8"
        >
          <el-form-item
            label="工号"
            prop="code"
          >
            <el-input
              placeholder="请输入工号"
              v-model.trim="userform.code"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
        v-if="!id"
      >
        <el-col
          :xs="24"
          :sm="16"
          :md="14"
          :lg="10"
          :xl="8"
        >
          <el-form-item
            label="密码"
            prop="pass"
          >
            <el-input
              show-password
              placeholder="请输入密码"
              v-model.trim="userform.pass"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xs="24"
          :sm="16"
          :md="14"
          :lg="10"
          :xl="8"
        >
          <el-form-item
            label="状态"
            prop="state"
          >
            <el-select
              v-model="userform.state"
              style="width:100%"
              placeholder="请选择状态"
              :disabled="!id"
            >
              <el-option
                v-for="(item, key) in statusList"
                :key="key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xs="24"
          :sm="16"
          :md="14"
          :lg="10"
          :xl="8"
        >
          <el-form-item
            label="性别"
            prop="gender"
          >
            <el-select
              v-model="userform.gender"
              style="width:100%"
              placeholder="请选择性别"
            >
              <el-option
                v-for="(item, key) in genderList"
                :key="key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xs="24"
          :sm="16"
          :md="14"
          :lg="10"
          :xl="8"
        >
          <el-form-item class="position">
            <el-button
              type="primary"
              @click="onSubmit('userform')"
              :loading="loading"
            >提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { StatusList, GenderList } from './user.config'
import Title from '@/components/title/Title'
export default {
  name: 'EditUser',
  components: {
    Title
  },
  data () {
    var validatePass = (rule, value, callback) => {
      if (/^[0-9a-zA-Z]*$/g.test(value)) {
        callback()
      } else {
        callback(new Error('密码只能是数字和字母'))
      }
      console.log(rule, value, 'valuevalue')
    }
    return {
      userform: {
        name: '',
        pass: '',
        gender: GenderList[0].value,
        state: StatusList[0].value,
        fullname: '',
        code: '',
        party: null
      },
      statusList: StatusList,
      genderList: GenderList,
      id: null, // 用户id
      title: null,
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        fullname: [
          { required: true, message: '请输入全名', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入工号', trigger: 'change' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 5, max: 16, message: '密码长度5到16位', trigger: 'change' },
          { validator: validatePass, trigger: 'change' }
        ],
        state: [
          {
            required: true, message: '请选择状态', trigger: 'change'
          }
        ],
        gender: [
          {
            required: true, message: '请选择性别', trigger: 'change'
          }
        ]
      },
      loading: false
    }
  },
  mounted () {
    if (this.$route.query.id) {
      // 编辑
      this.id = Number(this.$route.query.id)
      this.$http.get(`/system/user/get/${this.id}`).then((res) => {
        this.title = res.data.name
        this.userform.name = res.data.name
        this.userform.pass = res.data.pass
        this.userform.gender = res.data.gender
        this.userform.state = res.data.state
        this.userform.fullname = res.data.fullname
        this.userform.code = res.data.code
        this.userform.party = res.data.party
      })
    } else {
      this.title = '新建用户'
    }
    console.log(this.userform, 'userformuserform')
  },
  methods: {
    onBack () {
      this.$router.go(-1)
    },
    // 提交按钮
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            gender: this.userform.gender,
            pass: this.userform.pass,
            state: this.userform.state,
            name: this.userform.name,
            fullname: this.userform.fullname,
            code: this.userform.code
          }
          if (this.id) { // 修改提交
            params.id = this.id
            params.party = this.userform.party
            this.$http.put('/system/user', { data: params, error_return: true }).then((res) => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$router.go(-1)
            }, err => {
              if (err.code === 13) {
                this.$message.error('用户已经删除或失效')
              } else if (err.code === 14) {
                this.$message.error('用户名已经存在')
              } else if (err.code === 17) {
                this.$message.error('工号已经存在')
              } else {
                this.$message.error(err.msg)
              }
            })
          } else {
            this.$http.post('/system/user/new', { data: params, error_return: true }).then((res) => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$router.go(-1)
            }, err => {
              this.loading = false
              if (err.code === 13) {
                this.$message.error('用户已经删除或失效')
              } else if (err.code === 14) {
                this.$message.error('用户名已经存在')
              } else if (err.code === 17) {
                this.$message.error('工号已经存在')
              } else {
                this.$message.error(err.msg)
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-user-page-wraper {
  width: 100%;
  .position {
    text-align: center;
  }
}
</style>
