<template>
  <div class="request-list-container">
    <PageHeader title="请购单列表" />
    <Search :params="searchParams" @onSearch="onSeach" @onReset="onReset" />
    <el-button
      v-if="$permission('request_list_new')"
      type="primary"
      class="topbar-btn"
      @click="newOrEditRequest"
      >新增</el-button
    >
    <el-button disabled type="primary" class="topbar-btn"
      >更新请购列表</el-button
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
        :formatter="formatter"
        sortable="custom"
        v-for="(item, index) in tableCols"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            class="opreator"
            @click="goToDetail(scope)"
            v-if="$permission('request_list_detail')"
            >详情</span
          >
          <el-divider
            v-if="$permission('request_list_detail')"
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
                  :key="item.label"
                  v-if="$permission(item.permission)"
                  :disabled="item.disabled(scope)"
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
import PageHeader from '@/components/title/Title.vue'
import Table from '@/components/table/Table.vue'
import Search from '@/components/search/Search.vue'
import { tableCols, searchParams, API_MAP, stateMap } from './config'
import { transKey, formatTime } from '@/utils/trans.js'

export default {
  components: { PageHeader, Table, Search },
  data () {
    return {
      tableCols,
      tableData: [],
      searchParams,
      moreMenu: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      query: {},
      form: {},
      sort: { col: 'id', order: 0 }
    }
  },
  created () {
    this.getRequestList()
  },
  mounted () {
    this.moreMenu = [
      {
        label: '编辑',
        icon: 'el-icon-edit',
        permission: 'request_list_edit',
        disabled: item => {
          if (item.row.state === stateMap.draft.value) {
            return false
          } else {
            return true
          }
        },
        command: item => {
          this.$router.push({
            path: 'edit-request-list',
            query: { id: item.row.id }
          })
        }
      },
      {
        label: '取消',
        icon: 'el-icon-close',
        permission: 'request_list_cancel',
        disabled: item => {
          return false
        },
        command: item => {
          this.cancelRequest(item)
        }
      }
    ]
  },
  methods: {
    getRequestList () {
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.sort.col,
        order: this.sort.order,
        stateop: 1,
        state: 'cancel'
      }
      params = Object.assign(params, this.query)
      this.$http.get(API_MAP.PURCHASE_REQ, { data: params }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.pagination.total = res.data.total_records
        }
      })
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getRequestList()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getRequestList()
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getRequestList()
    },
    newOrEditRequest () {
      this.$router.push('edit-request-list')
    },
    goToDetail (scope) {
      this.$router.push({
        path: 'request-detail',
        query: { id: scope.row.id }
      })
    },
    onSeach (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getRequestList()
    },
    onReset (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getRequestList()
    },

    // 取消请购单
    cancelRequest (item) {
      this.$http.get(API_MAP.CHECK_REQ + `/${item.row.id}`).then(res => {
        if (res.code === 0) {
          if (res.data.length) {
            this.$confirm(
              `请购单${item.row.id}已被采购单${res.data.join(
                ','
              )}处理，不能取消`,
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
          } else {
            this.$confirm(
              `此操作将取消请购单${item.row.id}, 是否继续?`,
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(() => {
              this.$http
                .put(
                  API_MAP.PURCHASE_REQST +
                    `/${item.row.id}/${stateMap.cancel.value}`
                )
                .then(res => {
                  if (res.code === 0) {
                    if (
                      this.tableData.length === 1 &&
                      this.pagination.currentPage !== 1
                    ) {
                      this.pagination.currentPage =
                        this.pagination.currentPage - 1
                    }
                    this.$message.success('操作成功')
                    this.getRequestList()
                  }
                })
            })
          }
        }
      })
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'state' || column.property === 'class') {
        return transKey(row[column.property])
      } else if (column.property === 'create_at') {
        return formatTime(row[column.property])
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.request-list-container {
  .opreator {
    color: $--color-primary;
    cursor: pointer;
  }
}
.el-message-box {
  min-width: 420px;
}
</style>
