<template>
  <div>
    <el-collapse-item name="2">
      <template slot="title">
        <Title title="物料组属性"/>
      </template>
      <div class="topbar-btn">
          <el-tooltip class="item" effect="dark" content="点击添加属性" placement="top-start">
            <el-button type="primary" icon="el-icon-plus" circle size="small" @click="addType"></el-button>
          </el-tooltip>
      </div>
        <el-table :data="form.property" stripe border>
            <el-table-column label="属性名称">
              <template slot-scope="scope">
                <el-form-item :prop="'property.' + scope.$index + '.name'"
                              :rules="typeRules.name">
                  <el-input v-model.trim="scope.row.name" placeholder="请输入属性名称"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="属性代码">
              <template slot-scope="scope">
                <el-form-item :prop="'property.' + scope.$index + '.code'"
                              :rules="typeRules.code">
                  <el-input v-model.trim="scope.row.code" placeholder="长度：length，宽度：width，高度：height"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="是否管控">
              <template slot-scope="scope">
                <el-form-item :prop="'property.' + scope.$index + '.control'"
                              :rules="typeRules.control">
                  <el-switch v-model.trim="scope.row.control"></el-switch>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="属性值">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model.trim="scope.row.value" placeholder="请输入属性值"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                 <el-form-item>
                    <el-button type="danger" icon="el-icon-delete" circle size="small" @click.native.prevent="delType(scope.$index, form.property)"></el-button>
                 </el-form-item>
              </template>
            </el-table-column>
        </el-table>
    </el-collapse-item>
  </div>
</template>
<script>
import Title from '@/components/collapse-title/CollapseTitle'
export default {
  name: 'Type',
  components: { Title },
  props: {
    form: {
      property: []
    }
  },
  data () {
    return {
      typeRules: {
        name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入类别名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    addType () {
      this.form.property.push({
        name: '',
        code: '',
        control: false,
        value: ''
      })
    },
    delType (index, data) {
      data.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-collapse-item {
  border-bottom: 1px solid #DCDFE6;
  /deep/ .el-form-item__content{
    margin-left: 0 !important;
  }
}
</style>
