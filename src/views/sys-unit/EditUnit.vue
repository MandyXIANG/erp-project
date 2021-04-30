<template>
  <div class="edit-unit-page-wraper">
    <Title
      :title="title"
      :back="true"
      @back="$router.go(-1)"
    ></Title>
    <el-form
      ref="unitform"
      :model="unitform"
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
            label="单位编码"
            prop="code"
          >
            <el-input
              v-model.trim="unitform.code"
              placeholder="请输入单位编码"
              @change="removeSpaces(unitform.code,'code')"
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
            label="名称"
            prop="name"
          >
            <el-input
              placeholder="请输入名称"
              v-model.trim="unitform.name"
              @change="removeSpaces(unitform.name,'name')"
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
          <el-form-item class="position">
            <el-button
              type="primary"
              @click="onSubmit('unitform')"
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
export default {
  name: 'EditUnit',
  components: {
    Title
  },
  data () {
    return {
      code: null,
      id: null,
      title: '新建单位',
      unitform: {
        code: '',
        name: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入单位编码', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ]
      },
      loading: false
    }
  },
  mounted () {
    if (this.$route.query.code) {
      // 编辑
      this.code = this.$route.query.code
      this.id = this.$route.query.id
      const params = {
        code: this.code
      }
      this.$http.get('/system/unit', { data: params }).then(res => {
        this.unitform = res.data[0]
        this.title = res.data[0].name
      })
    }
  },
  methods: {
    // 去除前后空格
    removeSpaces (value, type) {
      if (type === 'code') {
        this.unitform.code = value.replace(/(^\s*)|(\s*)$/g, '')
      } else {
        this.unitform.name = value.replace(/(^\s*)|(\s*)$/g, '')
      }
    },
    // 提交按钮
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            code: this.unitform.code,
            name: this.unitform.name
          }
          if (this.code) { // 修改提交
            params.id = Number(this.id)
            this.$http.put('/system/unit', { data: params, error_return: true }).then((res) => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$router.go(-1)
            }).catch(err => {
              this.loading = false
              if (err.code === 15) {
                this.$message.error('单位编码或名称已存在')
              } else {
                this.$message.error(err.msg)
              }
            })
          } else {
            this.$http.post('/system/unit', { data: params, error_return: true }).then((res) => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$router.go(-1)
            }).catch(err => {
              this.loading = false
              if (err.code === 15) {
                this.$message.error('单位编码或名称已存在')
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
.edit-unit-page-wraper {
  width: 100%;
  .position {
    text-align: center;
  }
}
</style>
