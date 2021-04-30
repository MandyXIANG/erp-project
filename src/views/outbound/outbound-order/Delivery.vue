<template>
    <div>
      <el-collapse-item name="1">
        <template slot="title">
          <Title title='基本信息'/>
        </template>
        <el-row type="flex">
          <el-col :span="10">
            <el-form-item label="出库单类型" prop="type" :rules="deliveryRules.type">
              <el-select v-model="form.type" placeholder="请选择出库单类型" class="select-width" :disabled="true">
                <el-option v-for="(item, index) in TypeList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="选择仓库" prop="warehouse_code" :rules="deliveryRules.warehouse_code">
              <el-select v-model="form.warehouse_code" filterable clearable
                            class="select-width" @change="changeWarehouse" placeholder="请选择仓库">
                  <el-option v-for="item in warehouseList" :key="item.id"
                             :label="item.name" :value="item.code">
                            <span class="erp-option-left">{{ item.code }}</span>
                            <span class="erp-option-right">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10">
            <el-form-item label="计划备料时间" prop="plan_prepare_time"
                          :rules="deliveryRules.plan_prepare_time">
              <el-date-picker v-model="form.plan_prepare_time" class="select-width"
                              type="datetime" placeholder="请选择计划备料时间"
                              :picker-options="prepareStart()">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计划发料时间" prop="plan_stockout_time"
                          :rules="deliveryRules.plan_stockout_time">
              <el-date-picker v-model="form.plan_stockout_time" placeholder="请选择计划发料时间"
                              type="datetime" class="select-width"
                              :picker-options="planOutEnd()">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10">
            <el-form-item label="销售订单">
                  <el-select v-model="form.order_id" class="select-width"
                              placeholder="请输入销售订单号搜索" :loading="saleLoading"
                            :remote-method="getSaleOrderList" filterable remote clearable
                            @change="changeSaleOrder">
                            <el-option v-for="(item, index) in orderLists" :key="index"
                                       :label="item.id" :value="item.id">
                            </el-option>
                  </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="收货方代码" prop="receiptor_code" :rules="deliveryRules.receiptor_code">
                  <el-input v-model.trim="form.receiptor_code" :disabled="isShow"
                            placeholder="请输入收货方代码">
                  </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="收货方名称" prop="receiptor_name" :rules="deliveryRules.receiptor_name">
              <el-input v-model.trim="form.receiptor_name" placeholder="请输入收货方名称"
                        :disabled="isShow">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="备注">
                  <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
    </div>
</template>
<script>
import Title from '@/components/collapse-title/CollapseTitle'
import { TypeList } from './outboundConfig'
import order from '@/utils/data/order'
import warehouse from '@/utils/data/warehouse'
import * as moment from 'moment'

export default {
  name: 'Delivery',
  components: { Title },
  mixins: [order(), warehouse()],
  props: {
    form: {
      type: null, // 出库单类型
      plan_prepare_time: null, // 计划备料时间
      plan_stockout_time: null, // 计划发料时间
      order_id: null, // 销售订单
      receiptor_name: null, // 收货方名称
      receiptor_code: null, // 收货方代码
      warehouse_code: null,
      warehouse_id: null, // 仓库代码
      remark: null // 备注
    }
  },
  data () {
    return {
      TypeList,
      orderLists: [],
      warehouseList: [],
      saleLoading: false,
      isShow: false,
      start: '',
      end: '',
      deliveryRules: {
        type: [
          { required: true, message: '请选择出库单类型', trigger: 'change' }
        ],
        plan_stockout_time: [
          { required: true, message: '请选择计划发料时间', trigger: 'change' }
        ],
        plan_prepare_time: [
          { required: true, message: '请选择计划备料时间', trigger: 'change' }
        ],
        receiptor_name: [
          { required: true, message: '请输入收货方名称', trigger: 'change' }
        ],
        receiptor_code: [
          { required: true, message: '请输入收货方代码', trigger: 'change' }
        ],
        warehouse_code: [
          { required: true, message: '请选择仓库', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'form.order_id': {
      handler (newValue, oldValue) {
        if (newValue) {
          this.isShow = true
        }
      },
      deep: true
    },
    'form.plan_prepare_time': {
      handler (newValue, oldValue) {
        if (newValue) {
          this.end = moment(newValue).format('HH:mm:ss')
        } else {
          this.end = '23:59:59'
        }
      },
      immediate: true,
      deep: true
    },
    'form.plan_stockout_time': {
      handler (newValue, oldValue) {
        if (newValue) {
          this.start = moment(newValue).format('HH:mm:ss')
        } else {
          this.start = '00:00:00'
        }
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    this.getWarehouseList(list => {
      this.warehouseList = list.data
    })
  },
  methods: {
    // 计划备料时间
    prepareStart () {
      return {
        disabledDate: time => {
          const endDateVal = this.form.plan_stockout_time
          if (endDateVal) {
            return (time.getTime() > new Date(endDateVal).getTime())
          }
        },
        selectableRange: '00:00:00 - ' + this.end
      }
    },
    // 计划发料时间
    planOutEnd () {
      return {
        disabledDate: time => {
          const beginDateVal = this.form.plan_prepare_time
          if (beginDateVal) {
            return (time.getTime() < new Date(beginDateVal).getTime())
          }
        },
        selectableRange: this.start + '- 23:59:59'
      }
    },
    getSaleOrderList (query) {
      const params = { 'q[id]': query, state: 'effect,process', stateop: 0 }
      this.saleLoading = true
      this.$http.get('/business/sales/mains', { data: params }).then(res => {
        const result = res.data
        this.saleLoading = false
        this.orderLists = result.data || []
      })
    },
    changeSaleOrder (value) {
      this.$emit('changeSaleOrderItem', value)
      if (!value) {
        this.isShow = false
        this.form.receiptor_name = null
        this.form.receiptor_code = null
        return
      }
      const arr = this.orderLists.filter(item => value === item.id)
      this.form.receiptor_name = arr[0].customer_name
      this.form.receiptor_code = arr[0].customer_code
      this.isShow = true
    },
    changeWarehouse (code) {
      this.isShow = false
      this.warehouseList.map(k => {
        if (k.code === code) {
          this.form.warehouse_id = k.id
        }
      })
      this.$emit('changeWarehouseCode', code)
    }
  }
}
</script>
<style lang="scss" scoped>
.select-width {
  width: 100%;
}
/deep/ .el-dialog__body {
  height: 400px;
  overflow: auto;
}
</style>
