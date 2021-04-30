<template>
  <div>
    <Title :title="'待审核列表'"></Title>
    <Search
      :params="searchParams"
      @onSearch="onSearch"
      @onReset="onReset"
    />
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
        v-for="(item,key) in tableCols"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sortable"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            class="table-detail"
            @click="$router.push(`stockin-edit-wait-check?id=${scope.row.id}`)"
            v-if="$permission('stockin_check_receipt_task')"
          >审核</span>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>
<script>
import Table from '@/components/table/Table'
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
import { TableCols, SearchParams } from './config/waitcheck.config'
import { transKey } from '@/utils/trans'
export default {
  components: { Table, Title, Search },
  data () {
    return {
      tableCols: TableCols,
      searchParams: SearchParams,
      tableData: [],
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      order: 0, // 默认降序
      col: 'id', // 默认排序的字段
      query: {},
      transkey: transKey
    }
  },
  mounted () {
    this.getAllData()
  },
  methods: {
    onSearch (val) {
      this.pagination.currentpage = 1
      this.query = val
      this.getAllData()
    },
    onReset (val) {
      this.pagination.currentPage = 1
      this.query = {}
      this.getAllData()
    },
    getAllData () {
      const data = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.col,
        order: this.order,
        state: 'wait_check'
      }
      Object.assign(data, this.query)
      this.$http.get('/business/stockin/watch/receipt', { data: data }).then(res => {
        this.tableData = res.data.data
        this.pagination.total = res.data.total_records
      })
    },
    onCurrentChange (page) {
      this.pagination.currentPage = page
      this.getAllData()
    },
    onSizeChange (page) {
      this.pagination.pageSize = page
      this.getAllData()
    },
    // 表格排序
    sortChange (column) {
      this.col = column.prop
      column.order === 'descending' ? this.order = 0 : this.order = 1
      this.getAllData()
    },
    // 格式化数据
    formatter (row, column) {
      if (column.property === 'state' || column.property === 'class') {
        return this.transkey(row[column.property])
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
