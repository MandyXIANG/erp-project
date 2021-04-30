<template>
  <div class="warehouse-page-wraper">
    <Title :title="'仓库列表'"></Title>
    <Search :params="searchParams" @onSearch="onSearch" @onReset="onReset" />
    <el-button
      v-if="$permission('warehouse_new')"
      class="btn"
      type="primary"
      @click="onNew"
      >新增</el-button
    >
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
        :formatter="formatter"
      >
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <span
            v-if="$permission('warehouse_detail')"
            class="table-detail"
            @click="onDetail(scope)"
            >详情</span
          >
          <el-divider
            v-if="$permission('warehouse_detail')"
            direction="vertical"
          ></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-edit"
                v-if="$permission('warehouse_edit')"
                @click.native="onEdit(scope)"
                >编辑</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-delete"
                @click.native="onDelete(scope)"
                v-if="$permission('warehouse_del')"
                >删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>
<script>
import Table from '@/components/table/Table'
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
import { getEnumGroup } from '@/utils/common.js'
import { SearchParams, TableCols, API_MAP, ENUM_MAP } from './warehouse.config'
export default {
  components: {
    Table,
    Title,
    Search
  },
  data () {
    return {
      searchParams: SearchParams,
      tableCols: TableCols,
      warehouseType: [],
      kindMap: {},
      tableData: [],
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      query: {},
      sort: { col: 'id', order: 0 }
    }
  },
  created () {
    getEnumGroup([ENUM_MAP.warehouse_type]).then(data => {
      for (const item of data) {
        if (item.category === ENUM_MAP.warehouse_type) {
          this.warehouseType = item.children
          for (const jtem of this.warehouseType) {
            this.kindMap[jtem.id] = jtem.value
          }
        }
      }
      this.getWarehouseList()
    })
  },
  methods: {
    onSearch (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getWarehouseList()
    },
    onReset (val) {
      this.query = {}
      this.pagination.currentPage = 1
      this.getWarehouseList()
    },
    /**
     * 新建
     */
    onNew () {
      this.$router.push('edit-warehouse')
    },
    onSizeChange (page) {
      this.pagination.pageSize = page
      this.getWarehouseList()
    },
    onCurrentChange (page) {
      this.pagination.currentPage = page
      this.getWarehouseList()
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getWarehouseList()
    },
    /**
     * 详情
     */
    onDetail (scope) {
      this.$router.push({
        path: `warehouse-detail?id=${scope.row.id}`,
        query: { name: scope.row.name }
      })
    },
    /**
     * 编辑仓库
     */
    onEdit (scope) {
      this.$router.push({
        path: `edit-warehouse?id=${scope.row.id}`,
        query: { name: scope.row.name }
      })
    },
    /**
     * 删除按钮回调函数
     */
    onDelete (scope) {
      this.$confirm(`此操作将删除仓库${scope.row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletWarehouse(scope)
      })
    },
    /**
     * 删除仓库
     */
    deletWarehouse (scope) {
      this.$http.del(API_MAP.WAREHOUSE_SELF + `/${scope.row.id}`).then(res => {
        if (res.code === 0) {
          if (
            this.tableData.length === 1 &&
            this.pagination.currentPage !== 1
          ) {
            this.pagination.currentPage = this.pagination.currentPage - 1
          }
          this.$message.success('删除成功')
          this.getWarehouseList()
        }
      })
    },
    formatter (row, column, cellValue, index) {
      if (column.property === 'kind') {
        return this.kindMap[row[column.property]]
      } else {
        return row[column.property]
      }
    },
    /**
     * 获取仓库列表
     */
    getWarehouseList () {
      this.tableData = []
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.sort.col,
        order: this.sort.order
      }
      params = Object.assign(params, this.query)
      this.$http
        .get(API_MAP.WAREHOUSE_LIST + '?clerk=1', { data: params })
        .then(res => {
          if (res.code === 0) {
            this.tableData = res.data.data || []
            this.pagination.total = res.data.total_records
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.warehouse-page-wraper {
  width: 100%;
  .btn {
    margin-bottom: $padding-md;
  }
}
</style>
