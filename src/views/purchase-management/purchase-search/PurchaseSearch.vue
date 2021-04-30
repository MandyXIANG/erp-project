<template>
  <div>
    <PageHeader title="采购明细列表" />
    <div>
      <el-form :model="form" class="search-form" ref="searchForm">
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="6"
          :xl="6"
          class="search-form-item"
        >
          <el-form-item
            :xs="24"
            :sm="12"
            :md="12"
            :lg="6"
            :xl="6"
            prop="hscode"
            label="HS编码"
          >
            <el-input
              v-model="form.hscode"
              placeholder="请输入HS编码"
              @keyup.native.enter="onSeach"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="6"
          :xl="6"
          class="search-form-item"
        >
          <el-form-item
            :xs="24"
            :sm="12"
            :md="12"
            :lg="6"
            :xl="6"
            prop="req_num"
            label="请购单号"
          >
            <el-input
              v-model="form.req_num"
              placeholder="请输入请购单号"
              @keyup.native.enter="onSeach"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="6"
          :xl="6"
          class="search-form-item"
        >
          <el-form-item
            :xs="24"
            :sm="12"
            :md="12"
            :lg="6"
            :xl="6"
            prop="supplier_name"
            label="供应商名称"
          >
            <el-input
              v-model="form.supplier_name"
              placeholder="请输入供应商名称"
              @keyup.native.enter="onSeach"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          v-if="expand"
          :xs="24"
          :sm="12"
          :md="12"
          :lg="6"
          :xl="6"
          class="search-form-item"
        >
          <el-form-item
            :xs="24"
            :sm="12"
            :md="12"
            :lg="6"
            :xl="6"
            prop="material_name"
            label="物料名称"
          >
            <el-input
              v-model="form.material_name"
              placeholder="请输入物料名称"
              @keyup.native.enter="onSeach"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="6"
          :xl="6"
          class="search-form-item"
        >
          <el-form-item>
            <span class="expand" v-if="!expand" @click="onToggle">
              <i class="el-icon-arrow-down"></i>
              展开</span
            >
            <span class="expand" v-else @click="onToggle">
              <i class="el-icon-arrow-up"></i>
              收起</span
            >
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onSeach">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <Table
      :data="tableData"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item
              v-for="(jtem, j) in expandCols"
              :key="j"
              :label="jtem.label"
            >
              <span>{{ props.row[jtem.prop] }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        v-for="(item, key) in tableCols"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :formatter="formatter"
      >
      </el-table-column>
    </Table>
  </div>
</template>

<script>
import * as Decimal from 'decimal.js'

import PageHeader from '@/components/title/Title.vue'
import Table from '@/components/table/Table.vue'
import { tableCols, API_MAP, expandCols } from './config'
import { formatTime, transKey } from '@/utils/trans.js'

export default {
  components: { PageHeader, Table },
  data () {
    return {
      tableCols,
      expandCols,
      tableData: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      sort: { col: 'id', order: 0 },
      form: { hscode: null },
      expand: false,
      query: {}
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    onSeach () {
      this.query = {}
      this.query['q[hscode.code]'] = this.form.hscode
      this.query['q[material_name]'] = this.form.material_name
      this.query['q[supplier_name]'] = this.form.supplier_name
      this.query['q[req_num]'] = this.form.req_num
      for (const key in this.query) {
        if (
          this.query[key] === '' ||
          this.query[key] === undefined ||
          this.query[key] === null
        ) {
          delete this.query[key]
        }
      }
      this.getTableData()
    },
    onReset () {
      this.form = {}
      this.query = {}
      this.getTableData()
    },
    getTableData () {
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.sort.col,
        order: this.sort.order,
        stateop: 1,
        state: 'cancel'
      }
      params = Object.assign(params, this.query)

      this.$http.get(API_MAP.PURCHASE_DETAIL, { data: params }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.formatData()
          this.pagination.total = res.data.total_records
        }
      })
    },
    formatData () {
      this.tableData.map(item => {
        item.main_plan_date = formatTime(item.main_plan_date)
        item.total_price = Number(
          Decimal.mul(item.price, item.purchase_amount)
        )
        item.main_price_unit = transKey(item.main_price_unit)
        item.currency = transKey(item.currency)
      })
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getTableData()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getTableData()
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getTableData()
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'hscode') {
        return row.hscode.code
      } else if (column.property === 'state') {
        return transKey(row[column.property])
      } else {
        return row[column.property]
      }
    },
    onToggle () {
      this.expand = !this.expand
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  .search-form-item {
    /deep/ .el-form-item__label {
      text-align: left;
    }
    /deep/ .el-form-item__content {
      display: flex;
      div {
        width: 80% !important;
        .el-input {
          width: 100% !important;
        }
      }
      .expand {
        margin-right: 8px;
        cursor: pointer;
        color: $--color-primary;
      }
    }
  }
}
</style>
