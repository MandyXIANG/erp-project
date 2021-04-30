<template>
  <div class="warehouse-inventory">
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
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            header-cell-class-name="no-border-cell"
            cell-class-name="no-border-cell"
            :border="false"
            :data="props.row.supplier_material_infos"
            size="mini"
          >
            <el-table-column
              v-for="(ele, j) in warehouseExpand"
              :key="j"
              :prop="ele.prop"
              :label="ele.label"
            >
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <template v-for="(item, index) in warehouseCol">
        <el-table-column
          sortable="custom"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >
        </el-table-column>
      </template>
    </Table>
  </div>
</template>

<script>
import Table from '@/components/table/Table'
import { warehouseCol, warehouseExpand, searchParams, API_MAP } from './config'
import Search from '@/components/search/Search'
export default {
  components: {
    Table,
    Search
  },
  data () {
    return {
      warehouseExpand,
      warehouseCol,
      tableData: [],
      searchParams,
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      sort: { col: 'id', order: 0 },
      query: {}
    }
  },
  created () {
    this.getTabelData()
  },
  methods: {
    onSearch (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getTabelData()
    },
    onReset (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getTabelData()
    },
    changePageSize (pageSize) {
      this.pagination.pageSize = pageSize
      this.getTabelData()
    },
    changeCurrentPage (curPage) {
      this.pagination.currentPage = curPage
      this.getTabelData()
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getTabelData()
    },
    getTabelData () {
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.sort.col,
        order: this.sort.order
      }
      params = Object.assign(params, this.query)
      this.$http.get(API_MAP.WAREHOUSE, { data: params }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.datas
          this.pagination.total = res.data.total_records
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.warehouse-inventory {
  /deep/ .no-border-cell {
    border-right: 0 !important;
  }
}
</style>
