<template>
  <div>
    <el-collapse-item name="5">
      <template slot="title">
        <Title title="采购信息"/>
      </template>
      <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="采购物料单位">
                <el-input v-model="form.unit_info.purchase" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
                <el-form-item label="默认供应商">
                    <el-select v-model="form.purchase.supplier_name" class="select-width"
                              clearable filterable ref="selectSupplier"
                              @change="changeSupplier($event)" placeholder="请选择默认供应商">
                      <el-option v-for="item in supplierList" :key="item.id" :label="item.fullname" :value="{id: item.id, name: item.fullname}"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="到货提醒">
                <el-radio-group v-model.trim="form.purchase.notify">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="收货提前天数">
                <el-input type="number" v-model.number="form.purchase.ahead"
                          placeholder="请输入收货提前天数" @change="changeAhead"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="最小订货量" prop="planing.min">
                <el-input type="number" v-model.number="form.planing.min"
                          placeholder="请输入最小订货量" @change="changePlanMin"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="固定批量" prop="planing.fixed">
                <el-input type="number" v-model.number="form.planing.fixed"
                          placeholder="请输入固定批量" @change="changePlanFix">
                </el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="允许退料">
                <el-radio-group v-model="form.purchase.withdraw">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
        </el-row>
    </el-collapse-item>
  </div>
</template>
<script>
import Title from '@/components/collapse-title/CollapseTitle'
import supplier from '@/utils/data/supplier'
export default {
  name: 'Purchase',
  components: { Title },
  mixins: [supplier()],
  props: {
    form: {
      purchase: { // 采购信息
        supplier: null, // 供应商
        supplier_name: null,
        withdraw: false, // 允许退料
        notify: false, // 到货提醒
        ahead: null // 到货提前天数
      },
      planing: {
        min: null, // 最小订货量
        fixed: null // 固定批量
      }
    }
  },
  data () {
    return {
      supplierList: [],
      supplierName: '',
      supplierId: '',
      marName: ''
    }
  },
  created () {
    this.getSupplierList(list => {
      this.supplierList = list.data
    })
  },
  watch: {
    'form.purchase': {
      handler (newValue, oldValue) {
        this.supplierName = newValue.supplier_name
        this.supplierId = newValue.supplier
      }
    },
    'form.name': {
      handler (newValue, oldValue) {
        this.marName = newValue
      },
      deep: true
    }
  },
  methods: {
    changeSupplier (event) {
      if (this.supplierName) {
        this.$confirmMsg(`是否将物料【${this.marName}】从供应商【${this.supplierName}】中删除`).then(() => {
          this.form.purchase.supplier = event.id
          this.form.purchase.supplier_name = event.name
          this.$refs.selectSupplier.handleClose()
        }).catch(() => {
          this.form.purchase.supplier = this.supplierId
          this.form.purchase.supplier_name = this.supplierName
        })
      } else {
        this.form.purchase.supplier = event.id
        this.form.purchase.supplier_name = event.name
      }
    },
    changeAhead (value) {
      if (!value) {
        this.form.purchase.ahead = null
      }
    },
    changePlanMin (value) {
      if (!value) {
        this.form.planing.min = null
      }
    },
    changePlanFix (value) {
      if (!value) {
        this.form.planing.fixed = null
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
