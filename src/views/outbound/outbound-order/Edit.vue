<template>
    <div>
      <PageHeader :title="pageTitle" :back="true" @back="goBack"></PageHeader>
      <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
        <el-collapse v-model="activeName">
          <Delivery :form="ruleForm" @changeWarehouseCode="changeWarehouseCode"
          @changeSaleOrderItem="changeSaleOrderItem"></Delivery>
          <Add :marTableData="marTableData" @addMaterial="addMaterial"
              @deleteMar="deleteMar" :saleId="ruleForm.order_id"
              :warehouseId="ruleForm.warehouse_id" :outId="outId">
          </Add>
        </el-collapse>
        <div class="bottom-list">
          <el-button type="primary" :loading="draftLoading" @click="onSubmit('draft')">保存为草稿</el-button>
          <el-button type="primary" :loading="waitCheckLoading" @click="onSubmit('wait_check')">提交</el-button>
        </div>
      </el-form>
    </div>
</template>
<script>
import moment from 'moment'
import PageHeader from '@/components/title/Title'
import Delivery from './Delivery'
import { formatTime } from '@/utils/trans'
import Add from './Add'

export default {
  name: 'Edit',
  components: { PageHeader, Delivery, Add },
  data () {
    return {
      pageTitle: '',
      activeName: ['1', '2'],
      marTableData: [],
      formatTime,
      outId: '',
      draftLoading: false,
      waitCheckLoading: false,
      ruleForm: {
        type: 'handle_out', // 出库单类型
        plan_stockout_time: null, // 计划出库时间
        plan_prepare_time: null, // 计划备料时间
        order_id: null, // 销售订单
        receiptor_name: null, // 收货方名称
        receiptor_code: null, // 收货方代码
        warehouse_code: null, // 仓库代码
        warehouse_id: null,
        remark: null, // 备注
        details: [],
        state: null
      }
    }
  },
  mounted () {
    this.outId = this.$route.query.id
    if (!this.outId) {
      this.pageTitle = '新增出库单'
    } else {
      this.initData(this.outId)
    }
  },
  methods: {
    initData (id) {
      this.getFormDataById(id, list => {
        this.ruleForm = list
        this.marTableData = list.details
        this.marTableData.map(k => {
          if (k.order_detail_id) {
            k.order_code = list.order_id
          }
        })
        this.ruleForm.plan_stockout_time = this.formatTime(list.plan_stockout_time)
        this.ruleForm.plan_prepare_time = this.formatTime(list.plan_prepare_time)
        this.pageTitle = list.id
      })
    },
    // 编辑包含wait_check，取?iwc=${1} 取order_plan_amount得值
    getFormDataById (id, callback) {
      this.$http.get(`/business/stockout/${id}?iwc=${1}`).then(res => {
        callback(res.data)
      })
    },
    validOutForm (value, callback) {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.waitCheckLoading = false
          this.draftLoading = false
          return false
        } else {
          if (value === 'wait_check' && this.marTableData.length === 0) {
            this.$message.error('出库明细不能为空')
            this.waitCheckLoading = false
            this.draftLoading = false
          } else {
            this.saveOutForm(value, callback)
          }
        }
      })
    },
    saveOutForm (value, callback) {
      this.initParams(value)
      const params = this.ruleForm
      const id = this.$route.query.id
      if (!id) {
        this.$http.post('/business/stockout' + '?logtype=new', { data: params }).then(res => {
          const result = res
          callback(result)
        }).catch(() => {
          this.waitCheckLoading = false
          this.draftLoading = false
        })
      } else {
        this.$http.put('/business/stockout' + '?logtype=edit', { data: params }).then(res => {
          const result = res
          callback(result)
        }).catch(() => {
          this.waitCheckLoading = false
          this.draftLoading = false
        })
      }
    },
    onSubmit (value) {
      value === 'wait_check' ? this.waitCheckLoading = true : this.draftLoading = true
      this.validOutForm(value, result => {
        if (result.code === 0) {
          this.$message.success('操作成功')
          this.waitCheckLoading = false
          this.draftLoading = false
          if (value === 'draft') {
            this.initData(result.data)
          } else {
            this.goBack()
          }
        }
      })
    },
    // 格式化参数
    initParams (value) {
      this.ruleForm.plan_stockout_time = this.ruleForm.plan_stockout_time
        ? moment(this.ruleForm.plan_stockout_time).format('YYYY-MM-DDTHH:mm:ssZ') : null
      this.ruleForm.plan_prepare_time = this.ruleForm.plan_prepare_time
        ? moment(this.ruleForm.plan_prepare_time).format('YYYY-MM-DDTHH:mm:ssZ') : null
      delete this.ruleForm.warehouse_id
      this.ruleForm.details = this.marTableData
      this.ruleForm.state = value
    },
    // 添加物料
    addMaterial (val, index) {
      if (index === -1) {
        const same = this.isSame(val, this.marTableData)
        if (same) {
          return
        }
        this.marTableData = [...this.marTableData, ...val]
      } else {
        this.marTableData[index] = val[0]
      }
    },
    // 删除明细
    deleteMar (value) {
      this.marTableData.splice(value.$index, 1)
    },
    goBack () {
      this.$router.go(-1)
    },
    // 判断是否添加相同物料
    isSame (newMaterials, oldMaterials) {
      let same = false
      for (const i of newMaterials) {
        for (const j of oldMaterials) {
          if (!i.order_detail_id) {
            if (!j.order_detail_id && j.material_code === i.material_code) {
              same = true
              this.$message.error(`物料${i.material_code}重复，添加失败`)
              return same
            }
          } else {
            if (j.order_detail_id && j.order_detail_id === i.order_detail_id && j.code === i.code) {
              same = true
              this.$message.error(`销售订单${j.order_code}的物料${i.material_code}重复，添加失败`)

              return same
            }
          }
        }
      }
      return same
    },
    // 改变仓库明细值为空
    changeWarehouseCode (value) {
      this.ruleForm.order_id = null
      this.ruleForm.receiptor_name = null
      this.ruleForm.receiptor_code = null
      this.marTableData = []
    },
    // 改变销售订单，来自销售订单明细置为空
    changeSaleOrderItem (value) {
      this.marTableData = this.marTableData.filter(k => !(k.order_code))
    }
  }
}
</script>
<style lang="scss" scoped>
.bottom-list{
  margin-top: $padding-md;
  text-align: center;
}
</style>
