<template>
  <div class="edit-warehouse">
    <PageHeader
      :back="true"
      :title="pageTitle"
      @back="goBack"
    />
    <div class="content">
      <div class="left">
        <div class="box-top">
          <div>仓库</div>
          <div></div>
        </div>
        <div class="left-content">
          <div
            v-if="!treeData.length"
            class="add-btn"
            title="新建仓库"
            @click="addNode(1)"
          >
            <i class="el-icon-plus"></i>
          </div>
          <el-tree
            v-else
            :data="treeData"
            :props="defaultProps"
            :default-expand-all="true"
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            :current-node-key="defaultCheck[0]"
            @node-click="handleNodeClick"
            :default-checked-keys="defaultCheck"
          >
            <div
              class="custom-tree-node"
              slot-scope="{ node, data }"
            >
              <div :class="{
                  'select-current-node': selectNode && selectNode.id == node.id
                }">
                {{ node.label }}
              </div>
              <div>
                <i
                  class="el-icon-plus"
                  title="添加"
                  v-if="data.class !== classmap.location"
                  @click="addNode(data)"
                ></i>
                <i
                  class="el-icon-edit"
                  title="编辑"
                  @click="editNode(data)"
                ></i>
                <i
                  v-if="data.class === classmap.warehouse && data.parent === -1"
                  slot="reference"
                  class="el-icon-delete"
                  title="删除"
                  @click="deleteNode(data)"
                ></i>
                <el-popconfirm
                  v-else
                  :title="`确定要删除节点${data.name}吗？`"
                  @onConfirm="deleteNode(data)"
                >
                  <i
                    slot="reference"
                    class="el-icon-delete"
                    title="删除"
                  ></i>
                </el-popconfirm>
              </div>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="right">
        <div class="box-top">
          <div>
            <span>可存物料</span>
            <el-button
              v-if="selectNode"
              style="margin-left:8px"
              type="primary"
              size="mini"
              @click="addMaterial"
            >添加物料</el-button>
          </div>
        </div>
        <div class="right-content">
          <div
            v-if="!selectNode"
            class="no-data"
          >
            <img src="../../assets/imgs/no-data.png" />
            <div>选择节点添加物料</div>
          </div>
          <Table
            v-else
            :data="nodeMaterialData"
            :total="pagination2.total"
            :current-page="pagination2.currentPage"
            :page-size="pagination2.pageSize"
            @size-change="onSizeChange2"
            @current-change="onCurrentChange2"
          >
            <el-table-column
              v-for="(item, key) in TableColsW"
              :key="key"
              :prop="item.prop"
              :label="item.label"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span
                  class="table-detail"
                  @click="deleteMaterial(scope)"
                >移除</span>
              </template>
            </el-table-column>
          </Table>
        </div>
      </div>
    </div>
    <!-- 新建或编辑节点弹框 -->
    <el-dialog
      :title="nodeEditTitle"
      :visible.sync="nodeDialog"
    >
      <el-form
        :validate-on-rule-change="false"
        class="custome-form"
        :model="form"
        ref="nodeForm"
        :rules="rules"
      >
        <el-form-item
          label="代码"
          prop="code"
          label-width="120px"
        >
          <el-input
            v-model="form.code"
            :disabled="!isAddNode"
            autocomplete="off"
            placeholder="请输入代码"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="name"
          label="名称"
          label-width="120px"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="级别"
          label-width="120px"
        >
          <el-select
            v-model="form.class"
            disabled
            style="width:100%"
          >
            <el-option
              v-for="(item, key) in classOptions"
              :key="key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="仓库类型"
          label-width="120px"
        >
          <el-select
            placeholder="请选择仓库类型"
            v-model="form.kind"
            style="width:100%"
          >
            <el-option
              v-for="(item, key) in warehouseType"
              :key="key"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.class === classmap.warehouse"
          label="仓管员"
          label-width="120px"
        >
          <el-select
            v-model="form.clerk"
            filterable
            placeholder="请输入用户名或全名搜索"
            style="width:100%"
            remote
            clearable
            :remote-method="getUserList"
            multiple
            @change="onUserChange"
          >
            <el-option
              v-for="item in clerks"
              :key="item.id"
              :label="item.fullname"
              :value="item.id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.fullname
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="库位类型"
          label-width="120px"
        >
          <el-select
            placeholder="请选择库位类型"
            v-model="form.stock_type"
            style="width:100%"
          >
            <el-option
              v-for="(item, key) in locationType"
              :key="key"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="描述"
          label-width="120px"
        >
          <el-input
            placeholder="请输入描述"
            v-model="form.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注"
          label-width="120px"
        >
          <el-input
            row="3"
            type="textarea"
            placeholder="请输入备注"
            v-model="form.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="onCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="nodeBtnLoading"
          @click="addNodeOk"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加物料弹框 -->
    <el-dialog
      :title="'添加可存物料：' + (selectNode || {}).name"
      :visible.sync="dialogTableVisible"
    >
      <el-input
        type="text"
        v-model="material_code"
        @keyup.native.enter="onSearch"
        placeholder="请输入物料编码或名称搜索"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="onSearch"
          @keyup.enter="onSearch"
        ></i>
      </el-input>
      <Table
        :data="allMaterialData"
        :total="pagination.total"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        > </el-table-column>
        <el-table-column
          v-for="(item, key) in TableColsW"
          :key="key"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </Table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :loading="materialBtnLoading"
          @click="addMaterialOk"
        >确定</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as _ from 'lodash'

import PageHeader from '@/components/title/Title.vue'
import Table from '@/components/table/Table'
import {
  TableColsW,
  ENUM_MAP,
  API_MAP,
  classOptions,
  classMap
} from './warehouse.config'
import { getEnumGroup } from '@/utils/common.js'
import { validateCode } from '@/utils/validate.js'
const validateWarehouseCode = (rule, value, callback) => {
  if (value === '' || value === null || value === undefined) {
    callback(new Error('请输入代码'))
  } else if (validateCode(value)) {
    callback(new Error('仓库代码不允许输入空格或中文字符'))
  } else {
    callback()
  }
}
export default {
  components: {
    PageHeader,
    Table
  },
  data () {
    return {
      TableColsW,
      pageTitle: '',
      warehouseType: [],
      nodeDialog: false,
      dialogTableVisible: false,
      allMaterialData: [],
      form: {},
      clerks: [],
      classOptions,
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      classmap: classMap,
      locationType: [],
      parentId: null, // 父节点id
      firstId: null, // 第一级ID
      isFirst: true, // 是否是第一级
      treeData: [],
      isAddNode: false, // 判断是新建节点还是编辑节点
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      pagination2: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      selectMaterial: [],
      selectNode: null,
      nodeMaterialData: [],
      material_code: null,
      rules: [],
      defaultCheck: [],
      nodeBtnLoading: false,
      materialBtnLoading: false,
      nodeEditTitle: '',
      query: {}
    }
  },
  created () {
    getEnumGroup([ENUM_MAP.warehouse_type, ENUM_MAP.location_type]).then(
      data => {
        for (const item of data) {
          if (item.category === ENUM_MAP.warehouse_type) {
            this.warehouseType = item.children
          }
          if (item.category === ENUM_MAP.location_type) {
            this.locationType = item.children
          }
        }
        this.initPage()
      }
    )
  },
  mounted () { },
  methods: {
    initPage () {
      // this.getUserList()
      if (this.$route.query.id) {
        this.firstId = this.$route.query.id
        this.getTreeData()
        this.pageTitle = this.$route.query.name
        // 编辑
      } else {
        // 新建
        this.defaultCheck = []
        this.treeData = []
        this.pageTitle = '新增仓库'
      }
    },
    /**
     * 点击节点
     */
    handleNodeClick (data) {
      this.selectNode = data
      this.getNodeMaterial()
    },
    /**
     * 新建节点按钮
     */
    addNode (data) {
      this.isAddNode = true
      this.nodeEditTitle = '新建'
      this.form = {}
      /** 什么是Vue.nextTick():
       * 在下次DOM更新循环结束之后延迟回调 在修改数据之后立即使用这个方法 获取更新后的DOM
       * 所以就衍生出了这个获取更新后的DOM的Vue方法 所以放在Vue.nextTick()回调函数中的执行的应该就是会对DOM进行操作的js代码
       */
      this.nodeDialog = true
      if (data === 1) {
        this.isFirst = true
        this.$nextTick(() => {
          this.form = {}
          this.$refs.nodeForm.resetFields()
          this.form.class = classMap.warehouse
        })
      } else {
        this.isFirst = false
        this.$nextTick(() => {
          this.form = {}
          this.$refs.nodeForm.resetFields()
          if (data.class === classMap.warehouse) this.form.class = classMap.area
          if (data.class === classMap.area) this.form.class = classMap.location
        })
      }
      this.parentId = data.id
      this.initRules()
    },
    /**
     * 编辑节点按钮
     */
    editNode (data) {
      this.isAddNode = false
      this.form = _.cloneDeep(data)
      this.nodeEditTitle = '编辑'
      this.initRules()
      this.getClerks(data)
      console.log('xxx', this.form, data)
      this.nodeDialog = true
    },
    getClerks (data) {
      const clerks = data.clerks || []
      this.clerks = []
      for (const item of clerks) {
        this.clerks.push({
          id: item.clerk_id,
          name: item.clerk_name,
          fullname: item.clerk_fullname
        })
      }
    },
    initRules () {
      this.rules = {
        code: [
          {
            required: true,
            message: '请输入代码',
            trigger: ['blur', 'change'],
            validator: validateWarehouseCode
          }
        ],
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: ['blur', 'change']
          }
        ]
      }
    },

    /**
     * 添加物料按钮
     */
    addMaterial () {
      this.material_code = ''
      this.getMaterialList()
    },
    handleSelectionChange (data) {
      this.selectMaterial = data
    },
    onSearch () {
      this.pagination.currentPage = 1
      const query = {
        'q[code]': this.material_code,
        'q[name]': this.material_code,
        op: 1
      }
      this.query = query
      this.getMaterialList()
    },

    onCancel () {
      this.$refs.nodeForm.resetFields()
      this.nodeDialog = false
    },

    /**
     * 新建或编辑节点确认按钮
     */
    addNodeOk () {
      this.$refs.nodeForm.validate(valid => {
        if (valid) {
          this.nodeBtnLoading = true
          this.nodeDialog = false
          const params = this.form
          params.parent = this.isFirst ? -1 : this.parentId
          if (this.isAddNode) {
            this.$http
              .post(API_MAP.WAREHOUSE_SELF, {
                data: params,
                error_return: true
              })
              .then(res => {
                this.nodeBtnLoading = false
                if (res.code === 0) {
                  if (this.isFirst) {
                    this.firstId = res.data.id
                  }
                  this.$message.success('操作成功')
                } else {
                  this.$message.error('操作失败')
                }
                this.getTreeData()
              })
              .catch(err => {
                this.nodeBtnLoading = false
                if (err.code === 15) {
                  this.$message.error(`仓库代码${this.form.code}已存在`)
                } else if (err.code === 16) {
                  this.$message.error(`仓库代码${this.form.code}重复使用`)
                } else {
                  this.$message.error(err.msg)
                }
              })
          } else {
            this.$http
              .put(API_MAP.WAREHOUSE_SELF, { data: params, error_return: true })
              .then(res => {
                this.nodeBtnLoading = false
                if (res.code === 0) {
                  this.getTreeData()
                  this.$message.success('操作成功')
                } else {
                  this.$message.error('操作失败')
                }
              })
              .catch(err => {
                this.nodeBtnLoading = false
                if (err.code === 15) {
                  this.$message.error(`仓库代码${this.form.code}已存在`)
                } else if (err.code === 16) {
                  this.$message.error(`仓库代码${this.form.code}重复使用`)
                } else {
                  this.$message.error(err.msg)
                }
              })
          }
        }
      })
    },
    /**
     * 获取树形结构数据
     */
    getTreeData () {
      this.$http.get(API_MAP.TREE_DATA + `/${this.firstId}`).then(res => {
        if (res.code === 0) {
          this.treeData = [res.data]
          this.defaultCheck = [res.data.id]
          this.pageTitle = res.data.name
          this.handleNodeClick(res.data)
        } else {
          this.treeData = []
          this.selectNode = null
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    /**
     * 获取仓管员
     */
    getUserList (val) {
      const params = {
        'q[name]': val,
        'q[fullname]': val,
        op: 1
      }
      this.$http.get(API_MAP.USER_LIST, { data: params }).then(res => {
        if (res.code === 0) {
          this.clerks = res.data.data || []
        }
      })
    },
    onUserChange (val) {
      this.form.clerk = val || null
    },
    /**
     * 获取所有物料列表
     */
    getMaterialList (query = {}) {
      this.allMaterialData = []
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        op: 1,
        am: 0,
        state: 'release'
      }
      params = Object.assign(params, this.query)
      this.$http
        .get(API_MAP.NODE_MATERIAL + `/${this.selectNode.id}`, { data: params })
        .then(res => {
          this.dialogTableVisible = true
          if (res.code === 0) {
            this.allMaterialData = res.data.data || []
            this.pagination.total = res.data.total_records
          }
        })
    },
    // 所有物料表格当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getMaterialList()
    },
    // 所有物料表格当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getMaterialList()
    },
    // 所有物料表格当前页数改变时的事件
    onCurrentChange2 (currentPage) {
      this.pagination2.currentPage = currentPage
      this.getNodeMaterial()
    },
    // 所有物料表格当前条数改变时的事件
    onSizeChange2 (size) {
      this.pagination2.pageSize = size
      this.getNodeMaterial()
    },
    /**
     * 删除节点
     */
    deleteNode (data) {
      if (data.class === classMap.warehouse && data.parent === -1) {
        // 第一级
        this.$confirm(`此操作将删除仓库${data.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.del(API_MAP.WAREHOUSE_SELF + `/${data.id}`).then(res => {
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.goBack()
            } else {
              this.$message.error('删除失败')
            }
          })
        })
      } else {
        this.$http.del(API_MAP.WAREHOUSE_SELF + `/${data.id}`).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败')
          }
          this.getTreeData()
        })
      }
    },
    /**
     * 添加物料确认按钮
     */
    addMaterialOk () {
      if (!this.selectMaterial.length) {
        this.$message.error('您还没有选择物料')
        return
      }
      this.dialogTableVisible = false
      this.materialBtnLoading = true
      const mid = []
      for (const item of this.selectMaterial) {
        mid.push(item.id)
      }
      this.$http
        .post(
          API_MAP.WAREHOUSR_MATERIAL +
          `/${this.selectNode.id}?mid=${mid.join(',')}`
        )
        .then(res => {
          this.materialBtnLoading = false
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.getNodeMaterial()
          } else {
            this.$message.error('操作失败')
          }
        })
    },
    /**
     * 获取节点的物料
     */
    getNodeMaterial () {
      this.nodeMaterialData = []
      const params = {
        page: this.pagination2.currentPage,
        count: this.pagination2.pageSize
      }
      this.$http
        .get(API_MAP.NODE_MATERIAL + `/${this.selectNode.id}`, { data: params })
        .then(res => {
          if (res.code === 0) {
            this.nodeMaterialData = res.data.data || []
            this.pagination2.total = res.data.total_records
          }
        })
    },

    /**
     * 移除节点的物料
     */
    deleteMaterial (item) {
      this.$confirm(`此操作将移除物料${item.row.code}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .del(
            API_MAP.WAREHOUSR_MATERIAL +
            `/${this.selectNode.id}?mid=${item.row.id}`
          )
          .then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.getNodeMaterial()
            }
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-warehouse {
  width: 100%;
  height: 100%;
  .content {
    display: flex;
    .box-top {
      height: 50px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      padding: $padding-xs;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .left {
      width: 400px;
      min-height: 600px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-right: 0;
      .left-content {
        .add-btn {
          width: 80%;
          height: 50px;
          border: 2px dotted rgba(0, 0, 0, 0.2);
          margin: 50px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          i {
            font-size: 26px;
          }
        }
        /deep/ .custom-tree-node {
          display: flex;
          justify-content: space-between;
          width: 80%;
          /deep/ .select-current-node {
            color: $--color-primary !important;
          }
          i {
            opacity: 0;
            margin-left: $padding-md;
          }
          &:hover {
            i {
              opacity: 1;
              transition: all 0.3s;
              &:hover {
                color: $--color-primary;
                transform: scale(1.3);
              }
            }
          }
        }
      }
    }
    .right {
      flex: 1;
      border: 1px solid rgba(0, 0, 0, 0.2);
      .right-content {
        padding: $padding-xs;
        .no-data {
          width: 200px;
          padding: 16px;
          text-align: center;
          margin: 0 auto;
          img {
            width: 100%;
          }
        }
      }
    }
  }
}
/deep/ .el-dialog__body {
  height: 400px;
  overflow: auto;
  .custome-form {
    /deep/ .el-input {
      margin-bottom: 0;
    }
  }
}
</style>
