<template>
  <div>
    <el-collapse-item name="3">
      <template slot="title">
        <Title title="仓储信息"/>
      </template>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="默认仓库">
                <el-select v-model="form.warehouse_info.warehouse_name" filterable clearable
                            class="select-width" @change="changeWarehouse($event)"
                            placeholder="请输入仓库名称或代码搜索">
                  <el-option v-for="item in warehouseList" :key="item.id"
                            :label="item.name" :value="{ id: item.id, name: item.name }">
                            <span class="erp-option-left">{{ item.code }}</span>
                            <span class="erp-option-right">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="默认区位">
                <el-select v-model="form.warehouse_info.area_name" clearable filterable
                          class="select-width" @change="changeArea($event)"
                          placeholder="请输入区位名称和代码搜索">
                  <el-option v-for="item in areaList" :key="item.id"
                            :label="item.name" :value="{ id: item.id, name: item.name }">
                          <span class="erp-option-left">{{ item.code }}</span>
                          <span class="erp-option-right">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="默认库位">
                <el-select v-model="form.warehouse_info.location_name" clearable
                          class="select-width" @change="changeLocation($event)" filterable
                          placeholder="请输入库位名称和代码进行搜索">
                  <el-option v-for="item in locationList" :key="item.id"
                            :label="item.name" :value="{ id: item.id, name: item.name }">
                            <span class="erp-option-left">{{ item.code }}</span>
                            <span class="erp-option-right">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="库存单位">
                <el-input v-model="form.unit_info.stock" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10">
              <el-form-item label="仓库结算方式" clearable>
                <el-select v-model="form.warehouse_info.settle_method_name"
                          class="select-width" placeholder="请选择仓库结算方式" @change="changeSettle($event)">
                  <el-option v-for="(item, index) in SettleList" :key="index"
                             :label="item.label" :value="{id: item.value, name: item.label}">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="10">
              <el-form-item label="是否免检">
                <el-radio-group v-model="form.warehouse_info.verify">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="超发方式">
                <el-select v-model="form.warehouse_info.over_sale_name" clearable
                          @change="changeOverSale($event)" class="select-width" placeholder="请选择超发方式">
                  <el-option v-for="(item, index) in overSaleList" :key="index"
                             :label="item.label" :value="{id: item.value, name: item.label}">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="最大库存预警">
                <el-radio-group v-model="form.warehouse_info.max_alert">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="最小库存预警">
                <el-radio-group v-model="form.warehouse_info.min_alert">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="安全库存预警">
                <el-radio-group v-model="form.warehouse_info.safe_alert">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="最大库存量" prop="warehouse_info.max_num" :rules="storageRules.max_num">
                <el-input  type="number" v-model.number="form.warehouse_info.max_num"
                            placeholder="请输入最大库存量" @change="changeMaxNum">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="安全库存量" prop="warehouse_info.safe_num" :rules="storageRules.safe_num">
                <el-input  type="number" v-model.number="form.warehouse_info.safe_num"
                            placeholder="请输入安全库存量" @change="changeSafeNum">
                </el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="最小库存量" prop="warehouse_info.min_num" :rules="storageRules.min_num">
                <el-input  type="number" v-model.number="form.warehouse_info.min_num"
                          placeholder="请输入最小库存量" @change="changeMinNum">
                </el-input>
              </el-form-item>
            </el-col>
        </el-row>
    </el-collapse-item>
  </div>
</template>
<script>
import Title from '@/components/collapse-title/CollapseTitle'
import warehouse from '@/utils/data/warehouse'
import { SettleList, overSaleList } from './materConfig'
export default {
  name: 'Storage',
  components: { Title },
  mixins: [warehouse()],
  props: {
    form: {
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
      }
    }
  },
  data () {
    // 验证最大库存量
    const validateMaxRequered = (rule, value, callback) => {
      const safeNum = +this.form.warehouse_info.safe_num
      const minNum = +this.form.warehouse_info.min_num
      if (value && value < 0) {
        return callback(new Error('最大库存量必须大于0'))
      }
      if (value && safeNum && safeNum > value) {
        return callback(new Error('最大库存量 ≥ 安全库存量 ≥ 最小库存量'))
      }
      if (value && minNum && minNum > value) {
        return callback(new Error('最大库存量 ≥ 安全库存量 ≥ 最小库存量'))
      } else {
        return callback()
      }
    }
    // 验证安全库存量
    const validateSafeRequered = (rule, value, callback) => {
      const maxNum = +this.form.warehouse_info.max_num
      const minNum = +this.form.warehouse_info.min_num
      if (value && value < 0) {
        return callback(new Error('安全库存量必须大于0'))
      }
      if (value && maxNum && maxNum < value) {
        return callback(new Error('最大库存量 ≥ 安全库存量 ≥ 最小库存量'))
      }
      if (value && minNum && minNum > value) {
        return callback(new Error('最大库存量 ≥ 安全库存量 ≥ 最小库存量'))
      } else {
        return callback()
      }
    }
    // 验证最小库存量
    const validateMinRequered = (rule, value, callback) => {
      const maxNum = +this.form.warehouse_info.max_num
      const safeNum = +this.form.warehouse_info.safe_num
      if (value && value < 0) {
        return callback(new Error('最小库存量必须大于0'))
      }
      if (value && maxNum && maxNum < value) {
        return callback(new Error('最大库存量 ≥ 安全库存量 ≥ 最小库存量'))
      }
      if (value && safeNum && safeNum < value) {
        return callback(new Error('最大库存量 ≥ 安全库存量 ≥ 最小库存量'))
      } else {
        return callback()
      }
    }
    return {
      SettleList,
      overSaleList,
      areaId: null,
      warehouseList: [], // 仓库列表
      areaList: [], // 库位列表
      locationList: [], // 区位列表
      storageRules: {
        max_num: [
          { validator: validateMaxRequered, trigger: 'blur' }
        ],
        safe_num: [
          { validator: validateSafeRequered, trigger: 'blur' }
        ],
        min_num: [
          { validator: validateMinRequered, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'form.warehouse_info.warehouse': {
      handler (newValue, oldValue) {
        const warehouseId = newValue
        if (warehouseId) {
          this.getSpaceArea(warehouseId, list => {
            this.areaList = list.children
            if (this.areaId) {
              this.areaList.map(k => {
                if (k.id === this.areaId) {
                  this.locationList = k.children
                }
              })
            }
          })
        }
      },
      deep: true
    },
    'form.warehouse_info.area': {
      handler (newValue, oldValue) {
        this.areaId = newValue
      },
      deep: true
    }
  },
  created () {
    this.getWarehouseList()
  },
  methods: {
    // 仓库获取区位
    changeWarehouse (event) {
      this.areaList = []
      this.form.warehouse_info.area = null
      this.form.warehouse_info.area_name = null
      this.locationList = []
      this.form.warehouse_info.location = null
      this.form.warehouse_info.location_name = null
      if (!event.id) {
        this.form.warehouse_info.warehouse = null
        this.form.warehouse_info.warehouse_name = null
        return
      }
      this.form.warehouse_info.warehouse = event.id
      this.form.warehouse_info.warehouse_name = event.name
      this.getSpaceArea(event.id, list => {
        this.areaList = list.children
      })
    },
    changeSettle (event) {
      this.form.warehouse_info.settle_method = event.id
      this.form.warehouse_info.settle_method_name = event.name
    },
    changeOverSale (event) {
      this.form.warehouse_info.over_sale = event.id
      this.form.warehouse_info.over_sale_name = event.name
    },
    // 区位获取库位
    changeArea (event) {
      this.locationList = []
      this.form.warehouse_info.location = null
      this.form.warehouse_info.location_name = null
      if (!event.id) {
        this.form.warehouse_info.area = null
        this.form.warehouse_info.area_name = null
        return
      }
      this.form.warehouse_info.area = event.id
      this.form.warehouse_info.area_name = event.name
      this.areaList.map(k => {
        if (k.id === event.id) {
          this.locationList = k.children
        }
      })
    },
    // 更改库位
    changeLocation (event) {
      if (!event.id) {
        this.form.warehouse_info.location = null
        this.form.warehouse_info.location_name = null
        return
      }
      this.form.warehouse_info.location = event.id
      this.form.warehouse_info.location_name = event.name
    },
    changeMaxNum (value) {
      if (!value) {
        this.form.warehouse_info.max_num = null
      }
    },
    changeSafeNum (value) {
      if (!value) {
        this.form.warehouse_info.safe_num = null
      }
    },
    changeMinNum (value) {
      if (!value) {
        this.form.warehouse_info.min_num = null
      }
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
