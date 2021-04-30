<template>
  <div>
    <PageHeader
      :title="'订单跟踪：' + $route.query.id"
      :back="true"
      @back="goBack"
    />
    <Table
      :data="spliceTableData"
      :total="detailTableData.length"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    >
      <el-table-column
        sortable="custom"
        :formatter="formatter"
        v-for="(item, key) in trackCols"
        :key="key"
        :prop="item.prop"
        :label="item.label"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span class="table-detail" @click="editMaterial(scope)">编辑</span>
        </template>
      </el-table-column>
    </Table>
    <el-dialog
      :title="'订单跟踪：' + selectMaterial.material_code"
      :close-on-click-modal="false"
      :visible.sync="materialModel"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            label="本次到货数量"
            prop="amount"
            :rules="[
              { required: true, message: '请输入实际收货数量', trigger: 'blur' }
            ]"
          >
            <InputNumber
              placeholder="请输入本次到货数量"
              :min="0"
              v-model="form.amount"
            ></InputNumber>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="本次到货时间" prop="operation_time">
            <el-date-picker
              v-model="form.operation_time"
              type="datetime"
              placeholder="选择日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="materialModel = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="handleOk"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as moment from 'moment'

import PageHeader from '@/components/title/Title.vue'
import Table from '@/components/table/Table.vue'
import { trackCols, API_MAP } from './config'
import { USER_INFO } from '@/store/storageConst'
import { transKey } from '@/utils/trans.js'
import InputNumber from '@/components/input-number/InputNumber'

export default {
  components: {
    PageHeader,
    Table,
    InputNumber
  },
  data () {
    return {
      trackCols,
      detailTableData: [],
      materialModel: false,
      form: {},
      selectMaterial: {},
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      btnLoading: false
    }
  },
  computed: {
    spliceTableData () {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = this.pagination.currentPage * this.pagination.pageSize
      const cloneData = JSON.parse(JSON.stringify(this.detailTableData || []))
      return cloneData.slice(start, end)
    }
  },
  created () {
    this.getDetailById(this.$route.query.id)
  },
  methods: {
    getDetailById (id) {
      this.$http.get(API_MAP.PURCHASE_MAIN + `/${id}`).then(res => {
        if (res.code === 0) {
          this.detailTableData = res.data.details
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    editMaterial (scope) {
      this.selectMaterial = scope.row
      this.form = { operation_time: moment().format('YYYY-MM-DD HH:mm:ss') }
      this.materialModel = true
    },
    handleOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.amount <= 0) {
            this.$message.error('到货数量必须大于0')
            return
          }
          let params = {}
          params = Object.assign(this.form, {
            operator: this.$ls.get(USER_INFO).username,
            operator_fullname: this.$ls.get(USER_INFO).fullname
          })
          this.btnLoading = true
          this.$http
            .put(
              API_MAP.PURCHASER_TRACE +
                `/${this.selectMaterial.id}?main=${this.$route.query.id}&logtype=trace`,
              {
                data: params
              }
            )
            .then(res => {
              this.btnLoading = false
              if (res.code === 0) {
                this.$message.success('操作成功')
                this.materialModel = false
                this.getDetailById(this.$route.query.id)
              }
            })
        }
      })
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'state') {
        return transKey(row[column.property])
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  max-height: 400px;
  overflow: auto;
  .pay-form {
    width: 100%;
  }
}
</style>
