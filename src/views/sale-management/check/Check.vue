<template>
  <div>
    <PageHeader title="待审核列表" />
    <Search :params="searchParams" @onSearch="onSeach" @onReset="onReset" />
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
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            class="table-detail"
            v-if="$permission('check_order')"
            @click="goToDetail(scope)"
          >
            {{
              scope.row.state === "wait_check"
                ? "审核"
                : scope.row.effective_date
                ? "修改生效时间"
                : "生效"
            }}
          </span>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>

<script>
import PageHeader from '@/components/title/Title.vue'
import Search from '@/components/search/Search.vue'
import Table from '@/components/table/Table.vue'
import { tableCols, searchParams, API_MAP } from './config'
import { transKey, formatTime } from '@/utils/trans.js'
export default {
  components: {
    PageHeader,
    Search,
    Table
  },
  data () {
    return {
      tableCols,
      searchParams,
      tableData: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      query: {},
      sort: { col: 'id', order: 0 }
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    goToDetail (scope) {
      this.$router.push({
        path: 'sale-check-detail',
        query: {
          id: scope.row.id,
          state: scope.row.state,
          date: scope.row.effective_date
        }
      })
    },
    /**
     * 获取订单列表
     */
    getOrderList () {
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.sort.col,
        order: this.sort.order,
        stateop: 0,
        state: 'wait_check,pass'
      }
      params = Object.assign(params, this.query)
      this.$http.get(API_MAP.SALES_MAINS, { data: params }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.pagination.total = res.data.total_records
        }
      })
    },
    onSeach (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getOrderList()
    },
    onReset (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getOrderList()
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getOrderList()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getOrderList()
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getOrderList()
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'state') {
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

<style></style>
