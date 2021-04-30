<template>
  <div class="sys-organization-container">
    <!-- 左 -->
    <div class="content-left">
      <div class="content-left-top">
        <p class="title">{{organization}}</p>
        <p style="text-align:right">
        </p>
      </div>
      <div class="content-left-bottom">
        <template v-if="treeData.length">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="onNodeClick"
            :highlight-current="true"
          >
            <div
              slot-scope="{ node, data }"
              class="custom-tree-node"
            >
              <div>{{ node.label }}</div>
              <div>
                <i
                  v-if="$permission('new_organization')"
                  class="el-icon-plus"
                  @click="onNew(data)"
                ></i>
                <i
                  v-if="$permission('edit_organization')"
                  class="el-icon-edit"
                  @click="onEdit(data)"
                ></i>
                <i
                  v-if="$permission('delete_organization')"
                  class="el-icon-delete"
                  @click="onDelete(data)"
                ></i>
              </div>
            </div>
          </el-tree>
        </template>
      </div>
    </div>

    <div
      v-if="!treeData.length"
      class="content-right"
    >
      <div class="content-right-top"></div>
      <div class="no-data">
        <img
          src="@/assets/imgs/no-data.png"
          alt="没有数据"
        />
        <p>尚无数据,请创建新的组织结构〜</p>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="onNew(null)"
          v-if="$permission('new_organization')"
        >新建</el-button>
      </div>
    </div>
    <div
      class="content-right"
      v-if="treeData.length"
    >
      <div class="content-right-top">
        <el-button
          type="primary"
          v-if="nodeId && $permission('add_organization_member')"
          @click="onAddMember"
          size="mini"
        >添加成员</el-button>
        <el-button
          @click="onBatchDelete"
          v-if="nodeId && $permission('delete_organization_member')"
          size="mini"
        >批量删除</el-button>
      </div>
      <div class="content-right-bottom">
        <Table
          :data="tableData.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.currentPage * this.pagination.pageSize)"
          :border="false"
          :total="pagination.total"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          @selection-change="handleSelectionChange"
        >
          >
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            v-for="(item,key) in tableCols"
            :key="key"
            :formatter="formatter"
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                class="table-detail"
                @click="onEditUser(scope.row)"
                v-if="nodeId && $permission('edit_organization_member')"
              >编辑</span>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
    <!-- 新建或者编辑节点对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="nodeVisible"
      width="625px"
      :before-close="onBack"
      :close-on-click-modal="false"
    >
      <el-row class="el-row">
        <el-col :span="3">
          <span>*</span>
          部门名称
        </el-col>
        <el-col :span="21">
          <el-input v-model.trim="name"></el-input>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="3">
          <span>*</span>
          部门代码
        </el-col>
        <el-col :span="21">
          <el-input v-model.trim="code"></el-input>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="3">上级部门</el-col>
        <el-col :span="21">
          <SelectTree
            :options="treeData"
            :value="superior"
            :props="defaultProps"
            :disabled="isParentNode"
            :label="superiorLabel"
            :clearable="false"
            @getValue="handleNodeClick"
          ></SelectTree>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="3">创建日期</el-col>
        <el-col :span="21">
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期"
            style="width:100%"
            :disabled="true"
          ></el-date-picker>
        </el-col>
      </el-row>
      <el-row class="el-row">
        <el-col :span="3">备注</el-col>
        <el-col :span="21">
          <el-input
            type="textarea"
            v-model="remark"
          ></el-input>
        </el-col>
      </el-row>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="onBack">返回</el-button>
        <el-button
          type="primary"
          @click="onSave"
          :disabled="!code || !name"
          :loading="dialogLoading"
        >提交</el-button>
      </div>
    </el-dialog>

    <el-drawer
      :title="addTitle"
      dorection="rtl"
      :visible.sync="drawer"
      :show-close="false"
      class="perm-drawer"
    >
      <div>
        <el-button
          class="drawer-btn"
          @click="drawer = false"
        >返回</el-button>
        <el-button
          type="primary"
          class="drawer-btn-submit"
          :disabled="!selectUser"
          @click="onMerberSave"
          :loading="drawerLoading"
        >提交</el-button>
        <div class="set-person">选择成员</div>
        <div class="member">
          <div class="member-label">选择成员:</div>
          <div style="flex:1">
            <el-select
              v-model="selectUser"
              placeholder="请选择"
              style="width:100%"
              v-if="!isEditUser"
              @change="onSelectUser"
              filterable
            >
              <el-option
                v-for="(item,key) in allUserData"
                :key="key"
                :label="item.label"
                :value="item.id"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
            <el-input
              v-if="isEditUser"
              v-model="selectName"
              :disabled="true"
            ></el-input>
          </div>
        </div>
        <div class="role">
          <div class="role-label">选择角色:</div>
          <div style="flex:1">
            <el-select
              v-model="selectRole"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="(item,key) in userRole"
                :key="key"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="set-perm">设置成员数据权限</div>
        <div class="container-main">
          <div class="label">已选内容:</div>
          <div class="control">
            <el-tag
              size="small"
              class="owner"
            >本人</el-tag>
            <el-tag
              size="small"
              class="owner"
              v-if="allPerson"
            >所有人</el-tag>
            <el-tag
              size="small"
              class="owner-department"
              v-if="ownerDepart"
            >本部门</el-tag>
            <el-tag
              size="small"
              class="specify-department"
              closable
              @close="closeNode(key)"
              v-for="(item,key) in selectTagNodeData"
              :key="item.label+item.key"
            >{{item.label}}</el-tag>
            <el-tag
              size="small"
              class="specify-person"
              closable
              @close="closeUser(key)"
              v-for="(item,key) in selectTagUser"
              :key='item.label+item.key'
            >{{item.label}}</el-tag>
          </div>
          <div class="example">
            <ul>
              <li>
                <span style="background-color: #fafafa;"></span>
                所有人
              </li>
              <li>
                <span style="background-color: rgb(10, 152, 192);"></span>
                本部门
              </li>
              <li>
                <span style="background-color: rgb(93, 16, 107);"></span>
                指定部门
              </li>
              <li>
                <span style="background-color: rgb(169, 117, 15);"></span>
                指定人
              </li>
            </ul>
          </div>
        </div>
        <div class="specific-select">
          <div class="all-person">所有人:</div>
          <div>
            <el-checkbox
              v-model="allPerson"
              @change="selectAll"
            ></el-checkbox>
          </div>
          <div class="all-depart">本部门:</div>
          <div>
            <el-checkbox
              :disabled="disableSelect"
              v-model="ownerDepart"
            ></el-checkbox>
          </div>
        </div>
        <el-tabs
          v-model="activeName"
          @tab-click="handleTabsClick"
        >
          <el-tab-pane
            label="指定部门"
            name="1"
            :disabled="disableSelect"
          >
            <el-transfer
              :titles="['全部部门', '已选部门']"
              :data="allNodeData"
              v-model="selectNodeData"
              @change="changeKeyToTagNode"
            ></el-transfer>
          </el-tab-pane>
          <el-tab-pane
            label="指定人"
            name="2"
            :disabled="disableSelect"
          >
            <el-transfer
              :titles="['全部用户', '已选用户']"
              :data="allUserList"
              v-model="selectUserList"
              @change="changeKeyToTagUser"
            ></el-transfer>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import Table from '@/components/table/Table'
import { TableCols, UserRole } from './organization.config'
import { cloneDeep } from 'lodash-es'
import SelectTree from '@/components/select-tree/SelectTree'
export default {
  components: {
    Table,
    SelectTree
  },
  data () {
    return {
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      treeData: [],
      tableData: [],
      tableCols: TableCols,
      allUserData: [],
      superior: null, // 上一级
      superiorLabel: null, // 上一级(显示)
      name: null, // 部门名称
      code: null, // 部门代码
      date: null, // 创建日期
      remark: null, // 备注
      nodeId: null, // 节点id
      organization: null,
      activeName: '1',
      allPerson: false, // 所有人
      ownerDepart: false, // 本部门
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      isEdit: false, // 编辑按钮
      nodeVisible: false,
      drawer: false,
      selectUser: null,
      userRole: UserRole,
      selectRole: null,
      disableSelect: false,
      allPermList: [],
      userIds: [], // 批量删除的用户id
      allNodeData: [],
      selectTagNodeData: [], // 根据选中组织转换的tag
      selectNodeData: [], // 权限选中的组织
      allUserList: [],
      selectTagUser: [],
      selectUserList: [], // 权限选中的人员
      isDisabledBatch: true,
      isEditUser: false, // 编辑成员
      originalRelationData: [], // 原始关系数据
      selectUserId: null,
      selectName: null,
      originalUser: [], // 原始用户
      title: '新建组织',
      isParentNode: false,
      dialogLoading: false,
      drawerLoading: false,
      addTitle: null
    }
  },
  mounted () {
    //  获取全部得数据
    this.getAllNodeData()
  },
  methods: {
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'role') {
        for (let i = 0; i < this.userRole.length; i++) {
          const item = this.userRole[i]
          if (item.value === cellValue) {
            return item.label
          }
        }
      }
      return row[column.property]
    },
    //
    filterMethod () {

    },
    // 点击添加成员按钮
    onAddMember () {
      this.allUserData = []
      this.selectUser = null
      this.selectRole = null

      this.activeName = '1'
      this.allPerson = false
      this.disableSelect = false
      this.ownerDepart = false

      this.selectTagUser = []
      this.selectTagNodeData = []

      this.selectUserList = []
      this.selectNodeData = []

      this.allUserList = []
      this.allNodeData = []

      this.isEditUser = false

      this.getNodeData()
      // 获取全部用户
      const params = {
        filter: true
      }
      this.$http.get('/system/user/list', { data: params }).then((res) => {
        if (res.data.data) {
          res.data.data.forEach(element => {
            this.allUserData.push({
              label: element.name,
              value: element.fullname,
              id: element.id
            })
          })
        }
        this.drawer = true
        this.selectRole = this.userRole[0].value
        this.addTitle = '添加成员'
      })
    },
    onBack () {
      this.nodeVisible = false
      this.isEdit = true
    },
    /** 数据节点保存  */
    onSave () {
      if (this.isEdit) { // 代表编辑
        this.dialogLoading = true
        const params = {
          id: this.nodeId,
          name: this.name,
          parent: this.superior ? this.superior : -1,
          remark: this.remark,
          code: this.code,
          create_at: this.date
        }
        this.$http.put('/system/party/self', { data: params, error_return: true }).then(res => {
          this.dialogLoading = false
          this.nodeVisible = false
          this.isEdit = false
          this.$message.success('操作成功')
          this.clearVariable()
          this.getAllNodeData()
        }).catch(err => {
          this.dialogLoading = false
          if (err.code === 15) {
            this.$message.error('组织架构代码重复')
          } else {
            this.$message.error(err.msg)
          }
        })
      } else {
        this.dialogLoading = true
        const params = {
          code: this.code,
          name: this.name,
          create_at: this.date,
          remark: this.remark,
          parent: this.superior ? this.superior : -1
        }
        this.$http.post('/system/party/self', { data: params, error_return: true }).then(res => {
          this.dialogLoading = false
          this.nodeVisible = false
          this.isEdit = false
          this.$message.success('操作成功')
          this.clearVariable()
          this.getAllNodeData()
        }).catch(err => {
          console.log(err, 'err')
          this.dialogLoading = false
          if (err.code === 15) {
            this.$message.error('组织架构代码重复')
          } else {
            this.$message.error(err.msg)
          }
        })
      }
    },
    /** 成员和权限保存  */
    onMerberSave () {
      if (this.isEditUser) {
        this.drawerLoading = true
        // 处理add 和del 数据
        const add = []
        const del = []
        let _allPerson = false
        let _ownerDepart = false
        const _selectUserList = []
        const _selectNodeData = []
        const _selectUserId = []
        const _selectNodeId = []
        let _allPersonId = null
        let _ownerDepartId = null
        this.originalRelationData.forEach(el => {
          if (el.all) {
            _allPerson = el.all
            _allPersonId = el.id
          }
          if (el.member) {
            _selectUserList.push(el.member)
            _selectUserId.push({
              key: el.member,
              id: el.id
            })
          }
          if (el.department && el.department !== this.nodeId) {
            _selectNodeData.push(el.department)
            _selectNodeId.push({
              key: el.department,
              id: el.id
            })
          }
          if (el.department && el.department === this.nodeId) {
            _ownerDepart = true
            _ownerDepartId = el.id
          }
        })
        /** 所有人权限判断 */
        if (_allPerson) { // 为true 代表修改之前 用户就拥有'全部'权限
          if (!this.allPerson) {
            del.push({
              all: true,
              department: null,
              member: null,
              owner: this.selectUser,
              title: '',
              id: _allPersonId
            })
          }
        } else {
          if (this.allPerson) {
            add.push({
              all: true,
              department: null,
              member: null,
              owner: this.selectUser,
              title: ''
            })
          }
        }
        /** 本部门权限判断 */
        if (_ownerDepart) { // 为true 代表修改之前 用户就拥有'本部门'权限
          if (!this.ownerDepart) {
            del.push({
              all: false,
              department: this.nodeId,
              member: null,
              owner: this.selectUser,
              title: '',
              id: _ownerDepartId
            })
          }
        } else {
          if (this.ownerDepart) {
            add.push({
              all: false,
              department: this.nodeId,
              member: null,
              owner: this.selectUser,
              title: ''
            })
          }
        }
        /** 指定人权限判断 */
        const userArr1 = _selectUserList.filter((el) => {
          return this.selectUserList.indexOf(el) === -1
        })
        if (userArr1.length) { // 代表有删除
          userArr1.forEach(el => {
            _selectUserId.forEach(item => {
              if (el === item.key) {
                del.push({
                  all: false,
                  department: null,
                  member: el,
                  owner: this.selectUser,
                  title: '',
                  id: item.id
                })
              }
            })
          })
        }
        const userArr2 = this.selectUserList.filter((el) => {
          return _selectUserList.indexOf(el) === -1
        })
        if (userArr2.length) { // 代表有增加
          userArr2.forEach(el => {
            add.push({
              all: false,
              department: null,
              member: el,
              owner: this.selectUser,
              title: ''
            })
          })
        }
        /** 指定部门权限判断 */
        const nodeArr1 = _selectNodeData.filter((el) => {
          return this.selectNodeData.indexOf(el) === -1
        })
        if (nodeArr1.length) { // 代表有删除
          nodeArr1.forEach(el => {
            _selectNodeId.forEach(item => {
              if (el === item.key) {
                del.push({
                  all: false,
                  department: el,
                  member: null,
                  owner: this.selectUser,
                  title: '',
                  id: item.id
                })
              }
            })
          })
        }
        const nodeArr2 = this.selectNodeData.filter((el) => {
          return _selectNodeData.indexOf(el) === -1
        })
        if (nodeArr2.length) { // 代表有增加
          nodeArr2.forEach(el => {
            add.push({
              all: false,
              department: el,
              member: null,
              owner: this.selectUser,
              title: ''
            })
          })
        }
        const params = {
          role: this.selectRole,
          member: this.selectUser,
          party: this.nodeId,
          id: this.selectUserId,
          add: add,
          del: del
        }
        this.$http.put('/system/party/member', { data: params }).then(res => {
          this.drawerLoading = false
          this.$message.success('操作成功')
          this.drawer = false
          this.getAllNodeData()
          this.getTableDataById(this.nodeId)
        }, err => {
          console.log(err)
          this.drawerLoading = false
        })
      } else {
        this.drawerLoading = true
        const add = []
        if (this.allPerson) {
          add.push({
            all: true,
            department: null,
            member: null,
            owner: this.selectUser,
            title: ''
          })
        }
        if (this.ownerDepart) {
          add.push({
            all: false,
            department: this.nodeId,
            member: null,
            owner: this.selectUser,
            title: ''
          })
        }
        if (this.selectTagUser.length) {
          this.selectTagUser.forEach(el => {
            add.push({
              all: false,
              department: null,
              member: el.key,
              owner: this.selectUser,
              title: ''
            })
          })
        }
        if (this.selectTagNodeData.length) {
          this.selectTagNodeData.forEach(el => {
            add.push({
              all: false,
              department: el.key,
              member: null,
              owner: this.selectUser,
              title: ''
            })
          })
        }
        const params = {
          role: this.selectRole,
          member: this.selectUser,
          party: this.nodeId,
          add: add,
          del: []
        }
        this.$http.post('/system/party/member', { data: params }).then(res => {
          this.drawerLoading = false
          this.$message.success('操作成功')
          this.drawer = false
          this.getAllNodeData()
          this.getTableDataById(this.nodeId)
        }, err => {
          console.log(err)
          this.drawerLoading = false
        })
      }
    },
    // 新建按钮
    onNew (data) {
      this.name = null
      this.code = null
      this.superior = data ? data.id : null
      this.superiorLabel = data ? data.name : null
      this.isParentNode = true
      this.date = new Date()
      this.remark = null
      this.isEdit = false
      this.nodeVisible = true
      this.title = '新建组织'
    },
    /** 编辑 */
    onEdit (node) {
      this.nodeVisible = true
      this.isEdit = true
      this.title = '编辑组织'
      this.$http.get(`/system/party/self/${node.id}`).then(res => {
        this.name = res.data.name
        this.code = res.data.code
        this.date = res.data.create_at
        this.remark = res.data.remark
        this.superior = res.data.parent === -1 ? null : res.data.parent
        this.isParentNode = res.data.parent === -1
        this.superiorLabel = null
        this.handleChildren(this.treeData, node)
      })
    },
    onNodeClick (event) {
      this.nodeId = event.id
      this.organization = event.name
      this.getTableDataById(event.id)
    },

    getTableDataById (id) {
      this.$http.get(`/system/party/self/${id}`).then(res => {
        this.tableData = res.data.member
        this.pagination.total = this.tableData.length
      })
    },
    /** 获取上级部门label */
    handleChildren (treeData, node) {
      for (let i = 0; i < treeData.length; i++) {
        const item = treeData[i]
        if (item.id !== node.parent) {
          if (item.children) {
            this.handleChildren(item.children, node)
          }
        } else {
          this.superiorLabel = item.name
        }
      }
    },
    // 批量删除用户
    onBatchDelete () {
      if (this.userIds.length) {
        this.$confirm('此操作将删除选中的成员,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.del(`/system/party/member?ids=${this.userIds.join(',')}`).then(res => {
            this.$message.success('删除成功')
            this.getTableDataById(this.nodeId)
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$message.error('请先选择要删除的成员')
      }
    },
    handleSelectionChange (val) {
      this.userIds = []
      val.forEach(el => {
        this.userIds.push(el.id)
      })
    },
    // 删除按钮
    onDelete (node) {
      this.$confirm('确认要删除该部门以及所有子节点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.del(`/system/party/self/${node.id}`).then(res => {
          this.$message.success('删除成功')
          this.clearVariable()
          this.getAllNodeData()
        })
      }).catch(() => {
      })
    },
    /** 清除变量 */
    clearVariable () {
      this.organization = null
      this.name = null
      this.code = null
      this.superiorLabel = null
      this.superior = null
      this.date = null
      this.remark = null
      this.tableData = []
    },
    getAllNodeData () {
      this.$http.get('/system/party/tree').then(res => {
        if (res.data) {
          this.treeData[0] = res.data
        } else {
          this.treeData = []
        }
        this.treeData = cloneDeep(this.treeData)
      })
    },
    /** 处理tabs切换事件 */
    handleTabsClick (value) {
      if (value.name === '1') { // 获取全部部门
        this.getNodeData()
      } else if (value.name === '2') { // 获取全部用户
        this.getUserList()
      }
    },
    /** 选择用户 */
    onSelectUser (event) {
      if (this.activeName === '2') {
        this.allUserList = []
        this.originalUser.forEach(el => {
          if (el.id !== event) {
            this.allUserList.push({
              key: el.id,
              label: el.name
            })
          }
        })
        this.selectUserList.forEach((el, index) => {
          if (el === event) {
            this.selectUserList.splice(index, 1)
            this.selectTagUser.forEach((item, key) => {
              if (item.key === event) {
                this.selectTagUser.splice(key, 1)
              }
            })
          }
        })
      }
    },
    changeKeyToTagUser () {
      this.selectTagUser = []
      this.selectUserList.forEach(el => {
        this.allUserList.forEach(item => {
          if (el === item.key) {
            this.selectTagUser.push(item)
          }
        })
      })
    },
    changeKeyToTagNode () {
      this.selectTagNodeData = []
      this.selectNodeData.forEach(el => {
        this.allNodeData.forEach(item => {
          if (el === item.key) {
            this.selectTagNodeData.push(item)
          }
        })
      })
    },
    /**
     * 关闭用户Tag
     */
    closeUser (index) {
      const target = this.selectTagUser[index]
      this.selectTagUser.splice(index, 1)
      this.selectUserList.forEach((item, key) => {
        if (item === target.key) {
          this.selectUserList.splice(key, 1)
        }
      })
    },
    closeNode (index) {
      const target = this.selectTagNodeData[index]
      this.selectTagNodeData.splice(index, 1)
      this.selectNodeData.forEach((item, key) => {
        if (item === target.key) {
          this.selectNodeData.splice(key, 1)
        }
      })
    },
    getUserList () {
      this.allUserList = []
      this.$http.get('/system/user/list').then((res) => {
        this.originalUser = res.data.data
        res.data.data.forEach(el => {
          if (!this.selectUser || el.id !== this.selectUser) {
            this.allUserList.push({
              label: el.name,
              key: el.id
            })
          }
        })
      })
    },
    /** 获取部门的数组数据 */
    getNodeData () {
      this.allNodeData = []
      this.$http.get(`/system/party/tree?flatten=${true}`).then(res => {
        res.data.forEach((el, index) => {
          if (el.id !== this.nodeId) {
            this.allNodeData.push({
              key: el.id,
              label: el.name
            })
          }
        })
      })
    },
    /** 选中所有人 */
    selectAll (event) {
      this.disableSelect = event
      this.ownerDepart = false
      if (!event) {
        if (this.activeName === '1') {
          this.getNodeData()
        } else {
          this.getUserList()
        }
      } else {
        this.allNodeData = []
        this.selectNodeData = []
        this.selectTagNodeData = []

        this.allUserList = []
        this.selectUserList = []
        this.selectTagUser = []
      }
      /** 获取全部节点 */
    },
    handleNodeClick (node) {
      if (this.nodeId === node.id) {
        this.$message.error('不能选择自己作为上级部门')
        return
      }
      this.handleSelectTree(this.treeData, node)
    },
    // 编辑节点下的用户权限
    onEditUser (row) {
      this.isEditUser = true
      this.allPerson = false
      this.ownerDepart = false
      this.selectNodeData = []
      this.selectUserList = []
      this.selectTagNodeData = []
      this.selectTagUser = []

      this.$http.get(`/system/party/member/rel/${row.id}`).then(res => {
        // 调用全部node 数据
        this.addTitle = '编辑'
        this.drawer = true
        this.originalRelationData = res.data.relation
        this.selectRole = res.data.role
        this.selectUserId = res.data.id
        this.selectUser = res.data.member
        this.selectName = row.name
        res.data.relation.forEach(el => {
          if (el.all) {
            this.allPerson = true
          }
          if (el.department && el.department === this.nodeId) {
            this.ownerDepart = true
          }
          if (el.department && el.department !== this.nodeId) {
            this.selectNodeData.push(el.department)
          }
          if (el.member) {
            this.selectUserList.push(el.member)
          }
        })
        // 获取全部节点数据
        this.allNodeData = []
        this.$http.get(`/system/party/tree?flatten=${true}`).then(res => {
          res.data.forEach((el, index) => {
            this.selectNodeData.forEach(item => {
              if (item === el.id) {
                this.selectTagNodeData.push({
                  key: el.id,
                  label: el.name
                })
              }
            })
            if (el.id !== this.nodeId) {
              this.allNodeData.push({
                key: el.id,
                label: el.name
              })
            }
          })
        })

        // 获取全部用户名
        this.allUserList = []
        this.$http.get('/system/user/list').then((res) => {
          this.originalUser = res.data.data
          res.data.data.forEach(el => {
            this.selectUserList.forEach(item => {
              if (item === el.id) {
                this.selectTagUser.push({
                  label: el.name,
                  key: el.id
                })
              }
            })
            if (!this.selectUser || el.id !== this.selectUser) {
              this.allUserList.push({
                label: el.name,
                key: el.id
              })
            }
          })
        })
      })
    },
    handleSelectTree (treeData, node) {
      treeData.forEach(el => {
        if (el.id === this.nodeId) {
          const ids = []
          if (el.children) {
            this.handleIds(el.children, ids)
          }
          if (ids.indexOf(node.id) !== -1) {
            this.$message.error('不能选择自身或者子级节点作为上一级部门')
          } else {
            this.superior = node.id
            this.superiorLabel = node.name
          }
        } else {
          if (el.children) {
            this.handleSelectTree(el.children, node)
          }
        }
      })
    },
    handleIds (node, ids) {
      node.forEach(el => {
        ids.push(el.id)
        if (el.children) {
          this.handleIds(el.children, ids)
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.sys-organization-container {
  display: flex;
  min-height: 650px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  .content-left {
    width: 400px;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    .content-left-top {
      position: relative;
      height: 50px;
      line-height: 50px;
      padding: 0 $padding-xs;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      .title {
        position: absolute;
        font-size: 18px;
      }
    }
    .content-left-bottom {
      padding: $padding-md $padding-xs;
      .custom-tree-node {
        display: flex;
        justify-content: space-between;
        width: 100%;
        i {
          padding-right: $padding-md;
          opacity: 0;
        }
        &:hover {
          i {
            opacity: 1;
            &:hover {
              color: $--color-primary;
            }
          }
        }
      }
    }
  }
  .content-right {
    width: calc(100% - 400px);
    .content-right-top {
      height: 50px;
      line-height: 50px;
      padding: 0 $padding-xs;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }
    .content-right-bottom {
      margin-bottom: $padding-md;
    }
    .no-data {
      margin-top: 100px;
      text-align: center;
      p {
        margin: $padding-md 0;
      }
    }
  }
  .perm-drawer {
    .set-person {
      margin: 0 0 $padding-md 0;
      border-left: $padding-xs solid $--color-primary;
      padding-left: $padding-md;
      font-size: 18px;
    }
    .member {
      font-size: 14px;
      display: flex;
      margin-bottom: $padding-xs;
      .member-label {
        padding-right: $padding-md;
      }
    }
    .role {
      display: flex;
      font-size: 14px;
      margin-bottom: $padding-xs;
      .role-label {
        padding-right: $padding-md;
      }
    }
    .set-perm {
      margin: $padding-md 0;
      border-left: $padding-xs solid $--color-primary;
      padding-left: $padding-md;
      font-size: 18px;
    }
    .container-main {
      min-height: 120px;
      display: flex;
      font-size: 14px;
      margin-bottom: $padding-xs;
      .label {
        padding-right: $padding-md;
      }
      .control {
        flex: 2;
        border: 1px solid rgba(0, 0, 0, 0.2);
        padding: $padding-xs;
        .owner {
          background-color: #fafafa;
          color: rgba(0, 0, 0, 0.65);
          border: 1px solid #d9d9d9;
          margin-right: $padding-xs;
          margin-bottom: $padding-xs;
        }
        .owner-department {
          background-color: rgb(10, 152, 192);
          color: #ffffff;
          margin-right: $padding-xs;
          margin-bottom: $padding-xs;
        }
        .specify-department {
          background-color: rgb(93, 16, 107);
          color: #fff;
          margin-right: $padding-xs;
          margin-bottom: $padding-xs;
        }
        .specify-person {
          background-color: rgb(169, 117, 15);
          color: #fff;
          margin-right: $padding-xs;
          margin-bottom: $padding-xs;
        }
      }
      .example {
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-left: 0;
        font-size: 14px;
        ul {
          padding-top: $padding-xs;
          li {
            padding-left: $padding-md;
            span {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              border: 1px solid rgba(0, 0, 0, 0.2);
            }
          }
        }
      }
    }
    .specific-select {
      font-size: 14px;
      display: flex;
      margin-bottom: $padding-xs;
      .all-person {
        padding-right: $padding-md;
      }
      .all-depart {
        padding-left: $padding-md;
        padding-right: $padding-md;
      }
    }
    .drawer-btn {
      position: absolute;
      top: 15px;
      right: 100px;
    }
    .drawer-btn-submit {
      position: absolute;
      top: 15px;
      right: 10px;
    }
  }
  .el-row {
    margin-bottom: $padding-md;
    span {
      color: red;
    }
  }

  /deep/ .el-tag .el-icon-close::before {
    color: #ffffff;
  }
  /deep/ :focus {
    outline: 0;
  }
  /deep/ .el-drawer__header {
    font-size: 20px;
  }
  /deep/ .el-drawer__body {
    overflow: scroll;
    padding: 0 20px;
  }
  /deep/ .el-transfer-panel {
    width: 165px;
  }
}
</style>
