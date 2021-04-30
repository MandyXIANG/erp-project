<template>
  <div class="permission-page-wraper">
    <Title :title="'权限列表'"></Title>
    <Search
      :params="searchParams"
      @onSearch="onSearch"
      @onReset="onReset"
    />
    <el-button
      type="primary"
      @click="onNew"
      class="btn"
      v-if="$permission('new_permission')"
    >新增</el-button>
    <Table
      :data="tableData"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page="pagination.currentPage"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
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
            @click="onDetail(scope)"
            v-if="$permission('permission_detail')"
          >详情</span>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-edit"
                v-if="$permission('edit_permission')"
                @click.native="onEdit(scope)"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-delete"
                @click.native="onDelete(scope)"
                v-if="$permission('delete_permission')"
              >删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>
<script>
import { TableCols, SearchParams, StatusList } from './permission.config'
import Table from '@/components/table/Table'
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
export default {
  name: 'Permission',
  components: {
    Table,
    Title,
    Search
  },
  data () {
    return {
      tableData: [],
      tableCols: TableCols,
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      searchParams: SearchParams,
      query: {},
      order: 0,
      col: 'id',
      statusList: StatusList
    }
  },
  mounted () {
    // 获取全部的权限数据
    this.getAllPerData()
  },
  methods: {
    onNew () {
      this.$router.push('edit-permission')
    },
    onEdit (scope) {
      this.$router.push(`edit-permission?id=${scope.row.id}`)
    },
    // 删除按钮
    onDelete (scope) {
      this.$confirm(`此操作将删除权限${scope.row.name},是否继续`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = Number(scope.row.id)
        this.$http.del(`/system/roleperm/del/${id}`).then((res) => {
          if (this.tableData.length === 1 && this.pagination.currentPage !== 1) {
            this.pagination.currentPage = this.pagination.currentPage - 1
          }
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getAllPerData()
        })
      }).catch(() => { })
    },
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getAllPerData()
    },
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getAllPerData()
    },
    sortChange (column) {
      this.col = column.prop
      column.order === 'descending' ? this.order = 0 : this.order = 1
      this.getAllPerData()
    },
    getAllPerData () {
      const params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        type: 'perm',
        order: this.order,
        col: this.col,
        state: 'active,disable'
      }
      Object.assign(params, this.query)
      this.$http.get('/system/roleperm/list', { data: params }).then((res) => {
        this.tableData = res.data.data
        this.pagination.total = res.data.total_records
      })
    },
    onDetail (scope) {
      console.log(scope, 'scope')
      this.$router.push(`permission-detail?id=${scope.row.id}`)
    },
    /** 搜索按钮 */
    onSearch (val) {
      this.pagination.currentPage = 1
      this.query = val
      this.getAllPerData()
    },
    /** 重置按钮 */
    onReset (val) {
      this.pagination.currentPage = 1
      this.query = {}
      this.getAllPerData()
    },
    formatter (row, column, cellValue, index) {
      if (column.property === 'state') {
        for (let i = 0; i < this.statusList.length; i++) {
          const item = this.statusList[i]
          if (item.value === cellValue) {
            return item.label
          }
        }
      }
      return row[column.property]
    }
  }
}
</script>
<style lang="scss" scoped>
.permission-page-wraper {
  width: 100%;
  .btn {
    margin-bottom: $padding-md;
  }
}
</style>
