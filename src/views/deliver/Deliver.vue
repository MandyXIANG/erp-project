<template>
    <div>
      <Title :title="'发货管理'"></Title>
      <Search :params="Params" @onSearch="onSearch" @onReset="onReset"></Search>
      <Table :data="deliverData" :total="total"
             :current-page="searchForm.page" :page-size="searchForm.count"
             @size-change="changePageSize" @current-change="changeCurrentPage" @sort-change="sortChange">
             <el-table-column v-for="(item, index) in Columns" :key="index"
                              :label="item.label" :prop="item.prop"
                              :sortable="item.sortable" :formatter="formatter">
             </el-table-column>
             <el-table-column label="操作">
                <template slot-scope="scope">
                  <span @click="detail(scope)" class="detail" v-if="$permission('deliver_manager_info')">详情</span>
                  <el-divider direction="vertical"></el-divider>
                  <el-dropdown>
                      <span class="el-dropdown-link">更多<i class="el-icon-arrow-down el-icon--right"></i></span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-s-promotion"
                                          v-if="$permission('deliver_arrived')"
                                          :disabled="scope.row.state !== 'out'"
                                          @click.native="addInfo(scope, 'arrive')">已送达
                        </el-dropdown-item>
                        <el-dropdown-item icon="el-icon-goods"
                                          :disabled="scope.row.state !== 'arrived'"
                                          v-if="$permission('deliver_receipt')"
                                          @click.native="addInfo(scope, 'receipt')">确认收货
                        </el-dropdown-item>
                      </el-dropdown-menu>
                  </el-dropdown>
                </template>
             </el-table-column>
      </Table>
      <el-dialog :title="dialogTitle" :visible.sync="deliverDialog"
                  @close="closeDeliverDialog" :close-on-click-modal="false">
        <el-form :model="deliverForm" ref="deliverForm" label-width="120px" :rules="deliverRules">
            <el-row type="flex">
                <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
                  <el-form-item :label="labelUser" prop="name">
                      <el-select v-model="deliverForm.name" :remote-method="getUserList"
                                  class="select-width" clearable filterable
                                  remote placeholder="请输入用户名或全名搜索" @change="changeUser">
                        <el-option v-for="(item, index) in userList" :key="index"
                                    :label="item.name" :value="item.name">
                             <span style="float: left">
                                {{ item.name }}
                            </span>
                            <span style="float: right; color: #8492a6; font-size: 13px">
                              {{item.fullname}}
                            </span>
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
                  <el-form-item :label="labelDate">
                    <el-date-picker v-model="deliverForm.time" type="datetime"
                                    class="select-width" placeholder="请选择签收日期"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
            </el-row>
             <el-row type="flex">
                <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
                  <el-form-item label="备注">
                    <el-input v-model="deliverForm.remark" placeholder="请输入备注" clearable></el-input>
                  </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDeliverDialog">取 消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="submit('deliverForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { USER_INFO } from '@/store/storageConst'
import { transKey, formatTime } from '@/utils/trans'
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
import Table from '@/components/table/Table'
import { Params, Columns } from './deliverConfig'
import userList from '@/utils/data/user'

export default {
  name: 'Deliver',
  components: { Title, Search, Table },
  mixins: [userList()],
  data () {
    return {
      Params,
      Columns,
      labelUser: '',
      labelDate: '',
      dialogTitle: '',
      submitLoading: false,
      deliverData: [],
      total: 0,
      query: {},
      transkey: transKey,
      formattime: formatTime,
      deliverDialog: false,
      type: '',
      deliverForm: {
        delivery_id: '',
        name: this.$ls.get(USER_INFO).username,
        full_name: this.$ls.get(USER_INFO).fullname,
        time: null,
        remark: null
      },
      searchForm: {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      },
      deliverRules: {
        name: [
          { required: true, message: '请选择人员', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getDeliverList()
  },
  methods: {
    getDeliverList () {
      const params = Object.assign({}, this.searchForm, this.query)
      this.$http.get('/business/delivery', { data: params }).then(res => {
        const result = res.data
        this.deliverData = result.data
        this.total = result.total_records
      })
    },
    addInfo (scope, value) {
      this.deliverDialog = true
      this.deliverForm = {
        delivery_id: '',
        name: this.$ls.get(USER_INFO).username,
        fullname: this.$ls.get(USER_INFO).fullname,
        time: null,
        remark: null
      }
      this.deliverForm.delivery_id = scope.row.id
      if (value === 'receipt') {
        this.labelUser = '收货人'
        this.labelDate = '确认日期'
        this.dialogTitle = `确认收货 ${scope.row.id}`
        this.type = 'receipt'
      } else {
        this.labelUser = '签收人'
        this.labelDate = '签收日期'
        this.dialogTitle = `已送达 ${scope.row.id}`
        this.type = 'arrive'
      }
    },
    validDeliverForm (callback) {
      this.$refs.deliverForm.validate(valid => {
        if (!valid) {
          this.submitLoading = false
          return false
        } else {
          this.saveDeliverForm(callback)
        }
      })
    },
    saveDeliverForm (callback) {
      if (this.type === 'arrive') {
        const params = {
          delivery_id: this.deliverForm.delivery_id,
          remark: this.deliverForm.remark,
          sign_fullname: this.deliverForm.fullname,
          sign_name: this.deliverForm.name,
          sign_time: this.deliverForm.time
        }
        this.$http.put(`/business/delivery/arrived?logtype=${'arrived'}`, { data: params }).then(res => {
          const result = res
          callback(result)
        })
      }
      if (this.type === 'receipt') {
        const params = {
          delivery_id: this.deliverForm.delivery_id,
          remark: this.deliverForm.remark,
          receipt_fullname: this.deliverForm.fullname,
          receipt_name: this.deliverForm.name,
          receipt_time: this.deliverForm.time
        }
        this.$http.put(`/business/delivery/receipt?logtype=${'receipt'}`, { data: params }).then(res => {
          const result = res
          callback(result)
        })
      }
    },
    submit () {
      this.submitLoading = true
      this.validDeliverForm(result => {
        if (result.code === 0) {
          this.$message.success('操作成功')
          this.submitLoading = false
          this.deliverDialog = false
          this.getDeliverList()
        }
      })
    },
    detail (scope) {
      this.$router.push(`/main/deliverInfo?id=${scope.row.id}`)
    },
    // 格式化数据
    formatter (row, column) {
      if (column.property === 'state') {
        return this.transkey(row[column.property])
      } else if (column.property === 'delivery_time') {
        return this.formattime(row[column.property])
      } else {
        return row[column.property]
      }
    },
    // 排序
    sortChange (column) {
      this.searchForm.col = column.prop
      this.searchForm.order = column.order === 'ascending' ? 1 : 0
      this.getDeliverList()
    },
    closeDeliverDialog () {
      this.$refs.deliverForm.resetFields()
      this.deliverDialog = false
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
        }
      })
    },
    // 更改人
    changeUser (value) {
      const users = this.userList.filter(o => {
        return o.name === value
      })[0] || {}
      this.deliverForm.name = value
      this.deliverForm.fullname = users.fullname
    },
    // 判断是否是最后一页的最后一列
    isLastPage () {
      if (this.deliverData.length === 1 && this.searchForm.page !== 1) {
        this.searchForm.page--
      }
    },
    onSearch (form) {
      this.query = form
      this.searchForm.page = 1
      this.getDeliverList()
    },
    onReset (from) {
      this.query = from
      this.searchForm = {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      }
      this.getDeliverList()
    },
    changePageSize (count) {
      this.searchForm.count = count
      this.getDeliverList()
    },
    changeCurrentPage (page) {
      this.searchForm.page = page
      this.getDeliverList()
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.detail {
    color: $--color-primary;
    cursor: pointer;
}
.select-width{
  width: 100%;
}
</style>
