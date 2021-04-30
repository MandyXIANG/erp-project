<template>
  <div class="stockin-material-receive-page">
    <Title :title="'收料列表'"></Title>
    <Search
      :params="searchParams"
      @onSearch="onSearch"
      @onReset="onReset"
    ></Search>
    <Table
      :data="tableData"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      @sort-change="sortChange"
    >
      <el-table-column
        :formatter="formatter"
        sortable="custom"
        v-for="(item, key) in tableCols"
        :key="key"
        :prop="item.prop"
        :label="item.label"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            class="table-detail"
            @click="goToReceive(scope)"
            v-if="$permission('stockin_receipt')"
          >收料</span>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>
<script>
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
import Table from '@/components/table/Table'
import { transKey, formatTime } from '@/utils/trans.js'

import {
  SearchParams,
  TableCols,
  API_MAP
} from './config/material-receive.config'
export default {
  components: {
    Title,
    Search,
    Table
  },
  data () {
    return {
      searchParams: SearchParams,
      tableCols: TableCols,
      tableData: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      query: {
        state: 'unstart,receiving',
        stateop: 0
      },
      sort: { col: 'id', order: 0 }
    }
  },
  created () {
    this.getReceiveList()
  },
  methods: {
    goToReceive (scope) {
      this.$router.push({
        path: 'stockin-recevice',
        query: {
          id: scope.row.id,
          name: scope.row.supplier_name,
          code: scope.row.supplier_code
        }
      })
    },
    onSearch (value) {
      this.pagination.currentPage = 1
      this.query = value
      this.getReceiveList()
    },
    onReset (value) {
      this.pagination.currentPage = 1
      this.query = {
        state: 'unstart,receiving',
        stateop: 0
      }
      this.getReceiveList()
    },

    getReceiveList () {
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.sort.col,
        order: this.sort.order
      }
      params = Object.assign(params, this.query)
      this.$http.get(API_MAP.STOCKIN_RECEIPTS2, { data: params }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.pagination.total = res.data.total_records
        }
      })
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getReceiveList()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getReceiveList()
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getReceiveList()
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'state' || column.property === 'class') {
        return transKey(row[column.property])
      } else if (column.property === 'create_at') {
        return formatTime(row[column.property])
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
<style lang="scss">
.stockin-material-receive-page {
  .btn {
    margin-bottom: $padding-md;
  }
}
</style>
