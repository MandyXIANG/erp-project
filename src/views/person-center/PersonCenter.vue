<template>
  <div class="person-page-wraper">
    <Title :title="'个人中心'"></Title>
    <el-form
      :rules="rules"
      :model="personform"
      ref="personform"
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
            label="用户名"
            prop="name"
          >
            <el-input
              v-model="personform.name"
              :disabled="disabled"
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
            label="全名"
            prop="fullname"
          >
            <el-input
              v-model="personform.fullname"
              :disabled="disabled"
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
            label="工号"
            prop="code"
          >
            <el-input
              v-model="personform.code"
              :disabled="disabled"
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
            label="性别"
            prop="gender"
          >
            <el-select
              style="width:100%"
              v-model="personform.gender"
              :disabled="disabled"
            >
              <el-option
                v-for="(item,key) in genderList"
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
              @click="onSubmit('personform')"
              :disabled="disabled"
            >修改个人信息</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { GenderList } from '../sys-user/user.config'
import Title from '@/components/title/Title'
import { mapActions } from 'vuex'
import { USER } from '@/store/storageConst'
export default {
  components: {
    Title
  },
  name: 'PersonCenter',
  data () {
    return {
      disabled: true,
      companyList: [],
      genderList: GenderList,
      personform: {
        name: '',
        fullname: '',
        code: '',
        gender: GenderList[0].value
      },
      /**
       * 自定义规则
       */
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        fullname: [
          { required: true, message: '请输入电话号码', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入电话号码', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    console.log(this.$ls.get(USER), 'llll')
    if (this.$ls.get(USER) === 'admin') {
      this.disabled = true
    } else {
      this.disabled = false
    }
    this.$http.get('/system/user/self').then((res) => {
      this.personform.name = res.data.name
      this.personform.fullname = res.data.fullname
      this.personform.code = res.data.code
      this.personform.gender = res.data.gender
    })
  },
  methods: {
    ...mapActions('user', ['logOut']),
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            code: this.personform.code,
            gender: this.personform.gender,
            fullname: this.personform.fullname,
            name: this.personform.name
          }
          this.$http.put('/system/user/self', { data: params }).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.logOut().then(res => {
              this.$router.push('/login')
            })
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
.person-page-wraper {
  width: 100%;
  .position {
    text-align: center;
  }
}
</style>
