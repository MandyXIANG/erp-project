<template>
    <div class="page-info">
      <PageHeader v-if="showTitle" :title="outId" :back="true" @back="goBack"></PageHeader>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <Collapse-Title :title="'基本信息'"></Collapse-Title>
          </template>
          <div class="cell-group">
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">出库单号
                  <i class="el-icon-info" @click="showState()" title="历史记录"></i>
                </div>
                <div class="cell_value">{{formData.id }}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">创建时间</div><div class="cell_value"> {{formatTime(formData.create_at)}}</div>
            </el-col>
             <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">创建人</div><div class="cell_value"> {{formData.owner_name}}({{formData.owner_fullname}})</div>
            </el-col>
             <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">仓库名称</div><div class="cell_value"> {{formData.warehouse_name}}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">出库单类型</div><div class="cell_value"> {{transKey(formData.type)}}</div>
            </el-col>
             <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">状态
                </div>
                <div class="cell_value"> {{transKey(formData.state) }}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">计划备料时间</div><div class="cell_value"> {{formatTime(formData.plan_prepare_time )}}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">计划发料时间</div><div class="cell_value"> {{formatTime(formData.plan_stockout_time)}}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">收货方代码</div><div class="cell_value"> {{formData.receiptor_code}}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">收货方名称</div><div class="cell_value"> {{formData.receiptor_name}}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">备注</div><div class="cell_value"> {{formData.remark }}</div>
            </el-col>
          </div>
        </el-collapse-item>
         <el-collapse-item name="2">
          <template slot="title">
            <Collapse-Title :title="'出库明细'"></Collapse-Title>
          </template>
          <Table :data="tableDetailData" :total="tableData.length" :current-page="currentPage"
                 :page-size="pageSize" @size-change="sizeChange" @current-change="currentChange">
            <el-table-column v-for="(item, index) in outDetailColumn" :key="index"
                            :label="item.label" :prop="item.prop"
                            :formatter="formatter">
            </el-table-column>
           <!-- 出库单详情展示自己的已发数量 -->
            <el-table-column label="已发数量" prop="sent_amount"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
             <!-- 待审核不包含wait_check，取?iwc=${0} 取order_plan_amount得值，
                  出库单详情不展示【已审核数量】【待发数量】-->
            <el-table-column v-if="!showTitle" label="已审核数量" prop="order_plan_amount"></el-table-column>
            <el-table-column label="待发数量" prop="order_amount"
                              v-if="!showTitle" :formatter="formatterAmount">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="table-detail" @click="showPrepare(scope)">出库历史</span>
              </template>
            </el-table-column>
          </Table>
        </el-collapse-item>
      </el-collapse>
      <!-- 状态弹框 -->
      <el-dialog title="历史记录" :visible.sync="dialogStateHistory"
                @close="dialogStateHistory = false">
        <el-table :data="stateData" size="mini">
              <el-table-column v-for="(item, index) in stateColumn" :key="index"
                    :prop="item.prop" :label="item.label" :formatter="formatter">
            </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 备料历史 -->
      <el-dialog :title="this.prepareTitle" :visible.sync="dialogPrepareHistory"
                  @close="dialogPrepareHistory = false">
        <el-table :data="preHistoryData" size="mini">
              <el-table-column v-for="(item, index) in prepareColumn" :key="index"
                    :prop="item.prop" :label="item.label" :formatter="formatter" :width="item.width">
            </el-table-column>
        </el-table>
      </el-dialog>
    </div>
</template>
<script>
import PageHeader from '@/components/title/Title'
import CollapseTitle from '@/components/collapse-title/CollapseTitle'
import Table from '@/components/table/Table'
import { outDetailColumn, prepareColumn, stateColumn, issueColumn } from './outboundConfig'
import { formatTime, transKey, transAction } from '@/utils/trans'
import decimal from 'decimal.js'
import * as moment from 'moment'

export default {
  name: 'Detail',
  components: { PageHeader, CollapseTitle, Table },
  props: {
    showTitle: { type: Boolean, default: true },
    checkId: { type: String, default: '' }
  },
  data () {
    return {
      outDetailColumn,
      prepareColumn,
      stateColumn,
      issueColumn,
      formatTime,
      transKey,
      transAction,
      currentPage: 1,
      pageSize: 10,
      prepareTitle: '',
      activeNames: ['1', '2'],
      outId: null,
      formData: {},
      tableData: [],
      stateData: [], // 状态变更
      preHistoryData: [], // 备料历史
      dialogStateHistory: false, // 状态弹框
      dialogPrepareHistory: false // 备料弹框
    }
  },
  computed: {
    tableDetailData () {
      const start =
        (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      const tableData = JSON.parse(JSON.stringify(this.tableData || []))
      return tableData.slice(start, end)
    }
  },
  mounted () {
    this.outId = this.$route.query.id || this.checkId
    this.getFormData(this.outId)
  },
  methods: {
    // 获取数据
    getFormData (id) {
      this.$http.get(`/business/stockout/${id}?iwc=${0}`).then(res => {
        const result = res.data
        this.formData = result
        this.tableData = result.details
        this.tableData.map(k => {
          if (k.order_detail_id) {
            k.order_code = result.order_id
          }
        })
        this.formData.plan_stockout_time = moment(this.formData.plan_stockout_time).format('YYYY-MM-DDTHH:mm:ssZ')
      })
    },
    // 格式化数据
    formatter (row, column) {
      if (column.property === 'state') {
        return this.transKey(row[column.property])
      } else if (column.property === 'prepared_time' || column.property === 'delivery_time' || column.property === 'log_time') {
        return this.formatTime(row[column.property])
      } else if (column.property === 'owner') {
        return `${row.owner}(${row.owner_fullname})`
      } else if (column.property === 'log_type') {
        return transAction(row[column.property])
      } else if (column.property === 'deliverier') {
        return row.deliverier ? `${row.deliverier}(${row.deliverier_fullname})` : ''
      } else if (column.property === 'preparer') {
        return row.preparer ? `${row.preparer}(${row.preparer_fullname})` : ''
      } else {
        return row[column.property]
      }
    },
    // 格式化待出库数量
    formatterAmount (row) {
      let num = row.order_amount
      if (!num) {
        return null
      } else {
        const saleAmount = +decimal.mul(row.unit_info.sale_ratio, num)
        const stockNum = +(+(decimal.div(saleAmount, row.unit_info.stock_ratio)).toFixed(2))
        if (!row.order_plan_amount) {
          row.order_plan_amount = 0
        }
        num = +(decimal.sub(stockNum, row.order_plan_amount)).toFixed(2)
        return num
      }
    },
    // 改变条数
    sizeChange (size) {
      this.pageSize = size
    },
    // 改变当前页
    currentChange (currnetPage) {
      this.currentPage = currnetPage
    },
    // 出库单历史记录
    showState () {
      this.dialogStateHistory = true
      this.$http.get(`/system/oplogs/${this.$tableCode.TableStockoutMain}/${this.outId}`).then(res => {
        const result = res
        if (result.code === 0) {
          this.stateData = result.data
        }
      })
    },
    // 备料历史
    showPrepare (scope) {
      this.$http.get(`/business/prepared/${scope.row.id}`).then(res => {
        this.prepareTitle = `备料历史: ${scope.row.material_code}`
        const result = res
        if (result.code === 0) {
          this.preHistoryData = result.data.data
          this.dialogPrepareHistory = true
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
@import'@/styles/infoForm'
</style>
