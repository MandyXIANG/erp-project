<template>
  <div class="enum-page-wraper">
    <Title :title="'枚举列表'"></Title>
    <Search
      :params="searchParams"
      @onSearch="onSearch"
      @onReset="onReset"
    />
    <el-button
      type="primary"
      @click="addEnum"
      class="btn"
      v-if="$permission('new_enum')"
    >新增</el-button>
    <Table
      :data="AfterChangeData"
      :total="totalNum"
      :page-size="pageSize"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @sort-change="sortChange"
    >
      <el-table-column
        label="枚举名称"
        width="180"
        prop="category"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        label="内容"
        prop="value"
        :sortable="true"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="250"
      >
        <template slot-scope="scope">
          <span
            class="table-detail"
            @click="onDetail(scope.row)"
            v-if="$permission('enum_detail')"
          >详情</span>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-edit"
                @click.native="edit(scope.row)"
                v-if="$permission('edit_enum')"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-delete"
                @click.native="del(scope.row)"
                v-if="$permission('delete_enum')"
              >删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>
<script>
import Title from '@/components/title/Title'
import Table from '@/components/table/Table'
import Search from '@/components/search/Search'
import { SearchParams } from './enum.config'
export default {
  name: 'Enum',
  components: { Title, Table, Search },
  data () {
    return {
      enumTreeData: [],
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      searchParams: SearchParams,
      query: {},
      order: 0,
      col: 'id'
    }
  },
  computed: {
    AfterChangeData () {
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      return this.enumTreeData.slice(start, end)
    }
  },
  mounted () {
    this.initEnumTreeList()
  },
  methods: {
    // 初始化列表
    initEnumTreeList () {
      const params = {
        order: this.order,
        col: this.col
      }
      Object.assign(params, this.query)
      this.$http.get('/system/enums', { data: params }).then(res => {
        const result = res.data.data
        if (!result) {
          this.enumTreeData = []
          return
        }
        this.enumTreeData = result
        this.totalNum = result.length
      })
    },
    // 新增
    addEnum (row) {
      this.$router.push('edit-enum/add')
    },
    // 编辑节点
    edit (row) {
      console.log(row)
      this.$router.push(`edit-enum/edit?category=${row.category}`)
    },
    // 删除
    del (row) {
      this.$confirm(`此操作将删除枚举${row.value}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteEnum(row.id)
      }).catch((err) => {
        console.log(err)
      })
    },
    deleteEnum (rowId) {
      this.$http.del(`/system/enums/${rowId}`).then(res => {
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        const totalPage = Math.ceil((this.totalNum - 1) / this.pageSize)
        const currentPage = this.currentPage > totalPage ? totalPage : this.currentPage
        this.currentPage = this.currentPage < 1 ? 1 : currentPage
        this.initEnumTreeList()
      })
    },
    handleSizeChange (size) {
      this.pageSize = size
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    sortChange (column) {
      this.col = column.prop
      column.order === 'descending' ? this.order = 0 : this.order = 1
      this.initEnumTreeList()
    },
    /** 搜索按钮 */
    onSearch (val) {
      this.pagination.currentPage = 1
      this.query = val
      this.initEnumTreeList()
    },
    /** 重置按钮 */
    onReset (val) {
      this.pagination.currentPage = 1
      this.query = {}
      this.initEnumTreeList()
    },
    onDetail (row) {
      console.log(row, 'row')
      this.$router.push(`enum-detail?category=${row.category}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.enum-page-wraper {
  width: 100%;
  .btn {
    margin-bottom: $padding-md;
  }
}
</style>
