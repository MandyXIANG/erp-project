<template>
  <div class="edit-role-page-wraper">
    <Title
      :title="title"
      :back="true"
      @back="$router.go(-1)"
    ></Title>
    <el-form
      ref="roleform"
      :model="roleform"
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
            label="角色编码"
            prop="code"
          >
            <el-input
              v-model.trim="roleform.code"
              :disabled="disabled"
              @change="removeSpaces(roleform.code,'code')"
              placeholder="请输入角色编码"
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
            label="角色名"
            prop="name"
          >
            <el-input
              placeholder="请输入角色名"
              v-model.trim="roleform.name"
              @change="removeSpaces(roleform.name,'name')"
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
              v-model="roleform.state"
              style="width:100%"
              placeholder="请选择状态"
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
          <el-form-item class="position">
            <el-button
              type="primary"
              @click="onSubmit('roleform')"
              :loading="loading"
            >提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import Title from '@/components/title/Title'
import { StatusList } from './role.config'
export default {
  components: {
    Title
  },
  name: 'EditRole',
  data () {
    return {
      statusList: StatusList,
      roleform: {
        name: '',
        code: '',
        state: 'active'
      },
      id: null, // 角色id
      title: null,
      rules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      disabled: false,
      loading: false
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.disabled = true
      this.id = Number(this.$route.query.id)
      this.$http.get(`/system/roleperm/get/${this.id}`).then((res) => {
        this.title = res.data.code
        this.roleform.code = res.data.code
        this.roleform.name = res.data.name
        this.roleform.state = res.data.state
      })
    } else {
      this.title = '新建角色'
    }
  },
  methods: {
    removeSpaces (value, string) {
      if (string === 'code') {
        this.roleform.code = value.replace(/(^\s*)|(\s*)$/g, '')
      } else {
        this.roleform.name = value.replace(/(^\s*)|(\s*)$/g, '')
      }
    },
    // 提交按钮
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            code: this.roleform.code,
            name: this.roleform.name,
            type: 'role',
            state: this.roleform.state
          }
          if (this.id) { // role 修改
            params.id = this.id
            this.$http.put('/system/roleperm', { data: params, error_return: true }).then((res) => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$router.go(-1)
            }, err => {
              console.log(err)
              if (err.code === 15) {
                this.$message.error('角色编码重复')
              } else {
                this.$message.error(err.msg)
              }
              this.loading = false
            })
          } else { // role 新建
            this.$http.post('/system/roleperm/new', { data: params, error_return: true }).then((res) => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$router.go(-1)
            }).catch((err) => {
              this.loading = false
              if (err.code === 15) {
                this.$message.error('角色编码重复')
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
.edit-role-page-wraper {
  width: 100%;
  .position {
    text-align: center;
  }
}
</style>
