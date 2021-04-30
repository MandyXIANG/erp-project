<template>
  <div class="stockin-receive-page">
    <Title
      :title="title"
      @back="$router.go(-1)"
      :back="true"
    ></Title>
    <el-table
      :border="true"
      size="small"
      ref="table"
      :data="spliceTableData"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        v-for="(item, key) in tableCols"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            class="table-detail"
            @click="editMaterial(scope)"
          >编辑</span>
          <el-divider direction="vertical"></el-divider>
          <span
            class="table-detail"
            @click="closeMaterial(scope.row)"
          >结束</span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      style="margin-top:8px"
      :total="tableData.length"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
    <div class="btm-area">
      <el-button
        type="primary"
        @click="onSubmit"
        :loading="loading"
      >确认收料</el-button>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <span class="title">{{editTitle}}</span>
        <span
          class="especially one"
          title="允许一次超收"
          v-if="overReceive=== 1"
        >一</span>
        <span
          class="especially more"
          title="允许多次超收"
          v-if="overReceive===2"
        >多</span>
        <span
          class="especially free"
          title="免检"
          v-if="verify"
        >免</span>
      </div>

      <el-form
        ref="form"
        :model="form"
        label-width="120px"
      >
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="供应商名称"
            prop="supplier_name"
          >
            <el-input
              disabled
              v-model="form.supplier_name"
              placeholder="请输入供应商名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="物料编码"
            prop="material_code"
          >
            <el-input
              disabled
              v-model="form.material_code"
              placeholder="请输入物料编码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="物料名称"
            prop="material_name"
          >
            <el-input
              disabled
              v-model="form.material_name"
              placeholder="请输入物料名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="库存单位"
            prop="stock_unit"
          >
            <el-input
              disabled
              v-model="form.stock_unit"
              placeholder="请输入库存单位"
            ></el-input>
          </el-form-item>
        </el-col>
        <template v-if="form.property.length">
          <el-col
            v-for="(ele, index) in form.property"
            :key="index"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item :prop="ele.code">
              <span slot="label">
                <i
                  style="color:#F56C6C;"
                  v-if="ele.control"
                >*</i>
                {{ele.name}}
              </span>
              <el-input
                v-model="ele.value"
                :id="ele.code"
                @focus="propertyChange(ele.code,ele.value,ele)"
                @input="propertyChange(ele.code,ele.value,ele)"
                :placeholder="`请输入${ele.code}`"
                clearable
              ></el-input>
              <span
                style="position:absolute;color:#F56C6C;left:0px;bottom:-15px;"
                v-if="!ele.value&&ele.control"
              >请输入{{ele.code}}</span>
            </el-form-item>
          </el-col>
        </template>
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="实收数量"
            prop="amount"
            :rules="[
              {
                required: true,
                message: '请输入实收数量',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <!-- <el-input
              type="number"
              v-model.number="form.amount"
            ></el-input> -->
            <InputNumber v-model="form.amount"></InputNumber>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="收料人"
            prop="operator"
            :rules="[
              {
                required: true,
                message: '请输入收料人',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-select
              v-model="form['operator']"
              placeholder="请输入用户名或全名搜索"
              filterable
              remote
              :remote-method="getUserList"
              @change="onUserChange"
            >
              <el-option
                v-for="item in users"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
                <span class="erp-option-left">{{ item.name }}</span>
                <span class="erp-option-right">{{
                  item.fullname
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleOk"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogRemark"
      :close-on-click-modal="false"
      :title="rowTitle"
    >
      <el-form
        ref="form"
        :model="remarkForm"
        label-width="120px"
      >
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            type="textarea"
            v-model="remarkForm.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogRemark = false">取消</el-button>
        <el-button
          type="primary"
          @click="closeBtn"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { USER, USER_INFO } from '@/store/storageConst'
import Vue from 'vue'
import * as _ from 'lodash'
import * as moment from 'moment'
import { SearchParams, TableCols, API_MAP } from './config/receive.config'
import Title from '@/components/title/Title'
import Pagination from '@/components/table/Pagination'
import { formatTime } from '@/utils/trans.js'
import InputNumber from '@/components/input-number/InputNumber'
export default {
  components: {
    Title,
    InputNumber,
    Pagination
  },
  data () {
    return {
      searchParams: SearchParams,
      tableCols: TableCols,
      tableData: [],
      dialogFormVisible: false,
      date: new Date(),
      form: {
        property: [],
        amount: null
      },
      overReceive: null,
      users: [],
      editDetailId: null,
      editIndex: null,
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      title: null,
      formattime: formatTime,
      verify: null,
      loading: false,
      editTitle: null,
      dialogRemark: false,
      remarkForm: {
        remark: null
      },
      rowTitle: null,
      rowId: null
    }
  },
  computed: {
    spliceTableData () {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = this.pagination.currentPage * this.pagination.pageSize
      const cloneData = JSON.parse(JSON.stringify(this.tableData || []))
      return cloneData.slice(start, end)
    }
  },
  created () {
    this.title = this.$route.query.id
    this.getDetailsById(this.$route.query.id)
  },
  methods: {
    /**
     * 获取收料单明细
     */
    getDetailsById (id) {
      const params = {
        es: 'receive_end'
      }
      this.$http.get(API_MAP.STOCKIN_RECEIPT + `/${id}`, { data: params }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.details
          if (!this.tableData.length) {
            this.$router.go(-1)
          }
        }
      })
    },
    /**
     * 编辑明细
     */
    editMaterial (scope) {
      this.dialogFormVisible = true
      this.editTitle = `编辑物料:${scope.row.material_code}`
      this.$nextTick(() => {
        this.form = {
          property: [],
          amount: null
        }
        this.$refs.form.resetFields()
        this.form.operator = scope.row.operator ? scope.row.operator : Vue.ls.get(USER)
        this.form.fullname = scope.row.fullname ? scope.row.fullname : this.$ls.get(USER_INFO).fullname
        this.form.amount = scope.row.amount
      })
      this.editDetailId = scope.row.id
      this.editIndex = scope.$index
      this.getDetailById(scope.row)
    },
    /**
     * 关闭任务
     */
    closeMaterial (row) {
      this.dialogRemark = true
      this.rowId = row.id
      this.rowTitle = row.material_name
    },
    closeBtn () {
      const data = {
        remark: this.remarkForm.remark,
        state: 'receive_end'
      }
      this.$http.put(`/business/stockin/receipt/detail/state/${this.rowId}?logtype=receive`, { data: data }).then(res => {
        this.$message.success('操作成功')
        this.getDetailsById(this.$route.query.id)
        this.dialogRemark = false
      })
    },
    /**
     * 获取收料单明细的相关信息
     */
    getDetailById (row) {
      this.$http.get(API_MAP.STOCKIN_RECEIPT_OP + `/${row.id}`).then(res => {
        if (res.code === 0) {
          const item = res.data
          this.form.material_code = item.material_code
          this.form.material_name = item.material_name
          this.form.stock_unit = item.stock_unit
          this.form.supplier_name = item.supplier_name
          if (row.property) {
            this.form.property = row.property || []
          } else {
            this.form.property = item.property || []
          }
          this.setPropertyValue()
          this.overReceive = (item.warehouse_info || {}).settle_method || 0
          this.verify = (item.warehouse_info || {}).verify
        }
      })
    },
    setPropertyValue () {
      for (const item of this.form.property) {
        this.form[item.code] = item.value
      }
    },
    /**
     * 编辑物料确认按钮
     */
    handleOk () {
      for (let i = 0; i < this.form.property.length; i++) {
        const element = this.form.property[i]
        if (element.control && !element.value) {
          this.$message.error('表单信息不完善')
          return
        }
      }
      if (this.overReceive === 0) {
        if (this.form.amount + this.tableData[this.editIndex].received_amount > this.tableData[this.editIndex].plan_amount) {
          this.$message.error('不可超收的物料,实收数量不能大于计划收料数量')
          return
        }
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          for (const item of this.tableData) {
            const copyItem = _.cloneDeep(item)
            if (item.id === this.editDetailId) {
              copyItem.amount = this.form.amount
              copyItem.date = moment().format('YYYY-MM-DD HH:mm:ss')
              copyItem.property = this.form.property
              copyItem.operator = this.form.operator
              copyItem.fullname = this.form.fullname
              this.tableData[this.editIndex] = copyItem
            }
          }
          this.tableData = _.cloneDeep(this.tableData)
          this.dialogFormVisible = false
        }
      })
    },
    /**
     * 获取用户列表
     */
    getUserList (val) {
      const params = {
        'q[name]': val,
        'q[fullname]': val,
        op: 1
      }
      this.$http.get(API_MAP.USER_LIST, { data: params }).then(res => {
        if (res.code === 0) {
          this.users = res.data.data
        }
      })
    },
    onUserChange (val) {
      this.form.fullname = null
      const data = this.users.filter(item => item.name === val)
      if (data.length) {
        this.form.fullname = data[0].fullname
      }
      this.form.operator = val
      this.form = _.cloneDeep(this.form)
    },
    /**
     * 确认收料
     */
    onSubmit () {
      const params = this.handleParams()
      if (!params.goods.length) {
        this.$message.error('没有可收料的数据')
        return
      }
      this.loading = true
      this.$http.put(API_MAP.STOCKIN_RECEIPT_OP + '?logtype=receive', { data: params }).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.getDetailsById(this.$route.query.id)
        }
      }, err => {
        console.log(err)
        this.loading = false
      })
    },
    /**
     * 处理参数
     */
    handleParams () {
      const params = {}
      params.receipt_id = this.$route.query.id
      const arr = this.tableData.filter(o => {
        return o.amount > 0
      })
      const goods = []
      for (const item of arr) {
        const obj = item
        obj.receipt_detail_id = item.id
        obj.supplier_code = this.$route.query.code
        obj.supplier_name = this.$route.query.name
        obj.pending_amount = item.amount
        obj.op_log = {
          amount: item.amount,
          operation_time: moment().format('YYYY-MM-DD HH:mm:ss'),
          operator: item.operator,
          operator_fullname: item.fullname,
          property: item.property
        }

        goods.push(obj)
      }
      params.goods = goods
      return params
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.amount > 0) {
        return 'success-row'
      }
    },
    propertyChange (code, value, form) {
      this.form[code] = value
      this.form.property.forEach(element => {
        if (element.code === code) {
          if (element.control && !element.value) {
            document.getElementById(code).style.borderColor = '#F56C6C'
          } else {
            document.getElementById(code).style.borderColor = '#DCDFE6'
          }
        }
      })
    },
    formatter (row, column, cellValue, index) {
      if (column.property === 'plan_date') {
        return formatTime(row[column.property])
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.stockin-receive-page {
  .btm-area {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-size: 18px;
    color: #303133;
  }
  .especially {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: #fff;
    font-size: 16px;
    text-align: center;
    line-height: 30px;
    margin-left: $padding-xs;
    cursor: pointer;
  }
  .one {
    background-color: #f3a39f;
  }
  .more {
    background-color: #3499db;
  }
  .free {
    background-color: #18bd9b;
  }

  /deep/ .success-row {
    background: $--color-primary-light-8;
  }
}
</style>
