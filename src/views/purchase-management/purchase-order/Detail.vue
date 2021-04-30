<template>
  <div class="purchase-detail">
    <PageHeader
      v-if="header"
      :title="$route.query.id"
      :back="true"
      @back="goBack"
    />
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <Title title="基本信息" />
        </template>
        <div class="outer">
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">
              采购订单号
              <i
                class="el-icon-info"
                @click="statusHistory()"
                title="历史记录"
              ></i>
            </div>
            <div class="item-value">{{ item.id }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">
              状态
            </div>
            <div class="item-value">
              {{ item.state }}
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">创建时间</div>
            <div class="item-value">{{ item.create_at }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">创建人</div>
            <div class="item-value">
              {{ item.owner_name }}({{ item.owner_fullname }})
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">生效时间</div>
            <div class="item-value">{{ item.effective_date }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">供应商代码</div>
            <div class="item-value">{{ item.supplier_code }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">供应商名称</div>
            <div class="item-value">{{ item.supplier_name }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">供应商经手人</div>
            <div class="item-value">{{ item.supplier_agent }}</div>
          </el-col>

          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">交易币种</div>
            <div class="item-value">{{ item.currency }}</div>
          </el-col>

          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">订单总价</div>
            <div class="item-value">{{ item.order_total }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">金额单位</div>
            <div class="item-value">{{ item.price_unit }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">是否开票</div>
            <div class="item-value">{{ item.ticket ? "是" : "否" }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">优先级</div>
            <div class="item-value">{{ item.priority }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">汇款方式</div>
            <div class="item-value">{{ item.pay_method }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">
              结算方式
              <i class="el-icon-info" @click="payClick()" title="结算方式"></i>
            </div>
            <div class="item-value">{{ item.settles_name }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">计划交货时间</div>
            <div class="item-value">{{ item.plan_date }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">采购人员</div>
            <div class="item-value">
              {{ item.purchase_man }}({{ item.purchaseman_fullname }})
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">备注</div>
            <div class="item-value">{{ item.remark }}</div>
          </el-col>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <Title title="采购明细" />
        </template>
        <Table
          :data="spliceTableData"
          :total="(item.details || []).length"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        >
          <el-table-column width="50">
            <template slot-scope="scope">
              <i
                title="收货提醒"
                :style="{
                  fontSize: '20px',
                  color:
                    scope.row.notify && item.state !== '拒绝'
                      ? '#13C2C2'
                      : '#ddd'
                }"
                class="iconfont iconshouhuo"
              ></i>
            </template>
          </el-table-column>
          <el-table-column
            :width="item.width"
            :formatter="formatter"
            v-for="(item, index) in detailTableCols"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          >
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <span class="table-detail" @click="receiveHistory(scope)"
                >收货历史</span
              >
            </template>
          </el-table-column>
        </Table>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <Title title="相关文件" />
        </template>
        <div class="files">
          <div
            v-for="(ele, index) in item.attached_file"
            :key="index"
            class="file-item"
          >
            <i class="el-icon-document"></i>
            <span>{{ ele }}</span>
            <el-popconfirm title="确定要删除吗？" @onConfirm="deleteFile(ele)">
              <i slot="reference" class="el-icon-close" title="删除"></i>
            </el-popconfirm>
            <i
              class="el-icon-download download"
              title="下载"
              @click="download(ele)"
            ></i>
            <el-divider
              v-if="index !== (item.attached_file.length || []) - 1"
              direction="vertical"
            ></el-divider>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- 历史记录弹框 -->
    <el-dialog title="历史记录" :visible.sync="statusModel">
      <el-table :data="statusData" size="mini">
        <el-table-column
          :formatter="formatter"
          v-for="(item, key) in statusTableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 结算方式弹框 -->
    <el-dialog title="结算方式" :visible.sync="payDialog">
      <payForm :payMethod="payConfig" :hideTitle="true" />
    </el-dialog>
    <!-- 收货历史记录弹框 -->
    <el-dialog :title="receiveTitle" :visible.sync="receiveModel">
      <el-table :data="receiveData" size="mini">
        <el-table-column
          v-for="(item, key) in receiveHistoryTableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :formatter="formatter2"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as Decimal from 'decimal.js'
import * as moment from 'moment'
import axios from 'axios'

import PageHeader from '@/components/title/Title.vue'
import Title from '@/components/collapse-title/CollapseTitle.vue'
import Table from '@/components/table/Table.vue'
import downloadFile from '@/utils/download.js'
import {
  detailTableCols,
  API_MAP,
  statusTableCols,
  receiveHistoryTableCols
} from './config'
import payForm from '../../supplier/PayMethod'
import { transKey, formatTime, transPay, transAction } from '@/utils/trans.js'

export default {
  components: {
    PageHeader,
    Title,
    Table,
    payForm
  },
  props: {
    header: {
      type: Boolean,
      default: true
    },
    order: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      activeName: ['1', '2'],
      detailTableCols,
      statusTableCols,
      receiveHistoryTableCols,
      item: {},
      statusData: [],
      statusModel: false,
      payDialog: false,
      payConfig: {},
      receiveTitle: '',
      receiveModel: false,
      receiveData: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      }
    }
  },
  computed: {
    spliceTableData () {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = this.pagination.currentPage * this.pagination.pageSize
      const cloneData = JSON.parse(JSON.stringify(this.item.details || []))
      return cloneData.slice(start, end)
    }
  },
  created () {
    this.getInfoById(this.$route.query.id)
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getInfoById (id) {
      this.$http.get(API_MAP.PURCHASE_MAIN + `/${id}`).then(res => {
        if (res.code === 0) {
          this.item = res.data
          this.payConfig = this.item.settles
          this.initForm()
          this.notify(this.item.details)
        }
      })
    },
    /**
     * 处理界面基本信息
     */
    initForm () {
      const settles = this.item.settles
      for (const key in settles) {
        if (settles[key]) {
          this.item.settles_name = key
        }
      }
      this.item.state = transKey(this.item.state)
      this.item.pay_method = transKey(this.item.pay_method)
      this.item.settles_name = transPay(this.item.settles_name)
      this.item.create_at = formatTime(this.item.create_at)
      this.item.effective_date = formatTime(this.item.effective_date)
      this.item.plan_date = formatTime(this.item.plan_date)
      this.item.currency = transKey(this.item.currency)
      this.item.price_unit = transKey(this.item.price_unit)
      this.calcPrice()
    },
    statusHistory () {
      // this.statusData = this.item.state_log
      this.$http
        .get(
          API_MAP.OP_LOGS +
            `/${this.$tableCode.TablePurchaseMain}/${this.$route.query.id}`
        )
        .then(res => {
          if (res.code === 0) {
            this.statusData = res.data.filter(o => {
              return o.log_type !== 'trace'
            })
          }
          this.statusModel = true
        })
    },
    payClick () {
      this.payDialog = true
      this.payConfig = this.item.settles
    },
    // 格式化数据
    formatter2 (row, column, cellValue, index) {
      if (column.property === 'owner') {
        return `${row.owner}(${row.owner_fullname})`
      } else {
        return row[column.property]
      }
    },
    formatter (row, column, cellValue, index) {
      if (column.property === 'state') {
        return transKey(row[column.property])
      } else if (column.property === 'owner') {
        return `${row.owner}(${row.owner_fullname})`
      } else if (column.property === 'log_time') {
        return formatTime(row[column.property])
      } else if (column.property === 'log_type') {
        return transAction(row[column.property])
      } else if (column.property === 'hscode.code') {
        return (row.hscode || {}).code
      } else if (column.property === 'supplier_price' && row[column.property]) {
        if (row.supplier_price_unit) {
          return (
            row[column.property] + `(${transKey(row.supplier_price_unit)})`
          )
        } else {
          return row[column.property]
        }
      } else if (column.property === 'price' && row[column.property]) {
        if (this.item.price_unit) {
          return row[column.property] + `(${transKey(this.item.price_unit)})`
        } else {
          return row[column.property]
        }
      } else {
        return row[column.property]
      }
    },

    receiveHistory (scope) {
      this.$http
        .get(
          API_MAP.OP_LOGS +
            `/${this.$tableCode.TablePurchaseDetail}/${scope.row.id}`
        )
        .then(res => {
          this.receiveData = res.data
          this.receiveTitle = '收货历史：' + scope.row.material_code
          this.receiveModel = true
        })
    },
    calcPrice () {
      let orderTotal = 0
      for (const ele of this.item.details) {
        ele.total_price = Number(Decimal.mul(ele.price, ele.purchase_amount))
        orderTotal = Number(Decimal.add(orderTotal, ele.total_price))
      }
      this.item.order_total = orderTotal
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
    },
    /**
     * 收货提醒
     */

    notify (details) {
      for (const ele of details) {
        ele.notify = false
        const purchaseInfo = ele.purchase_info || {}
        if (purchaseInfo.notify && purchaseInfo.ahead && this.item.plan_date) {
          const ahead = purchaseInfo.ahead
          const planDate = formatTime(this.item.plan_date)
          const notifyDate = moment(planDate)
            .subtract(ahead, 'days')
            .format('YYYY-MM-DD HH:mm:ss')
          const nowDate = moment().format('YYYY-MM-DD HH:mm:ss')
          if (
            moment(notifyDate).isSameOrBefore(nowDate) &&
            ele.purchased_amount < ele.purchase_amount
          ) {
            ele.notify = true
          }
        }
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.notify) {
        return 'warning-row'
      }
    },
    /**
     * 下载文件
     */
    download (name) {
      axios
        .get('/api/v1' + API_MAP.SYSTEM_FT + `?name=${name}`, {
          responseType: 'arraybuffer'
        })
        .then(res => {
          downloadFile(name, res.data)
        })
    },
    /**
     * 删除文件
     */
    deleteFile (name) {
      this.$http
        .del(API_MAP.PURCHASE_F + `/${this.$route.query.id}?f=${name}`)
        .then(data => {
          console.log('删除0', data)
          if (data.code === 0) {
            this.$http.del(API_MAP.SYSTEM_FT + `?name=${name}`).then(res => {
              console.log('删除', res)
              if (res.code === 0) {
                this.$message.success('操作成功')
                this.getInfoById(this.$route.query.id)
              }
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.purchase-detail {
  .outer {
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    border-right: 1px solid $border-detail-color;
    border-bottom: 1px solid $border-detail-color;
    .item {
      display: flex;
      font-size: 14px;
      .item-label {
        min-width: 150px;
        max-width: 150px;
        text-align: left;
        border: 1px solid $border-detail-color;
        border-bottom: none;
        border-right: none;
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
      .value-area {
        flex: 1;
      }
      .item-value {
        padding-left: 8px;
        min-height: $detail-table-height;
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border: 1px solid $border-detail-color;
        border-bottom: none;
        border-right: none;
        &:hover {
          background-color: $detail-hover-bg-color;
        }
      }
    }
  }
  .files {
    display: flex;
    .file-item {
      margin-right: $padding-xs;
      i {
        font-size: 16px;
      }
      span {
        margin-right: $padding-xs;
        margin-left: $padding-xs;
      }
      .el-icon-close {
        cursor: pointer;
        &:hover {
          color: red;
          transform: scale(1.5);
          transition: all 0.3s;
        }
      }
      .download {
        cursor: pointer;
        &:hover {
          color: $--color-primary;
          transform: scale(1.5);
          transition: all 0.3s;
        }
      }
    }
  }
  /deep/ .warning-row {
    color: $warnning-color;
  }
}
</style>
