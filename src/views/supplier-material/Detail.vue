<template>
  <div class="supplier-material-detail">
    <PageHeader :title="$route.query.name" :back="true" @back="goBack" />
    <Table
      :data="materialData"
      :total="pagination.total"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item
              v-for="(jtem, j) in detailExpandCols"
              :key="j"
              :label="jtem.label"
            >
              <span>{{ scope.row[jtem.prop] }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        v-for="(item, key) in detailsTableCols"
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
import Table from '@/components/table/Table.vue'
import PageHeader from '@/components/title/Title.vue'
import {
  detailsTableCols,
  API_MAP,
  unitMap,
  currMap,
  detailExpandCols
} from './config'
export default {
  components: {
    PageHeader,
    Table
  },
  data () {
    return {
      detailsTableCols,
      detailExpandCols,
      currMap,
      unitMap,
      materialData: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      supplierId: null
    }
  },
  created () {
    this.supplierId = this.$route.query.id
    this.getSupplierMaterial()
  },
  methods: {
    formatter (row, column, cellValue, index) {
      if (column.property === 'trans_curr') {
        return this.currMap[row[column.property]]
      } else if (column.property === 'unit') {
        return this.unitMap[row[column.property]]
      }
      if (column.property === 'sm_state') {
        if (row[column.property] === 'release') {
          return '放行'
        } else if (row[column.property] === 'invalid') {
          return '作废'
        } else {
          return row[column.property]
        }
      } else {
        return row[column.property]
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    /**
     * 获取供应商的物料
     */
    getSupplierMaterial (sort = {}) {
      const params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        col: sort.col,
        order: sort.order,
        state: 'release,invalid'
      }
      this.$http
        .get(API_MAP.SUPPLIER_MATERIALS + `/${this.supplierId}`, {
          data: params
        })
        .then(res => {
          if (res.code === 0) {
            this.materialData = res.data.data || []
            this.pagination.total = res.data.total_records
          }
        })
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getSupplierMaterial()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getSupplierMaterial()
    },
    sortChange (column) {
      this.getSupplierMaterial({
        col: column.prop,
        order: column.order === 'ascending' ? 1 : 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
