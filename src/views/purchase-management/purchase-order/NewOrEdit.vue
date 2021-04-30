<template>
  <div class="new-purchase">
    <PageHeader :title="title" :back="true" @back="goBack" />
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <Title title="基本信息" />
        </template>
        <Basic ref="basicForm" :form="form" @formChange="formChange" />
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <Title title="采购明细" />
        </template>
        <Material
          :supplier="form.supplier_id"
          :materialTableDate="materialTableDate"
          :unit="form.price_unit"
          @addMaterial="addMaterial"
          @onDelete="deleteDetail"
        />
      </el-collapse-item>
    </el-collapse>
    <div class="btm-area">
      <el-button
        type="primary"
        :loading="draftBtnLoading"
        @click="onSubmit(stateMap.draft.value)"
        >保存为草稿</el-button
      >
      <el-button
        type="primary"
        :loading="submitBtnLoading"
        @click="onSubmit(stateMap.wait_check.value)"
        >提交</el-button
      >
    </div>
    <el-dialog
      title="余量处理"
      :close-on-click-modal="false"
      :visible.sync="surplusModal"
    >
      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="提示：下列请购单的采购数量小于请购数量，请选择您不再采购的条目。或不选，下次继续采购。"
      >
      </el-alert>
      <el-table
        ref="multipleTable"
        size="small"
        :data="detailsWithReq"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          v-for="(item, key) in surplusCols"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="laterPurchase">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as _ from 'lodash'
import * as moment from 'moment'
import * as Decimal from 'decimal.js'
import Vue from 'vue'

import { USER } from '@/store/storageConst'
import PageHeader from '@/components/title/Title.vue'
import Title from '@/components/collapse-title/CollapseTitle.vue'
import Basic from './components/Basic'
import Material from './components/Material'
import { stateMap, API_MAP, surplusCols } from './config'
import { formatTime } from '@/utils/trans.js'
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
      materialTableDate: [],
      stateMap,
      title: '',
      draftBtnLoading: false,
      submitBtnLoading: false,
      surplusModal: false,
      detailsWithReq: [],
      state: null,
      surplusCols,
      noPurchaseList: []
    }
  },
  created () {
    this.initPage(this.$route.query.id)
  },
  methods: {
    initPage (id) {
      if (id) {
        //  编辑
        this.title = id
        this.getInfoById(id)
      } else {
        this.title = '新增采购订单'
        this.form = { price_unit: 'yuan' }
        this.form.purchase_man = Vue.ls.get(USER)
        this.materialTableDate = []
      }
    },
    getInfoById (id) {
      this.$http.get(API_MAP.PURCHASE_MAIN + `/${id}`).then(res => {
        if (res.code === 0) {
          const data = _.cloneDeep(res.data)
          delete data.details
          this.form = data
          if (data.plan_date) {
            this.form.plan_date = formatTime(data.plan_date)
          }
          this.materialTableDate = res.data.details
          for (const item of this.materialTableDate) {
            this.calcPrice(item)
          }
          this.calcOrderTotalPrice(this.materialTableDate)
          this.initForm()
        }
      })
    },

    initForm () {
      const obj = _.cloneDeep(this.form.settles)
      this.settles = obj
      for (const key in this.settles) {
        if (this.settles[key]) {
          this.form.settles_name = key
        }
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    formChange (val, num) {
      this.form = val
      this.form = _.cloneDeep(this.form)
      if (num === 1) {
        // 切换供应商
        this.materialTableDate = []
      }
    },
    /**
     * 添加物料
     */
    addMaterial (val, editIndex) {
      for (const item of val) {
        item.plan_date = this.form.plan_date
          ? moment(this.form.plan_date).format('YYYY-MM-DDTHH:mm:ssZ')
          : null
        item.price_unit = this.form.price_unit
        item.total_price = this.calcPrice(item)
      }
      if (editIndex === -1) {
        const same = this.judgeSame(val, this.materialTableDate)
        if (same) {
          return
        }
        this.materialTableDate = [...this.materialTableDate, ...val]
      } else {
        if (val.length) {
          this.materialTableDate[editIndex] = val[0]
        } else {
          this.materialTableDate = this.materialTableDate.filter((o, i) => {
            return i !== editIndex
          })
        }
      }
      this.materialTableDate = _.cloneDeep(this.materialTableDate)
      this.calcOrderTotalPrice(this.materialTableDate)
    },
    /**
     * 判断是否重复添加物料
     */
    judgeSame (newMaterials, oldMaterials) {
      let same = false
      for (const item of newMaterials) {
        for (const jtem of oldMaterials) {
          if (!item.req_num) {
            if (!jtem.req_num && jtem.material_code === item.material_code) {
              same = true
              this.$message.error(`物料${item.material_code}重复，添加失败`)
              return same
            }
          } else {
            if (
              jtem.req_num &&
              jtem.req_num === item.req_num &&
              jtem.material_code === item.material_code
            ) {
              same = true
              this.$message.error(
                `请购单${jtem.req_num}的物料${item.material_code}重复，添加失败`
              )

              return same
            }
          }
        }
      }
      return same
    },

    /**
     * 计算订单明细的总价
     */
    calcPrice (item) {
      item.total_price = Number(Decimal.mul(item.price, item.purchase_amount))
      return item.total_price
    },
    /**
     * 计算订单总价
     */
    calcOrderTotalPrice (arr) {
      let total = 0
      for (const item of arr) {
        total = Number(Decimal.add(total, item.total_price))
      }
      this.form.total_price = total
      this.form = _.cloneDeep(this.form)
    },
    /**
     * 保存或提交按钮
     */
    onSubmit (state) {
      this.state = state
      const validate = this.$refs.basicForm.validateForm()
      if (!validate) {
        return
      }
      if (
        state === stateMap.wait_check.value &&
        !this.materialTableDate.length
      ) {
        this.$message.error('请添加采购明细')
        return
      }

      const checkRes = this.checkAmount()
      if (checkRes.code !== 0) {
        this.$message.error(
          `物料${checkRes.material_code}起订量不能小于${checkRes.start_num}`
        )
        return
      }
      for (const ele of this.materialTableDate) {
        if (ele.extra_req === 1) {
          this.$message.error(
            `请购单${ele.req_num}的物料${ele.material_code}不允许继续采购`
          )
          return
        }
      }
      if (state === stateMap.wait_check.value) {
        const surplus = this.surplus()
        if (surplus.length) {
          this.surplusModal = true
          this.$nextTick(() => {
            this.detailsWithReq.forEach(row => {
              if (row.extra_req === 1) {
                this.$refs.multipleTable.toggleRowSelection(row)
              }
            })
          })
          return
        }
      }

      this.handleSubmit()
    },
    /**
     * 保存或提交采购订单的请求
     */
    handleSubmit () {
      if (this.state === stateMap.draft.value) {
        this.draftBtnLoading = true
      } else {
        this.submitBtnLoading = true
      }
      const params = this.handleParams(this.state)
      if (!this.$route.query.id) {
        this.$http
          .post(API_MAP.PURCHASE_MAIN + '?logtype=new', { data: params })
          .then(res => {
            this.draftBtnLoading = false
            this.submitBtnLoading = false
            if (res.code === 0) {
              this.$message.success('操作成功')
              if (this.state === stateMap.draft.value) {
                this.initPage(res.data)
              } else {
                this.goBack()
              }
            }
          })
      } else {
        this.$http
          .put(API_MAP.PURCHASE_MAIN + '?logtype=edit', { data: params })
          .then(res => {
            this.draftBtnLoading = false
            this.submitBtnLoading = false
            if (res.code === 0) {
              this.$message.success('操作成功')
              if (this.state === stateMap.draft.value) {
                this.initPage(res.data)
              } else {
                this.goBack()
              }
            }
          })
          .catch(err => {
            console.log(err, '错误')
            this.draftBtnLoading = false
            this.submitBtnLoading = false
          })
      }
    },
    /**
     * 验证物料的采购数量是否达到起订量
     */
    checkAmount () {
      const checkedList = []
      for (const item of this.materialTableDate) {
        if (checkedList.indexOf(item.material_code) < 0) {
          checkedList.push(item.material_code)
          let amount = 0
          const startNum = item.req_num
            ? item.material_min
              ? item.material_min
              : item.start_num
            : item.start_num
          for (const jtem of this.materialTableDate) {
            if (jtem.material_code === item.material_code) {
              amount += jtem.purchase_amount
            }
          }
          if (amount < startNum) {
            return {
              code: -1,
              material_code: item.material_code,
              start_num: startNum
            }
          }
        }
      }
      return { code: 0 }
    },
    /**
     * 处理参数
     */
    handleParams (state) {
      let params = {}
      const cloneForm = _.cloneDeep(this.form)
      cloneForm.plan_date = this.form.plan_date
        ? moment(this.form.plan_date).format('YYYY-MM-DDTHH:mm:ssZ')
        : null
      params = Object.assign(params, cloneForm)
      params.state = state
      for (const item of this.materialTableDate) {
        item.extra_req = 0
        for (const jtem of this.noPurchaseList) {
          if (
            item.req_num === jtem.req_num &&
            item.material_code === jtem.material_code
          ) {
            item.extra_req = 1
          }
        }
      }
      params.details = this.materialTableDate
      return params
    },
    /**
     * 删除明细
     */
    deleteDetail (val) {
      this.materialTableDate = this.materialTableDate.filter((o, i) => {
        return i !== val.$index
      })
    },
    surplus () {
      this.detailsWithReq = []
      console.log(this.materialTableDate, 'fadfdf')
      // const arr = this.materialTableDate.filter(ele => {
      //   return ele.extra_req !== 1
      // })
      const arr = this.materialTableDate
      for (const item of arr) {
        if (
          item.req_num &&
          item.purchase_amount <
            Number(Decimal.sub(item.req_amount, item.finish_amount))
        ) {
          // 本次采购数量小于请购数量-已采购数量的采购明细
          this.detailsWithReq.push(item)
        }
      }
      return this.detailsWithReq
    },
    handleSelectionChange (val) {
      this.noPurchaseList = val
      console.log('不再采购', this.noPurchaseList)
    },
    /**
     * 余量处理确定按钮
     */
    laterPurchase () {
      this.handleSubmit()
      this.surplusModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
.new-purchase {
  .btm-area {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: $padding-xs;
  }
}
</style>
