<template>
    <div>
      <Title :title="'联系人列表'"></Title>
      <Search :params="Params" @onSearch="onSearch" @onReset="onReset"></Search>
      <el-button type="primary" @click="add" class="topbar-btn" v-if="$permission('contact_manager_new')">新增</el-button>
      <Table :data="contactData" :total="total"
             :current-page="searchForm.page" :page-size="searchForm.count"
             @size-change="changePageSize" @current-change="changeCurrentPage" @sort-change="sortChange">
          <el-table-column v-for="(item, index) in contactColum" :key="index"
                           :label="item.label" :prop="item.prop" :sortable="item.sortable">
          </el-table-column>
          <el-table-column label="状态" sortable>
            <template slot-scope="scope">
              {{scope.row.state === 'valid' ? '有效' : '无效'}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span @click="detail(scope)" class="detail" v-if="$permission('contact_manage_info')">详情</span>
              <el-divider direction="vertical"></el-divider>
              <el-dropdown>
                <span class="el-dropdown-link">更多<i class="el-icon-arrow-down el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-edit" @click.native="edit(scope)" :disabled="scope.row.state === 'invalid'" v-if="$permission('contact_edit')">编辑</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-delete" @click.native="handle(scope, 'delete', '删除')" v-if="$permission('contact_del')">删除</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-folder-delete" @click.native="handle(scope, 'invalid', '作废')" :disabled="scope.row.state === 'invalid'" v-if="$permission('contact_invalid')">作废</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-finished" @click.native="handle(scope, 'valid', '激活')" :disabled="scope.row.state === 'valid'" v-if="$permission('contact_valid')">激活</el-dropdown-item>
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
import { contactColum, Params } from './config'
export default {
  name: 'ContactList',
  components: { Title, Search, Table },
  data () {
    return {
      contactColum,
      Params,
      contactData: [],
      total: 0,
      query: {},
      searchForm: {
        page: 1,
        count: 10,
        col: 'id',
        order: 0,
        state: 'valid,invalid'
      }
    }
  },
  mounted () {
    this.initList()
  },
  methods: {
    initList () {
      const params = Object.assign({}, this.searchForm, this.query)
      this.$http.get('/base/contacts', { data: params }).then(res => {
        const result = res.data
        this.contactData = result.data
        this.total = result.total_records
      })
    },
    add () {
      this.$router.push('EditContact/add')
    },
    detail (scope) {
      this.$router.push(`ContactInfo/?id=${scope.row.id}`)
    },
    edit (scope) {
      this.$router.push(`EditContact/edit?id=${scope.row.id}`)
    },
    handle (scope, type, msg) {
      this.$confirmMsg(`此操作将${msg}联系人${scope.row.name}，是否继续？`, '提示').then(() => {
        this.$http.put(`/base/contact/state/${scope.row.id}?type=${type}`).then(res => {
          this.$tipMessage(`${msg}成功`, 'success', 1500)
          this.isLastPage()
          this.initList()
        })
      }).catch(() => {
      })
    },
    isLastPage () {
      if (this.contactData.length === 1 && this.searchForm.page !== 1) {
        this.searchForm.page--
      }
    },
    onSearch (form) {
      this.query = form
      this.searchForm.page = 1
      this.initList()
    },
    onReset (form) {
      this.query = form
      this.searchForm = {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      }
      this.initList()
    },
    changePageSize (count) {
      this.searchForm.count = count
      this.initList()
    },
    changeCurrentPage (page) {
      this.searchForm.page = page
      this.initList()
    },
    sortChange (column) {
      this.searchForm.col = column.prop
      this.searchForm.order = column.order === 'ascending' ? 1 : 0
      this.initList()
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
