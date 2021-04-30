<template>
  <div>
    <PageHeader
      :title="operationFlag === 'edit' ? `${this.ruleForm.code}`: '新增物料'"
      :back="true" @back="goBack" ></PageHeader>
    <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
      <el-collapse v-model="activeNames">
        <Base-Info :form="ruleForm" :marId="id"></Base-Info>
        <Type :form='ruleForm'></Type>
        <Storage :form="ruleForm"></Storage>
        <Purchase :form="ruleForm"></Purchase>
        <Sale :form="ruleForm"></Sale>
        <Other :form="ruleForm"></Other>
      </el-collapse>
      <div class="bottom-list">
        <el-button @click="$router.go(-1)">返回</el-button>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit('ruleForm')">提交</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import PageHeader from '@/components/title/Title'
import BaseInfo from './BaseInfo'
import Type from './Type'
import Storage from './Storage'
import Other from './Other'
import Purchase from './Purchase'
import Sale from './Sale'
export default {
  name: 'EditMaterial',
  components: { PageHeader, BaseInfo, Type, Storage, Other, Purchase, Sale },
  data () {
    return {
      activeNames: ['1', '2', '3', '4', '5', '6'],
      submitLoading: false,
      id: '',
      ruleForm: {
        name: '', // 基本信息
        code: '', // 物料编码
        description: '', // 物料描述
        basic_unit: '', // 基本单位
        class: '', // 类别
        abbr: '', // 物料简称
        group_id: null, // 物料组
        prod_date: null, // 生产日期
        valid_period: null, // 有效期至
        remark: '', // 备注
        unit_info: {
          sale: '', // 销售单位
          sale_ratio: null, // 销售转换系数
          purchase: '', // 采购单位
          purchase_ratio: null, // 采购转换系数
          stock: '', // 库存单位
          stack_ratio: null // 库存转换系数
        },
        property: [], // 物料属性
        warehouse_info: { // 仓储信息
          warehouse: null, // 默认仓库
          warehouse_name: null,
          area: null, // 默认区位
          area_name: null,
          location: null, // 默认库位
          location_name: null,
          settle_method: null, // 结算方式
          settle_method_name: null,
          verify: true, // 是否免检
          initial_num: null, // 初期库存
          over_sale: null, // 允许超发
          over_sale_name: null,
          max_alert: false, // 最大库存预警
          min_alert: false, // 最小库存预警
          safe_alert: false, // 安全库存预警
          max_num: null, // 最大库存量
          min_num: null, // 最小库存量
          safe_num: null // 安全库存量
        },
        trans_tax: null, // 增值税
        hscode: { // hs编码
          code: null,
          description: '',
          import_tax: null,
          unit: '',
          id: null
        },
        purchase: { // 采购信息
          supplier: null, // 供应商
          supplier_name: null,
          withdraw: false, // 允许退料
          notify: false, // 到货提醒
          ahead: null // 收货提前天数
        },
        planing: {
          min: null, // 最小订货量
          fixed: null // 固定批量
        },
        sales: { // 销售信息
          sale_unit: '', // 计价单位
          start_num: null, // 起订量
          trans_curr: '', // 基准币种
          min_discount: null, // 最低折扣
          withdraw: false, // 允许退货
          retail_price: null, // 零售价
          wholesale_price: null, // 批发价
          level_price: [null, null, null, null, null, null, null, null, null, null], // 等级客户价
          accessories: [] // 配件
        }
      }
    }
  },
  computed: {
    operationFlag () {
      return this.$route.params.operation
    }
  },
  mounted () {
    this.id = this.$route.query.id
    if (this.id) {
      this.initdata(this.id)
    }
    this.getSaleBaseConfig()
  },
  methods: {
    initdata (id) {
      this.getFormDataById(id, data => {
        this.ruleForm = data
      })
    },
    getFormDataById (id, callback) {
      this.$http.get(`/base/material/self/${id}`).then(res => {
        callback(res.data)
      })
    },
    validMaterialForm (ruleForm, callback) {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          this.submitLoading = false
          return false
        } else {
          this.saveMaterialForm(callback)
        }
      })
    },
    saveMaterialForm (callback) {
      const params = this.ruleForm
      if (this.operationFlag === 'add') {
        this.$http.post('/base/material/self', { data: params, error_return: true }).then(res => {
          const result = res
          callback(result)
        }).catch(err => {
          this.submitLoading = false
          if (err.code === 15) {
            this.$message.error(`物料代码${this.ruleForm.code}已存在`)
          }
          if (err.code === 16) {
            this.$message.error(`物料代码${this.ruleForm.code}重复使用`)
          }
        })
      }
      if (this.operationFlag === 'edit') {
        this.$http.put('/base/material/self', { data: params, error_return: true }).then(res => {
          const result = res
          callback(result)
        }).catch(err => {
          this.submitLoading = false
          if (err.code === 15) {
            this.$message.error(`物料代码${this.ruleForm.code}已存在`)
          }
          if (err.code === 16) {
            this.$message.error(`物料代码${this.ruleForm.code}重复使用`)
          }
        })
      }
    },
    onSubmit (ruleForm) {
      this.submitLoading = true
      this.validMaterialForm(ruleForm, result => {
        if (result.code === 0) {
          this.$message.success('操作成功')
          this.submitLoading = false
          this.goBack()
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    // 获取销售基本配置
    getSaleBaseConfig () {
      const name = 'sale_base'
      this.$http.get(`/system/conf/${name}`).then(res => {
        const result = res.data
        if (res.code === 0) {
          this.ruleForm.sales.sale_unit = result.price_unit.unit
          this.ruleForm.sales.trans_curr = result.price_unit.base_currency
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.bottom-list {
  margin-top: $padding-md;
  text-align: center;
}
</style>
