<template>
  <div class="purchase-order-info">
    <el-form
      :validate-on-rule-change="false"
      ref="form"
      :model="form"
      label-width="120px"
      :rules="rules"
    >
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="供应商" prop="supplier_id">
          <el-select
            v-model="form['supplier_id']"
            style="width:100%"
            placeholder="请输入供应商代码或简称搜索"
            filterable
            remote
            :remote-method="getSupplierList"
            @change="onSelectChange"
          >
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span class="erp-option-left">{{ item.code }}</span>
              <span class="erp-option-right">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="供应商经手人">
          <el-select
            v-model="form['supplier_agent']"
            style="width:100%"
            placeholder="请选择供应商经手人"
            @focus="onSelectFocus"
          >
            <el-option
              v-for="item in contacts"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="交易币种">
          <el-select
            v-model="form['currency']"
            style="width:100%"
            placeholder="请选择交易币种"
            disabled
          >
            <el-option
              v-for="item in currencys"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="计价单位" prop="price_unit">
          <el-select
            v-model="form['price_unit']"
            style="width:100%"
            placeholder="请选择计价单位"
          >
            <el-option
              v-for="item in priceUnit"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="是否开票">
          <el-checkbox v-model="form['ticket']"></el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="优先级">
          <el-select
            v-model="form['priority']"
            style="width:100%"
            placeholder="请选择优先级"
          >
            <el-option
              v-for="item in priority"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="汇款方式" prop="pay_method">
          <el-select
            v-model="form['pay_method']"
            style="width:100%"
            placeholder="请选择汇款方式"
          >
            <el-option
              v-for="item in remit"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="结算方式" prop="settles_name">
          <el-select
            v-model="form['settles_name']"
            style="width:90%"
            placeholder="请选择结算方式"
            @change="onSettlesChange"
            @focus="onSelectFocus"
          >
            <el-option
              v-for="item in payMethods"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <i
            class="el-icon-edit"
            title="修改结算方式"
            @click="editPayMethods"
          ></i>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="订单总价" prop="total_price">
          <el-input disabled v-model="form['total_price']"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="计划交货时间" prop="plan_date">
          <el-date-picker
            style="width:100%"
            v-model="form.plan_date"
            type="datetime"
            placeholder="选择计划交货时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="onDateChange"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="采购人员" prop="purchase_man">
          <el-select
            style="width:100%"
            v-model="form['purchase_man']"
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
              <span class="erp-option-right">{{ item.fullname }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            placeholder="请输入备注"
            :rows="3"
            v-model="form['remark']"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <!-- 结算方式弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="payDialog"
    >
      <payForm :hideTitle="true" :payMethod="payConfig" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="payDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleOK">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as _ from 'lodash'

import payForm from '../../../supplier/PayMethod'

import {
  arrivalConf,
  stageConf,
  prepaidConf,
  cycleConf,
  API_MAP
} from './config'
export default {
  components: {
    payForm
  },
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    form: {
      immediate: true,
      handler (v) {
        this.form = v
        this.initForm()
      }
    }
  },
  data () {
    return {
      arrivalConf,
      stageConf,
      prepaidConf,
      cycleConf,
      supplierList: [],
      priceUnit: [
        { label: '元', value: 'yuan' },
        { label: '万元', value: 'wanyuan' }
      ],
      currencys: [
        { label: '人民币', value: 'cny' },
        { label: '欧元', value: 'eur' },
        { label: '美元', value: 'usd' }
      ],
      remit: [
        { label: '电汇', value: 'telegraphic' },
        { label: '承兑', value: 'acceptance' }
      ],
      payMethods: [],
      priority: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' }
      ],
      payDialog: false,
      payConfig: {},
      title: '',
      selectSupplier: {},
      contacts: [],
      settles: {},
      users: [],
      rules: {},
      supplierSettels: {}
    }
  },
  created () {},
  mounted () {
    this.rules = {
      supplier_id: [
        { required: true, message: '请选择供应商', trigger: ['blur', 'change'] }
      ],
      price_unit: [
        {
          required: true,
          message: '请选择计价单位',
          trigger: ['blur', 'change']
        }
      ],
      pay_method: [
        {
          required: true,
          message: '请选择汇款方式',
          trigger: ['blur', 'change']
        }
      ],
      settles_name: [
        {
          required: true,
          message: '请选择结算方式',
          trigger: ['blur', 'change']
        }
      ],
      purchase_man: [
        {
          required: true,
          message: '请选择采购人员',
          trigger: ['blur', 'change']
        }
      ]
    }
    this.initForm()
  },

  methods: {
    initForm () {
      if (this.form.supplier_id) {
        this.payMethods = [
          { label: '货到付款', value: 'arrival' },
          { label: '分期付款', value: 'stage' },
          { label: '预付款', value: 'prepaid' },
          { label: '周期结算', value: 'cycle' }
        ]
        this.supplierList = [
          {
            id: this.form.supplier_id,
            name: this.form.supplier_name,
            code: this.form.supplier_code
          }
        ]
        this.getContactBySupplier(this.form.supplier_id)
        this.getSupplierInfo(this.form.supplier_id)
      }
    },
    getSupplierInfo (id) {
      this.$http.get(API_MAP.BASE_SUPPLIER + `/${id}`).then(res => {
        this.supplierSettels = res.data.settles
      })
    },
    editPayMethods () {
      const pay = this.form.settles_name
      const editSettels = this.form.settles || {}
      if (!pay) return
      if (pay === 'arrival') {
        this.title = '货到付款'
        if (editSettels.arrival) {
          this.payConfig = { arrival: editSettels.arrival }
        } else {
          this.payConfig = this.supplierSettels.arrival
            ? this.supplierSettels.arrival
            : this.arrivalConf
        }
      } else if (pay === 'stage') {
        this.title = '分期付款'
        if (editSettels.stage) {
          this.payConfig = { stage: editSettels.stage }
        } else {
          this.payConfig = this.supplierSettels.stage
            ? this.supplierSettels.stage
            : this.stageConf
        }
      } else if (pay === 'prepaid') {
        this.title = '预付款'
        if (editSettels.prepaid) {
          this.payConfig = { prepaid: editSettels.prepaid }
        } else {
          this.payConfig = this.supplierSettels.prepaid
            ? this.supplierSettels.prepaid
            : this.prepaidConf
        }
      } else if (pay === 'cycle') {
        this.title = '周期结算'
        if (editSettels.cycle) {
          this.payConfig = { cycle: editSettels.cycle }
        } else {
          this.payConfig = this.supplierSettels.cycle
            ? this.supplierSettels.cycle
            : this.cycleConf
        }
      } else {
        this.title = ''
      }
      this.payDialog = true
    },
    getSupplierList (val) {
      const params = {
        'q[name]': val,
        'q[code]': val,
        op: 1
      }
      this.serachLoading = true
      this.$http.get(API_MAP.SUPPLIER_LIST, { data: params }).then(res => {
        if (res.code === 0) {
          this.supplierList = res.data.data || []
        }
      })
    },
    onSelectChange (val) {
      this.selectSupplier =
        this.supplierList.filter(o => {
          return o.id === val
        })[0] || {}
      if (val) {
        this.getContactBySupplier(val).then(res => {
          this.payMethods = [
            { label: '货到付款', value: 'arrival' },
            { label: '分期付款', value: 'stage' },
            { label: '预付款', value: 'prepaid' },
            { label: '周期结算', value: 'cycle' }
          ]
          const cloneForm = _.cloneDeep(this.form)
          cloneForm.currency = this.selectSupplier.trans_curr
          cloneForm.supplier_code = this.selectSupplier.code
          cloneForm.supplier_name = this.selectSupplier.name
          this.settles = this.selectSupplier.settles
          this.supplierSettels = this.selectSupplier.settles
          cloneForm.supplier_agent = (this.contacts[0] || {}).name
          cloneForm.total_price = null
          this.$emit('formChange', cloneForm, 1)
        })
      }
    },
    getContactBySupplier (id) {
      this.contacts = []
      return new Promise((resolve, reject) => {
        this.$http
          .get(API_MAP.SUPPLIER_CONTACTS + `/${id}`)
          .then(res => {
            if (res.code === 0) {
              this.contacts = res.data.data || []
            }
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    /**
     * 结算方式改变的回调
     */
    onSettlesChange (val) {
      const cloneForm = _.cloneDeep(this.form)
      const cloneSettels = _.cloneDeep(this.supplierSettels)
      for (const key in this.supplierSettels) {
        if (key !== val) {
          cloneSettels[key] = null
        }
      }
      cloneForm.settles = cloneSettels
      cloneForm.settles_name = val
      this.$emit('formChange', cloneForm)
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
      const cloneForm = this.form
      cloneForm.purchase_man = val
      this.$emit('formChange', cloneForm)
    },
    onDateChange (val) {
      const cloneForm = this.form
      cloneForm.plan_date = val
      this.$emit('formChange', cloneForm)
    },
    onSelectFocus (val) {
      if (!this.form.supplier_id) {
        this.payMethods = []
        this.contacts = []
        this.$message.warning('请先选择供应商')
      }
    },
    /**
     * 编辑结算方式确认按钮
     */
    handleOK () {
      const cloneForm = _.cloneDeep(this.form)
      // cloneForm.settles = this.payConfig

      for (const key in this.payConfig) {
        for (const key2 in cloneForm.settles) {
          if (key === key2) {
            cloneForm.settles[key2] = this.payConfig[key]
          } else {
            cloneForm.settles[key2] = null
          }
        }
      }
      this.payDialog = false
      this.$emit('formChange', cloneForm)
    },
    /**
     * 表单验证
     */
    validateForm () {
      let res
      this.$refs.form.validate(valid => {
        res = valid
      })
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.purchase-order-info {
  margin: 0 auto;
  .el-icon-edit {
    font-size: 20px;
    margin-left: $padding-xs;
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
  }
}
/deep/ .el-dialog__body {
  max-height: 400px;
  overflow: auto;
  .pay-form {
    width: 100%;
  }
}
</style>
