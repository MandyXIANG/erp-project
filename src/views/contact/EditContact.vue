<template>
  <div>
    <PageHeader :title="operationFlag === 'edit' ? `${this.ruleForm.name}`: '新增联系人'"
                :back="true" @back="goBack">
    </PageHeader>
    <el-form :model="ruleForm" ref="ruleForm" label-width="160px">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <Title :title="'基本信息'"></Title>
          </template>
          <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="姓名" prop="name" :rules="contactRule.name">
                <el-input v-model.trim="ruleForm.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="性别">
                <el-radio-group v-model="ruleForm.gender">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="联系人关系">
                <el-input v-model.trim="ruleForm.relation" placeholder="请输入联系人关系"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="联系人来源" prop="source">
                <el-radio-group v-model="ruleForm.source" @change="changeValue">
                  <el-radio label="客户"></el-radio>
                  <el-radio label="供应商"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="公司">
                <el-select v-model="ruleForm.corp" placeholder="请选择公司" class="select-width" clearable>
                  <el-option v-for="(item, index) in lists" :key="index"
                            :label="item.fullname" :value="item.fullname">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="部门" prop="department" :rules="contactRule.department">
                <el-input v-model.trim="ruleForm.department" placeholder="请输入部门"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="职位">
                <el-input v-model.trim="ruleForm.position" placeholder="请输入职位"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="状态" prop="state" :rules="contactRule.state">
                <el-radio-group v-model="ruleForm.state">
                  <el-radio label="valid">有效</el-radio>
                  <el-radio label="invalid">无效</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="出生日期">
                <el-date-picker v-model="ruleForm.birth.birth_day" type="date"
                      @change="changeBirth" placeholder="请选择出生日期" class="select-width">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="生日提醒">
                <el-radio-group v-model="ruleForm.birth.remind">
                  <el-radio :disabled="!ruleForm.birth.birth_day" :label="true" @change="changeRemind">是</el-radio>
                  <el-radio :disabled="!ruleForm.birth.birth_day" :label="false" @change="changeRemind">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="提前期">
                <el-input v-model.number="ruleForm.birth.ahead_of_time" :disabled="!ruleForm.birth.birth_day"
                          type="number" placeholder="请输入提前期">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="电话" prop="tel" :rules="contactRule.tel">
                <el-input v-model.number="ruleForm.tel" type="number" placeholder="请输入电话号码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="10">
              <el-form-item label="邮箱" prop="mail" :rules="contactRule.mail">
                <el-input v-model.trim="ruleForm.mail" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="备注">
                <el-input v-model.trim="ruleForm.remark" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <div class="bottom-list">
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit('ruleForm')">提交</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import PageHeader from '@/components/title/Title'
import Title from '@/components/collapse-title/CollapseTitle'
import supplier from '@/utils/data/supplier'
import customer from '@/utils/data/customer'
import * as moment from 'moment'

export default {
  name: 'EditContact',
  components: { PageHeader, Title },
  mixins: [supplier(), customer()],
  data () {
    const checkPhone = (rule, value, callback) => {
      if (value) {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        const tel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
        if (reg.test(value) || tel.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的电话号码'))
        }
      } else {
        callback()
      }
    }
    return {
      activeNames: ['1'],
      submitLoading: false,
      ruleForm: {
        name: null, // 名字
        gender: null, // 性别
        birth: {
          ahead_of_time: null, // 提醒天数
          birth_day: null, // 出生日期
          remind: null // 生日提醒
        },
        tel: null, // 电话号码
        mail: null, // 电子邮箱
        state: 'valid', // 状态
        relation: null, // 关系
        source: null, // 来源
        corp: null, // 公司
        department: null, // 部门
        position: null, // 职位
        remark: null // 备注
      },
      lists: [],
      contactRule: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        department: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        mail: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        tel: [
          { validator: checkPhone, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    operationFlag () {
      return this.$route.params.operation
    }
  },
  mounted () {
    const id = this.$route.query.id
    if (id) {
      this.getContactFormData(id)
    }
  },
  methods: {
    changeValue (value) {
      if (!value) {
        this.lists = []
      }
      if (value === '客户') {
        this.getCustomerList(list => {
          this.lists = list.data
          this.isInclude(this.ruleForm.corp, this.lists)
        })
      }
      if (value === '供应商') {
        this.getSupplierList(list => {
          this.lists = list.data
          this.isInclude(this.ruleForm.corp, this.lists)
        })
      }
    },
    isInclude (value, arr) {
      const arrFullName = arr.map(k => k.fullname)
      arrFullName.includes(value) ? this.ruleForm.corp = value : this.ruleForm.corp = null
    },
    changeBirth (value) {
      if (value) {
        this.ruleForm.birth.birth_day = moment(value).format('YYYY-MM-DD')
        this.ruleForm.birth.remind = true
        this.ruleForm.birth.ahead_of_time = 10
      } else {
        this.ruleForm.birth.remind = null
        this.ruleForm.birth.ahead_of_time = null
      }
    },
    getContactFormData (id) {
      this.$http.get(`/base/contact/${id}`).then(res => {
        const result = res.data
        this.ruleForm = result
        if (!this.ruleForm.birth.birth_day) {
          this.ruleForm.birth.remind = null
        }
        this.changeValue(this.ruleForm.source)
      })
    },
    validContactForm (ruleForm, callback) {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.submitLoading = false
          return false
        } else if (this.ruleForm.birth.ahead_of_time < 0 || this.ruleForm.birth.ahead_of_time > 366) {
          this.$message.error('提前期错误')
          this.submitLoading = false
          return false
        } else {
          if (this.ruleForm.birth.remind === null) {
            this.ruleForm.birth.remind = false
          }
          this.saveContactForm(callback)
        }
      })
    },
    saveContactForm (callback) {
      const params = this.ruleForm
      if (this.operationFlag === 'add') {
        this.$http.post('/base/contact', { data: params }).then(res => {
          const result = res
          callback(result)
        })
      }
      if (this.operationFlag === 'edit') {
        this.$http.put('/base/contact', { data: params }).then(res => {
          const result = res
          callback(result)
        })
      }
    },
    onSubmit (ruleForm) {
      this.submitLoading = true
      this.validContactForm(ruleForm, result => {
        if (result.code === 0) {
          this.$message.success('操作成功')
          this.submitLoading = false
          this.goBack()
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    changeRemind (value) {
      if (!value) {
        this.ruleForm.birth.ahead_of_time = null
      } else {
        this.ruleForm.birth.ahead_of_time = 10
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.bottom-list {
  margin-top: $padding-md;
  text-align: center;
}
.select-width {
  width: 100%;
}
</style>
