<template>
  <div class="order-detail">
    <PageHeader v-if="header" :title="orderId" :back="true" @back="goBack" />
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <Title title="基本信息" />
        </template>
        <div class="outer">
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">
              销售订单号
              <i
                class="el-icon-info"
                @click="historyLog()"
                title="历史记录"
              ></i>
            </div>
            <div class="item-value">{{ item.id }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">客户代码</div>
            <div class="item-value">{{ item.customer_code }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">客户名称</div>
            <div class="item-value">{{ item.customer_name }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">客户经手人</div>
            <div class="item-value">{{ item.agent }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">客户订单号</div>
            <div class="item-value">{{ item.customer_order_no }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">
              状态
            </div>
            <div class="item-value">{{ item.state }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">交易币种</div>
            <div class="item-value">{{ item.currency }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">基准币种</div>
            <div class="item-value">{{ item.base_currency }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">计价单位</div>
            <div class="item-value">{{ item.unit }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">汇率</div>
            <div class="item-value">{{ item.exchange_rate }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">是否开票</div>
            <div class="item-value">{{ item.ticket ? "是" : "否" }}</div>
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
            <div class="item-value">
              {{ item.settles_name }}
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">折扣</div>
            <div class="item-value">
              {{ item.discount && item.discount + "%" }}
            </div>
          </el-col>
          <!-- <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">原始总价</div>
            <div class="item-value">{{ item.o_total }}</div>
          </el-col> -->
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">实际总价</div>
            <div class="item-value">{{ item.real_total }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-label">销售人员</div>
            <div class="item-value">
              {{ item.sales_man }}({{ item.salesman_fullname }})
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
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="16" :xl="16">
            <div class="item-label">备注</div>
            <div class="item-value">{{ item.remark }}</div>
          </el-col>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <Title title="订单明细" />
        </template>
        <Table
          :data="spliceTableData"
          :total="materialDate.length"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        >
          <el-table-column
            v-for="(item, key) in materialTableCols"
            :key="key"
            :prop="item.prop"
            :label="item.label"
            :formatter="formatter"
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                slot="reference"
                class="table-detail"
                @click="deliveryHistory(scope)"
                >发货历史</span
              >
            </template>
          </el-table-column>
        </Table>
      </el-collapse-item>
    </el-collapse>
    <!-- 历史记录弹框 -->
    <el-dialog title="历史记录" :visible.sync="historyModel">
      <el-table :data="historyData" size="mini">
        <el-table-column
          v-for="(item, key) in historyTableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :formatter="formatter3"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 发货历史记录弹框 -->
    <el-dialog :title="deliveryTitle" :visible.sync="deliveryModel">
      <el-table :data="deliveryData" size="mini">
        <el-table-column
          v-for="(item, key) in deliverHistoryTableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :formatter="formatter2"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 结算方式弹框 -->
    <el-dialog title="结算方式" :visible.sync="payDialog">
      <payForm  :hideAlert="true" :contentCenter="true" :payMethod="payConfig" :hideTitle="true" />
    </el-dialog>
  </div>
</template>

<script>
import * as Decimal from 'decimal.js'

import PageHeader from '@/components/title/Title.vue'
import Title from '@/components/collapse-title/CollapseTitle.vue'
import Table from '@/components/table/Table.vue'
import payForm from '../../supplier/PayMethod'
import {
  API_MAP,
  materialTableCols,
  historyTableCols,
  deliverHistoryTableCols
} from './config'
import { transKey, formatTime, transPay, transAction } from '@/utils/trans.js'

export default {
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
  components: {
    PageHeader,
    Title,
    Table,
    payForm
  },
  computed: {
    spliceTableData () {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = this.pagination.currentPage * this.pagination.pageSize
      const cloneData = JSON.parse(JSON.stringify(this.materialDate))
      return cloneData.slice(start, end)
    }
  },
  data () {
    return {
      activeName: ['1', '2'],
      materialTableCols,
      materialDate: [],
      historyModel: false,
      historyTableCols,
      deliverHistoryTableCols,
      historyData: [],
      item: {},
      orderId: null,
      deliveryModel: false,
      deliveryData: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      payDialog: false,
      payConfig: {},
      deliveryTitle: ''
    }
  },
  created () {
    this.orderId = this.$route.query.id || this.order
    this.initPage()
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    initPage () {
      this.$http.get(API_MAP.SALES_MAIN + `/${this.orderId}`).then(res => {
        if (res.code === 0) {
          this.item = res.data
          this.materialDate = res.data.details
          this.payConfig = this.item.settles
          this.initForm()
        }
      })
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (row[column.property] === null || row[column.property] === undefined) {
        return
      }
      if (column.property === 'state') {
        return transKey(row[column.property])
      } else if (column.property === 'sent_sum' && row.sent_sum) {
        const unitInfo = row.unit_info
        return Number(
          Decimal.div(
            Number(Decimal.mul(row.sent_sum, unitInfo.stock_ratio)),
            unitInfo.sale_ratio
          )
        )
      } else if (column.property === 'real_discount' && row[column.property]) {
        return row[column.property] + '%'
      } else if (column.property === 'sale_price') {
        return `${row[column.property]}${row.sale_currency || ''}${
          row.price_unit ? '(' + row.price_unit + ')' : ''
        }`
      } else if (
        column.property === 'real_price' ||
        column.property === 'real_total_price'
      ) {
        return `${row[column.property]}${
          this.item.currency ? transKey(this.item.currency) : ''
        }${this.item.unit ? '(' + transKey(this.item.unit) + ')' : ''}`
      } else {
        return row[column.property]
      }
    },
    formatter2 (row, column, cellValue, index) {
      if (column.property === 'state') {
        const state = row[column.property]
        const states = [
          'wait_check',
          'unstart',
          'preparing',
          'prepared',
          'prepare_end'
        ]
        if (states.indexOf(state) > -1) {
          return '待出库'
        } else if (state === 'stop') {
          return '已关闭'
        } else {
          return transKey(row[column.property])
        }
      } else if (column.property === 'plan_stockout_time') {
        return formatTime(row[column.property])
      } else if (column.property === 'owner') {
        return `${row.owner_name}(${row.owner_fullname})`
      } else {
        return row[column.property]
      }
    },
    formatter3 (row, column, cellValue, index) {
      if (row[column.property] === null || row[column.property] === undefined) {
        return
      }
      if (column.property === 'log_type') {
        return transAction(row[column.property])
      } else if (column.property === 'owner') {
        return `${row.owner}(${row.owner_fullname})`
      } else if (column.property === 'log_time') {
        return formatTime(row[column.property])
      } else {
        return row[column.property]
      }
    },
    /**
     * 处理界面基本信息
     */
    initForm () {
      const settles = this.item.settles || {}
      for (const key in settles) {
        if (settles[key]) {
          this.item.settles_name = key
        }
      }
      this.getContactById(this.item.agent)
      this.item.state = transKey(this.item.state)
      this.item.pay_method = transKey(this.item.pay_method)
      this.item.settles_name = transPay(this.item.settles_name)
      this.item.currency = transKey(this.item.currency)
      this.item.base_currency = transKey(this.item.base_currency)
      this.item.unit = transKey(this.item.unit)
      this.item.create_at = formatTime(this.item.create_at)
      this.item.effective_date = formatTime(this.item.effective_date)
      this.calcPrice()
    },
    calcPrice () {
      let originTotal = 0
      let realTotal = 0

      for (const ele of this.materialDate) {
        const sumOrigin = Number(Decimal.mul(ele.sale_price || 0, ele.count))
        const sumReal = Number(Decimal.mul(ele.real_price || 0, ele.count))
        originTotal = Number(Decimal.add(originTotal, sumOrigin))
        realTotal = Number(Decimal.add(realTotal, sumReal))
        ele.real_total_price = sumReal
        ele.origin_total_price = sumOrigin
      }
      this.item.real_total = realTotal
      this.item.o_total = originTotal
      if (this.item.discount) {
        this.item.real_total = Number(
          Decimal.mul(realTotal, Decimal.div(this.item.discount, 100))
        )
      }
    },
    /**
     * 根据联系人Id获取联系人
     */
    getContactById (id) {
      if (id) {
        this.$http.get(API_MAP.BASE_CONTACT + `/${id}`).then(res => {
          if (res.code === 0) {
            this.item.agent = res.data.name
          }
        })
      }
    },
    historyLog () {
      this.$http
        .get(
          API_MAP.OP_LOGS + `/${this.$tableCode.TableSaleMain}/${this.orderId}`
        )
        .then(res => {
          if (res.code === 0) {
            this.historyData = res.data.filter(item => {
              return item.log_type !== 'sale_out'
            })
          }
        })
      this.historyModel = true
    },
    deliveryHistory (scope) {
      this.deliveryTitle = `发货历史：${scope.row.material_code}`
      this.$http.get(API_MAP.SALES_OUTS + `/${scope.row.id}`).then(res => {
        if (res.code === 0) {
          this.deliveryData = res.data
          this.deliveryModel = true
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
    payClick () {
      this.payDialog = true
      this.payConfig = this.item.settles
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
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
}
/deep/ .el-dialog__body {
  max-height: 400px;
  overflow: auto;
}
</style>
