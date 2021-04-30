<template>
  <div>
    <Title
      @back="$router.go(-1)"
      :title="title"
      :back="true"
    ></Title>
    <Table
      :data="tableData.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.currentPage * this.pagination.pageSize)"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      :rowlClassName="tableRowClassName"
      :stripe="false"
    >
      <el-table-column
        v-for="(item,key) in tableCols"
        :key="key"
        :label="item.label"
        :prop="item.prop"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            @click="onEdit(scope.row)"
            class="table-detail"
          >编辑</span>
        </template>
      </el-table-column>
    </Table>
    <div style="text-align:center">
      <el-button
        type="primary"
        @click="onSubmit"
        :loading="loading"
      >确认存料</el-button>
    </div>
    <el-dialog
      :title="materialTitle"
      :visible.sync="dialogDetail"
      @close="dialogDetail=false"
      :close-on-click-modal="false"
    >
      <el-form
        ref="detailform"
        :model="detailform"
        label-width="120px"
      >
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="实际仓库"
            prop="warehouse"
            :rules="[{
              required:true,message: '请选择实际仓库',trigger:['change','blur']
              }]"
          >
            <el-select
              v-model="detailform.warehouse"
              @change="changeWarehouse"
              placeholder="请选择实际仓库"
              filterable
              :clearable="false"
            >
              <el-option
                v-for="(item,key) in warehouseList"
                :key="key"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.code }}</span>
                <span style="float: right; color: #8492a6; font-size: 14px">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="实际区位"
            prop="position"
            :rules="[{
              required:true,message: '请选择实际区位',trigger:['change','blur']
              }]"
          >
            <el-select
              v-model="detailform.position"
              @change="changePosition"
              filterable
              placeholder="请选择实际区位"
              :clearable="false"
            >
              <el-option
                v-for="(item,key) in positionList"
                :key="key"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.code }}</span>
                <span style="float: right; color: #8492a6; font-size: 14px">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="实际库位"
            prop="location"
            :rules="[{
              required:true,message: '请选择实际库位',trigger:['change','blur']
              }]"
          >
            <el-select
              v-model="detailform.location"
              placeholder="请选择实际库位"
              filterable
              :clearable="false"
            >
              <el-option
                v-for="(item,key) in locationList"
                :key="key"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.value }}</span>
                <span style="float: right; color: #8492a6; font-size: 14px">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="存料数量"
            prop="amount"
            :rules="[{
              required:true,message: '请输入存料数量',trigger:['change','blur']
              }]"
          >
            <!-- <el-input
              type="number"
              v-model.number="detailform.amount"
            ></el-input> -->
            <InputNumber v-model.number="detailform.amount"></InputNumber>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="存料人"
            prop="operator"
            :rules="[{
              required:true,message: '请输入用户名或全名搜索',trigger:['change','blur']
              }]"
          >
            <el-select
              v-model="detailform.operator"
              filterable
              remote
              reserve-keyword
              placeholder="请选择存料人"
              :remote-method="remoteMethod"
              style="width:100%"
              @change="changeUser"
            >
              <el-option
                v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.value }}</span>
                <span style="float: right; color: #8492a6; font-size: 14px">{{ item.code }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogDetail=false">取消</el-button>
        <el-button
          type="primary"
          @click="onConfirm('detailform')"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Title from '@/components/title/Title'
import Table from '@/components/table/Table'
import { TableCols } from './config/material-stock.config'
import { USER_INFO } from '@/store/storageConst'
import decimal from 'decimal.js'
import InputNumber from '@/components/input-number/InputNumber'
export default {
  components: {
    Title,
    Table,
    InputNumber
  },
  data () {
    return {
      tableData: [],
      tableCols: TableCols,
      dialogDetail: false,
      detailform: {
        warehouse: null,
        position: null,
        location: null,
        amount: null,
        operator: null,
        fullname: null
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userList: [],
      warehouseList: [],
      positionList: [],
      locationList: [],
      warehouseChild: [],
      editRow: null,
      title: null,
      materialTitle: null,
      loading: false,
      positionData: [],
      warehouseData: []
    }
  },
  mounted () {
    // 通过存料id 获取存料详情
    this.getAllDetailData()
  },
  methods: {
    getAllDetailData () {
      this.$http.get(`/business/stockin/store/${this.$route.query.id}`).then(res => {
        this.tableData = res.data.details
        this.pagination.total = res.data.details.length
        this.title = this.$route.query.id
        if (!this.tableData.length) {
          this.$router.go(-1)
        }
      })
    },
    onEdit (row) {
      this.dialogDetail = true
      this.$nextTick(() => {
        this.detailform = {
          warehouse: null,
          position: null,
          location: null,
          amount: null,
          operator: null
        }
        this.$refs.detailform.resetFields()
      })
      this.editRow = row
      // 获取仓库数据
      this.$http.get(`/base/warehouse/available/${row.material_id}`).then(res => {
        this.detailform.operator = row.operator ? row.operator : this.$ls.get(USER_INFO).username
        this.detailform.fullname = row.fullname ? row.fullname : this.$ls.get(USER_INFO).fullname
        this.materialTitle = `编辑物料:${row.material_code}`
        this.warehouseList = []
        console.log(res, 'resresresresresresres')
        this.warehouseData = res.data ? res.data : []
        this.warehouseData.forEach(el => {
          this.warehouseList.push({
            label: el.name,
            value: el.id,
            code: el.code
          })
        })
        if (row.warehouse) {
          this.detailform.warehouse = row.warehouse
          this.detailform.position = row.position
          this.detailform.location = row.location
          this.detailform.amount = row.amount
        }
      })
    },
    onSizeChange (page) {
      this.pagination.pageSize = page
    },
    onCurrentChange (page) {
      this.pagination.currentPage = page
    },
    // 选择仓库事件
    changeWarehouse (value) {
      this.detailform.position = null
      this.detailform.location = null
      this.positionList = []
      this.locationList = []
      const arr = this.warehouseData.filter(item => item.id === value)
      this.positionData = arr[0] ? arr[0].children ? arr[0].children : [] : []
      this.positionData.forEach(el => {
        this.positionList.push({
          label: el.name,
          value: el.id,
          code: el.code
        })
      })
    },

    // 选择区位事件
    changePosition (value) {
      this.detailform.location = null
      this.locationList = []
      const arr = this.positionData.filter(item => item.id === value)
      if (arr[0] && arr[0].children) {
        arr[0].children.forEach(elment => {
          this.locationList.push({
            label: elment.name,
            value: elment.code
          })
        })
      }
    },
    // 弹出框的确定按钮
    onConfirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.tableData.length; i++) {
            const el = this.tableData[i]
            if (el.id === this.editRow.id) {
              if (this.detailform.amount > Number(decimal.sub(this.editRow.pending_amount, this.editRow.completed_amount))) {
                this.$message.error('存料数量超额')
                break
              } else {
                el.amount = this.detailform.amount
                el.location = this.detailform.location
                el.operator = this.detailform.operator
                el.warehouse = this.detailform.warehouse
                el.position = this.detailform.position
                el.fullname = this.detailform.fullname
                this.dialogDetail = false
              }
            }
          }
          [...this.tableData] = this.tableData
        }
      })
    },
    // 提交按钮
    onSubmit () {
      const data = []
      this.tableData.forEach(el => {
        if (el.amount) {
          data.push({
            amount: el.amount,
            location_code: el.location,
            operator: el.operator,
            store_detail_id: el.id,
            operator_fullname: el.fullname
          })
        }
      })
      if (!data.length) {
        this.$message.error('没有可存料的数据')
        return
      }
      this.loading = true
      this.$http.put(`/business/stockin/store/detail?logtype=${'store'}`, { data: data }).then(res => {
        this.loading = false
        this.$message.success('操作成功')
        this.getAllDetailData()
      }, err => {
        console.log(err)
        this.loading = false
      })
    },
    remoteMethod (value) {
      if (value) {
        const data = {
          'q[name]': value,
          'q[fullname]': value,
          op: 1
        }
        this.$http.get('/system/user/list', { data: data }).then(res => {
          this.userList = []
          if (res.data.data) {
            res.data.data.forEach(element => {
              this.userList.push({
                code: element.fullname,
                value: element.name,
                label: element.name
              })
            })
          }
        })
      } else {
        this.userList = []
      }
    },
    changeUser (value) {
      this.detailform.fullname = null
      const data = this.userList.filter(item => item.value === value)
      if (data.length) {
        this.detailform.fullname = data[0].code
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.amount) {
        return 'success-row'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-table .success-row {
  background: $--color-primary-light-8;
}
</style>
