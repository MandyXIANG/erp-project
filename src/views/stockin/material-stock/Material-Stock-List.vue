<template>
  <div class="material-staock-list-page">
    <Title :title="'存料列表'"></Title>
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
        v-for="(item,key) in tableCols"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sortable"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <span
            class="table-detail"
            @click="$router.push(`stockin-material-stock-detail?id=${scoped.row.id}`)"
            v-if="$permission('stockin_read_material_stock_detail')"
          >详情</span>
          <el-divider direction="vertical"></el-divider>
          <span
            :class="{'disabled':scoped.row.state === 'finish'}"
            class="table-detail"
            v-if="$permission('stockin_edit_material_stock')"
            @click="goToDetail(scoped.row)"
          >
            存料
          </span>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>
<script>
import { TableCols, SearchParams } from './config/material-stock-list.config'
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
import Table from '@/components/table/Table'
import { transKey, formatTime } from '@/utils/trans'
export default {
  components: {
    Title,
    Search,
    Table
  },
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
      transkey: transKey,
      formattime: formatTime
    }
  },
  mounted () {
    // 获取全部存料数据
    this.getAllStore()
  },
  methods: {
    getAllStore () {
      const data = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.col,
        order: this.order
      }
      Object.assign(data, this.query)
      this.$http.get('/business/stockin/store', { data: data }).then(res => {
        console.log(res, 'resres')
        this.pagination.total = res.data.total_records
        this.tableData = res.data.data
      })
    },
    onSearch (val) {
      this.pagination.currentPage = 1
      this.query = val
      this.getAllStore()
    },
    onReset (val) {
      this.pagination.currentPage = 1
      this.query = {}
      this.getAllStore()
    },
    onSizeChange (page) {
      this.pagination.pageSize = page
      this.getAllStore()
    },
    onCurrentChange (page) {
      this.pagination.currentPage = page
      this.getAllStore()
    },
    sortChange (column) {
      console.log(column, 'valvalvalvalval')
      this.col = column.prop
      column.order === 'descending' ? this.order = 0 : this.order = 1
      this.getAllStore()
    },
    formatter (row, column) {
      if (column.property === 'state') {
        return this.transkey(row[column.property])
      } else if (column.property === 'create_at') {
        return this.formattime(row[column.property])
      } else {
        return row[column.property]
      }
    },
    goToDetail (row) {
      if (row.state !== 'finish') {
        this.$router.push(`stockin-material-stock?id=${row.id}`)
      }
    }
  }
}
</script>
<style lang="scss">
.material-staock-list-page {
  .disabled {
    color: $--disabled-color-base;
  }
}
</style>
