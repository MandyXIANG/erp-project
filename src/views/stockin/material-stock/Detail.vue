<template>
  <div class="material-stock-detail">
    <Title
      :title="$route.query.id"
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
            :lg="24"
            :xl="24"
          >
            <div class="item-label">
              存料单号
            </div>
            <div class="item-value">{{detail.id}}</div>
          </el-col>
          <el-col
            class="item-col"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
          >
            <div class="item-label">收料单号</div>
            <div class="item-value">{{detail.receipt_id}}</div>
          </el-col>
          <el-col
            class="item-col"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
          >
            <div class="item-label">状态</div>
            <div class="item-value">{{transkey(detail.state)}}</div>
          </el-col>
          <el-col
            class="item-col"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
          >
            <div class="item-label">待存数量</div>
            <div class="item-value">{{detail.need_amount}}</div>
          </el-col>
          <el-col
            class="item-col"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
          >
            <div class="item-label">收料时间</div>
            <div class="item-value">{{formattime(detail.create_at)}}</div>
          </el-col>
          <el-col
            class="item-col"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
          >
            <div class="item-label">创建人</div>
            <div class="item-value">{{detail.owner_name}}({{detail.owner_fullname}})</div>
          </el-col>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <CollapseTitle :title="'存料明细'" />
        </template>
        <Table
          :data="tableData.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.currentPage * this.pagination.pageSize)"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          :total="pagination.total"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
        >
          <el-table-column
            v-for="(item,key) in tableCols"
            :key="key"
            :prop="item.prop"
            :label="item.label"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <span
                class="table-detail"
                @click="onHistory(scoped.row)"
              >存料历史</span>
            </template>
          </el-table-column>
        </Table>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      :title="saveTitle"
      :visible.sync="dialog"
      @close="dialog= false"
      :close-on-click-modal="false"
    >
      <el-table :data="storeData">
        <el-table-column
          v-for="(item,key) in storeTableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :formatter="formatter"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Title from '@/components/title/Title'
import CollapseTitle from '@/components/collapse-title/CollapseTitle'
import Table from '@/components/table/Table'
import { TableCols, StoreTableCols } from './config/detail.config'
import { formatTime, transKey } from '@/utils/trans'
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
      detail: {},
      transkey: transKey,
      formattime: formatTime,
      dialog: false,
      storeData: [],
      tableData: [],
      storeTableCols: StoreTableCols,
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      saveTitle: null
    }
  },
  mounted () {
    const data = {
      f: 1
    }
    this.$http.get(`/business/stockin/store/${this.$route.query.id}`, { data: data }).then(res => {
      this.detail = res.data
      this.tableData = res.data.details
      this.pagination.total = res.data.details.length
    })
  },
  methods: {
    onHistory (row) {
      this.dialog = true
      this.$http.get(`/system/oplogs/${tableCode.TableStockinStoreDetail}/${row.id}`).then(res => {
        console.log(res, 'resresresresresresres')
        this.storeData = res.data
        this.saveTitle = `存料历史:${row.material_code}`
      })
    },
    onSizeChange (page) {
      this.pagination.pageSize = page
    },
    onCurrentChange (page) {
      this.pagination.currentPage = page
    },
    formatter (row, column) {
      if (column.property === 'owner') {
        return row[column.property] + '(' + row.owner_fullname + ')'
      } else if (column.property === 'log_time') {
        return formatTime(row[column.property])
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
<style lang="scss">
.material-stock-detail {
  .base-container {
    display: flex;
    flex-wrap: wrap;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    .item-col {
      display: flex;
      font-size: 14px;
      .item-label {
        width: 200px;
        text-align: left;
        border: 1px solid $border-detail-color;
        border-bottom: none;
        border-right: none;
        display: flex;
        align-items: center;
        padding-left: 8px;
        color: #606266;
        background-color: $--color-primary-light-9;
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
}
</style>
