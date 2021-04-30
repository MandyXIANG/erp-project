<template>
  <div>
    <Title :title="'发料列表'"></Title>
    <Search
      :params="Params"
      @onSearch="onSearch"
      @onReset="onReset"
    ></Search>
    <el-button
      type="primary"
      @click="issueSelectMar"
      class="topbar-btn"
      :disabled="isDisable"
      v-if="$permission('outbound_batch_store_issue')"
    >批量发料</el-button>
    <el-table
      :data="issueTableData"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item
              v-for="(item, index) in expandColumn"
              :key="index"
              :label="item.label"
            >
              <span>{{ props.row[item.prop] }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in IssueColumn"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :sortable="item.sortable"
        :formatter="formatter"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            class="table-detail"
            @click="issueMar(scope)"
            v-if="$permission('outbound_store_issue')"
          >发料</span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      style="margin-top:8px"
      :total="total"
      :current-page="searchForm.page"
      :page-size="searchForm.count"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
      @sort-change="sortChange"
    />
    <el-dialog
      :title="title"
      :visible.sync="issueDialog"
      @close="closeIssueDialog"
    >
      <el-form
        :model="issueForm"
        ref="issueForm"
        label-width="120px"
        :rules="IssueRules"
      >
        <el-row type="flex">
          <el-col
            :xs="24"
            :sm="18"
            :md="18"
            :lg="18"
            :xl="18"
          >
            <el-form-item
              label="发料人"
              prop="user"
            >
              <el-select
                v-model="issueForm.user"
                :remote-method="getUserList"
                class="select-width"
                clearable
                filterable
                remote
                placeholder="请输入用户名或全名搜索"
                @change="changeUser"
              >
                <el-option
                  v-for="(item, index) in userList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                >
                  <span class="erp-option-left">{{item.name}}</span>
                  <span class="erp-option-right">{{item.fullname}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col
            :xs="24"
            :sm="18"
            :md="18"
            :lg="18"
            :xl="18"
          >
            <el-form-item
              label="配送方式"
              prop="distribute"
            >
              <el-select
                v-model="issueForm.distribute"
                class="select-width"
                placeholder="请选择配送方式"
              >
                <el-option
                  v-for="(item, index) in distrList"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col
            :xs="24"
            :sm="18"
            :md="18"
            :lg="18"
            :xl="18"
          >
            <el-form-item
              label="物流单号"
              prop="order"
            >
              <el-input
                v-model="issueForm.order"
                placeholder="请输入物流单号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col
            :xs="24"
            :sm="18"
            :md="18"
            :lg="18"
            :xl="18"
          >
            <el-form-item
              label="备注"
              prop="remark"
            >
              <el-input
                v-model="issueForm.remark"
                placeholder="请输入备注"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="issueDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="submit('issueForm')"
          :loading="loading"
        >确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import Vue from 'vue'
import { USER, USER_INFO } from '@/store/storageConst'
import * as moment from 'moment'
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
import Pagination from '@/components/table/Pagination'
import { Params, IssueColumn, expandColumn, distrList } from './issueConfig'
import { transKey, formatTime } from '@/utils/trans'

export default {
  name: 'Check',
  components: { Title, Search, Pagination },
  data () {
    return {
      Params,
      IssueColumn,
      expandColumn,
      distrList,
      isDisable: true,
      selectIssue: [],
      total: 0,
      query: {},
      issueDialog: false,
      formLabelWidth: '160px',
      userList: [],
      issueForm: {
        user: null,
        distribute: null,
        order: null,
        time: null
      },
      issueTableData: [],
      searchForm: {
        page: 1,
        count: 10,
        col: 'id',
        order: '0'
      },
      IssueRules: {
        user: [
          { required: true, message: '请选择发料人', trigger: 'change' }
        ],
        distribute: [
          { required: true, message: '请选择配送方式', trigger: 'change' }
        ]
      },
      transkey: transKey,
      formattime: formatTime,
      title: '发料确认',
      loading: false,
      fullname: null
    }
  },
  mounted () {
    console.log(Vue.ls.get(USER_INFO))
    this.issueForm.user = Vue.ls.get(USER)
    this.fullname = Vue.ls.get(USER_INFO)
    this.initList()
  },
  methods: {
    initList () {
      const url = '/business/delivermaterial'
      const params = {
        page: this.searchForm.page,
        count: this.searchForm.count,
        col: this.searchForm.col,
        order: this.searchForm.order,
        state: 'unsend'
      }
      Object.assign(params, this.query)
      this.$http.get(url, { data: params }).then(res => {
        this.total = res.data.totla_records
        this.issueTableData = res.data.data
      })
    },
    issueMar (scope) {
      this.issueDialog = true
      this.title = scope.row.stockout_id
      this.selectIssue.push(scope.row)
    },
    issueSelectMar () {
      const isSame = Array.from(new Set(this.selectIssue.map(item => item.receiptor_name)))
      if (isSame.length > 1) {
        this.$message.error('批量发料时需为同一[收货方]')
        return
      }
      this.title = '发料确认'
      this.issueDialog = true
    },
    // 获取的发料ID
    handleSelectionChange (val) {
      val.length > 0 ? this.isDisable = false : this.isDisable = true
      this.selectIssue = val
    },
    validIssueForm (issurForm, callback) {
      this.$refs.issueForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.saveIssueForm(callback)
        }
      })
    },
    saveIssueForm (callback) {
      this.issueForm.time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ssZ')
      const prepared = []
      const params = {
        deliverier: this.issueForm.user,
        deliverier_fullname: this.fullname,
        delivery_code: this.issueForm.order,
        delivery_method: this.issueForm.distribute,
        prepared: prepared,
        receiptor_code: this.selectIssue[0].receiptor_code,
        receiptor_name: this.selectIssue[0].receiptor_name,
        remark: this.issueForm.remark
      }
      this.selectIssue.forEach(el => {
        prepared.push(
          {
            amount: el.amount,
            material_code: el.material_code,
            material_name: el.material_name,
            order_detail_id: el.detail_id,
            prepare_id: el.id
          }
        )
      })
      this.$http.put('/business/delivermaterial?logtype=send', { data: params }).then(res => {
        this.loading = false
        const result = res
        callback(result)
      }, err => {
        console.log(err)
        this.loading = false
      })
    },
    submit (issueForm) {
      this.validIssueForm(issueForm, result => {
        if (result.code === 0) {
          this.$message.success('操作成功')
          this.issueDialog = false
          this.initList()
        }
      })
    },
    // 获取人员列表
    getUserList (val) {
      const params = {
        'q[name]': val,
        'q[fullname]': val,
        op: 1
      }
      this.$http.get('/system/user/list', { data: params }).then(res => {
        if (res.code === 0) {
          this.userList = res.data.data
          console.log(this.userList, 'userList')
        }
      })
    },
    // 关闭弹框
    closeIssueDialog () {
      this.issueDialog = false
      this.$refs.issueForm.resetFields()
    },
    onSearch (val) {
      this.searchForm.page = 1
      this.query = val
      this.initList()
    },
    onReset (val) {
      this.searchForm.page = 1
      this.query = val
      this.initList()
    },
    changePageSize (pageSize) {
      this.searchForm.count = pageSize
      this.initList()
    },
    changeCurrentPage (currentPage) {
      this.searchForm.page = currentPage
      this.initList()
    },
    sortChange (column) {
      this.searchForm.col = column.prop
      this.searchForm.order = column.order === 'ascending' ? 1 : 0
      this.initList()
    },
    // 格式化数据
    formatter (row, column) {
      if (column.property === 'state') {
        return this.transkey(row[column.property])
      } else if (column.property === 'plan_ship_time' || column.property === 'prepared_time') {
        return this.formattime(row[column.property])
      } else {
        return row[column.property]
      }
    },
    /** 选择人员事件 */
    changeUser (value) {
      const arr = this.userList.filter(item => item.name === value)
      this.fullname = arr[0].fullname
    }
  }
}
</script>
