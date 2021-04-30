<template>
  <div class="delivery">
    <PageHeader title="发货" :back="true" @back="goBack" />
    <div class="form-content">
      <el-form ref="form" :model="form" class="delivery-form">
        <el-form-item
          label="计划发货时间"
          label-width="120px"
          prop="delivery_time"
          :rules="[
            { required: true, message: '请选择计划发货时间', trigger: 'blur' }
          ]"
        >
          <el-date-picker
            v-model="form.delivery_time"
            type="datetime"
            placeholder="请选择计划发货时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :border="true"
        size="small"
        ref="table"
        :data="materialDate"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-for="(item, key) in deliveryTableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column label="本次发货数量">
          <template slot-scope="scope">
            <InputNumber
              size="mini"
              placeholder="请输入本次发货数量"
              style="width:100%"
              v-model="scope.row.sent_count"
              :min="0"
            ></InputNumber>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        style="margin-top:8px"
        :total="resData.length"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      />
    </div>
    <div class="btm-area">
      <el-button type="primary" :loading="btnLoading" @click="onSubmit"
        >确认发货</el-button
      >
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/title/Title.vue'
import Pagination from '@/components/table/Pagination'
import InputNumber from '@/components/input-number/InputNumber'

import { deliveryTableCols, API_MAP } from './config'
import * as moment from 'moment'
import * as Decimal from 'decimal.js'
export default {
  components: {
    PageHeader,
    Pagination,
    InputNumber
  },
  data () {
    return {
      deliveryTableCols,
      form: {},
      modelTitle: '',
      orderIds: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      editItem: {},
      details: [],
      resData: [],
      btnLoading: false
    }
  },
  computed: {
    materialDate () {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = this.pagination.currentPage * this.pagination.pageSize
      const cloneData = JSON.parse(JSON.stringify(this.resData))
      return cloneData.slice(start, end)
    }
  },
  created () {
    this.orderIds = this.$route.query.id
    if (Array.isArray(this.orderIds)) {
      this.orderIds = this.orderIds.join(',')
    }
    this.getOrderDetails()
  },
  methods: {
    getOrderDetails () {
      this.$http
        .get(API_MAP.SALES_DETAILS + `?ids=${this.orderIds}`)
        .then(res => {
          if (res.code === 0) {
            this.resData = res.data
            // this.pagination.total = res.data.length
          }
        })
    },
    goBack () {
      this.$router.go(-1)
    },
    handleSelectionChange (val) {},
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.details = this.materialDate.filter(o => {
            return o.sent_count > 0
          })
          if (!this.details.length) {
            this.$message.error('您还没有选中任何数据')
            return
          }
          this.btnLoading = true
          const params = this.handleParams()
          this.$http
            .post(API_MAP.SALES_OUT + '?s=sale&logtype=sale_out', {
              data: params
            })
            .then(res => {
              this.btnLoading = false
              if (res.code === 0) {
                this.$message.success('操作成功')
                this.goBack()
              }
            })
        }
      })
    },
    handleParams () {
      const arr = []
      for (const ele of this.details) {
        const obj = {}
        const unitInfo = ele.unit_info || {}
        const saleRatio = unitInfo.sale_ratio
        const stockRatio = unitInfo.stock_ratio
        const amount = Number(
          Decimal.div(
            Number(Decimal.mul(ele.sent_count, saleRatio)),
            stockRatio
          )
        )
        obj.sent_count = amount
        obj.unit = unitInfo.stock
        obj.material_code = ele.material_code
        obj.material_name = ele.material_name
        obj.order_num = ele.order_num
        obj.plan_stockout_time = moment(this.form.delivery_time).format(
          'YYYY-MM-DDTHH:mm:ssZ'
        )
        obj.detail_id = ele.id
        arr.push(obj)
      }
      return arr
    },

    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.sent_count > 0) {
        return 'success-row'
      }
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'sent_sum' && row.sent_sum) {
        const unitInfo = row.unit_info
        return Number(
          Decimal.div(
            Number(Decimal.mul(row.sent_sum, unitInfo.stock_ratio)),
            unitInfo.sale_ratio
          )
        )
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.delivery {
  .form-content {
    display: flex;
    justify-content: flex-end;
  }
  .btm-area {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .success-row {
    background: $--color-primary-light-8;
  }
}
</style>
