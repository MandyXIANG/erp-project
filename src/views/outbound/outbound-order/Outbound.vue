<template>
    <div>
      <Title :title="'出库单列表'"></Title>
      <Search :params="Params" @onSearch="onSearch" @onReset="onReset"></Search>
      <el-button type="primary" @click="add" class="topbar-btn"
                v-if="$permission('outbound_manage_new')">
                新增
      </el-button>
      <Table :data="outData" :total="total" :current-page="searchForm.page" :page-size="searchForm.count"
             @size-change="changePageSize" @current-change="changeCurrentPage" @sort-change="sortChange">
              <el-table-column v-for="(item, index) in TableColumn" :key="index"
                              :label="item.label" :prop="item.prop" :sortable="item.sortable"
                              :formatter="formatter">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span @click="detail(scope)" class="detail" v-if="$permission('outbound_manage_info')">详情</span>
                  <el-divider direction="vertical"></el-divider>
                  <el-dropdown>
                    <span class="el-dropdown-link">更多<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-edit" @click.native="edit(scope)"
                                          v-if="$permission('outbound_edit')"
                                        :disabled="scope.row.state !== 'draft' && (scope.row.state !== 'reject' || scope.row.source !== null)">
                                        编辑
                        </el-dropdown-item>
                        <el-dropdown-item icon="el-icon-circle-close" @click.native="close(scope)"
                                        :disabled="scope.row.state === 'out'"
                                        v-if="$permission('outbound_close')">
                                        关闭任务
                        </el-dropdown-item>
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
import { formatTime, transKey } from '@/utils/trans'
import { Params, TableColumn } from './outboundConfig'

export default {
  name: 'Outbound',
  components: { Title, Search, Table },
  data () {
    return {
      Params,
      TableColumn,
      total: 3,
      query: {
        state: 'closed',
        stateop: 1
      },
      formattime: formatTime,
      transkey: transKey,
      searchForm: {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      },
      outData: []
    }
  },
  mounted () {
    this.getOutData()
  },
  methods: {
    // 获取出库单列表
    getOutData () {
      const params = Object.assign({}, this.searchForm, this.query)
      this.$http.get('/business/stockout', { data: params }).then(res => {
        const result = res.data
        this.outData = result.data
        this.total = result.total_records
      })
    },
    add () {
      this.$router.push('/main/outbound-edit')
    },
    detail (scope) {
      this.$router.push(`/main/outbound-detail?id=${scope.row.id}`)
    },
    edit (scope) {
      this.$router.push(`/main/outbound-edit?id=${scope.row.id}`)
    },
    // 关闭出库单
    close (scope) {
      const params = {
        state: 'closed'
      }
      this.$confirmMsg(`此操作将关闭出库单${scope.row.id}，是否继续？`, '提示').then(() => {
        this.$http.put(`/business/stockout/${scope.row.id}?logtype=${'closed'}`, { data: params }).then(res => {
          this.$tipMessage('关闭成功', 'success', 1500)
          this.isLastPage()
          this.getOutData()
        })
      }).catch(() => {
      })
    },
    isLastPage () {
      if (this.outData.length === 1 && this.searchForm.page !== 1) {
        this.searchForm.page--
      }
    },
    changePageSize (pageSize) {
      this.searchForm.count = pageSize
      this.getOutData()
    },
    changeCurrentPage (currentPage) {
      this.searchForm.page = currentPage
      this.getOutData()
    },
    sortChange (column) {
      this.searchForm.col = column.prop
      this.searchForm.order = column.order === 'ascending' ? 1 : 0
      this.getOutData()
    },
    onSearch (form) {
      this.searchForm.page = 1
      if (form.state) {
        this.query = form
      } else {
        this.query = { state: 'stop', stateop: 1 }
        Object.assign(this.query, form)
      }
      this.getOutData()
    },
    onReset (form) {
      this.query = form
      this.searchForm = {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      }
      this.query = {
        state: 'stop',
        stateop: 1
      }
      this.getOutData()
    },
    // 格式化数据
    formatter (row, column) {
      if (column.property === 'state' || column.property === 'type') {
        return this.transkey(row[column.property])
      } else if (column.property === 'create_at') {
        return this.formattime(row[column.property])
      } else if (column.property === 'source') {
        const value = row[column.property] === 'sale' ? '销售部门' : '仓库部门'
        return value
      } else {
        return row[column.property]
      }
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
