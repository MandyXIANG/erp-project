<template>
    <div>
        <el-collapse-item name="2">
            <template slot="title">
                <Title title="出库明细"/>
            </template>
            <el-button type="primary" class="topbar-btn" @click="addMar"
                      :disabled="!warehouseId">添加物料
            </el-button>
            <el-button type="primary" class="topbar-btn" @click="addSale"
                      :disabled="!saleId">销售订单
            </el-button>
            <Table :data="tableDetailData" :total="marTableData.length"
                    :current-page="marPagination.currentPage" :page-size="marPagination.pageSize"
                    @size-change="marSizeChange" @current-change="marCurrentChange">
                <el-table-column v-for="(item, index) in DetailColumn" :key="index"
                                :label="item.label" :prop="item.prop">
                </el-table-column>
                  <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-popconfirm title="确定要删除吗" @onConfirm="del(scope)">
                          <span slot="reference" class="table-detail">删除</span>
                        </el-popconfirm>
                        <el-divider direction="vertical"></el-divider>
                        <span class="table-detail" @click="editMar(scope)">编辑</span>
                      </template>
                  </el-table-column>
            </Table>
        </el-collapse-item>
        <!-- 添加物料 -->
        <el-dialog :title="title" :visible.sync="marDialog" @close="closeMarDialog">
          <el-form :model="marForm" ref="marForm" label-width="120px" :rules="rules">
            <el-row type="flex">
              <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
                <el-form-item label="物料编码" prop="material_code">
                  <el-select v-model="marForm.material_code" @change="changeMarCode"
                            class="select-width" placeholder="请选择物料编码" filterable>
                    <el-option v-for="(item, index) in marList" :key="index"
                              :label="item.code" :value="item.code">
                              <span style="float: left">{{ item.name }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">
                              {{item.code}}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
                <el-form-item label="物料名称">
                  <el-input v-model="marForm.material_name" :disabled="isDisable"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
                <el-form-item label="库存单位">
                  <el-input v-model="marForm.unit" :disabled="isDisable"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
                <el-form-item label="需求数量" prop="plan_amount">
                  <el-input v-model.number="marForm.plan_amount" type="number" placeholder="请输入需求数量"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeMarDialog()">取 消</el-button>
            <el-button type="primary" @click="submitMarForm">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 添加销售订单 -->
        <el-dialog title="销售出库" :visible.sync="saleDialog" :before-close="closeSaleDialog">
            <el-row type="flex">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
                <el-table :data="saleOrderList" border>
                  <el-table-column v-for="(item,index) in orderColumn" :key="index"
                                  :label="item.label" :prop="item.prop" :formatter="formatterSaleNum">
                  </el-table-column>
                  <el-table-column label="需求数量">
                    <template slot-scope="scope">
                      <el-input v-model.number="scope.row.plan_amount" type="number" placeholder="请输入需求数量">
                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
                <Pagination style="margin-top:8px" :total="salePagination.total"
                  :current-page="salePagination.currentPage" :page-size="salePagination.pageSize"
                  @size-change="saleSizeChange" @current-change="saleCurrentChange"/>
              </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeSaleDialog">取 消</el-button>
                <el-button type="primary" @click="submitSaleDialog">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Title from '@/components/collapse-title/CollapseTitle'
import Table from '@/components/table/Table'
import Pagination from '@/components/table/Pagination'
import { DetailColumn, orderColumn } from './outboundConfig'
import material from '@/utils/data/material'
import order from '@/utils/data/order'
import decimal from 'decimal.js'

export default {
  components: { Title, Table, Pagination },
  mixins: [material(), order()],
  name: 'Add',
  props: {
    warehouseId: { // 仓库ID 获取仓库下的物料
      type: Number,
      default: null
    },
    saleId: { // 销售ID
      type: String,
      default: null
    },
    marTableData: { // 明细table
      type: Array,
      default: () => []
    },
    outId: { // 出库单号
      type: String,
      default: null
    }
  },
  watch: {
    warehouseId: {
      immediate: true,
      handler (v) {
        this.warehouseId = v
      }
    },
    marTableData: {
      immediate: true,
      handler (v) {
        this.marTableData = v
      }
    },
    saleId: {
      immediate: true,
      handler (v) {
        this.saleId = v
      }
    }
  },
  data () {
    return {
      title: '',
      DetailColumn,
      orderColumn,
      marDialog: false,
      saleDialog: false,
      marList: [],
      saleOrderList: [],
      wareMarList: [],
      marCodeList: [],
      isDisable: true,
      marForm: {},
      editIndex: -1,
      total: 0,
      editItem: {},
      marPagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      salePagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      rules: {
        material_code: [
          { required: true, message: '请选择物料编码', trigger: 'blur' }
        ],
        plan_amount: [
          { required: true, message: '请输入需求数量', trigger: 'blur' },
          { type: 'number', message: '需求数量必须为数字', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    tableDetailData () { // 前端分页拿到的table数据
      const start =
        (this.marPagination.currentPage - 1) * this.marPagination.pageSize
      const end = this.marPagination.currentPage * this.marPagination.pageSize
      const tableData = JSON.parse(JSON.stringify(this.marTableData || []))
      return tableData.slice(start, end)
    }
  },
  methods: {
    // 提交物料
    submitMarForm () {
      this.$refs.marForm.validate(valid => {
        if (!valid) {
          this.$message.error('请完善物料')
        } else {
          this.$emit('addMaterial', [this.marForm], this.editIndex)
          this.marDialog = false
        }
      })
    },
    // 提交销售订单
    submitSaleDialog () {
      const saleMaterial = []
      this.saleOrderList.forEach(item => {
        if (item.plan_amount > 0) {
          this.changeSaleToStore(item, 'plan_amount')
          item.order_code = item.order_num
          item.unit = item.unit_info.stock
          item.order_detail_id = item.id || item.order_detail_id
          delete item.id
          saleMaterial.push(item)
        }
      })
      this.$emit('addMaterial', saleMaterial, this.editIndex)
      this.saleDialog = false
    },
    // 删除物料
    del (scope) {
      this.$emit('deleteMar', scope)
    },
    // 编辑物料
    editMar (scope) {
      this.editItem = scope.row
      this.editIndex = scope.$index
      if (this.editItem.order_detail_id) { // 来自销售订单
        if (this.editItem.id) { //
          this.editItem.order_num = this.editItem.order_code
          this.editItem.unit_info.stock = this.editItem.unit
          this.editItem.sale_unit = this.editItem.unit_info.sale
          this.editItem.id = this.editItem.order_detail_id
          delete this.editItem.order_detail_id
        }
        this.editItem.plan_amount = this.changeStoreToSale(this.editItem, 'plan_amount')
        this.saleOrderList = [this.editItem]
        this.saleDialog = true
        this.salePagination.total = 1
      } else { // 来自物料
        this.marForm = this.editItem
        this.title = `编辑${this.editItem.material_code}`
        this.marDialog = true
      }
    },
    saleSizeChange (cur) {
      this.salePagination.pageSize = cur
    },
    saleCurrentChange (page) {
      this.salePagination.currentPage = page
    },
    marSizeChange (count) {
      this.marPagination.pageSize = count
    },
    marCurrentChange (currentPage) {
      this.marPagination.currentPage = currentPage
    },
    // 拿到仓库下的物料
    async getWarehouseMar (callback) {
      if (this.warehouseId) {
        await this.$http.get(`/base/warehouse/materials/${this.warehouseId}?${'has_children=true'}`).then(res => {
          const result = res.data.data
          callback(result)
        })
      }
    },
    // 新增物料
    addMar () {
      this.getWarehouseMar(list => {
        this.marList = list
      })
      this.editIndex = -1
      this.title = '添加物料'
      this.marForm = {}
      this.marDialog = true
    },
    // 销售订单明细
    async addSale () {
      await this.getWarehouseMar(list => {
        this.wareMarList = list
        this.marCodeList = this.wareMarList.map(k => k.code)
      })
      const id = this.saleId
      await this.getSaleOrderList(id, list => {
        this.saleDialog = true
        const result = list.details
        const arr = this.filterMarCode(result, this.marCodeList)
        this.saleOrderList = arr
        this.salePagination.total = arr.length
      })
      this.editIndex = -1
    },
    // 过滤物料函数
    filterMarCode (arr1, arr2) {
      return arr1.filter(item => {
        return arr2.includes(item.material_code)
      })
    },
    // 销售转库存
    changeSaleToStore (row, amount) {
      const saleAmount = +decimal.mul(row.unit_info.sale_ratio, row[amount])
      row.plan_amount = +(+(decimal.div(saleAmount, row.unit_info.stock_ratio)).toFixed(2))
    },
    // 库存转销售
    changeStoreToSale (item, sum) {
      const stockNum = +decimal.mul(item.unit_info.stock_ratio, item[sum])
      const needNum = +(+(decimal.div(stockNum, item.unit_info.sale_ratio)).toFixed(2))
      return needNum
    },
    // 关闭物料弹框
    closeMarDialog () {
      this.marDialog = false
    },
    // 关闭销售订单弹框
    closeSaleDialog () {
      if (this.editItem && this.editItem.unit_info && this.editItem.plan_amount) {
        this.changeSaleToStore(this.editItem, 'plan_amount')
      }
      this.saleDialog = false
    },
    // 更改物料编码
    changeMarCode (value) {
      const mar = this.marList.filter(o => {
        return o.code === value
      })[0]
      this.marForm.material_name = mar.name
      this.marForm.unit = mar.stock_unit
    },
    // 格式化已发数量，在销售明细发出后，再次新增，展示销售单位
    formatterSaleNum (row, column) {
      if (column.property === 'sent_sum') {
        return row.sent_sum ? this.changeStoreToSale(row, 'sent_sum') : (row.order_plan_amount ? this.changeStoreToSale(row, 'order_plan_amount') : 0)
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
