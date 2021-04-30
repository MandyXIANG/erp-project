<template>
  <div class="new-customer-container">
    <PageHeader :title="pageTitle" :back="true" @back="goBack" />
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <Title title="基本信息" />
        </template>
        <Basic
          ref="basicForm"
          :form="form"
          :config="basicForm"
          :rules="rules"
          :codes="codes"
        />
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <Title title="联系信息" />
        </template>
        <RelationInfo
          ref="relationForm"
          :form="form"
          @deleteItem="deleteItem"
          @addItem="addItem"
        />
      </el-collapse-item>
      <!-- <el-collapse-item name="3">
        <template slot="title">
          <Title title="联系人信息" />
        </template>
        <RelationPeople
          :personTableData="personTableData"
          :personTableCol="personTableCol"
          :relationForm="relationForm"
        />
      </el-collapse-item> -->
      <el-collapse-item name="4">
        <template slot="title">
          <Title title="财务信息" />
        </template>
        <FinancialInfo
          ref="financialForm"
          :form="financialForm"
          :config="staticFinanceForm"
          @deleteItem="deleteItem"
          @addItem="addItem"
        />
      </el-collapse-item>
    </el-collapse>
    <div class="btm-area">
      <el-button type="primary" :loading="btnLoading" @click="onSubmit"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'
import Title from '@/components/collapse-title/CollapseTitle.vue'
import Basic from './components/Basic'
import RelationInfo from './components/RelationInfo.vue'
// import RelationPeople from './components/RelationPeople.vue'
import FinancialInfo from './components/FinancialInfo'
import PageHeader from '@/components/title/Title.vue'
// import { getEnum } from '@/utils/common.js'

import {
  dynamicForm,
  basicForm,
  staticFinanceForm,
  personTableCol,
  relationForm,
  FdynamicForm,
  API_MAP,
  ENUM_MAP
} from './config'
export default {
  components: {
    Title,
    Basic,
    RelationInfo,
    // RelationPeople,
    FinancialInfo,
    PageHeader
  },
  data () {
    return {
      form: {}, // 表单对象
      activeName: ['1', '2', '3', '4'],
      selectId: null,
      dynamicForm,
      FdynamicForm,
      basicForm,
      staticFinanceForm,
      personTableCol,
      relationForm,
      financialForm: {},
      rules: {},
      itemInfo: {},
      codes: [
        ENUM_MAP.corp_class,
        ENUM_MAP.corp_state,
        ENUM_MAP.corp_kind,
        ENUM_MAP.corp_type
      ],
      pageTitle: '',
      btnLoading: false
    }
  },
  created () {},

  mounted () {
    this.rules = {
      code: [
        {
          required: true,
          message: '请输入客户代码',
          trigger: ['blur', 'change']
        }
      ],
      name: [
        { required: true, message: '请输入简称', trigger: ['blur', 'change'] }
      ],
      fullname: [
        { required: true, message: '请输入全称', trigger: ['blur', 'change'] }
      ]
    }
    this.initForm()
  },
  methods: {
    getItemInfo () {
      this.$http.get(API_MAP.GET_CUSTOMER + `/${this.selectId}`).then(res => {
        if (res.code === 0) {
          this.itemInfo = res.data || {}
          this.pageTitle = this.itemInfo.fullname
          this.handleFormData()
        }
      })
    },
    initForm () {
      this.selectId = this.$route.query.id || null
      if (this.selectId) {
        // 编辑页面
        this.getItemInfo()
      } else {
        this.form = {}
        this.financialForm = {}
        this.dynamicForm = _.cloneDeep(dynamicForm)
        this.FdynamicForm = _.cloneDeep(FdynamicForm)
        this.pageTitle = '新增客户'
      }
      this.form = { ...this.dynamicForm, ...this.form }
      this.financialForm = Object.assign(this.FdynamicForm, this.financialForm)
    },
    /**
     * 处理表单数据结构
     */
    handleFormData () {
      const info = _.cloneDeep(this.itemInfo)
      delete info.financial
      const cpyFinacForm = this.itemInfo.financial // 财务信息表单
      const cpyForm = info // 其他表单
      cpyForm.addr = this.setValue(cpyForm.addr)
      cpyForm.site = this.setValue(cpyForm.site)
      cpyForm.tel = this.setValue(cpyForm.tel)
      cpyForm.mail = this.setValue(cpyForm.mail)
      cpyForm.fax = this.setValue(cpyForm.fax)
      cpyFinacForm.fax = this.setValue(cpyFinacForm.fax)
      cpyFinacForm.addr = this.setValue(cpyFinacForm.addr)
      cpyFinacForm.post_code = this.setValue(cpyFinacForm.post_code)
      cpyFinacForm.tel = this.setValue(cpyFinacForm.tel)
      this.form = cpyForm
      this.financialForm = cpyFinacForm
    },
    goBack () {
      this.$router.go(-1)
    },
    onSubmit () {
      this.btnLoading = true
      const validate1 = this.$refs.basicForm.validateForm()
      const validate2 = this.$refs.relationForm.validateForm()
      const validate3 = this.$refs.financialForm.validateForm()
      if (!validate1 || !validate2 || !validate3) {
        this.btnLoading = false
        return
      }
      const params = this.getParams()
      if (!this.selectId) {
        this.$http
          .post(API_MAP.NEW_CUSTOMER, { data: params, error_return: true })
          .then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.btnLoading = false
              this.goBack()
            }
          })
          .catch(err => {
            this.btnLoading = false
            if (err.code === 15) {
              this.$message.error(`客户代码${this.form.code}已存在`)
            } else if (err.code === 16) {
              this.$message.error(`客户代码${this.form.code}重复使用`)
            } else {
              this.$message.error(err.msg)
            }
          })
      } else {
        this.$http
          .put(API_MAP.UPDATE_CUSTOMER, { data: params, error_return: true })
          .then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.btnLoading = false
              this.goBack()
            }
          })
          .catch(err => {
            this.btnLoading = false
            if (err.code === 15) {
              this.$message.error(`客户代码${this.form.code}已存在`)
            } else if (err.code === 16) {
              this.$message.error(`客户代码${this.form.code}重复使用`)
            } else {
              this.$message.error(err.msg)
            }
          })
      }
    },
    /**
     * 动态添加控件
     */
    addItem (arr) {
      arr.push({ value: '' })
    },
    /**
     * 删除控件
     */
    deleteItem (arr, index) {
      if (arr.length > 1) {
        arr.splice(index, 1)
      }
    },
    // 获取动态表单里面的value
    getValue (arr) {
      const res = []
      for (const item of arr) {
        if (item.value.trim() && item.value.trim().length) {
          res.push(item.value)
        }
      }
      return res
    },
    // 给动态表单设置value
    setValue (arr) {
      let res = []
      for (const item of arr) {
        const ele = { value: item }
        res.push(ele)
      }
      if (!res.length) res = [{ value: '' }]
      return res
    },
    /**
     * 处理传参
     */
    getParams () {
      const newForm = _.cloneDeep(this.form)
      const newFinacialForm = _.cloneDeep(this.financialForm)
      newForm.addr = this.getValue(this.form.addr)
      newForm.fax = this.getValue(this.form.fax)
      newForm.tel = this.getValue(this.form.tel)
      newForm.site = this.getValue(this.form.site)
      newForm.mail = this.getValue(this.form.mail)
      newFinacialForm.addr = this.getValue(this.financialForm.addr)
      newFinacialForm.fax = this.getValue(this.financialForm.fax)
      newFinacialForm.post_code = this.getValue(this.financialForm.post_code)
      newFinacialForm.tel = this.getValue(this.financialForm.tel)

      const params = { ...newForm }
      params.financial = newFinacialForm
      for (const key in params) {
        if (params[key] === '') {
          params[key] = null
        }
      }
      return params
    }
  }
}
</script>

<style lang="scss" scoped>
.new-customer-container {
  display: flex;
  flex-direction: column;
  /deep/ .customer-form {
    // width: 95%;
    margin: 0 auto;
    .operation {
      cursor: pointer;
      color: $--color-primary;
    }
    .el-form-item {
      width: 80%;
      /deep/ .el-form-item__content {
        width: 100%;
      }
    }
  }
  /deep/ .contact-form {
    .contact-form-item {
      display: flex;
      align-items: center;
      margin-bottom: $padding-xs;
      i {
        font-size: 26px;
        margin-left: 16px;
        cursor: pointer;
      }
    }
  }
  .btm-area {
    text-align: center;
    margin-top: $padding-md;
  }
  /deep/ .icon-ban {
    color: #c0c4cc;
    cursor: not-allowed !important;
  }
}
/deep/ .el-dialog__body {
  height: 400px;
  overflow: auto;
}
</style>
