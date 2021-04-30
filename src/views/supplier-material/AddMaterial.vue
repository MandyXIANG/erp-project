<template>
  <div class="supplier-add-material">
    <PageHeader :title="pageTitle" :back="true" @back="goBack" />
    <el-button type="primary" class="topbar-btn" @click="newOrEditMaterial(0)"
      >添加物料</el-button
    >

    <Table
      :data="materialData"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      @sort-change="sortChange"
    >
      <el-table-column
        sortable="custom"
        :formatter="formatter"
        v-for="(item, key) in materialTableCols"
        :key="key"
        :prop="item.prop"
        :label="item.label"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            slot="reference"
            @click="deleteItem(scope)"
            class="table-opreator"
            >移除</span
          >

          <el-divider direction="vertical"></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in moreMenu"
                :key="item.label"
                @click.native="item.command(scope)"
              >
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </Table>

    <!-- 新建或编辑物料弹框 -->
    <el-dialog
      :destroy-on-close="true"
      :title="modelTitle"
      :visible.sync="editModel"
    >
      <div class="edit-material-content">
        <el-form ref="form" :model="materialForm" label-width="120px">
          <el-form-item
            label="选择物料"
            prop="material_id"
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
              filterable
              remote
              v-model="materialForm.material_id"
              @change="materialChange"
              placeholder="请输入物料编码或名称选择物料"
              :remote-method="getMaterialList"
            >
              <el-option
                v-for="item in materialModelData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <span style="float: left">{{ item.code }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.name
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <template v-for="(item, index) in editMaterialForm">
            <el-form-item
              v-if="item.type == 'Input'"
              :key="index"
              :label="item.label"
            >
              <el-input
                :disabled="item.disabled"
                v-model="materialForm[item.field]"
                :placeholder="item.placeholder"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="item.type == 'Number'"
              :key="index"
              :label="item.label"
            >
              <InputNumber
                style="width:100%"
                v-model="materialForm[item.field]"
                :min="0"
                :placeholder="item.placeholder"
              ></InputNumber>
            </el-form-item>
            <el-form-item
              v-if="item.type == 'Textarea'"
              :key="index"
              :label="item.label"
            >
              <el-input
                type="textarea"
                :rows="item.row"
                v-model="materialForm[item.field]"
                :placeholder="item.placeholder"
              ></el-input>
            </el-form-item>

            <el-form-item
              v-if="item.type == 'Select'"
              :key="index"
              :label="item.label"
            >
              <el-select
                style="width:100%"
                :disabled="item.disabled"
                v-model="materialForm[item.field]"
                :placeholder="item.placeholder"
              >
                <el-option
                  v-for="item in item.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editModel = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="onEditMaterialOk"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 物料详情弹框 -->
    <el-dialog
      :title="modelTitle"
      :close-on-click-modal="false"
      :visible.sync="detailModel"
    >
      <div class="detail-material-content">
        <div class="detail-item">
          <div class="item-label">
            供方物料编码
          </div>
          <div class="item-value">{{ editItem.code }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">
            供方物料名称
          </div>
          <div class="item-value">{{ editItem.name }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">
            供方物料描述
          </div>
          <div class="item-value">{{ editItem.description }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">
            供方物料单位
          </div>
          <div class="item-value">{{ editItem.sm_unit }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">
            供方物料单价
          </div>
          <div class="item-value">{{ editItem.price }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">
            供方币种
          </div>
          <div class="item-value">{{ currMap[editItem.trans_curr] }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">
            供方计价单位
          </div>
          <div class="item-value">{{ unitMap[editItem.unit] }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">
            备注
          </div>
          <div class="item-value">{{ editItem.remark }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as _ from 'lodash'

import PageHeader from '@/components/title/Title.vue'
import Table from '@/components/table/Table.vue'
import InputNumber from '@/components/input-number/InputNumber'
import {
  materialTableCols,
  editMaterialForm,
  API_MAP,
  unitMap,
  currMap
} from './config'
export default {
  components: { PageHeader, Table, InputNumber },
  data () {
    return {
      supplierId: null,
      materialTableCols,
      unitMap,
      currMap,
      materialData: [],
      materialModelData: [],
      editModel: false,
      moreMenu: [],
      editMaterialForm, // 物料弹框表单配置
      materialForm: {}, // 物料弹框表单对象
      detailModel: false,
      editItem: {},
      modelTitle: '',
      editIndex: null,
      selectMaterial: {},
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      pageTitle: '',
      btnLoading: false
    }
  },
  created () {
    this.initPage()
  },
  mounted () {
    this.moreMenu = [
      {
        label: '编辑',
        icon: 'el-icon-edit',
        command: item => {
          this.modelTitle = '编辑物料：' + item.row.sm_code
          this.newOrEditMaterial(item)
        }
      },
      {
        label: '详情',
        icon: 'el-icon-info',
        command: item => {
          this.editItem = item.row
          this.detailModel = true
          this.modelTitle = '详情：' + this.editItem.sm_code
        }
      }
    ]
  },
  methods: {
    initPage () {
      this.supplierId = Number(this.$route.query.id) || null
      this.getSupplierMaterial()
      this.pageTitle = this.$route.query.name
    },

    /**
     * 移除物料
     */
    deleteItem (scope) {
      this.$confirm(`此操作将移除物料${scope.row.sm_code}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .del(API_MAP.SUPPLIER_MATERIAL + `/${scope.row.id}`)
          .then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.getSupplierMaterial()
            }
          })
      })
    },

    /**
     * 新建或编辑物料
     */
    newOrEditMaterial (item) {
      if (item === 0) {
        // 新建
        this.editModel = true
        this.modelTitle = '添加物料'
        this.$nextTick(() => {
          this.materialForm = {}
          this.$refs.form.resetFields()
          this.materialForm = {
            trans_curr: this.$route.query.curr,
            unit: 'yuan'
          }
        })
        this.editItem = {}
      } else {
        this.editItem = _.cloneDeep(item.row)
        this.materialForm = _.cloneDeep(item.row)
        this.editIndex = item.$index
        this.getMaterialById(item.row)
      }
    },

    // 有问题

    getMaterialById (item) {
      this.materialModelData = []
      this.$http
        .get(API_MAP.MATERIAL_SELF + `/${item.material_id}`)
        .then(res => {
          if (res.code === 0) {
            this.materialModelData = [res.data]
            this.editModel = true
          }
        })
    },
    /**
     * 查询物料
     */
    getMaterialList (query) {
      const params = {
        'q[code]': query,
        'q[abbr]': query,
        'q[name]': query,
        op: 1,
        state: 'release'
      }
      this.$http.get(API_MAP.MATERIAL_LIST, { data: params }).then(res => {
        if (res.code === 0) {
          this.materialModelData = res.data.data || []
        }
      })
    },
    /**
     * 新建或编辑物料确认按钮
     */
    onEditMaterialOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (Object.keys(this.editItem).length) {
            // 编辑
            this.editMaterial()
          } else {
            // 新建
            this.addMaterial()
          }
          this.editModel = false
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },

    /**
     * 添加物料获取参数
     */
    getParams () {
      const res = _.cloneDeep(this.materialForm)
      res.sm_code = this.selectMaterial.code
      res.sm_name = this.selectMaterial.name
      res.supplier_id = Number(this.$route.query.id)
      res.min_goods_count = (this.selectMaterial.planing || {}).min
      return res
    },
    /**
     * 添加物料
     */
    addMaterial () {
      const params = this.getParams()
      this.$http
        .post(API_MAP.SUPPLIER_MATERIAL, { data: params, error_return: true })
        .then(res => {
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.btnLoading = false
            this.getSupplierMaterial()
          }
        })
        .catch(err => {
          this.btnLoading = false
          if (err.msg === 'unique violation') {
            this.$message.error('重复添加')
          } else {
            this.$message.error(err.msg)
          }
        })
    },
    editMaterial () {
      const params = this.getParams()
      this.$http.put(API_MAP.SUPPLIER_MATERIAL, { data: params }).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.btnLoading = false
          this.getSupplierMaterial()
        }
      })
    },
    /**
     * 物料下拉框改变的回调
     */
    materialChange (data) {
      this.selectMaterial =
        _.find(this.materialModelData, ele => {
          return ele.id === data
        }) || {}
      this.materialForm.sm_unit = (
        this.selectMaterial.unit_info || {}
      ).purchase
    },
    /**
     * 获取供应商的物料
     */
    getSupplierMaterial (sort = {}) {
      const params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: sort.col,
        order: sort.order,
        state: 'release,invalid'
      }
      this.$http
        .get(API_MAP.SUPPLIER_MATERIALS + `/${this.supplierId}`, {
          data: params
        })
        .then(res => {
          if (res.code === 0) {
            this.materialData = res.data.data || []
            this.pagination.total = res.data.total_records
          }
        })
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getSupplierMaterial()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getSupplierMaterial()
    },
    sortChange (column) {
      this.getSupplierMaterial({
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      })
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'sm_state') {
        if (row[column.property] === 'release') {
          return '放行'
        } else if (row[column.property] === 'invalid') {
          return '作废'
        } else {
          return row[column.property]
        }
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.supplier-add-material {
  .table-opreator {
    color: $--color-primary;
    font-size: $font-base;
    cursor: pointer;
  }
}
.material-model-table {
  margin-top: $padding-md;
  max-height: 500px;
  overflow: auto;
}
.edit-material-content {
  height: 400px;
  overflow: auto;
}
.detail-material-content {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid $border-detail-color;
  border-right: 1px solid $border-detail-color;
  .detail-item {
    display: flex;
    font-size: 14px;
    min-height: 45px;
    align-items: center;
    width: 50%;
    box-sizing: border-box;
    border-top: 1px solid $border-detail-color;
    border-left: 1px solid $border-detail-color;
    &:hover {
      background: $detail-hover-bg-color;
    }
    .item-label {
      margin-right: $padding-xs * 2;
      background: $--color-primary-light-9;
      padding-left: $padding-xs;
      min-height: 45px;
      width: 120px;
      display: flex;
      align-items: center;
    }
    .item-value {
      padding-left: $padding-xs;
      color: $detail-value-color;
    }
  }
  .detail-item-max {
    width: 100%;
  }
}
</style>
