<template>
  <div class="receive-task-detail-page">
    <Title
      :title="title"
      :back="true"
      @back="$router.go(-1)"
    ></Title>
    <el-collapse
      v-model="activeNames"
      v-if="detail"
    >
      <el-collapse-item name="1">
        <template slot="title">
          <CollapseTitle :title="'基本信息'" />
        </template>
        <div class="base-container">
          <el-col
            class="item-col"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="12"
          >
            <div class="item-label">
              收料单号
              <i
                class="el-icon-info"
                title="历史记录"
                @click="onOpenDialog"
              ></i>
            </div>
            <div class="item-value">{{detail.id}}</div>
          </el-col>
          <el-col
            class="item-col"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="12"
          >
            <div class="item-label">创建时间</div>
            <div class="item-value">{{formattime(detail.create_at)}}</div>
          </el-col>
          <el-col
            class="item-col"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="12"
          >
            <div class="item-label">创建人</div>
            <div class="item-value">{{detail.owner_name}}({{detail.owner_fullname}})</div>
          </el-col>
          <el-col
            class="item-col"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="12"
          >
            <div class="item-label">类型</div>
            <div class="item-value">{{transkey(detail.class)}}</div>
          </el-col>
          <el-col
            class="item-col"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="12"
          >
            <div class="item-label">
              状态
            </div>
            <div class="item-value">{{transkey(detail.state)}}</div>
          </el-col>
          <el-col
            class="item-col"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="12"
          >
            <div class="item-label">供应商简称</div>
            <div class="item-value">{{detail.supplier_name}}</div>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="12"
            class="item-col"
          >
            <div class="item-label">供应商代码</div>
            <div class="item-value">{{detail.supplier_code}}</div>
          </el-col>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <CollapseTitle :title="'收料明细'" />
        </template>
        <div class="table-container">
          <Table
            :data="detail.details.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.currentPage * this.pagination.pageSize)"
            :total="pagination.total"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            @size-change="onSizeChange"
            @current-change="onCurrentChange"
          >
            <el-table-column
              v-for="(item,key) in tableCols"
              :key="key"
              :prop="item.prop"
              :label="item.label"
              :formatter="formatter"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span
                  class="table-detail"
                  @click="onOpenReceiptHistroy(scope.row)"
                >收料历史</span>
              </template>
            </el-table-column>
          </Table>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      title="历史记录"
      :visible.sync="dialogState"
      @close="dialogState= false"
      :close-on-click-modal="false"
    >
      <el-table
        :data="stateData"
        :size="'small'"
      >
        <el-table-column
          v-for="(item,key) in stateTableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :formatter="stateFormatter"
        ></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :title="receiptTitle"
      :visible.sync="dialogReceipt"
      @close="dialogReceipt= false"
      :close-on-click-modal="false"
    >
      <el-table
        :data="receiptData"
        :size="'small'"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="left"
              class="demo-table-expand"
            >
              <el-form-item
                :label="item.name"
                v-for="(item,key) in props.row.property"
                :key="key"
              >
                <span>{{ item.value }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,key) in receiptTableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :formatter="stateFormatter"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Title from '@/components/title/Title'
import CollapseTitle from '@/components/collapse-title/CollapseTitle'
import Table from '@/components/table/Table'
import { TableCols, StateTableCols, ReceiptTableCols } from './config/detail.config'
import { formatTime, transKey, transAction } from '@/utils/trans'
import { tableCode } from '@/core/common.js'
export default {
  components: {
    Title,
    CollapseTitle,
    Table
  },
  data () {
    return {
      activeNames: ['1', '2'],
      tableCols: TableCols,
      title: null,
      detail: null,
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      formattime: formatTime,
      transkey: transKey,
      dialogState: false,
      stateTableCols: StateTableCols,
      stateData: [],
      dialogReceipt: false,
      receiptTableCols: ReceiptTableCols,
      receiptData: [],
      receiptTitle: null,
      transAction: transAction,
      formatTime: formatTime
    }
  },
  mounted () {
    this.title = this.$route.query.id
    this.$http.get(`/business/stockin/receipt/self/${this.title}`).then(res => {
      this.detail = res.data
      this.pagination.total = res.data.details.length
    })
  },
  methods: {
    onSizeChange (page) {
      this.pagination.pageSize = page
    },
    onCurrentChange (page) {
      this.pagination.currentPage = page
    },
    formatter (row, column) {
      if (column.property === 'plan_date') {
        return this.formattime(row[column.property])
      } else if (column.property === 'state') {
        return this.transkey(row[column.property])
      } else {
        return row[column.property]
      }
    },
    onOpenDialog () {
      this.dialogState = true
      this.$http.get(`/system/oplogs/${tableCode.TableStockinReceiptMain}/${this.title}`).then(res => {
        if (res.data.length) {
          this.stateData = res.data.filter(item => item.log_type !== 'receive')
        }
      })
    },
    stateFormatter (row, column) {
      if (column.property === 'owner') {
        return row[column.property] + '(' + row.owner_fullname + ')'
      } else if (column.property === 'log_type') {
        return this.transAction(row[column.property])
      } else if (column.property === 'log_time') {
        return this.formatTime(row[column.property])
      } else {
        return row[column.property]
      }
    },
    onOpenReceiptHistroy (row) {
      console.log(row, 'row')
      console.log(tableCode.TableSotckinReceiptDetail, 'vvvv')
      this.$http.get(`/system/oplogs/${tableCode.TableSotckinReceiptDetail}/${row.id}`).then(res => {
        this.dialogReceipt = true
        this.receiptTitle = `收料历史:${row.material_code}`
        this.receiptData = res.data
        console.log(res, 'resresres')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.receive-task-detail-page {
  .base-container {
    display: flex;
    flex-wrap: wrap;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    .item-col {
      display: flex;
      font-size: 14px;
      .item-label {
        width: 150px;
        text-align: left;
        border: 1px solid $border-detail-color;
        border-bottom: none;
        border-right: none;
        display: flex;
        align-items: center;
        padding-left: 8px;
        color: #606266;
        background-color: $--color-primary-light-9;
        i {
          margin-left: $padding-xs;
          cursor: pointer;
        }
      }
      .item-value {
        display: flex;
        align-items: center;
        flex: 1;
        min-height: $detail-table-height;
        border: 1px solid $border-detail-color;
        border-bottom: none;
        border-right: none;
        padding-left: 8px;
        &:hover {
          background-color: $detail-hover-bg-color;
        }
      }
    }
  }
  .table-container {
  }
}
</style>
