<template>
    <div>
      <el-collapse-item name="1">
        <template slot="title">
          <Title title="基本信息"></Title>
        </template>
        <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="物料组名称" prop="name" :rules="BaseInfoRule.name">
                <el-input v-model.trim="form.name" placeholder="请输入物料组名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="备注" prop="remark">
                <el-input v-model.trim="form.remark" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
      </el-collapse-item>
    </div>
</template>
<script>
import Title from '@/components/collapse-title/CollapseTitle'
export default {
  name: 'BaseInfo',
  components: { Title },
  props: {
    form: {
      name: '',
      remark: ''
    }
  },
  data () {
    return {
      BaseInfoRule: {
        code: [{ required: true, message: '请输入物料组编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入物料组名称', trigger: 'blur' }]
      }
    }
  }
}
</script>
