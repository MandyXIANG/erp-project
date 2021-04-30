<template>
  <div class="user-page-wraper">
    <Title :title="'用户列表'"></Title>
    <Search
      :params="searchParams"
      @onSearch="onSearch"
      @onReset="onReset"
    />
    <el-button
      class="btn"
      type="primary"
      @click="onNew"
      v-if="$permission('new_user')"
    >新增</el-button>
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
        :formatter="formatter"
        :sortable="item.sortable"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="350"
      >
        <template slot-scope="scope">
          <span
            class="table-detail"
            @click="onDetail(scope)"
            v-if="$permission('user_detail')"
          >详情</span>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-edit"
                v-if="$permission('edit_user')"
                @click.native="onEdit(scope)"
                :disabled="scope.row.name === 'admin'"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-user"
                v-if="$permission('set_role')"
                @click.native="onEditRole(scope)"
                :disabled="scope.row.state==='disable'"
              >设置角色</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-refresh-left"
                v-if="$permission('reset_password')"
                @click.native="onResetPwd(scope)"
                :disabled="scope.row.state==='disable'"
              >重置密码</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-delete"
                @click.native="onDelete(scope)"
                v-if="$permission('delete_user')"
                :disabled="scope.row.name === 'admin'"
              >删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>
<script>
import { StatusList, GenderList, TableCols, SearchParams } from './user.config'
import Table from '@/components/table/Table'
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
export default {
  name: 'Users',
  components: {
    Table,
    Title,
    Search
  },
  data () {
    return {
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      statusList: StatusList,
      genderList: GenderList,
      tableCols: TableCols,
      tableData: [],
      searchParams: SearchParams,
      order: 0, // 默认降序
      col: 'id', // 默认排序的字段
      query: {}
    }
  },
  mounted () {
    // 获取用户数据
    this.getAllUserData()
  },
  methods: {
    onEdit (scope) {
      this.$router.push(`edit-user?id=${scope.row.id}`)
    },
    onNew () {
      this.$router.push('edit-user')
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'state') {
        for (let i = 0; i < this.statusList.length; i++) {
          const item = this.statusList[i]
          if (item.value === cellValue) {
            return item.label
          }
        }
      }
      if (column.property === 'gender') {
        for (let i = 0; i < this.genderList.length; i++) {
          const item = this.genderList[i]
          if (item.value === cellValue) {
            return item.label
          }
        }
      }
      return row[column.property]
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getAllUserData()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getAllUserData()
    },
    sortChange (column) {
      this.col = column.prop
      column.order === 'descending' ? this.order = 0 : this.order = 1
      this.getAllUserData()
    },
    // 设置角色按钮
    onEditRole (scope) {
      this.$router.push({
        path: 'set-role',
        query: {
          id: scope.row.id,
          name: scope.row.name
        }
      })
    },
    // 获取用户数据
    getAllUserData () {
      const params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.col,
        order: this.order,
        state: 'active,disable'
      }
      Object.assign(params, this.query)
      this.$http.get('/system/user/list', { data: params }).then((res) => {
        this.tableData = res.data.data ? res.data.data : []
        this.pagination.total = res.data.total_records
      })
    },
    // 删除按钮
    onDelete (scope) {
      this.$confirm(`此操作将删除用户${scope.row.name},是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = Number(scope.row.id)
        this.$http.del(`/system/user/del/${id}`).then((res) => {
          if (this.tableData.length === 1 && this.pagination.currentPage !== 1) {
            this.pagination.currentPage = this.pagination.currentPage - 1
          }
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getAllUserData()
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    // 重置密码
    onResetPwd (scope) {
      this.$confirm(`此操作将重置用户${scope.row.name}密码,是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put(`/system/user/reset/${scope.row.id}`).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getAllUserData()
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    onDetail (scope) {
      this.$router.push(`user-detail?id=${scope.row.id}`)
    },
    /** 搜索按钮 */
    onSearch (val) {
      this.pagination.currentPage = 1
      this.query = val
      this.getAllUserData()
    },
    /** 重置按钮 */
    onReset (val) {
      this.pagination.currentPage = 1
      this.query = {}
      this.getAllUserData()
    }
  }
}
</script>
<style lang="scss" scoped>
.user-page-wraper {
  width: 100%;
  .btn {
    margin-bottom: $padding-md;
  }
}
</style>
