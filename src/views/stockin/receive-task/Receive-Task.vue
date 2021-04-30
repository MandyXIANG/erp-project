<template>
  <div class="receive-task-page">
    <Title :title="'收料单列表'"></Title>
    <Search
      :params="searchParams"
      @onSearch="onSearch"
      @onReset="onReset"
    ></Search>
    <el-button
      type="primary"
      class="btn"
      @click="onNew"
      v-if="$permission('stockin_new_receipt_task')"
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
        :sortable="item.sortable"
        :formatter="formatter"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            class="table-detail"
            @click="onDetail(scope.row)"
            v-if="$permission('stockin_receipt_task_detail')"
          >详情</span>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-edit"
                @click.native="onEdit(scope.row)"
                :disabled="scope.row.state!='draft' && scope.row.state != 'reject'"
                v-if="$permission('stockin_edit_receipt_task')"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-close"
                @click.native="closeTask(scope.row)"
                v-if="$permission('stockin_close_task')"
                :disabled="scope.row.state==='finish'"
              >关闭任务</el-dropdown-item>
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
import { TableReceiveCols, SearchParams } from './config/receive-task.config'
import { transKey, formatTime } from '@/utils/trans'
export default {
  components: {
    Table,
    Title,
    Search
  },
  data () {
    return {
      tableCols: TableReceiveCols,
      searchParams: SearchParams,
      tableData: [],
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      transkey: transKey,
      formattime: formatTime,
      order: 0, // 默认降序
      col: 'id', // 默认排序的字段
      query: {
        state: 'closed',
        stateop: 1
      }
    }
  },
  mounted () {
    this.getReceiptData()
  },
  methods: {
    getReceiptData () {
      const data = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.col,
        order: this.order
      }
      Object.assign(data, this.query)
      this.$http.get('/business/stockin/receipts', { data: data }).then(res => {
        this.tableData = res.data.data
        this.pagination.total = res.data.total_records
      })
    },
    onSearch (val) {
      console.log(val, 'valval')
      this.pagination.currentPage = 1
      if (val.state) {
        this.query = val
      } else {
        this.query = { state: 'stop', stateop: 1 }
        Object.assign(this.query, val)
      }
      this.getReceiptData()
    },
    onReset (val) {
      this.pagination.currentPage = 1
      this.query = {
        state: 'stop',
        stateop: 1
      }
      this.getReceiptData()
    },
    onDetail (row) {
      this.$router.push(`stockin-receive-task-detail?id=${row.id}`)
    },
    onSizeChange (page) {
      this.pagination.pageSize = page
      this.getReceiptData()
    },
    onCurrentChange (page) {
      this.pagination.currentPage = page
      this.getReceiptData()
    },
    sortChange (column) {
      this.col = column.prop
      column.order === 'descending' ? this.order = 0 : this.order = 1
      this.getReceiptData()
    },
    onNew (row) {
      this.$router.push('stockin-edit-receive-task')
    },
    // 编辑按钮
    onEdit (row) {
      this.$router.push(`stockin-edit-receive-task?id=${row.id}`)
    },
    // 关闭任务
    closeTask (row) {
      this.$confirm(`此操作将关闭收料单号${row.id},是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          remark: '',
          state: 'closed'
        }
        this.$http.put(`/business/stockin/receiptst/${row.id}?logtype=${'closed'}`, { data: data }).then(res => {
          if (this.tableData.length === 1 && this.pagination.currentPage !== 1) {
            this.pagination.currentPage = this.pagination.currentPage - 1
          }
          this.$message.success('操作成功')
          this.getReceiptData()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    formatter (row, column) {
      if (column.property === 'state' || column.property === 'class') {
        return this.transkey(row[column.property])
      } else if (column.property === 'create_at') {
        return this.formattime(row[column.property])
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.receive-task-page {
  .btn {
    margin-bottom: $padding-md;
  }
}
</style>
