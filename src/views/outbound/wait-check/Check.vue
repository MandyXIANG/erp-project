<template>
    <div>
      <Title :title="'待审核列表'"></Title>
      <Search :params="Params" @onSearch="onSearch" @onReset="onReset"></Search>
      <Table :data="checkList" :total="total" :current-page="searchForm.page"
             :page-size="searchForm.count" @size-change="changePageSize"
             @current-change="changeCurrentPage" @sort-change="sortChange">
                <el-table-column v-for="(item, index) in checkColumn" :key="index"
                                :label="item.label" :prop="item.prop"
                                :sortable="item.sortable" :formatter="formatter">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span class="table-detail" @click="check(scope)" v-if="$permission('outbound_check_manage_info')">审核</span>
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
import { Params, checkColumn } from './checkConfig'
export default {
  name: 'Check',
  components: { Title, Search, Table },
  data () {
    return {
      Params,
      checkColumn,
      transKey,
      formatTime,
      total: 0,
      query: {},
      checkList: [],
      searchForm: {
        state: 'wait_check',
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      }
    }
  },
  mounted () {
    this.initList()
  },
  methods: {
    initList () {
      const params = Object.assign({}, this.searchForm, this.query)
      this.$http.get('/business/stockout', { data: params }).then(res => {
        const result = res.data
        this.checkList = result.data
        this.total = result.total_records
      })
    },
    formatter (row, column) {
      if (column.property === 'state') {
        return this.transKey(row[column.property])
      } else if (column.property === 'create_at') {
        return this.formatTime(row[column.property])
      } else {
        return row[column.property]
      }
    },
    check (scope) {
      this.$router.push(`/main/check-detail?id=${scope.row.id}`)
    },
    onSearch (val) {
      this.query = val
      this.searchForm.page = 1
      this.initList()
    },
    onReset (val) {
      this.query = val
      this.searchForm = {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      }
      this.initList()
    },
    changePageSize (pageSize) {
      this.searchForm.count = pageSize
      this.initList()
    },
    changeCurrentPage (currentPage) {
      this.searchForm.page = currentPage
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
