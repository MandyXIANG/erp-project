<template>
  <div class="new-request-list">
    <PageHeader :title="pageTitle" :back="true" @back="goBack" />

    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <Title title="基本信息" />
        </template>
        <div class="content">
          <el-form :form="form" label-width="120px" class="info-from">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="请购单类型">
                <el-select
                  style="width:100%"
                  v-model="form.class"
                  disabled
                  placeholder="请选择请购单类型"
                >
                  <el-option
                    v-for="item in classOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="请购人">
                <el-select
                  style="width:100%"
                  v-model="form.operator"
                  placeholder="请输入用户名或全名搜索"
                  filterable
                  remote
                  :remote-method="getUserList"
                  @change="onUserChange"
                >
                  <el-option
                    v-for="item in users"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  >
                    <span class="erp-option-left">{{ item.name }}</span>
                    <span class="erp-option-right">{{ item.fullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="需求时间">
                <el-date-picker
                  v-model="form['demand_time']"
                  style="width:100%"
                  type="date"
                  placeholder="请选择需求时间"
                  value-format="yyyy-MM-dd"
                  @change="mainDateChange"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <Title title="请购明细" />
        </template>
        <div class="content">
          <el-button type="primary" class="topbar-btn" @click="newOrEdit"
            >添加物料</el-button
          >
          <Table
            :data="spliceTableData"
            :total="materialTableData.length"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            @size-change="onSizeChange"
            @current-change="onCurrentChange"
          >
            <el-table-column
              v-for="(item, index) in materialTableCols"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :formatter="formatter"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-popconfirm
                  title="确定要删除吗?"
                  @onConfirm="onDelete(scope)"
                >
                  <span slot="reference" class="table-detail">删除</span>
                </el-popconfirm>
                <el-divider direction="vertical"></el-divider>
                <span class="table-detail" @click="editMaterial(scope)"
                  >编辑</span
                >
              </template>
            </el-table-column>
          </Table>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="btm-area">
      <el-button
        :disabled="!materialTableData.length"
        type="primary"
        :loading="draftBtnLoading"
        @click="onSubmit(stateMap.draft.value)"
        >保存为草稿</el-button
      >
      <el-button
        :disabled="!materialTableData.length"
        type="primary"
        :loading="submitBtnLoading"
        @click="onSubmit(stateMap.wait_purchase.value)"
        >提交</el-button
      >
    </div>

    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="materialModel"
    >
      <el-form
        :validate-on-rule-change="false"
        ref="detail"
        :model="materialForm"
        label-width="120px"
      >
        <el-form-item
          label="选择物料"
          prop="material_code"
          :rules="[
            {
              required: true,
              message: '请选择物料',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-select
            style="width:100%"
            v-model="materialForm.material_code"
            placeholder="请输入物料编码或名称搜索"
            filterable
            remote
            :remote-method="getMaterialList"
            @change="onSelectChange"
          >
            <el-option
              v-for="item in materialList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
              <span class="erp-option-left">{{ item.code }}</span>
              <span class="erp-option-right">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购单位">
          <el-input disabled v-model="materialForm.unit"></el-input>
        </el-form-item>
        <el-form-item
          label="数量"
          prop="req_amount"
          :rules="[
            {
              required: true,
              message: '请输入数量',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <InputNumber
            style="width:100%"
            v-model="materialForm.req_amount"
            :min="0"
            placeholder="请输入数量"
          ></InputNumber>
        </el-form-item>
        <el-form-item
          label="需求时间"
          prop="demand_time"
          :rules="[
            {
              required: true,
              message: '请选择需求时间',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-date-picker
            v-model="materialForm['demand_time']"
            style="width:100%"
            type="date"
            placeholder="请选择需求时间"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            placeholder="请输入备注"
            v-model="materialForm.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="materialModel = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as _ from 'lodash'
import Vue from 'vue'

import PageHeader from '@/components/title/Title.vue'
import Table from '@/components/table/Table.vue'
import Title from '@/components/collapse-title/CollapseTitle.vue'
import { USER } from '@/store/storageConst'
import { materialTableCols, API_MAP, stateMap } from './config'
import { formatDate } from '@/utils/trans.js'
import InputNumber from '@/components/input-number/InputNumber'

export default {
  components: { PageHeader, Table, Title, InputNumber },
  data () {
    return {
      form: {},
      stateMap,
      materialTableCols,
      materialTableData: [],
      materialModel: false,
      materialForm: {},
      selectMaterial: {},
      selectIndex: null,
      activeName: ['1', '2'],
      classOptions: [{ label: '人工', value: 'manual' }],
      users: [],
      materialList: [],
      pageTitle: '',
      draftBtnLoading: false,
      submitBtnLoading: false,
      title: '',
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      }
    }
  },
  created () {
    this.initPage(this.$route.query.id)
  },
  computed: {
    spliceTableData () {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = this.pagination.currentPage * this.pagination.pageSize
      const cloneData = JSON.parse(
        JSON.stringify(this.materialTableData || [])
      )
      return cloneData.slice(start, end)
    }
  },
  mounted () {},
  methods: {
    /**
     * 初始化界面
     */
    initPage (id) {
      if (id) {
        // 编辑
        this.pageTitle = id
        this.getInfoById(id)
      } else {
        // 新建
        this.pageTitle = '新增请购单'
        this.form.class = 'manual'
        this.form.operator = Vue.ls.get(USER)
      }
    },
    /**
     *根据请购单id获取请购单信息
     @param id 请购单id
     */
    getInfoById (id) {
      this.$http.get(API_MAP.PURCHASE_REQ + `/${id}`).then(res => {
        if (res.code === 0) {
          const data = _.cloneDeep(res.data)
          delete data.materials
          this.form = data
          this.materialTableData = res.data.materials || []
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    /**
     * 添加物料
     */
    newOrEdit () {
      this.materialForm = {
        demand_time: this.form.demand_time || null
      }
      this.selectIndex = null
      this.materialModel = true
      this.title = '添加物料'
    },
    /**
     * 添加或编辑物料弹框的确认按钮
     */
    handleOk () {
      this.$refs.detail.validate(valid => {
        if (valid) {
          const item = this.materialForm
          item.demand_time = new Date(this.materialForm.demand_time)
          if (this.materialForm.req_amount <= 0) {
            this.$message.error('数量必须大于0')
            return
          }
          if (this.selectIndex === null || this.selectIndex === undefined) {
            // 新建
            const same = this.judgeSame(item, this.materialTableData)
            if (same) {
              this.$message.error(`编码为${item.material_code}的物料已存在`)
              return
            }
            this.materialTableData.push(item)
          } else {
            // 编辑
            for (let i = 0; i < this.materialTableData.length; i++) {
              if (i === this.selectIndex) {
                this.materialTableData[i] = item
              }
            }
            // this.materialTableData = this.materialTableData.splice(index, 1, item)
          }
          this.materialTableData = _.cloneDeep(this.materialTableData)
          this.materialModel = false
        }
      })
    },

    /**
     * 判断添加的当前物料是否已存在
     */
    judgeSame (item, oldMaterial) {
      let same = false
      for (const ele of oldMaterial) {
        if (item.material_code === ele.material_code) {
          same = true
        }
      }
      return same
    },
    /**
     * 删除物料
     */
    onDelete (scope) {
      this.materialTableData.splice(scope.$index, 1)
    },
    /**
     * 编辑物料
     */
    editMaterial (scope) {
      this.materialForm = _.cloneDeep(scope.row)
      this.selectIndex = scope.$index
      this.title = '编辑物料：' + scope.row.material_code
      this.materialModel = true
    },
    /**
     * 获取用户列表
     */
    getUserList (val) {
      const params = {
        'q[name]': val,
        'q[fullname]': val,
        op: 1
      }
      this.$http.get(API_MAP.USER_LIST, { data: params }).then(res => {
        if (res.code === 0) {
          this.users = res.data.data
        }
      })
    },
    /**
     * 请购人下拉框的回调
     */
    onUserChange (val) {
      this.form.operator = val
      this.form = _.cloneDeep(this.form)
    },
    /**
     * 获取所有物料列表
     */
    getMaterialList (val) {
      this.materialList = []
      const params = {
        'q[code]': val,
        'q[name]': val,
        op: 1,
        state: 'release'
      }
      this.$http.get(API_MAP.MATERIAL_LIST, { data: params }).then(res => {
        if (res.code === 0) {
          this.materialList = res.data.data || []
        }
      })
    },
    /**
     * 选择物料的回调
     */
    onSelectChange (val) {
      this.selectMaterial = this.materialList.filter(o => {
        return o.code === val
      })[0]
      this.materialForm.unit = this.selectMaterial.unit_info.purchase
      this.materialForm.material_name = this.selectMaterial.name
      this.materialForm.material_code = this.selectMaterial.code
      this.materialForm.material_id = this.selectMaterial.id
    },

    /**
     * 提交或保存按钮
     */
    onSubmit (state) {
      if (state === stateMap.draft.value) {
        this.draftBtnLoading = true
      } else {
        this.submitBtnLoading = true
      }
      const params = this.handleParam(state)
      if (!this.$route.query.id) {
        this.$http
          .post(API_MAP.PURCHASE_REQ + '?logtype=new', { data: params })
          .then(res => {
            this.draftBtnLoading = false
            this.submitBtnLoading = false
            if (res.code === 0) {
              this.$message.success('操作成功')
              if (state === stateMap.draft.value) {
                this.initPage(res.data)
              } else {
                this.goBack()
              }
            }
          })
      } else {
        this.$http
          .put(API_MAP.PURCHASE_REQ + '?logtype=edit', { data: params })
          .then(res => {
            this.draftBtnLoading = false
            this.submitBtnLoading = false
            if (res.code === 0) {
              this.$message.success('操作成功')
              if (state === stateMap.draft.value) {
                this.initPage(res.data)
              } else {
                this.goBack()
              }
            }
          })
      }
    },
    /**
     * 处理传参
     */
    handleParam (state) {
      const params = this.form
      params.state = state
      params.materials = this.materialTableData
      params.demand_time = new Date(this.form.demand_time)
      return params
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
    },
    mainDateChange (e) {},
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'demand_time') {
        return formatDate(row[column.property])
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.new-request-list {
  .content {
    margin: 0 auto;
    .info-from {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 80%;
        /deep/ .el-form-item__content {
          width: 100%;
        }
      }
    }
  }
  .btm-area {
    text-align: center;
    margin-top: $padding-xs;
  }
}
</style>
