<template>
  <div class="sale-info">
    <PageHeader title="销售基本信息" />
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <Title title="物价单位" />
        </template>
        <el-form ref="form" :model="form" label-width="120px">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="基准币种" prop="base_currency">
              <el-select
                v-model="form['base_currency']"
                style="width:100%"
                placeholder="请选择基准币种"
                filterable
              >
                <el-option
                  v-for="item in currOPtions"
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
              <el-select
                v-model="form['unit']"
                style="width:100%"
                placeholder="请选择计价单位"
                filterable
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
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <Title title="结算方式" />
        </template>
        <PayMethod ref="child" :hideAlert="true" :payMethod="payMethods" :labelWidth="120"/>
      </el-collapse-item>
    </el-collapse>
    <div class="btm">
      <el-button
        v-if="$permission('sale_info_edit')"
        :loading="btnLoading"
        type="primary"
        @click="onSubmit"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import { payMethods, API_MAP } from './config'
import PayMethod from '../../supplier/PayMethod'
import PageHeader from '@/components/title/Title.vue'
import Title from '@/components/collapse-title/CollapseTitle.vue'
import { currOPtions, priceUnit } from '@/utils/options'

export default {
  components: {
    PayMethod,
    PageHeader,
    Title
  },
  data () {
    return {
      payMethods,
      activeName: ['1', '2'],
      btnLoading: false,
      form: {},
      currOPtions,
      priceUnit
    }
  },
  created () {
    this.getBaseInfo()
  },
  methods: {
    getBaseInfo () {
      this.$http.get(API_MAP.SYS_CONF).then(res => {
        if (res.code === 0 && res.data && Object.keys(res.data).length) {
          this.payMethods = res.data.settles || payMethods
          this.form = res.data.price_unit || {}
          this.$refs.child.paymentChange(null, this.payMethods)
        }
      })
    },
    onSubmit () {
      if (this.$refs.child.validateForm()) {
        this.$refs.child.err = true
        return
      } else {
        this.$refs.child.err = false
      }
      this.btnLoading = true
      this.$http
        .put(API_MAP.SYS_CONF, { data: { settles: this.payMethods, price_unit: this.form } })
        .then(res => {
          this.btnLoading = false
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.getBaseInfo()
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.sale-info {
  width: 100%;
  .btm {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: $padding-xs;
  }
}
</style>
