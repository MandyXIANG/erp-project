<template>
  <div class="inventory-list">
    <Search :params="Params" @onSearch="onSearch" @onReset="onReset"></Search>
    <ul class="color-info">
      <li>
        <span class="max-warning"></span>
        <span>最大库存预警</span>
      </li>
      <li>
        <span class="safe-warning"></span>
        <span>安全库存预警</span>
      </li>
      <li>
        <span class="min-warning"></span>
        <span>最小库存预警</span>
      </li>
    </ul>
    <Table
      :data="invData"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"

      @size-change="changePageSize"
      @current-change="changeCurrentPage"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table header-cell-class-name="no-border-cell"  cell-class-name="no-border-cell" :border="false" :data="props.row.stock_location_infos" size="mini">
            <el-table-column v-for="(ele,j) in expandCol" :key="j"  :prop="ele.prop" :label="ele.label"> </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <template v-for="(item, index) in InvColumn">
        <el-table-column
          sortable="custom"
          v-if="item.prop === 'stock_amount'"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :formatter="formatter"
        >
          <template slot-scope="scope">
            <span
              style="font-size:16px;font-weight:bold"
              :class="{
                'max-warning':
                  scope.row.warehouse_max_alert &&
                  scope.row.warehouse_max_num !== null &&
                  scope.row.stock_amount >= scope.row.warehouse_max_num,
                'safe-warning':
                  scope.row.warehouse_safe_alert &&
                  scope.row.warehouse_safe_num !== null &&
                  scope.row.stock_amount <= scope.row.warehouse_safe_num,
                'min-warning':
                  scope.row.warehouse_min_alert &&
                  scope.row.warehouse_min_num !== null &&
                  scope.row.stock_amount <= scope.row.warehouse_min_num
              }"
              >{{ scope.row.stock_amount }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          v-else
          sortable="custom"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :formatter="formatter"
        >
        </el-table-column>
      </template>
    </Table>
  </div>
</template>
<script>
import Search from '@/components/search/Search'
import Table from '@/components/table/Table'
import { Params, InvColumn, API_MAP, expandCol } from './config'
export default {
  name: 'InventoryList',
  components: { Table, Search },
  data () {
    return {
      Params,
      invData: [],
      tagType: '',
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      InvColumn,
      query: {},
      sort: { col: 'id', order: 0 },
      expandCol
    }
  },
  created () {
    this.getInvData()
  },
  methods: {
    getInvData () {
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: this.sort.col,
        order: this.sort.order,
        state: 'release'
      }
      params = Object.assign(params, this.query)
      this.$http.get(API_MAP.STOCK_INFO, { data: params }).then(res => {
        if (res.code === 0) {
          this.invData = res.data.datas
          this.pagination.total = res.data.total_records
        }
      })
    },

    onSearch (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getInvData()
    },
    onReset (val) {
      this.query = val
      this.pagination.currentPage = 1
      this.getInvData()
    },
    changePageSize (pageSize) {
      this.pagination.pageSize = pageSize
      this.getInvData()
    },
    changeCurrentPage (curPage) {
      this.pagination.currentPage = curPage
      this.getInvData()
    },
    sortChange (column) {
      this.sort = {
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      }
      this.getInvData()
    },
    // 格式化数据
    formatter (row, column, cellValue, index) {
      if (column.property === 'state') {
        if (row[column.property] === 'release') {
          return '放行'
        } else {
          return row[column.property]
        }
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.inventory-list {
  .color-info {
    display: flex;
    align-items: center;
    margin-bottom: $padding-xs;
    li {
      span {
        &:first-child {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: $padding-xs;
          border-radius: 50%;
        }
      }
      margin-right: $padding-xs;
      .max-warning {
        background: #7219bf;
      }
      .min-warning {
        background: red;
      }
      .safe-warning {
        background: #19bfa9;
      }
    }
  }
  .max-warning {
    color: #7219bf;
  }

  .safe-warning {
    color: #19bfa9;
  }
  .min-warning {
    color: red;
  }
  /deep/ .no-border-cell{
    border-right: 0 !important;
  }
}
</style>
