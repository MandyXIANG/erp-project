<template>
  <div>
    <PageHeader title="销售订单列表" />
    <Search :params="searchParams" @onSearch="onSeach" @onReset="onReset" />
    <el-button
      type="primary"
      class="topbar-btn"
      v-if="$permission('sale_order_new')"
      @click="addOrEdit"
      >新增</el-button
    >
    <el-button
      type="primary"
      class="topbar-btn"
      v-if="$permission('sale_order_delivery')"
      :disabled="!selectOrder.length"
      @click="delivery"
      >批量发货</el-button
    >
    <Table
      :data="tableData"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column :selectable="judgeCheck" type="selection" width="55">
      </el-table-column>
      <el-table-column
        :formatter="formatter"
        sortable="custom"
        v-for="(item, key) in tableCols"
        :key="key"
        :prop="item.prop"
        :label="item.label"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            class="table-detail"
            v-if="$permission('sale_order_detail')"
            @click="goToDetail(scope)"
            >详情</span
          >
          <el-divider
            v-if="$permission('sale_order_detail')"
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
                  :disabled="item.disabled(scope)"
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
    <el-dialog :title="title" :visible.sync="modalVisible">
      <el-form :model="form" label-width="120px">
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from '@/components/title/Title.vue'
import Search from '@/components/search/Search.vue'
import Table from '@/components/table/Table.vue'
import { searchParams, tableCols, API_MAP, stateMap } from './config'
import { transKey, formatTime } from '@/utils/trans.js'

export default {
  components: {
    PageHeader,
    Search,
    Table
  },
  data () {
    return {
      searchParams,
      tableCols,
      tableData: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      moreMenu: [],
      modalVisible: false,
      form: {},
      title: '',
      query: {},
      selectOrder: [],
      clickItem: {},
      clickState: null,
      sort: { col: 'id', order: 0 }
    }
  },
  mounted () {
    this.moreMenu = [
      {
        label: '编辑',
        icon: 'el-icon-edit',
        permission: 'sale_order_eidt',
        disabled: item => {
          if (item.row.state === 'draft' || item.row.state === 'reject') {
            return false
          } else {
            return true
          }
        },
        command: item => {
          this.$router.push({
            path: 'edit-sale-order',
            query: { id: item.row.id }
          })
        }
      },
      {
        label: '发货',
        icon: 'el-icon-shopping-cart-full',
        permission: 'sale_order_delivery',
        disabled: item => {
          if (item.row.state === 'effect' || item.row.state === 'process') {
            return false
          } else {
            return true
          }
        },
        command: item => {
          this.selectOrder = [item.row]
          this.delivery()
        }
      },
      {
        label: '中止',
        icon: 'el-icon-switch-button',
        permission: 'sale_order_stop',
        disabled: item => {
          if (item.row.state === 'process') {
            return false
          } else {
            return true
          }
        },
        command: item => {
          this.title = '中止订单： ' + item.row.id
          this.form = {}
          this.modalVisible = true
          this.clickItem = item.row
          this.clickState = stateMap.stop
        }
      },
      {
        label: '恢复',
        icon: 'el-icon-refresh-right',
        permission: 'sale_order_restore',
        disabled: item => {
          if (item.row.state === 'stop') {
            return false
          } else {
            return true
          }
        },
        command: item => {
          this.title = '恢复订单： ' + item.row.id
          this.form = {}
          this.modalVisible = true
          this.clickItem = item.row
          this.clickState = stateMap.process
        }
      },
      {
        label: '取消',
        icon: 'el-icon-delete',
        permission: 'sale_order_cancel',
        disabled: item => {
          return false
        },
        command: item => {
          this.clickItem = item.row
          this.clickState = stateMap.cancel
          this.cancelOrder()
        }
      }
    ]
  },
  created () {
    this.getOrderList()
  },
  methods: {
    /**
     * 获取订单列表
     */
    getOrderList () {
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.sort.col,
        order: this.sort.order,
        stateop: 1,
        state: 'cancel'
      }
      params = Object.assign(params, this.query)
      this.$http.get(API_MAP.SALES_MAINS, { data: params }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.pagination.total = res.data.total_records
        }
      })
    },
    onSeach (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getOrderList()
    },
    onReset (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getOrderList()
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getOrderList()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getOrderList()
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getOrderList()
    },
    handleSelectionChange (val) {
      this.selectOrder = val
    },
    /**
     * 新建或编辑订单
     */
    addOrEdit () {
      this.$router.push({ path: 'edit-sale-order' })
    },
    /**
     * 发货
     */
    delivery () {
      const ids = []
      for (const item of this.selectOrder) {
        ids.push(item.id)
      }
      this.$router.push({ path: 'delivery', query: { id: ids } })
    },
    /**
     * 详情
     */
    goToDetail (scope) {
      this.$router.push({ path: 'sale-detail', query: { id: scope.row.id } })
    },
    handleOk () {
      this.modalVisible = false
      this.changeState()
    },
    /**
     * 改变状态
     */
    changeState () {
      const parmas = {
        remark: this.form.remark,
        state: this.clickState.value
      }
      this.$http
        .put(
          API_MAP.SALES_STATE +
            `/${this.clickItem.id}?logtype=${
              this.clickState.value === 'process'
                ? 'restore'
                : this.clickState.value
            }`,
          { data: parmas }
        )
        .then(res => {
          if (res.code === 0) {
            if (
              this.clickState.value === stateMap.cancel &&
              this.tableData.length === 1 &&
              this.pagination.currentPage !== 1
            ) {
              this.pagination.currentPage = this.pagination.currentPage - 1
            }
            this.$message.success('操作成功')
            this.getOrderList()
          }
        })
    },
    cancelOrder (item) {
      this.$confirm(
        `此操作将取消销售订单${this.clickItem.id}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.changeState()
        })
        .catch(() => {})
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'state') {
        return transKey(row[column.property])
      } else if (column.property === 'create_at') {
        return formatTime(row[column.property])
      } else {
        return row[column.property]
      }
    },
    /**
     * 判断当前行能否被选中
     */
    judgeCheck (row, index) {
      if (row.state === 'effect' || row.state === 'process') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style></style>
