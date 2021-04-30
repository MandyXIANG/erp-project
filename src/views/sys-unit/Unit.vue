<template>
  <div class="unit-page-wraper">
    <Title :title="'单位列表'"></Title>
    <Search :params="searchParams" @onSearch="onSearch" @onReset="onReset" />
    <el-button
      class="btn"
      type="primary"
      @click="onNew"
      v-if="$permission('new_unit')"
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
        v-for="(item, key) in tableCols"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sortable"
      >
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <!-- <span
            class="table-detail"
            @click="onDetail(scope)"
            v-if="$permission('unit_detail')"
          >详情</span> -->
          <span
            class="table-detail"
            v-if="$permission('edit_unit')"
            @click="onEdit(scope)"
            >编辑</span
          >
          <el-divider direction="vertical"></el-divider>
          <span
            class="table-detail"
            v-if="$permission('delete_unit')"
            @click="onDelete(scope)"
            >删除</span
          >
          <!-- <el-dropdown>
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-edit"
                v-if="$permission('edit_unit')"
                @click.native="onEdit(scope)"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-delete"
                v-if="$permission('delete_unit')"
                @click.native="onDelete(scope)"
              >删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </template>
      </el-table-column>
    </Table>
  </div>
</template>
<script>
import Table from '@/components/table/Table'
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
import { TableCols, SearchParams } from './unit.config'
export default {
  components: {
    Table,
    Search,
    Title
  },
  data () {
    return {
      tableCols: TableCols,
      tableData: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      searchParams: SearchParams,
      query: {},
      order: 0,
      col: 'id'
    }
  },
  mounted () {
    this.getAllUnitData()
  },
  methods: {
    getAllUnitData () {
      const params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        order: this.order,
        col: this.col
      }
      Object.assign(params, this.query)
      this.$http.get('/system/units', { data: params }).then(res => {
        this.tableData = res.data.data ? res.data.data : []
        this.pagination.total = res.data.total_records
      })
    },
    onNew () {
      this.$router.push('edit-unit')
    },
    onDetail (scope) {
      this.$router.push(`unit-detail?code=${scope.row.code}`)
    },
    onEdit (scope) {
      this.$router.push({
        path: 'edit-unit',
        query: {
          id: scope.row.id,
          code: scope.row.code
        }
      })
    },
    onDelete (scope) {
      this.$confirm(`此操作将删除单位${scope.row.name},是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const code = scope.row.code
          this.$http.del(`/system/unit?code=${code}`).then(res => {
            if (
              this.tableData.length === 1 &&
              this.pagination.currentPage !== 1
            ) {
              this.pagination.currentPage = this.pagination.currentPage - 1
            }
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getAllUnitData()
          })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getAllUnitData()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getAllUnitData()
    },
    sortChange (column) {
      this.col = column.prop
      column.order === 'descending' ? (this.order = 0) : (this.order = 1)
      this.getAllUnitData()
    },
    /** 搜索按钮 */
    onSearch (val) {
      this.pagination.currentPage = 1
      this.query = val
      this.getAllUnitData()
    },
    /** 重置按钮 */
    onReset (val) {
      this.pagination.currentPage = 1
      this.query = {}
      this.getAllUnitData()
    }
  }
}
</script>
<style lang="scss" scoped>
.unit-page-wraper {
  width: 100%;
  .btn {
    margin-bottom: $padding-md;
  }
}
</style>
