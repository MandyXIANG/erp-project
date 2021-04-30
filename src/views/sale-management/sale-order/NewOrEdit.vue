<template>
  <div class="order-detail">
    <PageHeader :title="pageTitle" :back="true" @back="goBack" />
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <Title title="基本信息" />
        </template>
        <Basic
          ref="basicForm"
          :form="form"
          :real="rPrice"
          :origin="oPrice"
          @discountChange="discountChange"
          @formChange="formChange"
          @rateChange="rateChange"
        />
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <Title title="订单明细" />
        </template>
        <Material
          :basic="form"
          :materialDate="materialDate"
          @onDelete="deleteDetail"
          @addDetail="addDetail"
        />
      </el-collapse-item>
    </el-collapse>
    <div class="btm-area">
      <el-button
        type="primary"
        :loading="draftBtnLoading"
        @click="onSubmit(stateMap.draft)"
        >保存为草稿</el-button
      >

      <el-button
        type="primary"
        :loading="submitBtnLoading"
        @click="onSubmit(stateMap.wait_check)"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import * as Decimal from 'decimal.js'
import * as _ from 'lodash'

import PageHeader from '@/components/title/Title.vue'
import Title from '@/components/collapse-title/CollapseTitle.vue'
import Basic from './components/Basic'
import Material from './components/Material'
import { API_MAP, stateMap } from './config'
import { USER } from '@/store/storageConst'

export default {
  components: {
    PageHeader,
    Title,
    Basic,
    Material
  },
  data () {
    return {
      activeName: ['1', '2'],
      form: {},
      materialDate: [],
      orderId: null,
      rPrice: 0,
      oPrice: 0,
      stateMap,
      pageTitle: '',
      settles: {},
      draftBtnLoading: false,
      submitBtnLoading: false,
      cloneRprice: 0
    }
  },
  created () {
    this.orderId = this.$route.query.id
    this.initPage()
  },
  methods: {
    /**
     * 初始化界面
     */
    initPage () {
      if (!this.orderId) {
        // 新建
        this.pageTitle = '新增销售订单'
        this.form = {}
        this.form.sales_man = Vue.ls.get(USER)
        this.materialDate = []
      } else {
        // 编辑
        this.pageTitle = this.orderId
        this.getInfoByOrder()
      }
    },
    /**
     * 获取订单的信息
     */
    getInfoByOrder () {
      this.$http.get(API_MAP.SALES_MAIN + `/${this.orderId}`).then(res => {
        if (res.code === 0) {
          this.form = res.data || {}
          this.materialDate = (res.data || {}).details || []
          this.initForm()
        }
      })
    },
    /**
     * 初始化基本信息表单
     */
    initForm () {
      const obj = _.cloneDeep(this.form.settles)
      this.settles = obj
      for (const key in this.settles) {
        if (this.settles[key]) {
          this.form.settles_name = key
        }
      }
      this.initPrice()
    },

    /**
     * 初始化明细和订单的价格
     */
    initPrice () {
      let originTotal = 0
      let realTotal = 0
      for (const ele of this.materialDate) {
        const sumOrigin = Number(Decimal.mul(ele.sale_price || 0, ele.count))
        const sumReal = Number(Decimal.mul(ele.real_price || 0, ele.count))
        originTotal = Number(Decimal.add(originTotal, sumOrigin))
        realTotal = Number(Decimal.add(realTotal, sumReal))
        ele.real_total_price = sumReal
        ele.origin_total_price = sumOrigin
      }
      this.rPrice = realTotal
      this.oPrice = originTotal
      this.cloneRprice = realTotal
      if (this.form.discount) {
        this.rPrice = Number(
          Decimal.mul(this.cloneRprice, Decimal.div(this.form.discount, 100))
        )
      }
      this.materialDate = _.cloneDeep(this.materialDate)
    },
    goBack () {
      this.$router.go(-1)
    },
    onSubmit (state) {
      const params = this.handleParams(state)
      const validate = this.$refs.basicForm.validateForm()
      if (!validate) {
        return
      }
      if (
        state.value === stateMap.wait_check.value &&
        !this.materialDate.length
      ) {
        this.$message.error('请添加订单明细')
        return
      }
      if (state.value === stateMap.draft.value) {
        this.draftBtnLoading = true
      } else {
        this.submitBtnLoading = true
      }
      if (!this.orderId) {
        // 新建
        this.$http
          .post(API_MAP.SALES_MAIN + '?logtype=new', { data: params })
          .then(res => {
            this.draftBtnLoading = false
            this.submitBtnLoading = false
            if (res.code === 0) {
              this.$message.success('操作成功')
              if (state.value === stateMap.draft.value) {
                this.orderId = res.data
                this.initPage()
              } else {
                this.goBack()
              }
            }
          })
      } else {
        // 编辑
        this.$http
          .put(API_MAP.SALES_MAIN + '?logtype=edit', { data: params })
          .then(res => {
            this.draftBtnLoading = false
            this.submitBtnLoading = false
            if (res.code === 0) {
              this.$message.success('操作成功')
              if (state.value === stateMap.draft.value) {
                this.orderId = res.data
                this.initPage()
              } else {
                this.goBack()
              }
            }
          })
      }
    },
    handleParams (state) {
      this.form.state = state.value
      let params = {}
      params = this.form
      params.details = this.materialDate
      params.settles = this.form.settles
      params.discount_price = this.rPrice
      params.raw_price = this.oPrice
      if (params.discount === '') {
        params.discount = null
      }
      if (params.agent === '') {
        params.agent = null
      }
      return params
    },
    /**
     * 删除明细
     */
    deleteDetail (val) {
      this.materialDate = this.materialDate.filter((o, i) => {
        return i !== val.$index
      })
      this.initPrice()
      this.materialDate = _.cloneDeep(this.materialDate)
    },
    /**
     * 添加明细
     */
    addDetail (val, row) {
      const item = this.calcPrice(val)
      if (item.real_discount === '') {
        item.real_discount = null
      }
      if (Object.keys(row).length) {
        // 编辑
        const index = row.$index
        for (let i = 0; i < this.materialDate.length; i++) {
          if (i === index) {
            this.materialDate[i] = item
          }
        }
      } else {
        const same = this.judgeSame(item, this.materialDate)
        if (same) {
          this.$message.error(`编码为${item.material_code}的物料已存在`)
          return
        }
        this.materialDate.push(item)
      }
      this.initPrice()
    },
    judgeSame (val, oldMaterials) {
      let same = false
      for (const item of oldMaterials) {
        if (val.material_code === item.material_code) {
          same = true
        }
      }
      return same
    },
    /**
     * 计算订单明细的价格
     */
    calcPrice (item) {
      const sumOrigin = Number(Decimal.mul(item.sale_price || 0, item.count))
      const sumReal = Number(Decimal.mul(item.real_price || 0, item.count))
      item.real_total_price = sumReal
      item.origin_total_price = sumOrigin
      return item
    },
    /**
     * 订单总折扣率改变的回调
     */
    discountChange (val) {
      if (val) {
        this.rPrice = Number(
          Decimal.mul(this.cloneRprice, Decimal.div(val, 100))
        )
      }
    },
    /**
     *汇率改变重新计算价格
     */
    rateChange (val) {
      let originTotal = 0
      let realTotal = 0
      for (const ele of this.materialDate) {
        let realPrice
        if (ele.sale_price) {
          realPrice = Number(
            Decimal.mul(ele.sale_price, this.form.exchange_rate || 1)
          )
          if (ele.real_discount) {
            realPrice = Number(
              Decimal.mul(realPrice, Decimal.div(ele.real_discount, 100))
            )
          }
        } else {
          realPrice = ele.real_price
        }

        const sumOrigin = Number(Decimal.mul(ele.sale_price || 0, ele.count))
        const sumReal = Number(Decimal.mul(realPrice || 0, ele.count))
        originTotal = Number(Decimal.add(originTotal, sumOrigin))
        realTotal = Number(Decimal.add(realTotal, sumReal))
        ele.real_total_price = sumReal
        ele.origin_total_price = sumOrigin
        ele.real_price = realPrice
      }
      this.rPrice = realTotal
      this.oPrice = originTotal
      this.cloneRprice = realTotal
      if (this.form.discount) {
        this.rPrice = Number(
          Decimal.mul(this.cloneRprice, Decimal.div(this.form.discount, 100))
        )
      }
      this.materialDate = _.cloneDeep(this.materialDate)
    },
    formChange (val) {
      this.form = val
      this.form = _.cloneDeep(this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  .btm-area {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: $padding-xs;
  }
}
</style>
