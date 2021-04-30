<template>
  <div class="request-detail">
    <PageHeader :title="$route.query.id" :back="true" @back="goBack" />
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <Title title="基本信息" />
        </template>
        <div class="outer">
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="item-label">
              请购单编号
              <i
                class="el-icon-info"
                @click="historyLog()"
                title="历史记录"
              ></i>
            </div>
            <div class="item-value">{{ item.id }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="item-label">请购单类型</div>
            <div class="item-value">{{ item.class }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="item-label">状态</div>
            <div class="item-value">{{ item.state_name }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="item-label">需求时间</div>
            <div class="item-value">{{ item.demand_time }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="item-label">请购人</div>
            <div class="item-value">
              {{ item.operator }}({{ item.operator_fullname }})
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="item-label">创建时间</div>
            <div class="item-value">{{ item.create_at }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">创建人</div>
            <div class="item-value">
              {{ item.owner_name }}({{ item.owner_fullname }})
            </div>
          </el-col>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <Title title="请购明细" />
        </template>
        <Table
          :data="spliceTableData"
          :total="(item.materials || []).length"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        >
          <el-table-column
            v-for="(jtem, index) in detailMaterialCols"
            :key="index"
            :prop="jtem.prop"
            :label="jtem.label"
            :formatter="formatter"
          >
          </el-table-column>
          <template v-if="item.state !== 'draft'">
            <el-table-column label="不再采购">
              <template slot-scope="scope">
                <el-tooltip
                  :content="scope.row.extra ? '不再采购' : '继续采购'"
                  placement="top"
                >
                  <el-switch
                    v-model="scope.row.extra"
                    :disabled="scope.row.disabled"
                    @change="switchChange(scope.row)"
                  >
                  </el-switch>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
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
  </div>
</template>

<script>
import PageHeader from '@/components/title/Title.vue'
import Title from '@/components/collapse-title/CollapseTitle.vue'
import Table from '@/components/table/Table.vue'
import { detailMaterialCols, API_MAP, historyTableCols } from './config'
import {
  transKey,
  formatTime,
  formatDate,
  transAction
} from '@/utils/trans.js'

export default {
  components: {
    PageHeader,
    Title,
    Table
  },
  data () {
    return {
      activeName: ['1', '2'],
      detailMaterialCols,
      historyTableCols,
      item: {},
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      historyModel: false,
      historyData: []
    }
  },
  computed: {
    spliceTableData () {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = this.pagination.currentPage * this.pagination.pageSize
      const cloneData = JSON.parse(JSON.stringify(this.item.materials || []))
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
    /**
     *根据请购单id获取请购单信息
     @param id 请购单id
     */
    getInfoById (id) {
      this.$http.get(API_MAP.PURCHASE_REQ + `/${id}`).then(res => {
        if (res.code === 0) {
          this.item = res.data
          this.item.materials = this.item.materials || []
          this.item.class = transKey(this.item.class)
          this.item.state_name = transKey(this.item.state)
          this.item.create_at = formatTime(this.item.create_at)
          this.item.demand_time = formatDate(this.item.demand_time)
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
      if (row.extra_req) {
        row.extra = true
      }
      if (row.req_amount === row.finish_amount) {
        row.extra = true
        row.disabled = true
      }
      if (column.property === 'demand_time') {
        return formatDate(row[column.property])
      } else {
        return row[column.property]
      }
    },
    historyLog () {
      this.$http
        .get(
          API_MAP.OP_LOGS +
            `/${this.$tableCode.TablePurchaseReq}/${this.$route.query.id}`
        )
        .then(res => {
          if (res.code === 0) {
            this.historyData = res.data
          }
        })
      this.historyModel = true
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
    switchChange (row) {
      this.$http
        .put(`${API_MAP.REP_EXTRA}/${row.id}?type=${row.extra ? 1 : 0}`)
        .then(res => {
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.getInfoById(this.$route.query.id)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.request-detail {
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
</style>
