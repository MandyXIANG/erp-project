<template>
  <div>
    <el-collapse-item name="4">
      <template slot="title">
        <Title title="其他信息"/>
      </template>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="增值税">
                <el-select v-model="form.trans_tax" clearable @change="changeTransTax"
                           class="select-width" placeholder="请选择增值税">
                  <el-option v-for="(item, index) in taxOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="HS编码">
                <el-select v-model="form.hscode.id" clearable @change="changeHs"
                          class="select-width" placeholder="请选择HS编码">
                  <el-option v-for="(item, index) in HsList" :key="index"
                            :label="item.code" :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
    </el-collapse-item>
  </div>
</template>
<script>
import Title from '@/components/collapse-title/CollapseTitle'
import { taxOptions } from './materConfig'
import hs from '@/utils/data/hs'
export default {
  name: 'Other',
  components: { Title },
  mixins: [hs()],
  props: {
    form: {
      trans_tax: null, // 增值税
      hscode: { // hs编码
        code: null,
        description: '',
        import_tax: null,
        unit: '',
        id: null
      }
    }
  },
  data () {
    return {
      taxOptions,
      HsList: []
    }
  },
  created () {
    this.getHsList(list => {
      this.HsList = list.data
    })
  },
  methods: {
    changeHs (value) {
      if (!value) {
        this.form.hscode = { // hs编码
          code: null,
          description: '',
          import_tax: null,
          unit: '',
          id: null
        }
        return
      }
      this.$http.get(`/base/hs/${value}`).then(res => {
        this.form.hscode = res.data
      })
    },
    changeTransTax (value) {
      if (value === '') {
        this.form.trans_tax = null
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
