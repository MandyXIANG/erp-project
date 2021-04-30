<template>
  <div class="basic-form ">
    <el-form :validate-on-rule-change="false" ref="form" :model="form" label-width="120px" :rules="rules">
      <template v-for="item in config">
        <el-col
          v-if="item.span == 12"
          :key="item.field"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            v-if="item.type == 'Input'"
            :label="item.label"
            :prop="item.validate ? item.field : ''"
          >
            <el-input
              v-model.trim="form[item.field]"
              :placeholder="item.placeholder"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="item.type == 'Select'"
            :label="item.label"
            :prop="item.validate ? item.field : ''"
          >
            <el-select
              style="width:100%"
              v-model="form[item.field]"
              :placeholder="item.placeholder"
            >
              <el-option
                v-for="jtem in item.options"
                :key="jtem.id"
                :label="jtem.value"
                :value="jtem.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          v-if="item.span == 24"
          :key="item.field"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="24"
        >
          <el-form-item
            v-if="item.type == 'Textarea'"
            :label="item.label"
            :prop="item.validate ? item.field : ''"
          >
            <el-input
              v-model="form[item.field]"
              :placeholder="item.placeholder"
              type="textarea"
              :rows="item.row"
            />
          </el-form-item>
        </el-col>
      </template>
    </el-form>
  </div>
</template>

<script>
import { getEnumGroup } from '@/utils/common.js'
export default {
  props: ['form', 'config', 'rules', 'codes'],
  watch: {
    form: {
      immediate: true,
      handler (v) {
        this.form = v
      }
    }
  },
  data () {
    return {
      enumConf: [],
      validate: false
    }
  },
  created () {
    getEnumGroup(this.codes).then(res => {
      this.enumConf = res
      this.initFormOptions()
    })
  },
  mounted () {

  },
  methods: {
    // 处理表单下拉框的选项
    initFormOptions () {
      for (const item of this.config) {
        if (item.code && item.code.length) {
          for (const jtem of this.enumConf) {
            if (item.code === jtem.category) {
              item.options = jtem.children
            }
          }
        }
      }
    },
    /**
     * 表单验证
     */
    validateForm () {
      this.$refs.form.validate((valid) => {
        this.validate = valid
      })
      return this.validate
    }
  }
}
</script>

<style lang="scss" scoped>
 .basic-form {
    // width: 95%;
    margin: 0 auto;
    .operation {
      cursor: pointer;
      color: $--color-primary;
    }
  }
</style>
