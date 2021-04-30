<template>
  <div class="order-detail">
    <div>
      <el-button type="primary" class="topbar-btn" @click="addOrEditDetail(0)"
        >添加物料</el-button
      >
    </div>
    <div>
      <Table
        :data="spliceTableData"
        :total="materialDate.length"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      >
        <el-table-column
          sortable="custom"
          v-for="(item, key) in editMaterialTableCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popconfirm title="确定要删除吗?" @onConfirm="onDelete(scope)">
              <span slot="reference" class="table-detail">删除</span>
            </el-popconfirm>
            <el-divider direction="vertical"></el-divider>
            <span class="table-detail" @click="addOrEditDetail(scope)"
              >编辑</span
            >
          </template>
        </el-table-column>
      </Table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="addDetailModel"
    >
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="选择物料" prop="material_code">
            <el-select
              v-model="form['material_code']"
              style="width:100%"
              placeholder="请输入物料编码或物料名称搜索"
              filterable
              remote
              :remote-method="getMaterialList"
              @change="onSelectChange"
            >
              <el-option
                v-for="item in materialList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
                <span class="erp-option-left">{{ item.code }}</span>
                <span class="erp-option-right">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="销售单位">
            <el-input disabled v-model="form['sale_unit']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="默认销售单价">
            <el-input
              style="width:100%"
              type="number"
              disabled
              v-model.number="form['sale_price']"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="计价单位">
            <el-input disabled v-model="form['price_unit']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="基准币种">
            <el-input disabled v-model="form['sale_currency']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="最低折扣">
            <el-input
              type="number"
              disabled
              v-model.number="form['min_discount']"
            >
              <template slot="suffix">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="实际单价" prop="real_price">
            <InputNumber
              placeholder="请输入实际单价"
              v-model="form['real_price']"
              @change="priceChange($event)"
            ></InputNumber>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="实际折扣">
            <InputNumber
              placeholder="请输入实际折扣"
              :max="100"
              v-model="form['real_discount']"
              @change="discountChange"
            >
              <template slot="suffix">%</template>
            </InputNumber>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="数量" prop="count">
            <InputNumber
              style="width:100%"
              :min="0"
              v-model="form['count']"
              placeholder="请输入数量"
            ></InputNumber>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDetailModel = false">取 消</el-button>
        <el-button type="primary" @click="addDetail">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Decimal from 'decimal.js'
import * as _ from 'lodash'

import Table from '@/components/table/Table.vue'
import { editMaterialTableCols, API_MAP } from '../config'
import { transKey } from '@/utils/trans.js'
import InputNumber from '@/components/input-number/InputNumber'

export default {
  props: {
    materialDate: {
      type: Array,
      default: () => []
    },
    basic: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    materialDate: {
      immediate: true,
      handler (v) {
        this.materialDate = v
      }
    },
    basic: {
      immediate: true,
      handler (v) {
        this.basic = v
      }
    }
  },
  components: {
    Table,
    InputNumber
  },
  computed: {
    spliceTableData () {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = this.pagination.currentPage * this.pagination.pageSize
      const cloneData = JSON.parse(JSON.stringify(this.materialDate))
      return cloneData.slice(start, end)
    }
  },
  data () {
    return {
      editMaterialTableCols,
      addDetailModel: false,
      form: { real_price: null },
      materialList: [],
      selectMaterial: {},
      rules: {},
      selectRow: {},
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      startNum: null,
      title: ''
    }
  },
  mounted () {
    this.rules = {
      count: [
        { required: true, message: '请输入数量', trigger: ['blur', 'change'] }
      ],
      material_code: [
        { required: true, message: '请选择物料', trigger: ['blur', 'change'] }
      ],
      real_price: [
        {
          required: true,
          message: '请输入实际单价',
          trigger: ['blur', 'change']
        }
      ]
    }
  },
  methods: {
    addOrEditDetail (scope) {
      if (scope === 0) {
        this.title = '添加物料'
        // 新建
        this.form = {}
        this.selectRow = {}
      } else {
        this.form = scope.row
        this.selectRow = scope
        this.title = '编辑物料：' + this.form.material_code
      }
      this.addDetailModel = true
    },
    /**
     * 获取放行状态的物料列表
     */
    getMaterialList (val) {
      this.materialList = []
      const params = {
        'q[code]': val,
        'q[name]': val,
        op: 1,
        state: 'release'
      }
      this.$http.get(API_MAP.MATERIAL_LIST, { data: params }).then(res => {
        if (res.code === 0) {
          this.materialList = res.data.data || []
        }
      })
    },
    /**
     * 下拉框值改变的回调
     */
    onSelectChange (val) {
      this.selectMaterial =
        this.materialList.filter(o => {
          return o.code === val
        })[0] || {}
      const saleInfo = this.selectMaterial.sales || {}
      this.form.sale_unit = (this.selectMaterial.unit_info || {}).sale
      this.form.price_unit = transKey(saleInfo.sale_unit)
      this.form.min_discount = saleInfo.min_discount
      this.form.sale_currency = transKey(saleInfo.trans_curr)
      this.form.material_name = this.selectMaterial.name
      const levelPrice = saleInfo.level_price || []
      if (this.basic.customer_class === 0 || !this.basic.customer_class) {
        this.form.sale_price = saleInfo.retail_price
      } else {
        this.form.sale_price = levelPrice[this.basic.customer_class - 1]
      }
      this.form.real_price = Number(
        Decimal.mul(this.form.sale_price || 0, this.basic.exchange_rate || 1)
      )
      delete this.form.real_discount
      delete this.form.count
      this.startNum = saleInfo.start_num || null
    },
    /**
     * 折扣改变的回调
     */
    discountChange (val) {
      if (val > 100) {
        this.form.real_discount = null
      }
      const price = Number(
        Decimal.mul(this.form.sale_price || 0, this.basic.exchange_rate || 1)
      )
      if (price) {
        if (val && val >= 0) {
          this.form.real_price = Number(
            Decimal.mul(price, Decimal.div(val, 100))
          )
        } else {
          this.form.real_price = price
        }
      }
      this.form = _.cloneDeep(this.form)
    },
    /**
     * 实际单价改变的回调
     */
    priceChange (val) {
      this.form.real_price = +val
      const price = Number(
        Decimal.mul(this.form.sale_price || 0, this.basic.exchange_rate || 1)
      )
      if (price) {
        let discount = Number(Decimal.div(this.form.real_price, price))
        discount = Number(Decimal.mul(discount, 100).toFixed(6))
        if (discount >= 100) {
          this.form.real_discount = null
        } else {
          this.form.real_discount = discount
        }
      }
      this.$forceUpdate()
    },

    onDelete (scope) {
      this.$emit('onDelete', scope)
    },
    addDetail () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.startNum) {
            if (this.form.count < this.startNum) {
              this.$message.error('销售数量不能低于' + this.startNum)
              return
            }
          }
          if (this.form.min_discount && this.form.real_discount) {
            if (this.form.min_discount > this.form.real_discount) {
              this.$message.error('最低折扣' + this.form.min_discount + '%')
              return
            }
          }

          this.addDetailModel = false
          this.$emit('addDetail', this.form, this.selectRow)
        }
      })
    },
    calcPrice () {},
    deleteMaterial (v) {},
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (row[column.property] === null || row[column.property] === undefined) {
        return
      }
      if (column.property === 'real_discount' && row[column.property]) {
        return row[column.property] + '%'
      } else if (column.property === 'sale_price') {
        return `${row[column.property]}${row.sale_currency || ''}${
          row.price_unit ? '(' + row.price_unit + ')' : ''
        }`
      } else if (
        column.property === 'real_price' ||
        column.property === 'real_total_price'
      ) {
        return `${row[column.property]}${
          this.basic.currency ? transKey(this.basic.currency) : ''
        }${this.basic.unit ? '(' + transKey(this.basic.unit) + ')' : ''}`
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  margin: 0 auto;
}
/deep/ .el-dialog__body {
  height: 400px;
  overflow: auto;
}
</style>
