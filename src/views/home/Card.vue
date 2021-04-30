<template>
  <el-card class="box-card">
    <div slot="header">
      <i class="title-icon" :class="'iconfont ' + icon"></i>
      <span class="title"> {{ title }}</span>
    </div>
    <div class="table">
      <el-scrollbar>
        <Table
          :data="tableData"
          :showPagination="false"
          :border="false"
          @row-click="selectRow"
          @sort-change="sortChange"
        >
          <el-table-column
            v-for="(item, key) in tableCols"
            :key="key"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.sortable"
            :formatter="formatter"
            :width="item.width"
          >
          </el-table-column>
        </Table>
      </el-scrollbar>
    </div>
  </el-card>
</template>
<script>
import Table from '@/components/table/Table'
import { transKey } from '@/utils/trans'
export default {
  components: {
    Table
  },
  props: {
    icon: {
      type: String,
      default: () => {
        return 'iconyewu'
      }
    },
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableCols: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      transkey: transKey
    }
  },
  mounted () {
    console.log(this.tableData, 'tableData')
    console.log(this.tableCols, 'tableCols')
  },
  methods: {
    /** 格式化数据 */
    formatter (row, column, cellValue, index) {
      if (column.property === 'state') {
        return this.transkey(row[column.property])
      } else {
        return row[column.property]
      }
    },
    selectRow (e) {
      console.log(e, 'eeeeeeeeeeeee')
      this.$emit('row-click', e)
    },
    sortChange (e) {
      this.$emit('sort-change', e)
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card {
  height: 100%;
  margin-bottom: $padding-md;
  /deep/.el-card__body {
    padding: 0;
  }
  .title {
    font-size: 18px;
    font-weight: 700;
    color: #666;
  }
  .title-icon{
    font-size: 20px;
  }
  .table {
    // min-height: 600px;
    height: 600px;
    .el-scrollbar {
      height: 100%;
      /deep/ .el-table__row:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
