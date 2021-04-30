<template>
    <div>
      <Title :title="'物料列表'"></Title>
      <Search :params="Params" @onSearch="onSearch" @onReset="onReset"></Search>
      <el-button type="primary" @click="add" class="topbar-btn" v-if="$permission('material_manage_new')">新增</el-button>
      <Table :data="MarData" :total="total"
             :current-page="searchForm.page" :page-size="searchForm.count"
             @size-change="changePageSize" @current-change="changeCurrentPage" @sort-change="sortChange">
             <el-table-column v-for="(item, index) in Columns" :key="index"
                              :label="item.label" :prop="item.prop" :sortable="item.sortable">
             </el-table-column>
             <el-table-column label="状态" sortable>
                <template slot-scope="scope">
                  {{scope.row.state === 'delete' ? '删除' : (scope.row.state === 'invalid' ? '作废' : '放行')}}
                </template>
             </el-table-column>
             <el-table-column label="操作">
                <template slot-scope="scope">
                  <span @click="detail(scope)" class="detail" v-if="$permission('material_manage_info')">详情</span>
                  <el-divider direction="vertical"></el-divider>
                  <el-dropdown>
                    <span class="el-dropdown-link">更多<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-edit" @click.native="edit(scope)" :disabled ="scope.row.state === 'invalid'" v-if="$permission('material_edit')">编辑</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete" @click.native="handle(scope, 'delete', '删除')" v-if="$permission('material_del')">删除</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-folder-delete" @click.native="handle(scope, 'invalid', '作废')" :disabled ="scope.row.state === 'invalid'" v-if="$permission('material_invalid')">作废</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-finished" @click.native="handle(scope, 'release', '激活')" :disabled="scope.row.state === 'release'" v-if="$permission('material_release')">激活</el-dropdown-item>
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
import material from '@/utils/data/material'
import { Columns, Params } from './materConfig'
export default {
  name: 'MaterialList',
  mixins: [material()],
  components: { Title, Search, Table },
  data () {
    return {
      MarData: [],
      Columns,
      Params,
      moreMenu: [],
      total: 0,
      query: {},
      searchForm: {
        page: 1,
        count: 10,
        col: 'id',
        order: 0,
        state: 'release,invalid'
      }
    }
  },
  mounted () {
    this.getMaterialList()
  },
  methods: {
    getMaterialList () {
      const params = Object.assign({}, this.searchForm, this.query)
      this.$http.get('/base/material/list', { data: params }).then(res => {
        const result = res.data
        this.MarData = result.data
        this.total = result.total_records
      })
    },
    // 排序
    sortChange (column) {
      this.searchForm.col = column.prop
      this.searchForm.order = column.order === 'ascending' ? 1 : 0
      this.getMaterialList()
    },
    add () {
      this.$router.push('EditMaterial/add')
    },
    detail (scope) {
      this.$router.push(`MaterialInfo?id=${scope.row.id}`)
    },
    edit (scope) {
      this.$router.push(`EditMaterial/edit?id=${scope.row.id}`)
    },
    handle (scope, type, msg) {
      this.$confirmMsg(`此操作将${msg}物料${scope.row.code}，是否继续?`, '提示').then(() => {
        this.$http.put(`/base/material/state/${scope.row.id}?type=${type}`).then(res => {
          this.$tipMessage(`${msg}成功`, 'success', 1500)
          this.isLastPage()
          this.getMaterialList()
        })
      }).catch(() => {
      })
    },
    // 判断是否是最后一页的最后一列
    isLastPage () {
      if (this.MarData.length === 1 && this.searchForm.page !== 1) {
        this.searchForm.page--
      }
    },
    onSearch (form) {
      this.query = form
      this.searchForm.page = 1
      this.getMaterialList()
    },
    onReset (from) {
      this.query = from
      this.searchForm = {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      }
      this.getMaterialList()
    },
    changePageSize (count) {
      this.searchForm.count = count
      this.getMaterialList()
    },
    changeCurrentPage (page) {
      this.searchForm.page = page
      this.getMaterialList()
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
