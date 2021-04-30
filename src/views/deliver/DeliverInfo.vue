<template>
    <div class="page-info">
      <PageHeader :title="deliverId" :back="true" @back="goBack"></PageHeader>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <Collapse-Title :title="'基本信息'"></Collapse-Title>
          </template>
          <div class="cell-group">
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">发货单号
                  <i class="el-icon-info" @click="showState()" title="历史记录"></i></div>
                  <div class="cell_value"> {{formData.id }}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">发货日期</div><div class="cell_value"> {{formatTime(formData.delivery_time)}}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">发货人</div><div class="cell_value"> {{formData.deliverier}}({{formData.deliverier_fullname}})</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">创建人</div><div class="cell_value"> {{formData.owner_name}}({{formData.owner_fullname}})</div>
            </el-col>
             <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">状态</div>
                <div class="cell_value"> {{transKey(formData.state) }}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">收货方名称</div><div class="cell_value"> {{formData.receiptor_name}}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">收货方代码</div><div class="cell_value"> {{formData.receiptor_code}}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">配送方式</div><div class="cell_value"> {{formData.delivery_method }}</div>
            </el-col>
            <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">物流单号</div><div class="cell_value"> {{formData.delivery_code }}</div>
            </el-col>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <Collapse-Title :title="'发货明细'"></Collapse-Title>
          </template>
          <Table :data="tableDataPage" :total="tableData.length"
                 :current-page="currentPage" :page-size="pageSize"
                 @size-change="sizeChange" @current-change="currentChange">
            <el-table-column v-for="(item, index) in deliverDetailColumn" :key="index"
                            :label="item.label" :prop="item.prop" :formatter="formatter">
            </el-table-column>
          </Table>
        </el-collapse-item>
      </el-collapse>
      <!-- 状态弹框 -->
      <el-dialog title="历史记录" :visible.sync="dialogStateHistory"
                @close="dialogStateHistory = false">
        <el-table :data="stateDate" size="mini">
              <el-table-column v-for="(item, index) in stateColumn" :key="index"
                    :prop="item.prop" :label="item.label" :formatter="formatter">
            </el-table-column>
        </el-table>
      </el-dialog>
    </div>
</template>
<script>
import PageHeader from '@/components/title/Title'
import CollapseTitle from '@/components/collapse-title/CollapseTitle'
import Table from '@/components/table/Table'
import { formatTime, transKey, transAction } from '@/utils/trans'
import { deliverDetailColumn, stateColumn } from './deliverConfig'

export default {
  name: 'DeliverInfo',
  components: { PageHeader, CollapseTitle, Table },
  data () {
    return {
      deliverDetailColumn,
      stateColumn,
      formatTime,
      transKey,
      transAction,
      activeNames: ['1', '2'],
      deliverId: null,
      currentPage: 1,
      pageSize: 10,
      formData: {},
      tableData: [], // 发货明细
      stateDate: [], // 状态变更
      dialogStateHistory: false // 状态弹框
    }
  },
  mounted () {
    this.deliverId = this.$route.query.id
    this.getFormData(this.deliverId)
  },
  computed: {
    tableDataPage () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  methods: {
    getFormData (id) {
      this.$http.get(`/business/delivery/${id}`).then(res => {
        const result = res.data
        this.formData = result
        this.tableData = result.details
      })
    },
    formatter (row, column, cellValue, index) {
      if (column.property === 'log_type') {
        return transAction(row[column.property])
      } else if (column.property === 'state') {
        return transKey(row[column.property])
      } else if (column.property === 'log_time') {
        return formatTime(row[column.property])
      } else if (column.property === 'owner') {
        return `${row.owner}(${row.owner_fullname})`
      } else if (column.property === 'operator') {
        return `${row.operator}(${row.operator_fullname})`
      } else {
        return row[column.property]
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
    showState () {
      this.dialogStateHistory = true
      this.$http.get(`/system/oplogs/${this.$tableCode.TableDeliveryMain}/${this.deliverId}`).then(res => {
        const result = res
        this.stateDate = result.data.filter(k => k.state !== 'out')
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
