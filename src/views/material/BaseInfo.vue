<template>
  <div>
    <el-collapse-item name="1">
      <template slot="title">
        <Title title="基本信息"/>
      </template>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="物料名称" prop="name" :rules="baseInfoRules.name">
                <el-input v-model.trim="form.name" placeholder="请输入物料名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="物料编码" prop="code" :rules="baseInfoRules.code">
                <el-input v-model.trim="form.code" placeholder="请输入物料编码" :disabled="!!marId"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="物料描述">
                <el-input v-model.trim="form.description" placeholder="请输入物料描述"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="基本单位" prop="basic_unit" :rules="baseInfoRules.basic_unit">
                <el-select v-model="form.basic_unit" clearable class="select-width"
                            placeholder="请选择基本单位" :disabled="!!marId">
                  <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="物料简称" prop="abbr">
                <el-input v-model.trim="form.abbr" placeholder="请输入物料简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="物料组" prop="group">
                <el-select v-model="form.group_id" placeholder="请输入物料组"
                            @change="changeMarGroup" class="select-width" filterable >
                  <el-option v-for="(item, index) in marGroupList" :key="index"
                            clearable filterable :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="生产日期" prop="prod_date">
                <el-date-picker v-model.trim="form.prod_date" type="date"
                                placeholder="请选择生产日期" class="select-width" @change="changeProDate"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="有效期至" prop="valid_period">
                <el-date-picker v-model="form.valid_period" type="date" @change="changeValidDate"
                                placeholder="请选择有效期" class="select-width">
                </el-date-picker>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="类别" prop="class">
                <el-input v-model.trim="form.class" placeholder="请输入类别"
                ></el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="20">
            <el-form-item label="备注">
              <el-input v-model.trim="form.remark" type="textarea" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="销售单位" prop="unit_info.sale" :rules="baseInfoRules.sale">
                <el-select v-model="form.unit_info.sale" clearable placeholder="请选择销售单位"
                          :disabled="!!marId" filterable>
                  <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="基本单位">
                {{form.basic_unit}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="转换系数" prop="unit_info.sale_ratio" :rules="baseInfoRules.saleRation">
                <el-input v-model.number="form.unit_info.sale_ratio"  type="number" placeholder="请输入转换系数"
                         :disabled="!!marId"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="采购单位" prop="unit_info.purchase" :rules="baseInfoRules.purchase">
                <el-select v-model="form.unit_info.purchase" clearable placeholder="请选择采购单位"
                          filterable :disabled="!!marId">
                  <el-option v-for="item in unitList" :key="item.id"
                             :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="基本单位">
                {{form.basic_unit}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="转换系数" prop="unit_info.purchase_ratio" :rules="baseInfoRules.purchaseRation">
                <el-input v-model.number="form.unit_info.purchase_ratio" type="number"
                          placeholder="请输入转换系数" :disabled="!!marId"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="库存单位" prop="unit_info.stock" :rules="baseInfoRules.stock">
                <el-select v-model="form.unit_info.stock" clearable placeholder="请选择库存单位"
                            filterable :disabled="!!marId">
                  <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="基本单位">
                {{form.basic_unit}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="转换系数" prop="unit_info.stock_ratio" :rules="baseInfoRules.stockRation">
                <el-input v-model.number="form.unit_info.stock_ratio" type="number"
                          placeholder="请输入转换系数" :disabled="!!marId">
                </el-input>
              </el-form-item>
            </el-col>
        </el-row>
    </el-collapse-item>
  </div>
</template>
<script>
import Title from '@/components/collapse-title/CollapseTitle'
import unit from '@/utils/data/unit'
import marGroup from '@/utils/data/marGroupList'
import * as moment from 'moment'

export default {
  name: 'BaseInfo',
  components: { Title },
  mixins: [unit(), marGroup()],
  props: {
    marId: {
      type: String,
      default: ''
    },
    form: {
      name: '', // 物料名称
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
        stock_ratio: null // 库存转换系数
      }
    }
  },
  data () {
    const checkNum = (rule, value, callback) => {
      if (value < 0 || value === 0) {
        callback(new Error('转换系数必须大于0'))
      } else {
        callback()
      }
    }
    return {
      unitList: [],
      supplierList: [],
      marGroupList: [],
      baseInfoRules: {
        name: [
          { required: true, message: '请输入物料名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        basic_unit: [
          { required: true, message: '请选择基本单位', trigger: 'change' }
        ],
        sale: [
          { required: true, message: '请选择销售单位', trigger: 'change' }
        ],
        saleRation: [
          { required: true, message: '请输入转换系数', trigger: 'change' },
          { validator: checkNum, trigger: 'change' }
        ],
        purchase: [
          { required: true, message: '请选择采购单位', trigger: 'change' }
        ],
        purchaseRation: [
          { required: true, message: '请输入转换系数', trigger: 'change' },
          { validator: checkNum, trigger: 'change' }
        ],
        stock: [
          { required: true, message: '请选择库存单位', trigger: 'change' }
        ],
        stockRation: [
          { required: true, message: '请输入转换系数', trigger: 'change' },
          { validator: checkNum, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getUnitList(list => {
      this.unitList = list.data
    })
    this.getMarGroupList(list => {
      this.marGroupList = list.data
    })
  },
  methods: {
    changeMarGroup (value) {
      if (value) {
        const arr = this.marGroupList.filter(item => value === item.id)
        this.form.property = [...arr[0].property]
      } else {
        this.form.group_id = null
        this.form.property = []
      }
    },
    changeProDate (time) {
      this.form.prod_date = moment(time).format('YYYY-MM-DDTHH:mm:ssZ')
    },
    changeValidDate (time) {
      this.form.valid_period = moment(time).format('YYYY-MM-DDTHH:mm:ssZ')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-collapse-item {
  border-bottom: 1px solid #DCDFE6;
}
.select-width {
  width: 100%
}
</style>
