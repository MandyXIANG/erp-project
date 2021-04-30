<template>
  <div class="purchase-order-detail">
    <div>
      <el-button
        :disabled="!supplier"
        type="primary"
        class="topbar-btn"
        @click="addMaterial"
        >添加物料</el-button
      >
      <el-button
        :disabled="!supplier"
        type="primary"
        class="topbar-btn"
        @click="requestMaterial"
        >请购处理</el-button
      >
    </div>
    <div>
      <Table
        :data="spliceTableData"
        :total="materialTableDate.length"
        :current-page="pagination2.currentPage"
        :page-size="pagination2.pageSize"
        @size-change="onSizeChange2"
        @current-change="onCurrentChange2"
      >
        <el-table-column
          sortable="custom"
          v-for="(item, key) in orderMaterialTableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-popconfirm title="确定要删除吗?" @onConfirm="onDelete(scope)">
              <span slot="reference" class="table-detail">删除</span>
            </el-popconfirm>
            <el-divider direction="vertical"></el-divider>
            <span class="table-detail" @click="editMaterial(scope)">编辑</span>
          </template>
        </el-table-column>
      </Table>
    </div>
    <!-- 添加物料弹框 -->
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="addMaterialModel"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item
            label="选择物料"
            prop="material_code"
            :rules="[
              { required: true, message: '请选择物料', trigger: 'blur' }
            ]"
          >
            <el-select
              v-model="form['material_code']"
              style="width:100%"
              placeholder="请输入物料名称搜索"
              filterable
              @change="onMaterialChange"
            >
              <el-option
                v-for="item in materialList"
                :key="item.sm_code"
                :label="item.sm_name"
                :value="item.sm_code"
                :disabled="item.expired"
              >
                <i
                  v-if="item.expired"
                  class="expired-material iconfont iconyiguoqi2"
                ></i>
                <span class="erp-option-left">{{ item.sm_code }}</span>
                <span class="erp-option-right">{{ item.sm_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="采购单位" prop="purchase_unit">
            <el-input disabled v-model="form['purchase_unit']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="默认单价" prop="supplier_price">
            <el-input disabled v-model="form['supplier_price']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="默认计价单位" prop="supplier_price_unit">
            <el-input disabled v-model="form['supplier_price_unit']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item
            label="实际单价"
            prop="price"
            :rules="[
              { required: true, message: '请输入实际单价', trigger: 'blur' }
            ]"
          >
            <InputNumber
              placeholder="请输入实际单价"
              v-model="form['price']"
              :min="0"
            ></InputNumber>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item
            label="采购数量"
            prop="purchase_amount"
            :rules="[
              { required: true, message: '请输入采购数量', trigger: 'blur' }
            ]"
          >
            <InputNumber
              style="width:100%"
              v-model="form['purchase_amount']"
              placeholder="请输入采购数量"
              :min="0"
            ></InputNumber>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMaterialModel = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="请购处理"
      :close-on-click-modal="false"
      :visible.sync="requestModel"
    >
      <div>
        <el-table
          size="small"
          :data="requestMaterialData"
          row-key="index"
          :expand-row-keys="expandRows"
          @expand-change="expandChange"
          @sort-change="sortChange"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item
                  v-for="(col, index) in expandCols"
                  :key="index"
                  :label="col.label"
                >
                  <span v-if="col.prop === 'raw_unit'">{{
                    transKey(props.row[col.prop])
                  }}</span>
                  <span v-else>{{ props.row[col.prop] }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, key) in requestMaterialCols"
            :key="key"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            sortable="custom"
            :show-overflow-tooltip="
              item.prop === 'material_name' ? false : true
            "
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'material_name'">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.material_name"
                  placement="top"
                  :disabled="scope.row.expired"
                >
                  <span>{{ scope.row.material_name }}</span>
                </el-tooltip>
                <el-tooltip
                  v-if="scope.row.expired"
                  class="item"
                  effect="dark"
                  :content="scope.row.material_name"
                  placement="top"
                >
                  <i class="float-expired iconfont iconyiguoqi2"></i>
                </el-tooltip>
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="150" label="实际单价">
            <template slot-scope="scope">
              <InputNumber
                :disabled="scope.row.expired"
                style="width:100%"
                v-model="scope.row.price"
                size="small"
                :min="0"
              ></InputNumber>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="150" label="本次采购数量">
            <template slot-scope="scope">
              <InputNumber
                :disabled="scope.row.expired"
                style="width:100%"
                v-model="scope.row.purchase_amount"
                :min="0"
                size="small"
              ></InputNumber>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="requestModel = false">取 消</el-button>
        <el-button type="primary" @click="requestOkBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as moment from 'moment'

import Table from '@/components/table/Table.vue'
import Pagination from '@/components/table/Pagination'
import { transKey, formatDate } from '@/utils/trans.js'
import InputNumber from '@/components/input-number/InputNumber'
import {
  orderMaterialTableCols,
  requestMaterialCols,
  expandCols,
  API_MAP
} from './config'
export default {
  components: {
    Table,
    Pagination,
    InputNumber
  },
  props: {
    supplier: {
      type: Number,
      default: null
    },
    materialTableDate: {
      type: Array,
      default: () => []
    },
    unit: {
      type: String,
      default: null
    }
  },
  watch: {
    materialTableDate: {
      immediate: true,
      handler (v) {
        this.materialTableDate = v
      }
    },
    supplier: {
      immediate: true,
      handler (v) {
        this.supplier = v
      }
    },
    unit: {
      immediate: true,
      handler (v) {
        this.unit = v
      }
    }
  },
  data () {
    return {
      orderMaterialTableCols,
      requestMaterialCols,
      requestMaterialData: [],
      expandCols,
      transKey,
      addMaterialModel: false,
      title: '',
      form: {},
      materialList: [],
      requestModel: false,
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      pagination2: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      editIndex: -1,
      expandRows: [],
      sort: {
        col: 'demand_time',
        order: 1
      }
    }
  },
  computed: {
    spliceTableData () {
      const start =
        (this.pagination2.currentPage - 1) * this.pagination2.pageSize
      const end = this.pagination2.currentPage * this.pagination2.pageSize
      const cloneData = JSON.parse(
        JSON.stringify(this.materialTableDate || [])
      )
      return cloneData.slice(start, end)
    }
  },
  methods: {
    /**
     * 添加物料弹框
     */
    addMaterial () {
      this.getSupplierMaterial()
      this.editIndex = -1
      this.title = '添加物料'
      this.form = {}
      this.addMaterialModel = true
    },
    /**
     * 请购处理弹框
     */
    requestMaterial () {
      this.sort = {
        col: 'demand_time',
        order: 1
      }
      this.getRequestDetail()
      this.editIndex = -1
      this.requestModel = true
    },
    /**
     * 获取供应商的物料
     */
    getSupplierMaterial () {
      const params = { state: 'release' }
      this.$http
        .get(API_MAP.SUPPLIER_MATERIALS + `/${this.supplier}`, { data: params })
        .then(res => {
          if (res.code === 0) {
            for (const item of res.data.data) {
              if (item.valid_period) {
                if (
                  moment(item.valid_period).isBefore(
                    moment().format('YYYY-MM-DD')
                  )
                ) {
                  item.expired = true
                } else {
                  item.expired = false
                }
              }
            }
            this.materialList = res.data.data
            console.log('供物料', this.materialList)
          }
        })
    },
    /**
     * 物料下拉框改变的回调
     */
    onMaterialChange (val) {
      const selectMaterial =
        this.materialList.filter(o => {
          return o.sm_code === val
        })[0] || {}
      this.form.purchase_unit = selectMaterial.sm_unit
      this.form.supplier_price = selectMaterial.price
      this.form.supplier_price_unit = transKey(selectMaterial.unit)
      this.form.material_name = selectMaterial.sm_name
      this.form.start_num = selectMaterial.min_goods_count || null
      this.form.supplier_material_code = selectMaterial.code
      this.form.supplier_material_name = selectMaterial.name
      this.form.hscode = selectMaterial.hscode
    },
    /**
     * 添加物料弹框确认按钮的回调
     */
    handleOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.purchase_amount <= 0) {
            this.$message.error('采购数量必须大于0')
            return
          }
          this.$emit('addMaterial', [this.form], this.editIndex)
          this.addMaterialModel = false
        }
      })
    },
    /**
     * 获取供应商相关的所有请购单
     */
    getRequestDetail () {
      const params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize
      }
      if (Object.keys(this.sort).length) {
        params.col = this.sort.col
        params.order = this.sort.order
      }
      this.$http
        .get(API_MAP.PURCHASE_FILTER + `/${this.supplier}`, { data: params })
        .then(res => {
          if (res.code === 0) {
            this.requestMaterialData = res.data.data
            this.requestMaterialData.map((item, index) => {
              item.index = index
              item.demand_time_formatter = formatDate(item.demand_time)
              if (item.valid_period) {
                if (
                  moment(item.valid_period).isBefore(
                    moment().format('YYYY-MM-DD')
                  )
                ) {
                  item.expired = true
                } else {
                  item.expired = false
                }
              }
            })
            this.pagination.total = res.data.total_records
          }
        })
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getRequestDetail()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getRequestDetail()
    },
    // 当前页数改变时的事件
    onCurrentChange2 (currentPage) {
      this.pagination2.currentPage = currentPage
    },
    // 当前条数改变时的事件
    onSizeChange2 (size) {
      this.pagination2.pageSize = size
    },
    /**
     * 请购处理确认按钮
     */
    requestOkBtn () {
      const selectMaterils = []
      for (const item of this.requestMaterialData) {
        if (item.purchase_amount > 0) {
          item.req_num = item.req_id
          item.supplier_price = item.raw_price
          item.supplier_price_unit = item.raw_unit
          item.purchase_unit = item.req_unit
          selectMaterils.push(item)
        }
      }
      console.log('传入的数据', selectMaterils)
      this.$emit('addMaterial', selectMaterils, this.editIndex)
      this.requestModel = false
    },

    /**
     * 编辑采购明细
     */
    editMaterial (scope) {
      const item = scope.row
      this.editIndex = scope.$index
      this.materialList = [
        { sm_code: item.material_code, sm_name: item.material_name }
      ]
      if (item.req_num) {
        // 来自请购单
        item.raw_price = item.supplier_price
        item.raw_unit = item.supplier_price_unit
        item.req_unit = item.purchase_unit
        item.req_id = item.req_num
        this.requestMaterialData = [item]
        this.requestModel = true
        this.pagination.total = 1
      } else {
        this.form = item
        this.title = '编辑物料：' + item.material_code
        this.addMaterialModel = true
      }
    },
    onDelete (scope) {
      this.$emit('onDelete', scope)
    },
    formatter (row, column, cellValue, index) {
      if (column.property === 'supplier_price' && row[column.property]) {
        if (row.supplier_price_unit) {
          return (
            row[column.property] + `(${transKey(row.supplier_price_unit)})`
          )
        } else {
          return row[column.property]
        }
      } else if (column.property === 'hscode.code') {
        return (row.hscode || {}).code
      } else if (column.property === 'price' && row[column.property]) {
        if (this.unit) {
          return row[column.property] + `(${transKey(this.unit)})`
        } else {
          return row[column.property]
        }
      } else {
        return row[column.property]
      }
    },

    expandChange (row, expanded) {
      if (expanded.length) {
        this.expandRows = [row.index]
      } else {
        this.expandRows = []
      }
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getRequestDetail()
    }
  }
}
</script>

<style lang="scss" scoped>
.purchase-order-detail {
  margin: 0 auto;
}
/deep/ .el-dialog__body {
  max-height: 400px;
  overflow: auto;
  .el-input {
    margin-bottom: 0px;
  }
}
.expired-material {
  color: red;
  font-size: 24px;
  float: right;
}
.float-expired {
  position: absolute;
  left: 20px;
  font-size: 40px;
  color: red;
}
</style>
