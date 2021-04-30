<template>
  <div class="page-info">
    <PageHeader :title="this.preId" :back="true" @back="goBack"></PageHeader>
    <el-table :data="preTableData" size="small" border :row-class-name="tableRowClassName">
          <el-table-column v-for="(item, index) in tableDataColumn"
                          :key="index" :label="item.label" :prop="item.prop">
          </el-table-column>
          <el-table-column label="操作">
                <template slot-scope="scope">
                    <span class="table-detail" @click="edit(scope)">编辑</span>
                    <el-divider direction="vertical"></el-divider>
                    <span class="table-detail" @click="openCloseDialog(scope)">结束</span>
                </template>
          </el-table-column>
    </el-table>
    <Pagination style="margin-top:8px" :total="tableData.length"
                :current-page="pagination.currentPage" :page-size="pagination.pageSize"
                @size-change="sizeChange" @current-change="currentChange"/>
    <div class="bottom-list">
          <el-button type="primary" :loading="submitLoading" @click="submitPrepare">确认备料</el-button>
    </div>
    <el-dialog :visible.sync="preDialog">
        <div slot="title">
            <span class="title">编辑备料{{this.prepareTitle}}</span>
            <span class="especially" title="允许一次超发" v-if="overPrepare === 1">超</span>
        </div>
        <el-form :model="preForm" ref="preForm" label-width="120px" :rules="rules">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="供应商" prop="supplier_code">
                  <el-select v-model="preForm.supplier_name" class="select-width"
                            @change="changeSupplier($event)" placeholder="请选择供应商" filterable>
                    <el-option v-for="(item, index) in supplyList" :key="index"
                              :label="item.fullname" :value="{code: item.code, name: item.fullname}">
                      <span class="erp-option-left">{{ item.code }}</span>
                      <span class="erp-option-right">{{ item.name }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="仓库" prop="warehouse_id">
                  <el-select v-model="preForm.warehouse_id" clearable
                    class="select-width" @change="changeWarehouse"
                    placeholder="请输入仓库名称或代码搜索" filterable :disabled="!preForm.supplier_name">
                    <el-option v-for="item in warehouseList" :key="item.id"
                                :label="item.name" :value="item.id">
                      <span class="erp-option-left">{{ item.code }}</span>
                      <span class="erp-option-right">{{ item.name }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="区位" prop="space_id">
                  <el-select v-model="preForm.space_id" clearable class="select-width"
                              @change="changeSpace" :disabled="!preForm.supplier_name"
                              filterable placeholder="请输入区位名称和代码搜索">
                    <el-option v-for="item in areaList" :key="item.id"
                              :label="item.name" :value="item.id" filterable>
                      <span class="erp-option-left">{{ item.code }}</span>
                      <span class="erp-option-right">{{ item.name }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="库位" prop="location_code">
                    <el-select v-model="preForm.location_code" clearable :disabled="!preForm.supplier_name"
                              class="select-width" filterable placeholder="请输入库位名称和代码进行搜索">
                      <el-option v-for="item in locationList" :key="item.id"
                                :label="item.name" :value="item.code" filterable>
                            <span class="erp-option-left">{{ item.code }}</span>
                            <span class="erp-option-right">{{ item.name }}</span>
                            <span class="">--{{ item.amount }}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="本次备料数量" prop="amount">
                    <el-input v-model="preForm.amount" type="number" placeholder="请输入本次备料数量"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="料盒编码">
                    <el-input v-model.trim="preForm.box_code" placeholder="请输入料盒编码"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="备料人"  prop="preparer">
                    <el-select v-model="preForm.preparer" :remote-method="getUserList"
                              class="select-width" clearable filterable
                              @change="changeUser" remote placeholder="请输入用户名或全名搜索">
                        <el-option v-for="(item, index) in userList" :key="index"
                                    :label="item.name" :value="item.name">
                              <span style="float: left">{{ item.name }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{item.fullname}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
              <el-button @click="preDialog = false">取 消</el-button>
              <el-button type="primary" @click="addDetail">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog :visible.sync="remarkDialog" :close-on-click-modal="false" :title="remarkTitle">
        <el-form :model="remarkForm" label-width="120px">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="remarkForm.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="remarkDialog = false">取消</el-button>
            <el-button type="primary" @click="close">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import * as moment from 'moment'
import * as _ from 'lodash'
import decimal from 'decimal.js'
import PageHeader from '@/components/title/Title'
import Pagination from '@/components/table/Pagination'
import warehouse from '@/utils/data/warehouse'
import supplier from '@/utils/data/supplier'
import { tableDataColumn } from './prepareConfig'
import { USER_INFO } from '@/store/storageConst'
import userList from '@/utils/data/user'

export default {
  name: 'Detail',
  components: { PageHeader, Pagination },
  mixins: [warehouse(), supplier(), userList()],
  data () {
    return {
      warehouseList: [], // 仓库列表
      areaList: [], // 区位列表
      locationList: [], // 库位列表
      submitLoading: false, // 备料按钮的loading
      prepareTitle: '',
      tableDataColumn,
      preDialog: false,
      marCode: null,
      preparedAmount: null, // 以备数量
      planAmount: null, // 需求数量
      editId: null,
      editIndex: null,
      warehouseId: null,
      overPrepare: null, // 超发次数
      remarkDialog: false, // 备注弹框
      remarkRowId: null, // 本次物料的ID
      remarkTitle: '', // 弹框标题
      remarkForm: { // 弹框表单
        remark: ''
      },
      tipMsg: '', // 提示的错误信息
      amountList: [], // 验证过滤后的数组
      preForm: {
        warehouse_id: null, // 仓库
        space_id: null, // 区位
        location_code: null, // 库位
        box_code: '', // 料盒
        supplier_code: null, // 供应商代码
        supplier_name: null, // 供应商名称
        amount: null, // 备料数量
        prepared_time: null, // 备料时间
        preparer: null, // 备料人
        preparer_fullname: null
      },
      supplyList: [],
      tableData: [],
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      preId: null,
      formData: {},
      rules: {
        warehouse_id: [
          { required: true, message: '请选择仓库', trigger: 'blur' }
        ],
        space_id: [
          { required: true, message: '请选择区位', trigger: 'blur' }
        ],
        location_code: [
          { required: true, message: '请选择库位', trigger: 'blur' }],
        supplier_code: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入备料数量', trigger: 'blur' }
        ],
        preparer: [
          { required: true, message: '请选择备料人', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    preTableData () {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = this.pagination.currentPage * this.pagination.pageSize
      const data = JSON.parse(JSON.stringify(this.tableData || []))
      return data.slice(start, end)
    }
  },
  mounted () {
    this.preId = this.$route.query.id
    this.getFormData(this.preId)
  },
  methods: {
    // 获取出库单明细
    getFormData (id) {
      this.$http.get(`/business/wait_prepare/${id}`).then(res => {
        const result = res.data
        this.warehouseId = result.warehouse_id
        if (this.warehouseId) {
          this.preForm.warehouse_id = result.warehouse_id
        }
        this.tableData = result.details
        if (this.tableData.length === 0) {
          this.goBack()
        }
      })
    },
    // 提交备料
    submitPrepare () {
      this.submitLoading = true
      const params = this.handleParams()
      if (!params.data.length) {
        this.$message.error('没有可备料的数据')
        this.submitLoading = false
        return
      }
      this.checkEnoughMar(params, list => {
        this.amountList = list
        if (this.amountList.length > 0) {
          this.tipMsg = this.amountList.map((k, index) => `${index + 1}、物料编码: ${k.material_code}的本次备料数量: ${k.amount}大于库存量: ${k.total_amount}`)
          this.$confirmMsg(this.tipMsg.join(';'), '提示').then(() => {
            this.submitLoading = false
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          this.postPrepare(params)
        }
      })
    },
    // 提交备料数据
    postPrepare (arr) {
      this.$http.post(`/business/prepared?logtype=${'prepare'}`, { data: arr }).then(res => {
        const result = res
        if (result.code === 0) {
          this.submitLoading = false
          this.$message.success('操作成功')
          this.getFormData(this.preId)
        }
      }).catch(() => {
        this.submitLoading = false
      })
    },
    // 处理数据
    handleParams () {
      const params = {}
      params.stockout_main_id = this.preId
      const arrList = this.tableData.filter(k => k.amount > 0)
      const preMater = []
      arrList.forEach(ele => {
        const form = {}
        form.amount = ele.amount
        form.box_code = ele.box_code
        form.detail_id = ele.id
        form.warehouse_id = ele.warehouse_id
        form.space_id = ele.space_id
        form.location_code = ele.location_code
        form.material_code = ele.material_code
        form.plan_amount = ele.plan_amount
        form.prepared_amount = ele.prepared_amount
        form.supplier_code = ele.supplier_code
        form.supplier_name = ele.supplier_name
        form.preparer = ele.preparer
        form.preparer_fullname = ele.preparer_fullname
        preMater.push(form)
      })
      params.data = preMater
      return params
    },
    // 验证多人操作时，库存是否足够bug 9223
    checkEnoughMar (arr, callback) {
      const arrData = arr.data
      const params = arrData.map(item => {
        return {
          amount: item.amount,
          location_code: item.location_code,
          material_code: item.material_code,
          supplier_code: item.supplier_code
        }
      })
      this.$http.post('/business/stockin/store3/materials', { data: params }).then(res => {
        const result = res
        if (result.code === 0) {
          const amountResult = result.data.filter(item => item.amount > item.total_amount)
          callback(amountResult)
        }
      })
    },
    // 编辑物料
    edit (scope) {
      this.getWarehouseList()
      this.prepareTitle = scope.row.material_code
      this.overPrepare = scope.row.warehouse_info.over_sale
      this.preForm = {
        warehouse_id: scope.row.warehouse_id ? scope.row.warehouse_id : this.warehouseId, // 仓库
        space_id: scope.row.space_id, // 区位
        location_code: scope.row.location_code, // 库位
        box_code: scope.row.box_code, // 料盒
        supplier_code: scope.row.supplier_code, // 供应商代码
        supplier_name: scope.row.supplier_name, // 供应商名称
        amount: scope.row.amount, // 备料数量
        prepared_time: null, // 备料时间
        preparer: scope.row.preparer ? scope.row.preparer : this.$ls.get(USER_INFO).username,
        preparer_fullname: scope.row.preparer_fullname ? scope.row.preparer_fullname : this.$ls.get(USER_INFO).fullname
      }
      this.preDialog = true
      this.editIndex = scope.$index
      this.editId = scope.row.id
      this.marCode = scope.row.material_code
      this.preparedAmount = scope.row.prepared_amount // 以备数量
      this.planAmount = scope.row.plan_amount // 需求数量
      this.getSupplierList(list => { // 供应商列表
        this.supplyList = list.data
      })
    },
    // 关闭备料
    openCloseDialog (scope) {
      this.remarkDialog = true
      this.remarkRowId = scope.row.id
      this.remarkTitle = scope.row.material_name
    },
    close () {
      const params = {
        id: this.remarkRowId,
        remark: this.remarkForm.remark
      }
      this.$http.put(`/business/close_stockout_detail?logtype=${'prepare'}`, { data: params }).then(res => {
        this.$message.success('操作成功')
        this.getFormData(this.preId)
        this.remarkDialog = false
      })
    },
    // 更改供应商
    changeSupplier (event) {
      this.warehouseList = []
      this.areaList = []
      this.preForm.space_id = null
      this.locationList = []
      this.preForm.location_code = null
      if (event) {
        this.preForm.supplier_name = event.name
        this.preForm.supplier_code = event.code
        this.$http.get(`/base/stockinfo/warehouse/${this.marCode}/${this.preForm.supplier_code}`).then(res => {
          const result = res
          if (result.code === 0) {
            this.warehouseList = result.data ? result.data : []
            const isWareIdInclude = this.warehouseList.map(k => k.id).includes(this.warehouseId) // 判断传入的
            if (isWareIdInclude) {
              this.preForm.warehouse_id = this.warehouseId
              this.changeWarehouse(this.warehouseId)
            } else {
              this.preForm.warehouse_id = null
            }
          }
        })
      }
    },
    // 更改仓库
    changeWarehouse (value) {
      this.areaList = []
      this.preForm.location_code = null
      this.locationList = []
      this.preForm.space_id = null
      if (!value) {
        return
      }
      const areaArr = this.warehouseList.filter(k => k.id === value)
      this.areaList = areaArr[0] ? areaArr[0].children ? areaArr[0].children : [] : []
    },
    // 更改区位
    changeSpace (value) {
      this.locationList = null
      this.preForm.location_code = null
      if (!value) {
        return
      }
      this.areaList.map(k => {
        if (k.id === value) {
          this.locationList = k.children
        }
      })
    },
    // 确认添加
    addDetail () {
      this.$refs.preForm.validate(valid => {
        if (!valid) {
          return false
        } else {
          const params = {
            m: this.marCode, // 物料代码
            loc: this.preForm.location_code, // 库位
            s: this.preForm.supplier_code // 供应商
          }
          this.$http.get('/business/stockin/store3/material', { data: params }).then(res => {
            const resultNum = +res.data // 仓库下的物料数量
            const remainNum = +decimal.sub(this.planAmount, this.preparedAmount)
            if (resultNum < +this.preForm.amount) {
              this.$message.error(`本次备料数量大于供方物料总数量${resultNum}`)
            } else if (this.overPrepare === 0 && remainNum < +this.preForm.amount) {
              this.$message.error(`本次备料数量大于需求数量${remainNum}`)
            } else {
              this.tableData.map(k => {
                if (k.id === this.editId) {
                  k.warehouse_id = this.preForm.warehouse_id
                  k.space_id = this.preForm.space_id
                  k.location_code = this.preForm.location_code
                  k.supplier_code = this.preForm.supplier_code
                  k.supplier_name = this.preForm.supplier_name
                  k.box_code = this.preForm.box_code
                  k.amount = +this.preForm.amount
                  k.preparer = this.preForm.preparer
                  k.preparer_fullname = this.preForm.preparer_fullname
                  k.prepared_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                  this.tableData[this.editIndex] = k
                }
              })
              this.tableData = _.cloneDeep(this.tableData)
              this.preDialog = false
            }
          })
        }
      })
    },
    // 本次备料数量大于0
    tableRowClassName ({ row, rowIndex }) {
      if (row.amount > 0) {
        return 'success-row'
      }
    },
    // 更改备料人
    changeUser (value) {
      const selectUser =
        this.userList.filter(o => {
          return o.name === value
        })[0] || {}
      this.preForm.preparer = value
      this.preForm.preparer_fullname = selectUser.fullname
    },
    // 改变条数
    sizeChange (size) {
      this.pagination.pageSize = size
    },
    // 改变当前页
    currentChange (currnetPage) {
      this.pagination.currentPage = currnetPage
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.bottom-list {
  margin-top: $padding-md;
  text-align: center;
}
.especially {
  display: inline-block;
  background-color: #f3a39f;
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
.title {
  font-size: 18px;
  color: #303133;
}
/deep/ .success-row {
  background: $--color-primary-light-8;
}
/deep/ .el-message-box{
  width: 500px !important;
}
</style>
