<template>
  <div class="supplier-container">
    <Title :title="'供应商列表'" />
    <Search :params="params" @onSearch="onSeach" @onReset="onReset" />
    <el-button
      v-if="$permission('supplier_manage_new')"
      type="primary"
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
            class="detail"
            @click="goToDetail(scope)"
            v-if="$permission('supplier_manage_detail')"
            >详情</span
          >
          <el-divider
            v-if="$permission('supplier_manage_detail')"
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
import { getEnumMap } from '../customer/utils'

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
      corpClass: {},
      sort: { col: 'id', order: 0 },
      query: {}
    }
  },
  created () {
    getEnumGroup([ENUM_MAP.supplier_class, ENUM_MAP.supplier_states]).then(
      data => {
        const statusArr = data.find(o => {
          return o.category === ENUM_MAP.supplier_states
        }).children

        this.corpStatus = getEnumMap(statusArr, 'id', 'value')
        const classArr = data.find(o => {
          return o.category === ENUM_MAP.supplier_class
        }).children

        this.corpClass = getEnumMap(classArr, 'id', 'value')
        this.getSupplierList()
      }
    )
  },
  mounted () {
    this.moreMenu = [
      {
        label: '编辑供应商',
        icon: 'el-icon-edit',
        permission: 'supplier_manage_edit',
        command: item => {
          this.newOrEdit(item.row.id)
        }
      },
      {
        label: '设置联系人',
        icon: 'iconfont iconlianxirenguanli',
        permission: 'supplier_set_contact',
        command: item => {
          this.$router.push({
            path: 'supplier-concat',
            query: { id: item.row.id, name: item.row.name }
          })
        }
      },
      {
        label: '删除供应商',
        icon: 'el-icon-delete',
        permission: 'supplier_manage_del',
        command: item => {
          this.deleteSupplier(item)
        }
      }
    ]
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
    goToDetail (item) {
      this.$router.push({
        path: 'supplier-detail',
        query: { id: item.row.id }
      })
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
    newOrEdit (id) {
      if (id < 0) {
        // 新建客户
        this.$router.push('edit-supplier')
      } else {
        this.$router.push({ path: 'edit-supplier', query: { id: id } })
      }
    },
    // 删除供应商
    deleteSupplier (item) {
      this.$confirm(
        `此操作将删除供应商${item.row.name}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http
            .del(API_MAP.BASE_SUPPLIER + `/${item.row.id}`)
            .then(res => {
              if (res.code === 0) {
                if (
                  this.tableData.length === 1 &&
                  this.pagination.currentPage !== 1
                ) {
                  this.pagination.currentPage = this.pagination.currentPage - 1
                }
                this.$message.success('删除成功')
                this.getSupplierList()
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
.supplier-container {
  /deep/.detail {
    color: $--color-primary;
    cursor: pointer;
  }
}
</style>
