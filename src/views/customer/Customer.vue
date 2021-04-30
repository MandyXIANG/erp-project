<template>
  <div class="customer-container">
    <Title :title="'客户列表'" />
    <Search :params="params" @onSearch="onSeach" @onReset="onReset" />
    <el-button
      type="primary"
      v-if="$permission('customer_manage_new')"
      class="topbar-btn"
      @click="newOrEdit(-1)"
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
      >
        <template slot-scope="scope">
          <span v-if="item.prop === 'corp_state'">{{
            corpStatus[scope.row[item.prop]]
          }}</span>
          <span v-else-if="item.prop === 'class'">{{
            corpClass[scope.row[item.prop]]
          }}</span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            v-if="$permission('customer_manage_detail')"
            class="detail"
            @click="goToDetail(scope)"
            >详情</span
          >
          <el-divider
            v-if="$permission('customer_manage_detail')"
            direction="vertical"
          ></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <template v-for="item in moreMenu">
                <el-dropdown-item
                  v-if="$permission(item.permission)"
                  :key="item.label"
                  @click.native="item.command(scope)"
                >
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </Table>
  </div>
</template>

<script>
import Table from '@/components/table/Table.vue'
import Title from '@/components/title/Title.vue'
import Search from '@/components/search/Search.vue'
import { tableCols, searchParams, API_MAP, ENUM_MAP } from './config'
import { getEnumGroup } from '@/utils/common.js'
import { getEnumMap } from './utils'
export default {
  components: { Table, Title, Search },
  data () {
    return {
      tableCols: tableCols,
      tableData: [],
      params: searchParams,
      moreMenu: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      corpStatus: {},
      corpClass: {
        0: '普通客户',
        1: '一级客户',
        2: '二级客户',
        3: '三级客户',
        4: '四级客户'
      },
      query: {},
      sort: { col: 'id', order: 0 }
    }
  },
  created () {
    getEnumGroup([ENUM_MAP.corp_state]).then(data => {
      const statusArr = data.find(o => {
        return o.category === ENUM_MAP.corp_state
      }).children

      this.corpStatus = getEnumMap(statusArr, 'id', 'value')

      this.getCustomerList()
    })
  },
  mounted () {
    this.moreMenu = [
      {
        label: '编辑客户',
        icon: 'el-icon-edit',
        permission: 'customer_manage_edit',
        command: item => {
          this.newOrEdit(item.row.id)
        }
      },
      {
        label: '设置联系人',
        icon: 'iconfont iconlianxirenguanli',
        permission: 'customer_set_contact',
        command: item => {
          this.$router.push({
            path: 'cusromer-concat',
            query: { id: item.row.id, name: item.row.name }
          })
        }
      },
      {
        label: '删除客户',
        icon: 'el-icon-delete',
        permission: 'customer_manage_del',
        command: item => {
          this.deleteCustomer(item)
        }
      }
    ]
  },
  methods: {
    /**
     * 获取客户列表
     */
    getCustomerList () {
      this.tableData = []
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.sort.col,
        order: this.sort.order
      }
      params = Object.assign(params, this.query)
      this.$http.get(API_MAP.CUSTOMER_LIST, { data: params }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data || []
          this.pagination.total = res.data.total_records
        }
      })
    },
    goToDetail (item) {
      this.$router.push({
        path: 'cusromer-detail',
        query: { id: item.row.id }
      })
    },
    onSeach (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getCustomerList()
    },
    onReset (val) {
      this.query = {}
      this.pagination.currentPage = 1
      this.getCustomerList()
    },
    newOrEdit (id) {
      if (id < 0) {
        // 新建客户
        this.$router.push('edit-cusromer')
      } else {
        this.$router.push({ path: 'edit-cusromer', query: { id: id } })
      }
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getCustomerList()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getCustomerList()
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getCustomerList()
    },
    deleteCustomer (item) {
      this.$confirm(`此操作将删除客户${item.row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .del(API_MAP.DELETE_CUSTOMER + `/${item.row.id}`)
            .then(res => {
              if (res.code === 0) {
                if (
                  this.tableData.length === 1 &&
                  this.pagination.currentPage !== 1
                ) {
                  this.pagination.currentPage = this.pagination.currentPage - 1
                }
                this.$message.success('删除成功')
                this.getCustomerList()
              } else {
                this.$message.warning('删除失败')
              }
            })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-container {
  /deep/.detail {
    color: $--color-primary;
    cursor: pointer;
  }
}
</style>
