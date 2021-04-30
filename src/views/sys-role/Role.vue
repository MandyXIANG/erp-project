<template>
  <div class="role-page-warper">
    <Title :title="'角色列表'"></Title>
    <Search
      :params="searchParams"
      @onSearch="onSearch"
      @onReset="onReset"
    />
    <el-button
      type="primary"
      class="btn"
      @click="onNew"
      v-if="$permission('new_role')"
    >新增</el-button>
    <Table
      :data="tableData"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
      @sort-change="sortChange"
    >
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        v-for="(item,key) in tableCols"
        :key="key"
        :sortable="item.sortable"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            class="table-detail"
            @click="onDetail(scope)"
            v-if="$permission('role_detail')"
          >详情</span>
          <el-divider direction="vertical"></el-divider>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-edit"
                v-if="$permission('edit_role')"
                @click.native="onEdit(scope)"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-user"
                v-if="$permission('set_user')"
                @click.native="onSetUser(scope)"
                :disabled="scope.row.state==='disable'"
              >设置用户
              </el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-user"
                v-if="$permission('set_permission')"
                @click.native="onEditPermission(scope)"
                :disabled="scope.row.state==='disable'"
              >设置权限</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-delete"
                @click.native="onDelete(scope)"
                v-if="$permission('delete_role')"
              >删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </Table>
    <el-drawer
      title="角色配置"
      dorection="rtl"
      :visible.sync="drawer"
      :show-close="false"
    >
      <el-button
        type="primary"
        class="drawer-btn"
        @click="onSubmit"
        :loading="loading"
      >确定</el-button>
      <el-tabs type="border-card">
        <el-tab-pane label="角色权限">
          <el-tree
            :data="permTree"
            :default-expand-all="true"
            :show-checkbox="true"
            ref="permTree"
            node-key="key"
            :default-checked-keys="checkPermData"
          ></el-tree>
        </el-tab-pane>
        <!-- <el-tab-pane label="角色api">
          <el-tree
            :data="apiTree"
            :default-expand-all="true"
            :show-checkbox="true"
            ref="apiTree"
            node-key="key"
            :default-checked-keys="checkApiData"
          >
          </el-tree>
        </el-tab-pane> -->
      </el-tabs>
    </el-drawer>
  </div>
</template>
<script>
import { TableCols, SearchParams, StatusList } from './role.config'
import Table from '@/components/table/Table'
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
export default {
  name: 'Role',
  components: {
    Table,
    Title,
    Search
  },
  data () {
    return {
      statusList: StatusList,
      tableData: [],
      tableCols: TableCols,
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      drawer: false,
      permTree: [], // perm的树型结构数据
      apiTree: [], // api的树型结构数据
      apiData: [], // 获取到的全部api数据
      permData: [], // 获取到的全部perm数据
      role: null,
      checkApiData: [], // 通过角色获取到的进行处理的Api数据(默认选中的)
      checkPermData: [], // 通过角色获取到的进行处理的权限数据(默认选中的)
      checkPerm: [], // 通过角色获取到的没有进行处理的权限数据
      checkApi: [], // 通过角色获取到的没有进行处理的Api数据
      searchParams: SearchParams,
      order: 0, // 默认降序
      col: 'id', // 默认排序的字段
      query: {},
      loading: false
    }
  },
  mounted () {
    // 获取全部用户名
    this.getAllRoleData()
  },
  methods: {
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getAllRoleData()
    },
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getAllRoleData()
    },
    sortChange (column, prop, order) {
      this.col = column.prop
      column.order === 'descending' ? this.order = 0 : this.order = 1
      this.getAllRoleData()
    },
    onDelete (scope) {
      this.$confirm(`此操作将删除角色${scope.row.name},是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = Number(scope.row.id)
        this.$http.del(`/system/roleperm/del/${id}`).then((res) => {
          if (this.tableData.length === 1 && this.pagination.currentPage !== 1) {
            this.pagination.currentPage = this.pagination.currentPage - 1
          }
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getAllRoleData()
        })
      }).catch(() => { })
    },
    onNew () {
      this.$router.push('edit-role')
    },
    onEdit (scope) {
      this.$router.push(`edit-role?id=${scope.row.id}`)
    },
    onSubmit () {
      // 处理数据
      // const api = this.$refs.apiTree.getCheckedNodes()
      this.loading = true
      const perm = this.$refs.permTree.getCheckedNodes()
      // 最终选中的数据
      // const add = this.handleCheckData(api, this.checkApiData, this.apiData, 'api_perm', this.checkApi).add.concat(this.handleCheckData(perm, this.checkPermData, this.permData, 'web_perm', this.checkPerm).add)
      const add = this.handleCheckData(perm, this.checkPermData, this.permData, 'perm', this.checkPerm).add
      // const del = this.handleCheckData(api, this.checkApiData, this.apiData, 'api_perm', this.checkApi).del.concat(this.handleCheckData(perm, this.checkPermData, this.permData, 'web_perm', this.checkPerm).del)
      const del = this.handleCheckData(perm, this.checkPermData, this.permData, 'perm', this.checkPerm).del
      // 新增接口
      const params = {
        add: add,
        del: del,
        role: this.role
      }
      this.$http.post('/system/permm', { data: params }).then((res) => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.drawer = false
      }, err => {
        console.log(err)
        this.loading = false
      })
    },
    handleCheckData (data, initCheckData, localData, type, initData) {
      let checkData = []
      if (type === 'api_perm') {
        const _checkData = []
        localData.forEach((item) => {
          data.forEach((element) => {
            if (!element.children && item.id === element.parentsId) {
              _checkData.push({
                action: [element.label],
                code: item.code,
                description: item.description,
                group: item.group,
                id: item.id,
                name: item.name,
                type: item.type
              })
            }
          })
        })
        checkData = this.mergeData(_checkData)
      } else {
        localData.forEach((item) => {
          data.forEach((element) => {
            if (!element.children && element.id === item.id) {
              checkData.push({
                action: item.action,
                code: item.code,
                description: item.description,
                group: item.group,
                id: item.id,
                name: item.name,
                type: item.type
              })
            }
          })
        })
      }
      // 选中的跟初始化相对比 如果选中的没有在里面 代表新增
      let add = []
      let del = []
      if (!initCheckData.length && checkData.length) { // 初始化没有选中的数据  最后有选中的数据(选中的全部是增加的数据)
        del = []
        add = checkData
      } else if (!checkData.length && initCheckData.length) { // 初始化有选中的数据 最后没有选中的数据(默认选中的数据是删除的数据)
        del = initData
        add = []
      } else {
        // 先将选中的数据 转换为 id_name_action 结构
        const selectKey = []
        for (let i = 0; i < checkData.length; i++) {
          const element = checkData[i]
          if (element.action) {
            element.action.forEach(el => {
              selectKey.push(element.id + '_' + element.name + '_' + el)
            })
          } else {
            selectKey.push(element.id + '_' + element.name + '_' + element.action)
          }
        }
        // 通过初始化默认选择的数据与转换的数据对比(这些数据都是唯一的)
        const addKey = []
        if (type === 'api_perm') {
          for (let j = 0; j < selectKey.length; j++) {
            const item = selectKey[j]
            for (let i = 0; i < localData.length; i++) {
              const element = localData[i]
              element.action.forEach(el => {
                const key = element.id + '_' + element.name + '_' + el
                if (item === key) {
                  addKey.push({
                    action: [el],
                    name: element.name,
                    group: element.group,
                    code: element.group,
                    id: element.id,
                    description: element.description,
                    type: element.type
                  })
                }
              })
            }
          }
          add = this.mergeData(addKey)
          return {
            del: initData,
            add: add
          }
        }
        for (let i = 0; i < selectKey.length; i++) {
          const element = selectKey[i]
          for (let j = 0; j < initCheckData.length; j++) {
            const item = initCheckData[j]
            if (element === item) {
              break
            }
            if (j === initCheckData.length - 1 && item !== element) {
              const arr = element.split('_')
              localData.forEach(el => {
                if (el.id === Number(arr[0])) {
                  addKey.push({
                    action: el.action,
                    name: el.name,
                    group: el.group,
                    code: el.group,
                    id: el.id,
                    description: el.description,
                    type: el.type
                  })
                }
              })
            }
          }
        }
        add = addKey
        // 删除 delete
        const deleKey = []
        for (let i = 0; i < initCheckData.length; i++) {
          const element = initCheckData[i]
          for (let j = 0; j < selectKey.length; j++) {
            const item = selectKey[j]
            if (item === element) {
              break
            }
            if (j === selectKey.length - 1 && item !== element) {
              const arr = element.split('_')
              localData.forEach(el => {
                if (el.id === Number(arr[0])) {
                  deleKey.push({
                    action: el.action,
                    name: el.name,
                    group: el.group,
                    code: el.group,
                    id: el.id,
                    description: el.description,
                    type: el.type
                  })
                }
              })
            }
          }
          del = deleKey
        }
      }
      return {
        del: del,
        add: add
      }
    },
    onSetUser (scope) {
      console.log(scope, 'scopescope')
      this.$router.push({
        path: 'set-user',
        query: {
          id: scope.row.id,
          name: scope.row.name
        }
      })
    },
    onEditPermission (scope) {
      this.checkPermData = []
      this.checkApiData = []
      this.drawer = true
      this.role = scope.row
      // 获取全部api数据
      // this.getAllApiData()
      // 获取全部权限数据
      this.getAllPerData()
      // 获取已有的权限
      this.getCheckData(Number(scope.row.id), 'api_perm')
      this.getCheckData(Number(scope.row.id), 'perm')
    },
    // 获取全部角色名
    getAllRoleData () {
      const params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        type: 'role',
        col: this.col,
        order: this.order,
        state: 'active,disable'
      }
      Object.assign(params, this.query)
      this.$http.get('/system/roleperm/list', { data: params }).then((res) => {
        this.pagination.total = res.data.total_records
        this.tableData = res.data.data ? res.data.data : []
      })
    },
    // 获取全部api数据
    // getAllApiData () {
    //   const params = {
    //     type: 'api_perm'
    //   }
    //   this.$http.get('/perm', { data: params }).then((res) => {
    //     this.apiData = res.data.role_perms ? res.data.role_perms : []
    //     this.apiTree = this.handleData(this.apiData, 'api_perm')
    //   })
    // },
    // 获取全部权限数据
    getAllPerData () {
      const params = {
        type: 'perm',
        state: 'active'
      }
      this.$http.get('/system/roleperm/list', { data: params }).then((res) => {
        this.permData = res.data.data ? res.data.data : []
        this.permTree = this.handleData(this.permData, 'perm')
      })
    },
    // 获取已选的数据
    getCheckData (id, type) {
      this.$http.get(`/system/permm/${id}`).then((res) => {
        const checkData = []
        if (res.data) {
          if (type === 'api_perm') {
            res.data.forEach(el => {
              if (el.action) {
                el.action.forEach(element => {
                  checkData.push(el.id + '_' + el.name + '_' + element)
                })
              }
            })
            this.checkApiData = checkData
            this.checkApi = res.data ? res.data : []
          } else {
            res.data.forEach(el => {
              checkData.push(el.id + '_' + el.name + '_' + el.action)
            })
            this.checkPermData = checkData
            this.checkPerm = res.data ? res.data : []
          }
        }
      })
    },
    handleData (data, type) {
      const treeData = []
      const obj = {}
      data.forEach((item, index) => {
        if (!obj[item.group]) {
          obj[item.group] = item
        }
      })
      let count = 1
      for (const key in obj) {
        const obj1 = {}
        const children = []
        obj1.id = count
        obj1.label = key
        count++
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          if (type === 'perm') {
            if (element.group === key) {
              children.push({
                id: element.id,
                label: element.name,
                key: element.id + '_' + element.name + '_' + element.action
              })
            }
          } else {
            if (element.group === key) {
              const child = []
              for (let j = 0; j < element.action.length; j++) {
                const item = element.action[j]
                child.push({
                  id: item,
                  label: item,
                  parentsId: element.id,
                  key: element.id + '_' + element.name + '_' + item
                })
              }
              children.push({
                id: element.id,
                label: element.name,
                parentsId: element.id,
                key: element.id + '_' + element.name,
                children: child
              })
            }
          }
        }
        obj1.children = children
        treeData.push(obj1)
      }
      return treeData
    },
    // 合并数据
    mergeData (data) {
      for (let j = 0; j < data.length; j++) {
        const element = data[j]
        for (let x = j + 1; x < data.length; x++) {
          const item = data[x]
          if (element.id === item.id) {
            element.action.push(item.action[0])
            data.splice(x, 1)
            j--
          }
        }
      }
      return data
    },
    onDetail (scope) {
      this.$router.push(`role-detail?id=${scope.row.id}`)
    },
    /** 搜索按钮 */
    onSearch (val) {
      this.pagination.currentPage = 1
      this.query = val
      this.getAllRoleData()
    },
    /** 重置按钮 */
    onReset (val) {
      this.pagination.currentPage = 1
      this.query = {}
      this.getAllRoleData()
    },
    formatter (row, column, cellValue, index) {
      if (column.property === 'state') {
        for (let i = 0; i < this.statusList.length; i++) {
          const item = this.statusList[i]
          if (item.value === cellValue) {
            return item.label
          }
        }
      }
      return row[column.property]
    }
  }
}
</script>
<style lang="scss" scoped>
.role-page-warper {
  width: 100%;
  .btn {
    margin-bottom: $padding-md;
  }
  .drawer-btn {
    position: absolute;
    top: 15px;
    right: 10px;
  }
}
/deep/ :focus {
  outline: 0;
}
/deep/ .el-tabs--border-card {
  height: 100%;
}
/deep/ .el-drawer__body {
  overflow: scroll;
}
</style>
