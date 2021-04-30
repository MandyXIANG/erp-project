<template>
  <div class="order-info">
    <el-form
      :validate-on-rule-change="false"
      ref="form"
      :model="form"
      label-width="120px"
      :rules="rules"
    >
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="客户" prop="customer">
          <el-select
            v-model="form['customer']"
            style="width:100%"
            placeholder="请输入客户代码或简称搜索"
            filterable
            remote
            :remote-method="getCustomerList"
            :loading="serachLoading"
            @change="onSelectChange"
          >
            <el-option
              v-for="item in customerList"
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
        <el-form-item label="客户经手人">
          <el-select
            v-model="form['agent']"
            style="width:100%"
            placeholder="请选择客户经手人"
          >
            <el-option
              v-for="item in contacts"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="客户订单号">
          <el-input
            v-model="form['customer_order_no']"
            placeholder="请输入客户订单号"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="交易币种">
          <el-select
            v-model="form['currency']"
            style="width:100%"
            placeholder=""
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
        <el-form-item label="基准币种">
          <el-select
            v-model="form['base_currency']"
            style="width:100%"
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
        <el-form-item label="计价单位" prop="unit">
          <el-select v-model="form['unit']" style="width:100%" disabled>
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
        <el-form-item label="汇率" prop="exchange_rate">
          <InputNumber
            v-model="form['exchange_rate']"
            placeholder="请输入汇率"
            @change="rateChange"
            @blur="onBlur"
          >
            <template slot="suffix">1基准币种=N交易币种</template>
          </InputNumber>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="折扣">
          <InputNumber
            v-model="form['discount']"
            :min="0"
            :max="100"
            @change="discountChange"
            placeholder="请输入折扣"
          >
            <template slot="suffix">%</template>
          </InputNumber>
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
        <el-form-item label="是否开票">
          <el-checkbox v-model="form['ticket']"></el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="实际总价">
          <el-input v-model="real" disabled placeholder="请选择"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item label="销售人员" prop="sales_man">
          <el-select
            style="width:100%"
            v-model="form['sales_man']"
            placeholder="请选择销售人员"
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
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form['remark']"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-dialog
      :title="title"
      :visible.sync="payDialog"
      :close-on-click-modal="false"
      @opened="dialogOpen"
    >
      <payForm
        ref="child"
        :contentCenter="true"
        :hideTitle="true"
        :payMethod="payConfig"
        :hideAlert="true"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="payDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleOK">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as _ from 'lodash'

import InputNumber from '@/components/input-number/InputNumber'
import {
  payMethods,
  arrivalConf,
  stageConf,
  prepaidConf,
  cycleConf,
  API_MAP,
  remit
} from '../config'
import payForm from '../../../supplier/PayMethod'
import { currOPtions, priceUnit } from '@/utils/options'
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    real: {
      // 折后总价
      type: Number,
      default: 0
    },
    origin: {
      // 原总价
      type: Number,
      default: 0
    }
  },
  components: {
    payForm,
    InputNumber
  },
  data () {
    return {
      rules: {},
      options: [{ label: '1', value: '1' }],
      payMethods,
      priceUnit,
      remit,
      payConfig: {},
      payDialog: false,
      title: '',
      customerList: [],
      serachLoading: false,
      contacts: [],
      selectCustomer: {},
      settles: {},
      users: [],
      currencys: currOPtions
    }
  },
  watch: {
    form: {
      immediate: true,
      handler (v) {
        this.form = v
        this.initForm()
      }
    },
    real: {
      immediate: true,
      handler (v) {
        this.real = v
      }
    },
    origin: {
      immediate: true,
      handler (v) {
        this.origin = v
      }
    }
  },
  created () {
    this.getSettlesConf()
  },
  mounted () {
    this.rules = {
      sales_man: [
        {
          required: true,
          message: '请选择销售人员',
          trigger: ['blur', 'change']
        }
      ],
      customer: [
        { required: true, message: '请选择客户', trigger: ['blur', 'change'] }
      ],
      settles_name: [
        {
          required: true,
          message: '请选择结算方式',
          trigger: ['blur', 'change']
        }
      ],
      unit: [
        {
          required: true,
          message: '请选择计价单位',
          trigger: ['blur', 'change']
        }
      ],
      exchange_rate: [
        {
          required: true,
          message: '请输入汇率',
          trigger: ['blur', 'change']
        }
      ],
      pay_method: [
        {
          required: true,
          message: '请选择汇款方式',
          trigger: ['blur', 'change']
        }
      ]
    }
    this.initForm()
  },
  methods: {
    initForm () {
      if (this.form.customer) {
        this.customerList = [
          {
            id: this.form.customer,
            name: this.form.customer_name,
            code: this.form.customer_code
          }
        ]
        this.getContactByCustomer(this.form.customer)
      }
    },
    // 编辑结算方式
    editPayMethods () {
      const pay = this.form.settles_name
      const editSettels = this.form.settles || {}
      if (!pay) return
      if (pay === 'arrival') {
        this.title = '货到付款'
        if (editSettels.arrival) {
          this.payConfig = { arrival: editSettels.arrival }
        } else {
          this.payConfig = this.settles.arrival
            ? this.settles.arrival
            : arrivalConf
        }
      } else if (pay === 'stage') {
        this.title = '分期付款'
        if (editSettels.stage) {
          this.payConfig = { stage: editSettels.stage }
        } else {
          this.payConfig = this.settles.stage ? this.settles.stage : stageConf
        }
      } else if (pay === 'prepaid') {
        this.title = '预付款'
        if (editSettels.prepaid) {
          this.payConfig = { prepaid: editSettels.prepaid }
        } else {
          this.payConfig = this.settles.prepaid
            ? this.settles.prepaid
            : prepaidConf
        }
      } else if (pay === 'cycle') {
        this.title = '周期结算'
        if (editSettels.cycle) {
          this.payConfig = { cycle: editSettels.cycle }
        } else {
          this.payConfig = this.settles.cycle ? this.settles.cycle : cycleConf
        }
      } else {
        this.title = ''
      }
      this.payDialog = true
    },
    dialogOpen () {
      this.$refs.child.paymentChange(null, this.payConfig)
    },
    /**
     * 获取客户列表
     */
    getCustomerList (val) {
      const params = {
        'q[name]': val,
        'q[code]': val,
        op: 1
      }
      this.serachLoading = true
      this.$http.get(API_MAP.CUSTOMER_LIST, { data: params }).then(res => {
        this.serachLoading = false
        if (res.code === 0) {
          this.customerList = res.data.data || []
        }
      })
    },
    onSettlesChange (val) {
      const cloneForm = _.cloneDeep(this.form)
      const cloneSettels = _.cloneDeep(this.settles)
      for (const key in this.settles) {
        if (key !== val) {
          cloneSettels[key] = null
        }
      }
      cloneForm.settles = cloneSettels
      cloneForm.settles_name = val
      this.$emit('formChange', cloneForm)
    },
    /**
     * 客户下拉框选中值改变的回调
     */
    onSelectChange (val) {
      this.selectCustomer =
        this.customerList.filter(o => {
          return o.id === val
        })[0] || {}
      const cloneForm = _.cloneDeep(this.form)
      cloneForm.currency = this.selectCustomer.trans_curr
      cloneForm.customer_code = this.selectCustomer.code
      cloneForm.customer_name = this.selectCustomer.name
      cloneForm.customer_fullname = this.selectCustomer.fullname
      cloneForm.customer_class = this.selectCustomer.class
      if (val) {
        this.getContactByCustomer(val).then(res => {
          cloneForm.agent = (this.contacts[0] || {}).id
          this.$emit('formChange', cloneForm)
        })
      }
    },
    /**
     * 获取客户经手人
     */
    getContactByCustomer (id) {
      this.contacts = []
      return new Promise((resolve, reject) => {
        this.$http
          .get(API_MAP.CUSTOMER_CONTACT + `/${id}`)
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
     * 获取结算方式配置
     */
    getSettlesConf () {
      this.$http.get(API_MAP.SYS_CONF).then(res => {
        if (res.code === 0 && res.data && Object.keys(res.data).length) {
          this.settles = res.data.settles || {}
          const cloneForm = this.form
          cloneForm.unit = cloneForm.unit || (res.data.price_unit || {}).unit
          cloneForm.base_currency =
            cloneForm.base_currency ||
            (res.data.price_unit || {}).base_currency
          this.$emit('formChange', cloneForm)
        }
      })
    },
    /**
     * 编辑结算方式确认按钮
     */
    handleOK () {
      if (this.$refs.child.validateForm()) {
        this.$refs.child.err = true
        return
      } else {
        this.$refs.child.err = false
      }
      const cloneForm = _.cloneDeep(this.form)
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
      cloneForm.sales_man = val
      this.$emit('formChange', cloneForm)
    },
    discountChange (val) {
      this.$emit('discountChange', val)
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
    },
    /**
     * 汇率改变的回调
     */
    rateChange (val) {
      const cloneForm = this.form
      // val = Number(val)
      cloneForm.exchange_rate = val
      this.$emit('formChange', cloneForm)
      this.$emit('rateChange', val)
    },
    onBlur (e) {
      // let val = Number(e.target.value)
      let val = e
      if (val <= 0) {
        val = 1
        const cloneForm = this.form
        cloneForm.exchange_rate = val
        this.$emit('formChange', cloneForm)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order-info {
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
