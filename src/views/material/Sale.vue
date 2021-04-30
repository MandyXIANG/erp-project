<template>
  <div>
    <el-collapse-item name="6">
      <template slot="title">
        <Title title="销售信息" />
      </template>
      <el-row type="flex">
        <el-col :span="10">
          <el-form-item label="销售物料单位">
            <el-input v-model="form.unit_info.sale" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="计价单位">
            <el-select v-model="form.sales.sale_unit" clearable
                      :disabled="true" class="select-width" placeholder="请选择计价单位">
              <el-option v-for="(item, index) in saleUnit" :key="index"
                          :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="10">
          <el-form-item label="起订量">
            <el-input class="select-width" v-model.number="form.sales.start_num"
                      type="number" placeholder="请输入起订量" @change="changeStartNum">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="基准币种">
            <el-select v-model="form.sales.trans_curr" placeholder="请选择基准币种"
                      clearable class="select-width" :disabled="true">
              <el-option v-for="(item, index) in Curr" :key="index"
                        :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="10">
          <el-form-item label="最低折扣" prop="sales.min_discount" :rules="saleRules.min_discount">
            <el-input v-model.number="form.sales.min_discount" type="number"
                      placeholder="请输入最低折扣" @change="changeMinDiscount">
              <template slot="suffix">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="允许退货">
            <el-radio-group v-model="form.sales.withdraw">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="10">
          <el-form-item label="零售价">
            <el-input v-model.number="form.sales.retail_price" placeholder="请输入零售价"
                      class="select-width" type="number" @change="changeRetailPrice">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="配套配件">
            <el-select v-model="form.sales.accessories" clearable multiple
              class="select-width" @change="changeAssess($event)" value-key="id" placeholder="请选择配套配件">
              <el-option v-for="(item, index) in materialList" :key="index"
                        :label="item.name" :value="{ name: item.name, id: item.id }">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="10">
          <el-form-item label="一级客户价">
            <el-input v-model.number="form.sales.level_price[0]" placeholder="请输入一级客户价"
                      class="select-width" type="number" @change="changeC1st_price">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="二级客户价">
            <el-input v-model.number="form.sales.level_price[1]" placeholder="请输入二级客户价"
                      class="select-width" type="number" @change="changeC2nd_price">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="10">
          <el-form-item label="三级客户价">
            <el-input v-model.number="form.sales.level_price[2]" placeholder="请输入三级客户价"
                      class="select-width" type="number" @change="changeC3rd_price">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="四级客户价">
            <el-input v-model.number="form.sales.level_price[3]" placeholder="请输入四级客户价"
                      class="select-width" type="number" @change="changeC4th_price">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="10">
          <el-form-item label="五级客户价">
            <el-input v-model.number="form.sales.level_price[4]" placeholder="请输入五级客户价"
                      class="select-width" type="number" @change="changeC5th_price">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="六级客户价">
            <el-input v-model.number="form.sales.level_price[5]" placeholder="请输入六级客户价"
                      class="select-width" type="number" @change="changeC6th_price">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="10">
          <el-form-item label="七级客户价">
            <el-input v-model.number="form.sales.level_price[6]" placeholder="请输入七级客户价"
                      class="select-width" type="number" @change="changeC7th_price">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="八级客户价">
            <el-input v-model.number="form.sales.level_price[7]"  placeholder="请输入八级客户价"
                    class="select-width" type="number" @change="changeC8th_price">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="10">
          <el-form-item label="九级客户价">
            <el-input v-model.number="form.sales.level_price[8]" placeholder="请输入九级客户价"
                      class="select-width" type="number" @change="changeC9th_price">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="十级客户价">
            <el-input v-model.number="form.sales.level_price[9]" placeholder="请输入十级客户价"
                      class="select-width" type="number" @change="changeC10th_price">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-collapse-item>
  </div>
</template>
<script>
import Title from '@/components/collapse-title/CollapseTitle'
import material from '@/utils/data/material'
import { saleUnit, Curr } from './materConfig'
export default {
  name: 'Sale',
  mixins: [material()],
  components: { Title },
  props: {
    form: {
      sales: { // 销售信息
        sale_unit: '', // 计价单位
        start_num: null, // 起订量
        trans_curr: '', // 基准币种
        min_discount: null, // 最低折扣
        withdraw: false, // 允许退货
        retail_price: null, // 零售价
        wholesale_price: null, // 批发价
        level_price: [],
        accessories: [] // 配件
      }
    }
  },
  data () {
    return {
      saleUnit,
      Curr,
      materialList: [],
      saleRules: {
        min_discount: [
          { pattern: /^(\d{1,2}(\.\d{1,2})?|100)$/, message: '请输入0——100之间的值', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getMaterialList(list => {
      this.materialList = list.data
    })
  },
  methods: {
    changeAssess (event) {
      this.form.sales.accessories = event
    },
    changeStartNum (value) {
      if (!value) {
        this.form.sales.start_num = null
      }
    },
    changeRetailPrice (value) {
      if (!value) {
        this.form.sales.retail_price = null
      }
    },
    changeMinDiscount (value) {
      if (!value) {
        this.form.sales.min_discount = null
      }
    },
    changeC1st_price (value) {
      if (!value) {
        this.form.sales.level_price[0] = null
      }
    },
    changeC2nd_price (value) {
      if (!value) {
        this.form.sales.level_price[1] = null
      }
    },
    changeC3rd_price (value) {
      if (!value) {
        this.form.sales.level_price[2] = null
      }
    },
    changeC4th_price (value) {
      if (!value) {
        this.form.sales.level_price[3] = null
      }
    },
    changeC5th_price (value) {
      if (!value) {
        this.form.sales.level_price[4] = null
      }
    },
    changeC6th_price (value) {
      if (!value) {
        this.form.sales.level_price[5] = null
      }
    },
    changeC7th_price (value) {
      if (!value) {
        this.form.sales.level_price[6] = null
      }
    },
    changeC8th_price (value) {
      if (!value) {
        this.form.sales.level_price[7] = null
      }
    },
    changeC9th_price (value) {
      if (!value) {
        this.form.sales.level_price[8] = null
      }
    },
    changeC10th_price (value) {
      if (!value) {
        this.form.sales.level_price[9] = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.select-width {
  width: 100%;
}
</style>
