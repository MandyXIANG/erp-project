<template>
    <div>
      <Title :title="'备料列表'"></Title>
      <Search :params="Params" @onSearch="onSearch" @onReset="onReset"></Search>
      <Table :data="prepareTableData" :total="total" :current-page="searchForm.page" :page-size="searchForm.count"
             @size-change="changePageSize" @current-change="changeCurrentPage" @sort-change="sortChange">
              <el-table-column v-for="(item, index) in prepareColumn" :key="index"
                              :label="item.label" :prop="item.prop"
                              :sortable="item.sortable" :formatter="formatter">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span class="table-detail" @click="detail(scope)"
                        v-if="$permission('prepare_manage_info')">
                        备料
                  </span>
                </template>
              </el-table-column>
      </Table>
    </div>
</template>
<script>
import Title from '@/components/title/Title'
import Search from '@/components/search/Search'
import Table from '@/components/table/Table'
import { Params, prepareColumn } from './prepareConfig'
import { transKey, formatTime } from '@/utils/trans.js'

export default {
  name: 'Prepare',
  components: { Title, Search, Table },
  data () {
    return {
      Params,
      prepareColumn,
      total: 0,
      query: {},
      prepareTableData: [],
      searchForm: {
        page: 1,
        count: 10,
        col: 'id',
        order: '0'
      }
    }
  },
  mounted () {
    this.getPrepareData()
  },
  methods: {
    getPrepareData () {
      const params = Object.assign({}, this.searchForm, this.query)
      this.$http.get('/business/wait_prepare', { data: params }).then(res => {
        const result = res.data
        this.prepareTableData = result.data
        this.total = result.total_records
      })
    },
    formatter (row, column, cellValue, index) {
      if (column.property === 'state') {
        return transKey(row[column.property])
      } else if (column.property === 'plan_prepare_time') {
        return formatTime(row[column.property])
      } else {
        return row[column.property]
      }
    },
    detail (scope) {
      this.$router.push(`/main/prepare-Detail?id=${scope.row.id}`)
    },
    onSearch (val) {
      this.query = val
      this.searchForm.page = 1
      this.getPrepareData()
    },
    onReset (val) {
      this.query = val
      this.searchForm = {
        page: 1,
        count: 10,
        col: 'id',
        order: 0
      }
      this.getPrepareData()
    },
    changePageSize (pageSize) {
      this.searchForm.count = pageSize
      this.getPrepareData()
    },
    changeCurrentPage (currentPage) {
      this.searchForm.page = currentPage
      this.getPrepareData()
    },
    sortChange (column) {
      this.searchForm.col = column.prop
      this.searchForm.order = column.order === 'ascending' ? 1 : 0
      this.getPrepareData()
    }
  }
}
</script>
