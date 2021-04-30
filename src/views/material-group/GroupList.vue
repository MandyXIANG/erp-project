<template>
    <div>
      <Title :title="'物料组列表'"></Title>
      <Search :params="Params" @onSearch="onSearch" @onReset="onReset"></Search>
      <el-button type="primary" class="topbar-btn" @click="add"
                 v-if="$permission('material_group_manage_new')">
                 新增
      </el-button>
      <Table :data="marGroupData"  :total="total" :current-page="searchForm.page"
             :page-size="searchForm.count" @size-change="changePageSize"
             @current-change="changeCurrentPage" @sort-change="sortChange">
             <el-table-column v-for="(item, index) in Columns" :key="index"
                              :label="item.label" :prop="item.prop"
                              :sortable="item.sortable">
             </el-table-column>
             <el-table-column label="操作">
               <template slot-scope="scope">
                 <span @click="detail(scope)" class="detail" v-if="$permission('material_group_manage_info')">详情</span>
                 <el-divider direction="vertical"></el-divider>
                 <el-dropdown>
                   <span class="el-dropdown-link">更多<i class="el-icon-arrow-down el-icon--right"></i></span>
                   <el-dropdown-menu slot="dropdown">
                     <el-dropdown-item icon="el-icon-edit" @click.native="edit(scope)" v-if="$permission('material_group_edit')">编辑</el-dropdown-item>
                     <el-dropdown-item icon="el-icon-delete" @click.native="del(scope)" v-if="$permission('material_group_del')">删除</el-dropdown-item>
                   </el-dropdown-menu>
                 </el-dropdown>
               </template>
             </el-table-column>
      </Table>
    </div>
</template>
<script>
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
import Table from '@/components/table/Table'
import { Params, Columns } from './materialGroupConfig'
export default {
  name: 'GroupList',
  components: { Title, Search, Table },
  data () {
    return {
      Params,
      Columns,
      marGroupData: [],
      total: 0,
      searchForm: {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      }
    }
  },
  mounted () {
    this.getMaterialGroupList()
  },
  methods: {
    getMaterialGroupList () {
      const params = Object.assign({}, this.searchForm, this.query)
      this.$http.get('/base/materialgroup/', { data: params }).then(res => {
        const result = res.data
        this.marGroupData = result.data
        this.total = result.total_records
      })
    },
    add () {
      this.$router.push('/main/EditGroup')
    },
    edit (scope) {
      this.$router.push(`/main/EditGroup?id=${scope.row.id}`)
    },
    detail (scope) {
      this.$router.push(`/main/GroupInfo?id=${scope.row.id}`)
    },
    del (scope) {
      this.$confirmMsg(`此操作将删除物料${scope.row.name}，是否继续?`, '提示').then(() => {
        this.$http.del(`/base/materialgroup/${scope.row.id}`).then(res => {
          this.$tipMessage('删除成功', 'success', 1500)
          this.isLastPage()
          this.getMaterialGroupList()
        })
      }).catch(() => {
      })
    },
    isLastPage () {
      if (this.marGroupData.length === 1 && this.searchForm.page !== 1) {
        this.searchForm.page--
      }
    },
    onSearch (form) {
      this.query = form
      this.searchForm.page = 1
      this.getMaterialGroupList()
    },
    onReset (from) {
      this.query = from
      this.searchForm = {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      }
      this.getMaterialGroupList()
    },
    // 排序
    sortChange (column) {
      this.searchForm.col = column.prop
      this.searchForm.order = column.order === 'ascending' ? 1 : 0
      this.getMaterialGroupList()
    },
    changePageSize (count) {
      this.searchForm.count = count
      this.getMaterialGroupList()
    },
    changeCurrentPage (page) {
      this.searchForm.page = page
      this.getMaterialGroupList()
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.detail {
    color: $--color-primary;
    cursor: pointer;
}
</style>
