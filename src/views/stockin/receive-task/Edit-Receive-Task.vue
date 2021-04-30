<template>
  <div class="edit-receive-task-page">
    <Title
      :title="title"
      :back="true"
      @back="onBack"
    ></Title>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <CollapseTitle :title="'基本信息'" />
        </template>
        <div class="base-info">
          <el-form
            :label-position="'right'"
            label-width="120px"
            :model="baseForm"
            ref="baseForm"
          >
            <el-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="12"
              :xl="12"
            >
              <el-form-item
                label="收料单类型"
                prop="class"
                :rules="[
                { required: true, message: '请选择收料单类型',trigger: ['blur','change'] },
                ]"
              >
                <el-select
                  style="width:100%"
                  v-model="baseForm.class"
                  :disabled="title !== '新建收料单'"
                  clearable
                  placeholder="请选择收料单类型"
                >
                  <el-option
                    v-for="(item,key) in receiptTypeList"
                    :key="key"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
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
                label="供应商"
                prop="supplier_name"
                :rules="[
                  { required: true, message: '请选择供应商',trigger: ['blur','change'] },
                ]"
              >
                <el-select
                  clearable
                  v-model="baseForm.supplier_name"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入供应商代码或简称搜索"
                  :remote-method="remoteMethod"
                  style="width:100%"
                  @change="selectSupplier"
                >
                  <el-option
                    v-for="(item,key) in supplierOption"
                    :key="key"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 14px">{{ item.code }}</span>
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
              <el-form-item label="备注">
                <el-input v-model="baseForm.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <CollapseTitle :title="'收料单明细'" />
        </template>
        <div class="recevice-info">
          <div class="btn">
            <el-button
              type="primary"
              @click="addMaterial"
              :disabled="!this.baseForm.supplier_name"
            >添加物料</el-button>
            <el-button
              type="primary"
              @click="addReceive"
              :disabled="!this.baseForm.supplier_name"
            >采购入库</el-button>
          </div>
          <Table
            :data="tableData.slice((this.materialPagination.currentPage - 1) * this.materialPagination.pageSize, this.materialPagination.currentPage * this.materialPagination.pageSize)"
            :total="materialPagination.total"
            :current-page="materialPagination.currentPage"
            :page-size="materialPagination.pageSize"
            @size-change="onMaterialSizeChange"
            @current-change="onMaterialCurrentChange"
          >
            <el-table-column
              v-for="(item,key) in tableCols"
              :key="key"
              :prop="item.prop"
              :label="item.label"
            ></el-table-column>
            <el-table-column :label="'操作'">
              <template slot-scope="scope">
                <span
                  class="table-detail"
                  @click="onEdit(scope.row)"
                >编辑</span>
                <el-divider direction="vertical"></el-divider>
                <el-popconfirm
                  title="确定删除吗?"
                  @onConfirm="onDelete(scope.row)"
                >
                  <span
                    slot="reference"
                    class="table-detail"
                  >删除</span>
                </el-popconfirm>
              </template>
            </el-table-column>
          </Table>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="footer">
      <el-button
        type="primary"
        @click="onSave('draft')"
        :disabled="!baseForm.class || !tableData.length"
        :loading="draftLoading"
      >保存为草稿</el-button>
      <el-button
        type="primary"
        @click="onSave('wait_check')"
        :disabled="!baseForm.class || !tableData.length"
        :loading="saveLoading"
      >提交</el-button>
    </div>
    <!-- 物料弹出框 -->
    <el-dialog
      :title="editTitle"
      :visible.sync="dialogMaterial"
      @close="calenMaterial"
      :close-on-click-modal="false"
    >
      <el-form
        :model="materialForm"
        ref="materialForm"
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
            label="物料编码"
            label-width="120px"
            prop="material_code"
            clearble
            :rules="[
                { required: true, message: '请选择物料编码',trigger: ['blur','change'] },
                ]"
          >
            <el-select
              v-model="materialForm.material_code"
              style="width:100%"
              @change="selectMaterial"
              placeholder="请选择物料编码"
              filterable
              :filter-method="filterMaterial"
              :disabled="isEdit"
            >
              <el-option
                v-for="(item,key) in filterMaterialList"
                :key="key"
                :prop="item.prop"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 14px">{{ item.name }}</span>
              </el-option>
            </el-select>
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
            label-width="120px"
          >
            <el-input
              v-model="materialForm.material_name"
              :disabled="true"
              placeholder="请选择物料名称"
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
            label-width="120px"
          >
            <el-input
              v-model="materialForm.stock_unit"
              :disabled="true"
              placeholder="请选择库存单位"
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
            label="计划收料数量"
            label-width="120px"
            prop="plan_amount"
            :rules="[
                { required: true, message: '请选择计划数量',trigger: ['blur','change'] },
                ]"
          >
            <!-- <el-input
              type="number"
              v-model.number="materialForm.plan_amount"
            ></el-input> -->
            <InputNumber v-model="materialForm.plan_amount" ></InputNumber>
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
            label="计划收料时间"
            label-width="120px"
          >
            <el-date-picker
              v-model="materialForm.plan_date"
              type="datetime"
              placeholder="选择计划收料时间"
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="calenMaterial">取消</el-button>
        <el-button
          type="primary"
          @click="saveMaterial('materialForm')"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 收料明细弹出框 -->
    <el-dialog
      title="收料单明细"
      :visible.sync="dialogDetail"
      @close="canlePurchase"
      :close-on-click-modal="false"
    >
      <el-select
        v-model="purchaseValue"
        placeholder="请选择采购单号"
        @change="selectPurchase"
      >
        <el-option
          v-for="item in purchaseOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <Table
        :data="purchaseTableData.slice((this.purchasePagination.currentPage - 1) * this.purchasePagination.pageSize, this.purchasePagination.currentPage * this.purchasePagination.pageSize)"
        :total="purchasePagination.total"
        :current-page="purchasePagination.currentPage"
        :page-size="purchasePagination.pageSize"
        @size-change="onPurchaseSizeChange"
        @current-change="onPurchaseCurrentChange"
      >
        <el-table-column
          v-for="(item,key) in purchaseTableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :formatter="purchseFormatter"
        ></el-table-column>
        <el-table-column
          :label="'计划收料数量'"
          :width="'150px'"
        >
          <template slot-scope="scope">
            <el-input
              type="number"
              v-model.number="scope.row.amount"
              @change="changePlanamount(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          :label="'计划收料时间'"
          :width="'200px'"
        >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.plan_date"
              type="datetime"
              placeholder="请选择计划收料时间"
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </template>
        </el-table-column>
      </Table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="canlePurchase">取消</el-button>
        <el-button
          type="primary"
          :disabled="!purchaseTableData.length"
          @click="savePurchase"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import Title from '@/components/title/Title'
import CollapseTitle from '@/components/collapse-title/CollapseTitle'
import Table from '@/components/table/Table'
import { TableCols, ReceiptType, PurchaseTableCols } from './config/edit-receive-task.config'
import { formatTime, transKey } from '@/utils/trans'
import decimal from 'decimal.js'
import InputNumber from '@/components/input-number/InputNumber'
export default {
  components: {
    Title,
    CollapseTitle,
    Table,
    InputNumber
  },
  data () {
    return {
      title: '新建收料单',
      activeNames: ['1', '2'],
      baseForm: {
        calss: null,
        remark: null,
        supplier_name: null,
        supplier_code: null,
        supplier_id: null
      },
      tableCols: TableCols,
      tableData: [],
      dialogMaterial: false,
      dialogDetail: false,
      materialForm: {
        material_name: null,
        material_code: null,
        stock_unit: null,
        plan_amount: null,
        plan_date: null,
        purchase_detail_id: null
      },
      purchaseTableCols: PurchaseTableCols,
      purchaseTableData: [],
      receiptTypeList: ReceiptType,
      purchaseValue: null,
      purchaseOption: [],
      supplierOption: [],
      materialList: [],
      filterMaterialList: [],
      allmaterial: [],
      formattime: formatTime,
      allPurchase: [],
      transkey: transKey,
      materialPagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      purchasePagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        stateLog: null
      },
      draftLoading: false,
      saveLoading: false,
      editTitle: null,
      isEdit: false
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.title = this.$route.query.id
      this.getDetailById(this.title)
    }
  },
  methods: {
    // 通过收料id获取收料详情
    getDetailById (id) {
      this.$http.get(`/business/stockin/receipt/self/${id}`).then(res => {
        this.tableData = res.data.details
        res.data.details.forEach(el => {
          el.plan_date = this.formattime(el.plan_date)
        })
        this.baseForm = {
          class: res.data.class,
          remark: res.data.remark,
          supplier_name: res.data.supplier_name,
          supplier_code: res.data.supplier_code,
          supplier_id: res.data.supplier_id
        }
        this.stateLog = res.data.state_log ? res.data.state_log : []
      })
    },
    onBack () {
      this.$router.go(-1)
    },
    addMaterial () {
      // 通过供应商id 获取该供应商下的物料
      const params = {
        state: 'release'
      }
      this.$http.get(`/base/supplier/materials/${Number(this.baseForm.supplier_id)}`, { data: params }).then(res => {
        this.materialList = []
        this.allmaterial = res.data.data
        res.data.data.forEach(el => {
          this.materialList.push({
            label: el.sm_code,
            value: el.sm_code,
            name: el.sm_name
          })
        })
        this.filterMaterialList = this.materialList
      })
      this.dialogMaterial = true
      this.editTitle = '添加物料'
      this.isEdit = false
    },
    addReceive () {
      this.$http.get(`/business/stockin/filter/receipt/${Number(this.baseForm.supplier_id)}`).then(res => {
        this.dialogDetail = true
        this.purchaseOption = []
        res.data.data.forEach(el => {
          this.purchaseOption.push({
            label: el.id,
            value: el.id
          })
        })
      })
    },
    onSave (state) {
      if (state === 'draft') {
        this.draftLoading = true
      } else {
        this.saveLoading = true
      }
      const details = []
      this.tableData.forEach(el => {
        const detaillInfo = {
          material_code: el.material_code,
          material_name: el.material_name,
          stock_unit: el.stock_unit,
          plan_amount: el.plan_amount,
          plan_date: el.plan_date ? moment(el.plan_date).format('YYYY-MM-DDTHH:mm:ssZ') : null,
          purchase_detail_id: el.purchase_detail_id ? el.purchase_detail_id : null,
          state: state,
          purchase_num: el.purchase_num ? el.purchase_num : null
        }
        if (this.title !== '新建收料单') {
          detaillInfo.receipt_id = this.title
        }
        details.push(detaillInfo)
      })
      const data = {
        class: this.baseForm.class,
        create_at: new Date(),
        details: details,
        remark: this.baseForm.remark,
        state: state,
        supplier_code: this.baseForm.supplier_code,
        supplier_name: this.baseForm.supplier_name,
        supplier_id: this.baseForm.supplier_id
      }
      // 如果title!= '新建收料单' 代表是编辑
      let logType = 'new'
      if (this.title !== '新建收料单') {
        data.id = this.title
        logType = 'edit'
        this.$http.put(`/business/stockin/receipt?logtype=${logType}`, { data: data }).then(res => {
          this.$message.success('操作成功')
          if (state === 'draft') {
            this.draftLoading = false
            this.getDetailById(this.title)
          } else {
            this.draftLoading = false
            this.$router.go(-1)
          }
        }, err => {
          console.log(err)
          if (state === 'draft') {
            this.draftLoading = false
          } else {
            this.draftLoading = false
          }
        })
      } else {
        this.$http.post(`/business/stockin/receipt?logtype=${logType}`, { data: data }).then(res => {
          this.$message.success('操作成功')
          if (state === 'draft') {
            this.draftLoading = false
            this.getDetailById(res.data)
            this.title = res.data
          } else {
            this.draftLoading = false
            this.$router.go(-1)
          }
        }, err => {
          console.log(err)
          if (state === 'draft') {
            this.draftLoading = false
          } else {
            this.draftLoading = false
          }
        })
      }
    },
    remoteMethod (query) {
      if (query) {
        const data = {
          'q[name]': query,
          'q[code]': query,
          op: 1
        }
        this.$http.get('/base/supplier/list', { data: data }).then(res => {
          this.supplierOption = []
          res.data.data.forEach(element => {
            this.supplierOption.push({
              label: element.name,
              value: element.name,
              code: element.code,
              id: element.id
            })
          })
        })
      } else {
        this.supplierOption = []
      }
    },
    selectMaterial (value) {
      this.allmaterial.forEach(el => {
        if (el.sm_code === value) {
          this.materialForm.material_name = el.sm_name
          this.materialForm.stock_unit = el.unit_info.stock
        }
      })
      this.filterMaterialList = this.materialList
    },
    /**
     * 物料进行搜索
     */
    filterMaterial (value) {
      const arr = this.materialList.filter((item, index) => {
        return item.label.includes(value) || item.name.includes(value)
      })
      this.filterMaterialList = arr
    },
    // 添加物料弹出框的确定按钮
    saveMaterial (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.materialForm.plan_amount <= 0) {
            this.$message.error('计划收料数量必须大于0')
            return
          }
          if (this.materialList.length) {
            // 新建
            let flag = false
            this.tableData.forEach(el => {
              if (el.material_code === this.materialForm.material_code && el.purchase_detail_id === this.materialForm.purchase_detail_id) {
                flag = true
                this.$message.warning('不能重复添加物料')
              }
            })
            if (!flag) {
              this.tableData.push({
                material_code: this.materialForm.material_code,
                material_name: this.materialForm.material_name,
                stock_unit: this.materialForm.stock_unit,
                plan_amount: this.materialForm.plan_amount,
                plan_date: this.materialForm.plan_date ? this.materialForm.plan_date : null,
                purchase_num: null,
                purchase_detail_id: null
              })
            }
          } else {
            // 编辑
            this.tableData.forEach(el => {
              if (el.material_code === this.materialForm.material_code && el.purchase_detail_id === this.materialForm.purchase_detail_id) {
                el.plan_amount = this.materialForm.plan_amount
                el.plan_date = this.materialForm.plan_date ? this.materialForm.plan_date : null
              }
            })
          }
          this.materialPagination.total = this.tableData.length
          this.calenMaterial()
        }
      })
    },
    // 添加物料弹出框取消按钮
    calenMaterial () {
      this.dialogMaterial = false
      this.materialForm = {
        material_code: null,
        material_name: null,
        stock_unit: null,
        plan_amount: null,
        plan_date: null,
        purchase_detail_id: null
      }
      this.materialList = []
      this.allmaterial = []
    },
    // 物料表格里面的编辑按钮
    onEdit (row) {
      this.materialForm = {
        material_code: row.material_code,
        material_name: row.material_name,
        stock_unit: row.stock_unit,
        plan_amount: row.plan_amount,
        plan_date: row.plan_date,
        purchase_detail_id: row.purchase_detail_id
      }
      this.dialogMaterial = true
      this.editTitle = `编辑物料:${row.material_code}`
      this.isEdit = true
    },
    // 物料明细表格的删除按钮
    onDelete (row) {
      this.tableData.forEach((el, index) => {
        if (row.material_code === el.material_code && row.purchase_detail_id === el.purchase_detail_id) {
          this.tableData.splice(index, 1)
        }
      })
    },
    //  选择供应商事件
    selectSupplier (value) {
      this.supplierOption.forEach(el => {
        if (el.value === value) {
          this.baseForm.supplier_code = el.code
          this.baseForm.supplier_id = el.id
        }
      })
      this.tableData = []
    },
    // 选择采购单号事件
    selectPurchase (value) {
      this.$http.get(`/business/purchase/main/${value}`).then(res => {
        this.purchaseTableData = []
        res.data.details.forEach(el => {
          this.purchaseTableData.push({
            purchase_num: el.purchase_num,
            material_code: el.material_code,
            material_name: el.material_name,
            purchase_unit: el.purchase_unit,
            purchase_amount: el.purchase_amount,
            purchased_amount: el.purchased_amount,
            state: el.state,
            purchase_detail_id: el.id,
            unit_info: el.unit_info,
            basic_unit: el.basic_unit
          })
        })
        this.purchasePagination.total = this.purchaseTableData.length
      })
    },
    // 采购单表格格式
    purchseFormatter (row, column) {
      if (column.property === 'state') {
        if (row[column.property]) {
          return this.transkey(row[column.property])
        } else {
          return row[column.property]
        }
      } else {
        return row[column.property]
      }
    },
    // 收料单明细确定按钮
    savePurchase () {
      if (this.tableData.length) {
        for (let k = 0; k < this.purchaseTableData.length; k++) {
          const el = this.purchaseTableData[k]
          for (let i = 0; i < this.tableData.length; i++) {
            const item = this.tableData[i]
            if (el.plan_amount > 0) {
              if (el.material_code === item.material_code && el.purchase_detail_id === item.purchase_detail_id) {
                this.$message.warning('不能重复添加物料')
                break
              } else {
                if (i === this.tableData.length - 1) {
                  this.tableData.push({
                    material_code: el.material_code,
                    material_name: el.material_name,
                    stock_unit: el.unit_info.stock,
                    plan_amount: el.plan_amount,
                    plan_date: el.plan_date ? el.plan_date : null,
                    purchase_detail_id: el.purchase_detail_id,
                    purchase_num: el.purchase_num
                  })
                  break
                }
              }
            }
          }
        }
      } else {
        this.purchaseTableData.forEach(el => {
          if (el.plan_amount > 0) {
            this.tableData.push({
              material_code: el.material_code,
              material_name: el.material_name,
              stock_unit: el.unit_info.stock,
              plan_amount: el.plan_amount,
              plan_date: el.plan_date ? el.plan_date : null,
              purchase_detail_id: el.purchase_detail_id,
              purchase_num: el.purchase_num
            })
          }
        })
      }
      this.canlePurchase()
    },
    onMaterialSizeChange (page) {
      this.materialPagination.pageSize = page
    },
    onMaterialCurrentChange (page) {
      this.materialPagination.currentPage = page
    },
    onPurchaseSizeChange (page) {
      this.purchasePagination.pageSize = page
    },
    onPurchaseCurrentChange (page) {
      this.purchasePagination.currentPage = page
    },
    // 收料单明细返回按钮
    canlePurchase () {
      this.purchaseTableData = []
      this.purchaseValue = null
      this.dialogDetail = false
    },
    changePlanamount (row) {
      const purchaseAmount = Number(decimal.mul(row.unit_info.purchase_ratio, row.amount))
      row.plan_amount = Number(Number(decimal.div(purchaseAmount, row.unit_info.stock_ratio)).toFixed(2))
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-receive-task-page {
  .base-info,
  .recevice-info {
    .btn {
      margin-bottom: $padding-md;
    }
  }
  .footer {
    margin-top: $padding-md;
    text-align: center;
  }
}
</style>
