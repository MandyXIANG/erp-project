<template>
    <div class="page-wraper">
      <PageHeader :title="operateFlag === 'edit' ? `${hsForm.code}` : '新增HS编码'" :back="true" @back="goBack" />
      <el-form ref="hsForm" :model="hsForm" :rules="hsFormRules" label-width="100px" label-position="left">
       <el-row type="flex" justify="center">
          <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
            <el-form-item label="HS编码" prop="code">
              <el-input v-model.trim="hsForm.code" placeholder="请输入HS编码"></el-input>
            </el-form-item>
          </el-col>
       </el-row>
       <el-row type="flex" justify="center">
          <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
            <el-form-item label="编码描述" prop="description">
              <el-input v-model.trim="hsForm.description" placeholder="请输入编码描述"></el-input>
            </el-form-item>
          </el-col>
       </el-row>
       <el-row type="flex" justify="center">
          <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
            <el-form-item label="第一单位" prop="unit">
              <el-input v-model.trim="hsForm.unit" placeholder="请输入第一单位"></el-input>
            </el-form-item>
          </el-col>
       </el-row>
       <el-row type="flex" justify="center">
          <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
            <el-form-item label="进口税率" prop="import_tax">
              <el-input v-model.number="hsForm.import_tax" type="number" v-precision
                      placeholder="请输入进口关税">
                      <template slot="suffix">%</template>
              </el-input>
            </el-form-item>
          </el-col>
       </el-row>
       <el-row type="flex" justify="center">
         <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
           <el-form-item class="position">
              <el-button @click="$router.go(-1)">返回</el-button>
              <el-button type="primary" :loading="submitLoading" @click="onSubmit('hsForm')">提交</el-button>
           </el-form-item>
         </el-col>
       </el-row>
    </el-form>
    </div>
</template>
<script>
import PageHeader from '@/components/title/Title'
export default {
  name: 'EditHs',
  components: { PageHeader },
  data () {
    return {
      submitLoading: false,
      hsForm: {
        id: 0,
        code: '',
        description: '',
        import_tax: '',
        unit: ''
      },
      HsId: '',
      hsFormRules: {
        code: [
          { required: true, message: '请输入HS编码', trigger: 'change' }
        ],
        unit: [
          { required: true, message: '请输入第一单位', trigger: 'change' }
        ],
        import_tax: [
          { required: true, message: '请输入关税', trigger: 'change' },
          { type: 'number', message: '关税必须为数字值', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    operateFlag () {
      return this.$route.params.operation
    }
  },
  mounted () {
    this.HsId = this.$route.query.id
    if (this.HsId) {
      this.initForm(this.HsId)
    }
  },
  methods: {
    initForm (id) {
      this.$http.get(`/base/hs/${id}`).then(res => {
        this.hsForm = res.data
      })
    },
    validHsForm (hsForm, callback) {
      this.$refs.hsForm.validate(valid => {
        if (!valid) {
          this.submitLoading = false
          return false
        } else {
          this.saveHsForm(callback)
        }
      })
    },
    saveHsForm (callback) {
      const params = this.hsForm
      if (this.operateFlag === 'add') {
        this.$http.post('/base/hs', { data: params, error_return: true }).then(res => {
          const result = res
          callback(result)
        }).catch(err => {
          this.submitLoading = false
          if (err.code === 15) {
            this.$message.error(`HS编码${this.hsForm.code}已存在`)
          }
          if (err.code === 16) {
            this.$message.error(`HS编码${this.hsForm.code}重复使用`)
          }
        })
      }
      if (this.operateFlag === 'edit') {
        this.$http.put('/base/hs', { data: params, error_return: true }).then(res => {
          const result = res
          callback(result)
        }).catch(err => {
          this.submitLoading = false
          if (err.code === 15) {
            this.$message.error(`HS编码${this.ruleForm.code}已存在`)
          }
          if (err.code === 16) {
            this.$message.error(`HS编码${this.ruleForm.code}重复使用`)
          }
        })
      }
    },
    onSubmit (hsForm) {
      this.submitLoading = true
      this.validHsForm(hsForm, result => {
        if (result.code === 0) {
          this.$message.success('操作成功')
          this.submitLoading = false
          this.goBack()
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
