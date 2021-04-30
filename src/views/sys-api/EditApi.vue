<template>
  <div class="edit-api-config-page-wraper">
    <Title :title="title"></Title>
    <el-form
      :model="apiform"
      :rules="rules"
      ref="apiform"
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
            prop="code"
            label="apiCode"
          >
            <el-input
              v-model="apiform.code"
              placeholder="请输入api路径"
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
          :xs="24"
          :sm="16"
          :md="14"
          :lg="10"
          :xl="8"
        >
          <el-form-item
            prop="name"
            label="api名字"
          >
            <el-input
              v-model="apiform.name"
              placeholder="请输入api名字"
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
            prop="group"
            label="api分组"
          >
            <el-input
              v-model="apiform.group"
              placeholder="请输入api组"
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
            prop="description"
            label="api简介"
          >
            <el-input
              v-model="apiform.description"
              placeholder="请输入api简介"
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
            prop="action"
            label="api请求"
          >
            <el-select
              v-model="apiform.action"
              style="width:100%"
              placeholder="请输入api请求"
              multiple
            >
              <el-option
                v-for="(item,key) in ActionList"
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
          <span class="tips">新增Api需要在角色管理内配置权限才可使用</span>
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
            <el-button @click="$router.go(-1)">返回</el-button>
            <el-button
              type="primary"
              @click="onSubmit('apiform')"
            >提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { ActionList } from './api.config'
import Title from '@/components/title/Title'
export default {
  name: 'EditApi',
  components: {
    Title
  },
  data () {
    return {
      apiform: {
        code: '',
        name: '',
        group: '',
        description: '',
        action: [ActionList[0].value]
      },
      title: '新建Api',
      rules: {
        code: [
          { required: true, message: '请输入apiCode', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入api名字', trigger: 'change' }
        ],
        group: [
          { required: true, message: '请输入api组', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入api简介', trigger: 'change' }
        ]
      },
      ActionList: ActionList,
      disabled: false
    }
  },
  mounted () {
    if (this.$route.query.id !== '0') {
      this.title = '编辑Api'
      this.disabled = true
      this.id = Number(this.$route.query.id)
      const params = {
        id: this.id
      }
      this.$http.get(`/perm/${this.id}`, { data: params }).then(res => {
        this.apiform.code = res.data.code
        this.apiform.name = res.data.name
        this.apiform.group = res.data.group
        this.apiform.description = res.data.description
        this.apiform.action = res.data.action
      })
    }
  },
  methods: {
    // 提交按钮
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            code: this.apiform.code,
            name: this.apiform.name,
            description: this.apiform.description,
            group: this.apiform.group,
            action: this.apiform.action,
            type: 'api_perm'
          }
          if (this.id) { // 修改
            params.id = this.id
            this.$http.put('/role', { data: params }).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$router.go(-1)
            })
          } else {
            this.$http.post('/role', { data: params }).then((res) => {
              this.$message({
                type: 'success',
                message: '新建成功'
              })
              this.$router.go(-1)
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '验证不通过'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-api-config-page-wraper {
  width: 100%;
  .tips {
    color: $--color-danger;
    margin-bottom: $padding-md;
    display: block;
  }
  .position {
    text-align: center;
  }
}
</style>
