<template>
  <div>
    <PageHeader :title="$route.query.name" :back="true" @back="goBack" />
    <addConcat
      :personTableCol="personTableCol"
      :tableData="tableData"
      :id="customerId"
      :type="0"
      @handleOk="handleOk"
      @onDelete="onDelete"
    />
  </div>
</template>

<script>
import addConcat from './components/addConcat'
import PageHeader from '@/components/title/Title.vue'
import { personTableCol, API_MAP } from './config'
export default {
  components: { addConcat, PageHeader },
  data () {
    return {
      personTableCol,
      customerId: null,
      tableData: []
    }
  },
  mounted () {
    this.customerId = this.$route.query.id
    this.getCustomerConcat()
  },
  methods: {
    getCustomerConcat () {
      this.tableData = []
      const params = {
        state: 'valid,invalid',
        stateop: 0
      }
      this.$http
        .get(API_MAP.CUSTOMER_CONCAT + `/${this.customerId}`, { data: params })
        .then(res => {
          if (res.code === 0) {
            this.tableData = res.data.data
          }
        })
    },
    goBack () {
      this.$router.go(-1)
    },
    handleOk (val) {
      const cids = []
      for (const item of val) {
        cids.push(item.id)
      }
      if (cids.length) {
        this.$http
          .post(
            API_MAP.CUSTOMER_CONCAT +
              `/${this.customerId}?cids=${cids.join(',')}`
          )
          .then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.getCustomerConcat()
            }
          })
      }
    },
    onDelete (val) {
      this.$confirm(`此操作将移除联系人${val.row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .del(
              API_MAP.CUSTOMER_CONCAT + `/${this.customerId}?cid=${val.row.id}`
            )
            .then(res => {
              if (res.code === 0) {
                this.$message.success('操作成功')
                this.getCustomerConcat()
              }
            })
        })
    }
  }
}
</script>

<style></style>
