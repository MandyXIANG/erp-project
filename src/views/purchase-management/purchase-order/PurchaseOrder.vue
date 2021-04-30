<template>
  <div class="purchase-order">
    <PageHeader title="采购订单列表" />
    <Search :params="searchParams" @onSearch="onSeach" @onReset="onReset" />
    <el-button
      type="primary"
      v-if="$permission('purchase_order_new')"
      class="topbar-btn"
      @click="newPurchaseOrder"
      >新增</el-button
    >
    <div>
      <el-table
        stripe
        :border="true"
        size="small"
        ref="table"
        :data="tableData"
        @sort-change="sortChange"
      >
        <el-table-column width="80">
          <template slot-scope="scope">
            <i
              title="收货提醒"
              :style="{
                marginRight: '8px',
                fontSize: '20px',
                color:
                  scope.row.notify && scope.row.state !== 'reject'
                    ? '#13C2C2'
                    : '#ddd'
              }"
              class="iconfont iconshouhuo"
            ></i>
            <i
              :style="{
                fontSize: '20px',
                color:
                  scope.row.pay_notify && scope.row.state !== 'reject'
                    ? '#FF8F18'
                    : '#ddd'
              }"
              title="付款提醒"
              style="font-size:20px"
              class="iconfont iconfukuantongzhi"
            ></i>
          </template>
        </el-table-column>
        <el-table-column
          sortable="custom"
          :formatter="formatter"
          v-for="(item, key) in tableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
        >
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <span
              class="table-detail"
              v-if="$permission('purchase_order_detail')"
              @click="goToDetail(scope)"
              >详情</span
            >
            <el-divider
              direction="vertical"
              v-if="$permission('purchase_order_detail')"
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
                    :disabled="item.disabled(scope)"
                    @click.native="item.command(scope)"
                    v-if="$permission(item.permission)"
                  >
                    <i :class="item.icon"></i>
                    <span>{{ item.label }}</span>
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        style="margin-top:8px"
        :total="pagination.total"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      />
    </div>
    <el-dialog
      :title="uploadTitle"
      :close-on-click-modal="false"
      :visible.sync="uploadModal"
    >
      <div class="chose-file-box">
        <div class="file-input">
          {{ fileName }}
        </div>
        <div class="file-btn">
          选择文件
          <input
            class="file-real-btn"
            type="file"
            @change="addFile"
            ref="inputer"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadModal = false">取消</el-button>
        <el-button type="primary" @click="handleUpload">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as moment from 'moment'
import * as _ from 'lodash'

import { USER_INFO } from '@/store/storageConst'
import PageHeader from '@/components/title/Title.vue'
import Pagination from '@/components/table/Pagination.vue'
import Search from '@/components/search/Search.vue'
import { searchParams, tableCols, API_MAP, stateMap } from './config'
import { transKey, formatTime } from '@/utils/trans.js'

export default {
  components: { PageHeader, Pagination, Search },
  data () {
    return {
      searchParams,
      tableCols,
      moreMenu: [],
      tableData: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      query: {},
      sort: { col: 'id', order: 0 },
      uploadModal: false,
      fileName: '',
      file: null,
      uploadTitle: '',
      selectPO: null
    }
  },
  mounted () {
    this.moreMenu = [
      {
        label: '编辑',
        icon: 'el-icon-edit',
        permission: 'purchase_order_edit',
        disabled: item => {
          if (
            item.row.state === stateMap.draft.value ||
            item.row.state === stateMap.reject.value
          ) {
            return false
          } else {
            return true
          }
        },
        command: item => {
          this.$router.push({
            path: 'new-purchase',
            query: { id: item.row.id }
          })
        }
      },
      {
        label: '订单跟踪',
        icon: 'el-icon-position',
        permission: 'purchase_order_track',
        disabled: item => {
          if (item.row.state === stateMap.process.value) {
            return false
          } else {
            return true
          }
        },
        command: item => {
          this.$router.push({
            path: 'purchase-track',
            query: { id: item.row.id }
          })
        }
      },
      {
        label: '上传文件',
        icon: 'iconfont iconshangchuan1',
        permission: 'purchase_order_cancel',
        disabled: item => {},
        command: item => {
          this.uploadModal = true
          this.file = null
          this.fileName = '请选择需要上传的文件'
          this.uploadTitle = '上传文件：' + item.row.id
          this.selectPO = item.row.id
          console.log('上传文件', item)
        }
      },
      {
        label: '取消',
        icon: 'el-icon-close',
        permission: 'purchase_order_cancel',
        disabled: item => {
          if (item.row.state === stateMap.finish.value) {
            return true
          } else {
            return false
          }
        },
        command: item => {
          this.cancelOrder(item)
        }
      }
    ]
  },
  created () {
    this.getPurchaseOrderList()
  },
  methods: {
    newPurchaseOrder () {
      this.$router.push('new-purchase')
    },
    goToDetail (scope) {
      this.$router.push({
        path: 'purchase-detail',
        query: { id: scope.row.id }
      })
    },
    /**
     * 获取采购订单列表
     */
    getPurchaseOrderList () {
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.sort.col,
        order: this.sort.order,
        stateop: 1,
        state: 'cancel'
      }
      params = Object.assign(params, this.query)
      this.$http.get(API_MAP.PURCHASE_MAIN, { data: params }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data || []
          this.pagination.total = res.data.total_record
          this.notify(this.tableData)
          this.getUnpaid()
        }
      })
    },
    /**
     * 获取该付款提醒的数据
     */
    getUnpaid () {
      this.$http.get(API_MAP.UNPAID).then(res => {
        const unpaid = res.data
        this.tableData.map((item, i) => {
          item.pay_notify = false
          const arr = _.find(unpaid, o => {
            return o.id === item.id
          })

          if (arr) {
            item.pay_notify = true
          } else {
            item.pay_notify = false
          }
        })
        this.tableData = _.cloneDeep(this.tableData)
      })
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getPurchaseOrderList()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getPurchaseOrderList()
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getPurchaseOrderList()
    },
    onSeach (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getPurchaseOrderList()
    },
    onReset (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getPurchaseOrderList()
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'state' || column.property === 'class') {
        return transKey(row[column.property])
      } else if (column.property === 'plan_date') {
        return formatTime(row[column.property])
      } else {
        return row[column.property]
      }
    },

    /**
     * 收货提醒
     */

    notify (arr) {
      for (const item of arr) {
        item.notify = false
        const details = item.details || []
        for (const ele of details) {
          const purchaseInfo = ele.purchase_info || {}
          if (purchaseInfo.notify && purchaseInfo.ahead && item.plan_date) {
            const ahead = purchaseInfo.ahead
            const planDate = formatTime(item.plan_date)
            const notifyDate = moment(planDate)
              .subtract(ahead, 'days')
              .format('YYYY-MM-DD HH:mm:ss')
            const nowDate = moment().format('YYYY-MM-DD HH:mm:ss')
            if (
              moment(notifyDate).isSameOrBefore(nowDate) &&
              ele.purchased_amount < ele.purchase_amount
            ) {
              item.notify = true
            }
          }
        }
      }
    },

    cancelOrder (item) {
      this.$confirm(`此操作将取消采购订单${item.row.id}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          operation_time: moment().format('YYYY-MM-DD HH:mm:ss'),
          state: stateMap.cancel.value,
          operator: this.$ls.get(USER_INFO).username,
          operator_fullname: this.$ls.get(USER_INFO).fullname
        }
        this.$http
          .put(
            API_MAP.PURCHASE_MAINST +
              `/${item.row.id}?logtype=${stateMap.cancel.value}`,
            { data: params }
          )
          .then(res => {
            if (res.code === 0) {
              if (
                this.tableData.length === 1 &&
                this.pagination.currentPage !== 1
              ) {
                this.pagination.currentPage = this.pagination.currentPage - 1
              }
              this.$message.success('操作成功')
              this.getPurchaseOrderList()
            }
          })
      })
    },
    /**
     * 选择文件
     */
    addFile () {
      const inputDOM = this.$refs.inputer
      this.file = inputDOM.files[0]
      this.fileName = this.file.name
    },
    /**
     * 上传文件
     */
    handleUpload () {
      if (!this.file) {
        this.$message.warning('请选择需要上传的文件')
        return
      }
      const options = new FormData()
      options.append('upload', this.file)
      this.$http
        .post(API_MAP.SYSTEM_FT, { data: options, error_return: true })
        .then(res => {
          if (res.code === 0) {
            const str = res.data || ''
            this.attachFileToPo(str.substring(str.indexOf('=') + 1))
          }
        })
        .catch(err => {
          if (err.code === 15) {
            this.$message.error('文件名重复')
          } else {
            this.$message.error(err.msg)
          }
        })
    },
    /**
     * 关联上传的文件名到对应的订单
     */
    attachFileToPo (file) {
      this.$http
        .put(API_MAP.PURCHASE_F + `/${this.selectPO}?f=${file}`)
        .then(res => {
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.uploadModal = false
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.purchase-order {
  /deep/ .warning-row {
    color: $warnning-color;
    .delay-icon {
      font-size: 20px;
      margin-left: $padding-xs;
    }
  }
}
/deep/ .el-dialog__body {
  // height: 400px;
}
.chose-file-box {
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  .file-input {
    width: 80%;
    height: 40px;
    line-height: 40px;
    border: 1px solid #dcdfe6;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right: 0;
    padding-left: $padding-xs;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
    color: #dcdfe6;
  }
  .file-btn {
    background: $--color-primary;
    flex: 1;
    height: 40px;
    line-height: 40px;
    position: relative;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    color: #fff;
    font-size: 18px;
    text-align: center;
    .file-real-btn {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      filter: alpha(opacity=0);
      height: 40px;
      line-height: 40px;
      width: 100%;
    }
  }
}
</style>
