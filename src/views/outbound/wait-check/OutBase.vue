<template>
    <div>
      <el-collapse-item name="2">
        <template slot="title">
          <Title title="审核信息"></Title>
        </template>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="审核结果" prop="state" :rules="checkRules.state">
                <el-select v-model="form.state" class="select-width" placeholder="请选择审核结果">
                  <el-option v-for="(item, index) in resultList" :key="index"
                              :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
            <el-form-item label="备注">
              <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
    </div>
</template>
<script>
import Title from '@/components/collapse-title/CollapseTitle'
import { resultList } from './checkConfig'

export default {
  name: 'OutBase',
  components: { Title },
  props: {
    form: {
      state: null,
      remark: null
    }
  },
  data () {
    return {
      resultList,
      formData: this.form,
      checkRules: {
        state: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.form.state = 'unstart'
  }
}
</script>
