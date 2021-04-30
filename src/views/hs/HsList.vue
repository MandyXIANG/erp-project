<template>
    <div class="page-wraper">
        <Title :title="'HS编码'"></Title>
          <Search :params="Params" @onSearch="onSearch" @onReset="onReset"></Search>
          <el-button class="topbar-btn" v-if="$permission('hs_manager_new')" type="primary" @click="add">新增</el-button>
          <Table :data="hsData" :total="total" @sort-change="sortChange"
                :current-page="searchForm.page" :page-size="searchForm.count"
                @size-change="changeSize" @current-change="changeCurrent">
                <el-table-column v-for="(item, index) in HsColumn" :key="index"
                                  :prop="item.prop" :label="item.label" :sortable="item.sortable">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span type="text"  class="detail" @click="editHs(scope)" v-if="$permission('edit_hs')" >编辑</span>
                    <el-divider direction="vertical"></el-divider>
                    <span type="text" class="detail" @click="delHs(scope)" v-if="$permission('delete_hs')" >删除</span>
                  </template>
                </el-table-column>
          </Table>
    </div>
</template>
<script>
import Title from '@/components/title/Title'
import Table from '@/components/table/Table'
import Search from '@/components/search/Search'
import { HsColumn, Params } from './HsConfig'
export default {
  name: 'HsList',
  components: { Title, Table, Search },
  data () {
    return {
      hsData: [],
      HsColumn,
      Params,
      total: 0,
      query: {},
      searchForm: {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      }
    }
  },
  mounted () {
    this.getHsTbaleData()
  },
  methods: {
    // 获取数据
    getHsTbaleData () {
      const params = Object.assign({}, this.searchForm, this.query)
      this.$http.get('/base/hs', { data: params }).then(res => {
        const result = res
        if (result.code === 0) {
          this.hsData = result.data.data
          this.total = result.data.total_records
        }
      })
    },
    sortChange (column) {
      this.searchForm.col = column.prop
      this.searchForm.order = column.order === 'ascending' ? 1 : 0
      this.getHsTbaleData()
    },
    onSearch (form) {
      this.query = form
      this.searchForm.page = 1
      this.getHsTbaleData()
    },
    onReset (form) {
      this.query = form
      this.searchForm = {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      }
      this.getHsTbaleData()
    },
    add () {
      this.$router.push('EditHs/add')
    },
    // 编辑
    editHs (scope) {
      this.$router.push(`EditHs/edit?id=${scope.row.id}`)
    },
    // 删除
    delHs (scope) {
      this.$confirmMsg(`此操作将删除编码${scope.row.code}，是否继续？`, '提示').then(() => {
        this.$http.del(`/base/hs?ids=${scope.row.id}`).then(res => {
          this.$tipMessage('删除成功', 'success', 1500)
          this.isLastPage()
          this.getHsTbaleData()
        })
      }).catch(() => {
      })
    },
    isLastPage () {
      if (this.hsData.length === 1 && this.searchForm.page !== 1) {
        this.searchForm.page--
      }
    },
    changeSize (pageSize) {
      this.searchForm.count = pageSize
      this.getHsTbaleData()
    },
    changeCurrent (currentPage) {
      this.searchForm.page = currentPage
      this.getHsTbaleData()
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
