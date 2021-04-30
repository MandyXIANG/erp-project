<template>
  <div class="pay-form">
    <div class="pay-method" v-if="payMethod.arrival">
      <div class="title" v-if="payMethod.arrival.name && !hideTitle">
        <span class="title-icon"></span>
        <span class="title-text">货到付款</span>
      </div>
      <div class="content">
        <div
          class="pay-item-area"
          :style="{ margin: contentCenter ? '0 auto' : '' }"
        >
          <div class="pay-item">
            <div
              class="pay-label"
              :style="{ width: labelWidth ? labelWidth + 'px' : '' }"
            >
              付款上限天数
            </div>
            <div class="pay-value">
              <el-input-number
                :controls="false"
                v-model="payMethod.arrival.max_day"
                :min="0"
                placeholder="请输入付款上限天数"
              ></el-input-number>
            </div>
          </div>
          <div class="pay-item">
            <div
              class="pay-label"
              :style="{ width: labelWidth ? labelWidth + 'px' : '' }"
            >
              开始计算日期
            </div>
            <div class="pay-value">
              <el-radio-group v-model="payMethod.arrival.start_time">
                <el-radio label="签收日期">签收日期</el-radio>
                <el-radio label="发货日期">发货日期</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pay-method" v-if="payMethod.stage">
      <div class="title" v-if="payMethod.stage.name && !hideTitle">
        <span class="title-icon"></span>
        <span class="title-text">分期付款</span>
      </div>
      <div class="content">
        <div
          class="pay-item-area"
          :style="{ margin: contentCenter ? '0 auto' : '' }"
          v-for="(item, index) in payMethod.stage.stage_conf"
          :key="index"
        >
          <div class="pay-item">
            <div
              class="pay-label"
              :style="{ width: labelWidth ? labelWidth + 'px' : '' }"
            >
              付款比例
            </div>
            <div class="pay-value custome-suffix">
              <el-input-number
                v-model="item.ratio"
                :controls="false"
                placeholder="请输入付款比例"
                :min="0"
                @change="validateForm"
              >
                <template slot="suffix">%</template>
              </el-input-number>
            </div>
          </div>
          <div class="pay-item">
            <div
              class="pay-label"
              :style="{ width: labelWidth ? labelWidth + 'px' : '' }"
            >
              付款时机
            </div>
            <div class="pay-value">
              <el-select
                v-model="item.time"
                @change="paymentChange"
                placeholder="请选择付款时机"
              >
                <el-option
                  v-for="item in payment"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                  :disabled="findItem(item.value)"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <i
            class="el-icon-remove-outline opreation-icon"
            title="删除"
            @click="deleteItem(payMethod.stage.stage_conf, index)"
            :class="{
              'icon-ban': index === 0 && payMethod.stage.stage_conf.length === 1
            }"
          />
          <i
            title="添加"
            class="el-icon-circle-plus-outline opreation-icon"
            @click="addStage(payMethod.stage.stage_conf)"
          />
        </div>
      </div>
      <div class="err-msg">
        <span v-if="err">分期付款付款比例相加必须等于100%</span>
      </div>
    </div>
    <div class="pay-method" v-if="payMethod.prepaid">
      <div class="title" v-if="payMethod.prepaid.name && !hideTitle">
        <span class="title-icon"></span>
        <span class="title-text">预付款</span>
      </div>
      <div class="content">
        <div
          class="pay-item-area"
          :style="{ margin: contentCenter ? '0 auto' : '' }"
        >
          <div class="pay-item">
            <div
              class="pay-label"
              :style="{ width: labelWidth ? labelWidth + 'px' : '' }"
            >
              付款后发货周期
            </div>
            <div class="pay-value">
              <el-input-number
                :min="0"
                v-model="payMethod.prepaid.delivery"
                placeholder="请输入付款后发货周期"
                :controls="false"
              ></el-input-number>
            </div>
          </div>
          <div class="pay-item">
            <div
              class="pay-label"
              :style="{ width: labelWidth ? labelWidth + 'px' : '' }"
            >
              周期单位
            </div>
            <div class="pay-value">
              <el-select
                class="unit"
                v-model="payMethod.prepaid.unit"
                placeholder="请选择周期单位"
              >
                <el-option
                  v-for="item in deliveryCycle"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pay-method" v-if="payMethod.cycle">
      <div class="title" v-if="payMethod.cycle.name && !hideTitle">
        <span class="title-icon"></span>
        <span class="title-text">周期结算</span>
      </div>
      <div class="content">
        <div
          class="pay-item-area"
          :style="{ margin: contentCenter ? '0 auto' : '' }"
          v-if="!hideAlert"
        >
          <div class="pay-item">
            <div
              class="pay-label"
              :style="{ width: labelWidth ? labelWidth + 'px' : '' }"
            >
              付款提醒
            </div>
            <div class="pay-value">
              <el-radio v-model="payMethod.cycle.alert" :label="true"
                >是</el-radio
              >
              <el-radio v-model="payMethod.cycle.alert" :label="false"
                >否</el-radio
              >
            </div>
          </div>
          <div class="pay-item">
            <div
              class="pay-label"
              :style="{ width: labelWidth ? labelWidth + 'px' : '' }"
            >
              起始日期
            </div>
            <div class="pay-value">
              <el-date-picker
                value-format="yyyy-MM-dd"
                style="width:100%;margin-left:7px"
                v-model="payMethod.cycle.start_time"
                type="date"
                placeholder="请选择起始日期"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="pay-item">
            <div
              class="pay-label"
              :style="{ width: labelWidth ? labelWidth + 'px' : '' }"
            >
              提前天数
            </div>
            <div class="pay-value">
              <el-input-number
                v-model="payMethod.cycle.advance_day"
                placeholder="请输入提前天数"
                :min="0"
                :controls="false"
              />
            </div>
          </div>
        </div>
        <div
          class="pay-item-area"
          :style="{ margin: contentCenter ? '0 auto' : '' }"
          v-for="(item, index) in payMethod.cycle.cycle_conf"
          :key="index"
        >
          <div class="pay-item">
            <div
              class="pay-label"
              :style="{ width: labelWidth ? labelWidth + 'px' : '' }"
            >
              付款周期
            </div>
            <div class="pay-value">
              <el-input-number
                :controls="false"
                v-model="item.value"
                placeholder="请输入付款周期"
                :min="0"
                @change="valueChange"
              >
              </el-input-number>
            </div>
          </div>
          <div class="pay-item">
            <div
              class="pay-label"
              :style="{ width: labelWidth ? labelWidth + 'px' : '' }"
            >
              周期单位
            </div>
            <div class="pay-value">
              <el-select
                class="pay-cycle-unit"
                v-model="item.unit"
                placeholder="请选择周期单位"
              >
                <template v-for="item in payCycle">
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </template>
              </el-select>
            </div>
          </div>
          <i
            class="el-icon-remove-outline opreation-icon"
            title="删除"
            @click="deleteItem(payMethod.cycle.cycle_conf, index)"
            :class="{
              'icon-ban': index === 0 && payMethod.cycle.cycle_conf.length === 1
            }"
          />
          <i
            title="添加"
            class="el-icon-circle-plus-outline opreation-icon"
            @click="addCycle(payMethod.cycle.cycle_conf)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Decimal from 'decimal.js'
import * as _ from 'lodash'

import { ENUM_MAP } from './config'
import { getEnumGroup } from '@/utils/common.js'
export default {
  // props: ['payMethod', 'hideTitle'],
  props: {
    payMethod: {
      type: Object,
      default: () => {}
    },
    hideTitle: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: Number,
      default: null
    },
    contentCenter: {
      type: Boolean,
      default: false
    },
    hideAlert: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    payMethod: {
      immediate: true,
      handler (v) {
        this.numberToEmpty(v)
      }
    }
  },
  data () {
    return {
      payCycle: [
        { label: '天（每隔多少天付款', value: 'day' },
        { label: '周（每周哪一天付款', value: 'week' },
        { label: '月（每个月几号付款', value: 'month' }
      ],
      deliveryCycle: [],
      payment: [],
      err: false,
      selectTime: []
    }
  },
  mounted () {
    getEnumGroup([ENUM_MAP.delivery_cycle, ENUM_MAP.payment_time]).then(res => {
      for (const item of res) {
        if (item.category === ENUM_MAP.delivery_cycle) {
          this.deliveryCycle = item.children
        }
        if (item.category === ENUM_MAP.payment_time) {
          this.payment = item.children
        }
      }
    })
  },
  beforeUpdate () {},
  methods: {
    addStage (arr) {
      arr.push({ ratio: undefined, time: '' })
    },
    addCycle (arr) {
      arr.push({ unit: '', value: undefined })
    },
    /**
     * 删除控件
     */
    deleteItem (arr, index) {
      if (arr.length > 1) {
        arr.splice(index, 1)
      }
      this.paymentChange()
      this.validateForm()
    },
    /**
     * 验证表单
     * 通过：false
     * 不通过：true
     */
    validateForm (val) {
      const stageConf = (this.payMethod.stage || {}).stage_conf || []
      if (!stageConf.length) {
        this.err = false
        return false
      }
      if (
        stageConf.length === 1 &&
        (stageConf[0].ratio === undefined ||
          stageConf[0].ratio === null ||
          stageConf[0].ratio === '')
      ) {
        this.err = false
        return false
      }
      let sum = 0
      for (const item of stageConf) {
        if (
          item.ratio !== null &&
          item.ratio !== undefined &&
          item.ratio !== ''
        ) {
          sum = Number(Decimal.add(sum, item.ratio))
        }
      }
      if (sum === 100) {
        this.err = false
        return false
      } else {
        this.err = true
        return true
      }
    },
    paymentChange (val, arr) {
      let stageConf = []
      const config = arr || this.payMethod
      if (!config.stage) {
        return
      }
      stageConf = config.stage.stage_conf || []
      this.selectTime = []
      for (const item of stageConf) {
        this.selectTime.push(item.time)
      }
      this.selectTime = _.uniq(this.selectTime)
    },
    findItem (item) {
      if (this.selectTime.indexOf(item) > -1) {
        return true
      } else {
        return false
      }
    },
    valueChange (val) {
      console.log('数字', val, typeof val)
    },
    numberToEmpty (obj) {
      for (const key in obj) {
        const item = obj[key] || {}
        if (key === 'arrival') {
          if (item.max_day === '' || item.max_day === null) {
            item.max_day = undefined
          }
        } else if (key === 'cycle') {
          if (item.advance_day === '' || item.advance_day === null) {
            item.advance_day = undefined
          }
          if (item.alert === '' || item.alert === null) {
            item.alert = undefined
          }
          for (const ele of item.cycle_conf || []) {
            if (ele.value === '' || ele.value === null) {
              ele.value = undefined
            }
          }
        } else if (key === 'prepaid') {
          if (item.delivery === '' || item.delivery === null) {
            item.delivery = undefined
          }
        } else if (key === 'stage') {
          for (const ele of item.stage_conf || []) {
            if (ele.ratio === '' || ele.ratio === null) {
              ele.ratio = undefined
            }
          }
        }
      }
      this.payMethod = obj
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-form {
  width: 90%;
  margin: 0 auto;
  .pay-method {
    .title {
      font-size: 14px;
      color: #606266;
      .title-icon {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #e4e7ed;
        border-radius: 50%;
        margin-right: $padding-xs;
      }
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      overflow: auto;
      .pay-item {
        display: flex;
        margin: $padding-md / 2;
        align-items: center;
        // margin-right: $padding-md * 2;
        .pay-label {
          margin-right: $padding-xs;
          text-align: right;
        }
      }
      .pay-value {
        display: flex;
        width: 202px;
        .unit {
          margin-left: $padding-xs;
        }
        .pay-cycle-unit {
          margin-left: $padding-xs;
        }
      }

      .pay-item-area {
        display: flex;
        align-items: center;
        .opreation-icon {
          font-size: 26px;
          margin-left: 16px;
          cursor: pointer;
        }
      }
    }
    .err-msg {
      color: red;
      position: relative;
      left: 120px;
      width: 80%;
    }
  }
}
.custome-suffix {
  /deep/ .el-input__suffix {
    top: 8px;
    right: 18px;
  }
  /deep/.el-input__inner {
    padding-right: 15px;
  }
}

/deep/ .el-input {
  width: 202px;
}

/deep/ .icon-ban {
  color: #c0c4cc;
  cursor: not-allowed !important;
}
</style>
