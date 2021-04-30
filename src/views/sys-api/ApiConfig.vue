<template>
  <div class="api-config-page-wraper">
    <Title :title="'Api列表'"></Title>
    <Search
      :params="searchParams"
      @onSearch="onSearch"
      @onReset="onReset"
    />
    <el-button
      type="primary"
      class="btn"
      @click="onNew"
      v-if="$permission('new_api')"
    >新增</el-button>
    <Table
      :data="tableData"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
    >
      <el-table-column
        v-for="(item,key) in tableCols"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'action'">
            <span
              v-for="(el,index) in ActionList"
              :key="index"
            >
              <span
                v-for="(item,key) in scope.row.action"
                :key="key"
              >
                <template v-if="el.value === item">
                  {{item}}
                  <el-tag :type="el.type">{{el.title}}</el-tag>
                </template>
              </span>
            </span>
          </template>
          <template v-else>
            {{scope.row[item.prop]}}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            class="table-detail"
            @click="onDetail(scope)"
          >详情</span>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-edit"
                v-if="$permission('edit_api')"
                @click.native="onEdit(scope)"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-delete"
                @click.native="onDelete(scope)"
                v-if="$permission('delete_api')"
              >删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>
<script>
import { TableCols, ActionList, SearchParams } from './api.config'
import Table from '@/components/table/Table'
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
export default {
  name: 'ApiConfig',
  components: {
    Table,
    Title,
    Search
  },
  data () {
    return {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableCols: TableCols,
      tableData: [],
      ActionList: ActionList,
      searchParams: SearchParams
    }
  },
  mounted () {
    // 获取全部数据
    this.getAllApiData()
  },
  methods: {
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getAllApiData()
    },
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getAllApiData()
    },
    onNew () {
      this.$router.push('edit-api?id=0')
    },
    onEdit (scope) {
      this.$router.push(`edit-api?id=${scope.row.id}`)
    },
    // 删除按钮
    onDelete (scope) {
      this.$confirm(`确定要删除 ${scope.row.name} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = Number(scope.row.id)
        const params = {
          id: id
        }
        this.$http.del(`/role/${id}`, { data: params }).then((res) => {
          if (this.tableData.length === 1 && this.pagination.currentPage !== 1) {
            this.pagination.currentPage = this.pagination.currentPage - 1
          }
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getAllApiData()
        })
      }).catch(() => { })
    },
    getAllApiData () {
      const params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        type: 'api_perm'
      }
      this.$http.get('/perm', { data: params }).then((res) => {
        this.tableData = res.data.role_perms ? res.data.role_perms : []
        this.pagination.total = res.data.total_records
      })
    },
    onDetail (scope) {
      this.$router.push(`api-detail?id=${scope.row.id}`)
    },
    onReset (val) {
      this.pagination.currentPage = 1
    },
    onSearch (val) {
      this.pagination.currentPage = 1
    }
  }
}
</script>
<style lang="scss" scoped>
.api-config-page-wraper {
  width: 100%;
  .btn {
    margin-bottom: $padding-md;
  }
}
</style>
