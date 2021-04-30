<template>
    <div>
      <PageHeader :title="outId" :back="true" @back="goback"></PageHeader>
      <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
        <el-collapse v-model="activeName">
          <BaseDetail :showTitle="false" :checkId="outId"></BaseDetail>
          <OutBase :form="ruleForm"></OutBase>
        </el-collapse>
        <div class="bottom-list">
          <el-button type="primary" :loading="submitLoading" @click="onSubmit('ruleForm')">提交</el-button>
        </div>
      </el-form>
    </div>
</template>
<script>
import PageHeader from '@/components/title/Title'
import OutBase from './OutBase'
import BaseDetail from '../outbound-order/Detail'

export default {
  name: 'Detail',
  components: { PageHeader, OutBase, BaseDetail },
  data () {
    return {
      activeName: ['1', '2'],
      submitLoading: false,
      ruleForm: {
        state: null, // 审核结果
        remark: null // 备注
      },
      outId: null
    }
  },
  mounted () {
    this.outId = this.$route.query.id
  },
  methods: {
    validCheckForm (callback) {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.submitLoading = false
          return false
        } else {
          this.saveCheckForm(callback)
        }
      })
    },
    saveCheckForm (callback) {
      const id = this.outId
      const params = this.ruleForm
      const logtype = this.ruleForm.state === 'unstart' ? 'pass' : 'reject'
      this.$http.put(`/business/stockout/${id}?logtype=${logtype}`, { data: params }).then(res => {
        const result = res
        callback(result)
      })
    },
    onSubmit () {
      this.submitLoading = true
      this.validCheckForm(result => {
        if (result.code === 0) {
          this.$message.success('操作成功')
          this.submitLoading = false
          this.goback()
        }
      })
    },
    goback () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.bottom-list{
  margin-top: $padding-md;
  text-align: center;
}
</style>
