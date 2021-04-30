<template>
  <div class="edit-permission-page-wraper">
    <Title
      :title="title"
      :back="true"
      @back="$router.go(-1)"
    ></Title>
    <el-form
      :model="permform"
      ref="permform"
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
            prop="code"
            label="权限编码"
          >
            <el-input
              v-model.trim="permform.code"
              placeholder="请输入权限编码"
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
            label="名字"
          >
            <el-input
              placeholder="请输入名字"
              v-model.trim="permform.name"
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
            label="分组"
          >
            <el-select
              v-model="permform.group"
              style="width:100%"
              placeholder="请选择分组"
              filterable
            >
              <el-option
                v-for="(item,key) in groupList"
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
            prop="state"
            label="状态"
          >
            <el-select
              v-model="permform.state"
              style="width:100%"
              placeholder="请选择状态"
              filterable
            >
              <el-option
                v-for="(item,key) in statusList"
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
            prop="description"
            label="简介"
          >
            <el-input
              v-model="permform.description"
              placeholder="请输入简介"
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
              @click="onSubmit('permform')"
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
import { StatusList } from './permission.config'
export default {
  name: 'EditPermission',
  components: {
    Title
  },
  data () {
    return {
      statusList: StatusList,
      permform: {
        name: '',
        code: '',
        group: '',
        description: '',
        state: null
      },
      groupList: [],
      id: null,
      disabled: false,
      title: null,
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入权限编码', trigger: 'change' }
        ],
        group: [
          { required: true, message: '请选择分组', trigger: 'change' }
        ],
        state: [
          {
            required: true, message: '请选择状态', trigger: 'change'
          }
        ]
      },
      loading: false
    }
  },
  created () {
    // 处理groupList 数据
    const MenuList = require('@/config/menu.config')
    console.log(MenuList, 'MuenList')
    MenuList.forEach(element => {
      if (element.children) {
        element.children.forEach(item => {
          this.groupList.push({
            label: item.name,
            value: item.name
          })
        })
      } else {
        this.groupList.push({
          label: element.name,
          value: element.name
        })
      }
    })
  },
  mounted () {
    this.permform.state = this.statusList[0].value
    // 判断id 是否为0 为0是新建 反之为编辑
    if (this.$route.query.id) { // 编辑
      this.id = Number(this.$route.query.id)
      this.disabled = true
      this.$http.get(`/system/roleperm/get/${this.id}`).then((res) => {
        this.title = res.data.code
        this.permform.code = res.data.code
        this.permform.name = res.data.name
        this.permform.group = res.data.group
        this.permform.description = res.data.description
        this.permform.state = res.data.state
      })
    } else {
      this.title = '新建权限'
    }
  },
  methods: {
    // 提交数据
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            code: this.permform.code,
            name: this.permform.name,
            group: this.permform.group,
            description: this.permform.description,
            type: 'perm',
            state: this.permform.state
          }
          if (this.id) { // 编辑
            params.id = this.id
            this.$http.put('/system/roleperm', { data: params }).then((res) => {
              this.loading = false
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$router.go(-1)
            }, err => {
              console.log(err)
              this.loading = false
            })
          } else {
            this.$http.post('/system/roleperm/new', { data: params }).then((res) => {
              this.loading = false
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$router.go(-1)
            }, err => {
              console.log(err)
              this.loading = false
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-permission-page-wraper {
  width: 100%;
  .position {
    text-align: center;
  }
}
</style>
