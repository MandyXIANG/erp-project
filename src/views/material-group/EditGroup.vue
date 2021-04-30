<template>
    <div>
      <PageHeader :title="pageTitle" :back="true" @back="goBack"></PageHeader>
      <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
        <el-collapse v-model="activeName">
          <Base-Info :form="ruleForm"></Base-Info>
          <Type :form="ruleForm"></Type>
        </el-collapse>
        <div class="bottom-list">
            <el-button @click="$router.go(-1)">返回</el-button>
            <el-button type="primary" :loading="submitLoading" @click="onSubmit('ruleForm')">提交</el-button>
        </div>
      </el-form>
    </div>
</template>
<script>
import PageHeader from '@/components/title/Title'
import BaseInfo from './BaseInfo'
import Type from './Type'
export default {
  name: 'EditGroup',
  components: { PageHeader, BaseInfo, Type },
  data () {
    return {
      pageTitle: '',
      activeName: ['1', '2'],
      submitLoading: false,
      marGroupId: '',
      ruleForm: {
        name: '',
        remark: '',
        property: []
      }
    }
  },
  mounted () {
    this.marGroupId = this.$route.query.id
    if (!this.marGroupId) {
      this.pageTitle = '新增物料组'
    } else {
      this.initData(this.marGroupId)
    }
  },
  methods: {
    initData (id) {
      this.$http.get(`/base/materialgroup/${id}`).then(res => {
        const result = res
        this.ruleForm = result.data
        this.pageTitle = result.data.name
      })
    },
    validMarGroupForm (ruleForm, callback) {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.submitLoading = false
          return false
        } else {
          this.saveMarGroupForm(callback)
        }
      })
    },
    saveMarGroupForm (callback) {
      const params = this.ruleForm
      if (!this.marGroupId) { // 新增
        this.$http.post('/base/materialgroup/', { data: params, error_return: true }).then(res => {
          const result = res
          callback(result)
        }).catch(err => {
          this.submitLoading = false
          if (err.code === 15) {
            this.$message.error(`物料代码${this.ruleForm.code}已存在`)
          }
          if (err.code === 16) {
            this.$message.error(`物料代码${this.ruleForm.code}重复使用`)
          }
        })
      } else { // 编辑
        this.$http.put('/base/materialgroup/', { data: params, error_return: true }).then(res => {
          const result = res
          callback(result)
        }).catch(err => {
          this.submitLoading = false
          if (err.code === 15) {
            this.$message.error(`物料代码${this.ruleForm.code}已存在`)
          }
          if (err.code === 16) {
            this.$message.error(`物料代码${this.ruleForm.code}重复使用`)
          }
        })
      }
    },
    onSubmit (ruleForm) {
      this.submitLoading = true
      this.validMarGroupForm(ruleForm, result => {
        if (result.code === 0) {
          this.$message.success('操作成功')
          this.submitLoading = false
          this.goBack()
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.bottom-list {
  margin-top: $padding-md;
  text-align: center;
}
</style>
