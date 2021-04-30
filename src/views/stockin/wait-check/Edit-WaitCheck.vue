<template>
  <div class="edit-wait-check-page">
    <Title
      :title="title"
      :back="true"
      @back="$router.go(-1)"
    ></Title>
    <div class="info">
      <el-collapse
        v-model="activeNames"
        v-if="detail"
      >
        <el-collapse-item name="1">
          <template slot="title">
            <CollapseTitle title="基本信息" />
          </template>
          <div class="info-detail">
            <el-col
              class="info-detail-item"
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="12"
            >
              <div class="info-item-label">收料单号</div>
              <div class="info-item-value">{{detail.id}}</div>
            </el-col>
            <el-col
              class="info-detail-item"
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="12"
            >
              <div class="info-item-label">创建时间</div>
              <div class="info-item-value">{{formattime(detail.create_at)}}</div>
            </el-col>
            <el-col
              class="info-detail-item"
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="12"
            >
              <div class="info-item-label">创建人</div>
              <div class="info-item-value">{{detail.owner_name}}({{detail.owner_fullname}})</div>
            </el-col>
            <el-col
              class="info-detail-item"
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="12"
            >
              <div class="info-item-label">类型</div>
              <div class="info-item-value">{{transkey(detail.class)}}</div>
            </el-col>
            <el-col
              class="info-detail-item"
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="12"
            >
              <div class="info-item-label">
                状态
                <i
                  class="el-icon-info"
                  title="变更历史"
                  @click="onOpenDialog"
                ></i>
              </div>
              <div class="info-item-value">{{transkey(detail.state)}}</div>
            </el-col>
            <el-col
              class="info-detail-item"
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="12"
            >
              <div class="info-item-label">供应商简称</div>
              <div class="info-item-value">{{detail.supplier_name}}</div>
            </el-col>
            <el-col
              class="info-detail-item"
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="12"
            >
              <div class="info-item-label">供应商代码</div>
              <div class="info-item-value">{{detail.supplier_code}}</div>
            </el-col>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <CollapseTitle title="订单明细" />
          </template>
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
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="result">
      <el-form
        ref="resultForm"
        :model="resultForm"
        label-width="120px"
        :rules="rules"
      >
        <el-col
          :xs="24"
          :sm="24"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <el-form-item
            label="审核结果"
            prop="result"
          >
            <el-select
              v-model="resultForm.result"
              placeholder="请选择审核结果"
            >
              <el-option
                v-for="(item,key) in resultType"
                :key="key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <el-form-item label="备注">
            <el-input v-model="resultForm.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="btn">
        <el-button
          type="primary"
          @click="onSave('resultForm')"
          :loading="loading"
        >提交</el-button>
      </div>
    </div>
    <el-dialog
      title="状态变更历史"
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
import CollapseTitle from '@/components/collapse-title/CollapseTitle.vue'
import Table from '@/components/table/Table'
import { ResultType, TableCols, StateTableCols, ReceiptTableCols } from './config/edit-waitcheck.config'
import { transKey, formatTime } from '@/utils/trans'
export default {
  components: {
    Title,
    CollapseTitle,
    Table
  },
  data () {
    return {
      activeNames: ['1', '2'],
      resultForm: {
        result: null,
        remark: null
      },
      rules: {
        result: {
          required: true, message: '请选择审核结果', trigger: 'change'
        }
      },
      resultType: ResultType,
      tableCols: TableCols,
      title: null,
      detail: null,
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      transkey: transKey,
      formattime: formatTime,
      dialogState: false,
      stateTableCols: StateTableCols,
      stateData: [],
      dialogReceipt: false,
      receiptData: [],
      receiptTableCols: ReceiptTableCols,
      loading: false,
      receiptTitle: null
    }
  },
  mounted () {
    this.resultForm.result = this.resultType[0].value
    this.title = this.$route.query.id
    // 通过收料单获取收料详情
    this.getReciptDetailById()
  },
  methods: {
    getReciptDetailById () {
      this.$http.get(`/business/stockin/receipt/self/${this.title}`).then(res => {
        this.detail = res.data
        this.pagination.total = res.data.details.length
      })
    },
    onSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const data = {
            remark: this.resultForm.remark,
            state: this.resultForm.result
          }
          let logType = 'reject'
          if (this.resultForm.result === 'unstart') {
            logType = 'pass'
          }
          console.log(data, 'datadatadata')
          this.$http.put(`/business/stockin/receiptst/${this.title}?logtype=${logType}`, { data: data }).then(res => {
            this.loading = false
            this.$message.success('操作成功')
            this.$router.go(-1)
          }, err => {
            console.log(err)
            this.loading = false
          })
        }
      })
    },
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
        if (row[column.property] === 'unstart') {
          return '通过'
        } else {
          return this.transkey(row[column.property])
        }
      } else {
        return row[column.property]
      }
    },
    onOpenDialog () {
      this.dialogState = true
      this.stateData = this.detail.state_log ? this.detail.state_log : []
    },
    stateFormatter (row, column) {
      if (column.property === 'state') {
        return this.transkey(row[column.property])
      } else if (column.property === 'operator') {
        return row[column.property] + '(' + row.operator_fullname + ')'
      } else {
        return row[column.property]
      }
    },
    onOpenReceiptHistroy (row) {
      this.dialogReceipt = true
      this.receiptData = row.op_log ? row.op_log : []
      this.receiptTitle = `收料历史:${row.material_code}`
    }

  }

}
</script>
<style lang="scss">
.edit-wait-check-page {
  .result {
    margin-top: $padding-xs;
  }
  .btn {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .info {
    .info-detail {
      display: flex;
      flex-wrap: wrap;
      border-right: 1px solid $border-detail-color;
      border-bottom: 1px solid $border-detail-color;
      .info-detail-item {
        font-size: 14px;
        display: flex;
        .info-item-label {
          width: 150px;
          border: 1px solid $border-detail-color;
          border-right: none;
          border-bottom: none;
          background-color: $--color-primary-light-9;
          padding-left: 8px;
          color: #606266;
          display: flex;
          align-items: center;
          i {
            margin-left: $padding-xs;
            cursor: pointer;
          }
        }
        .info-item-value {
          padding-left: 8px;
          min-height: $detail-table-height;
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          border: 1px solid $border-detail-color;
          border-bottom: none;
          border-right: none;
          &:hover {
            background-color: $detail-hover-bg-color;
          }
        }
      }
    }
  }
}
</style>
