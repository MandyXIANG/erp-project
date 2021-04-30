<template>
  <div class="supplier-material-container">
    <Title title="供应商列表" />
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
            v-if="$permission('supplier_material_detail')"
            class="table-opreator"
            @click="goToDetail(scope)"
            >详情</span
          >
          <el-divider
            v-if="$permission('supplier_material_detail')"
            direction="vertical"
          ></el-divider>
          <span
            v-if="$permission('supplier_material_add')"
            class="table-opreator"
            @click="addMaterial(scope)"
            >添加物料</span
          >
        </template>
      </el-table-column>
    </Table>
  </div>
</template>

<script>
import Table from '@/components/table/Table.vue'
import Title from '@/components/title/Title.vue'
import Search from '@/components/search/Search.vue'
import { searchParams, tableCols, API_MAP } from './config'
export default {
  components: {
    Table,
    Title,
    Search
  },
  data () {
    return {
      searchParams: searchParams,
      tableCols,
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
    this.getSupplierList()
  },
  methods: {
    getSupplierList () {
      this.tableData = []
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.sort.col,
        order: this.sort.order
      }
      params = Object.assign(params, this.query)
      this.$http.get(API_MAP.SUPPLIER_LIST, { data: params }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data || []
          this.pagination.total = res.data.total_records
        }
      })
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getSupplierList()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getSupplierList()
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getSupplierList()
    },
    onSeach (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getSupplierList()
    },
    onReset (val) {
      this.query = {}
      this.pagination.currentPage = 1
      this.getSupplierList()
    },
    addMaterial (scope) {
      this.$router.push({
        path: 'supplier-add-material',
        query: {
          id: scope.row.id,
          name: scope.row.name,
          curr: scope.row.trans_curr
        }
      })
    },
    goToDetail (scope) {
      this.$router.push({
        path: 'supplier-material-detail',
        query: { id: scope.row.id, name: scope.row.name }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.supplier-material-container {
  .table-opreator {
    color: $--color-primary;
    font-size: $font-base;
    cursor: pointer;
  }
}
</style>
