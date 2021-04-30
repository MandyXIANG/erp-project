<template>
  <div class="wust-table">
    <el-table
      style="width:100%"
      :header-cell-style="{'background':'#FAFAFA','color':'#000','font-weight':'normal'}"
      :data="data"
      :border="border"
      :stripe="stripe"
      :size="size"
      :fit="fit"
      :row-class-name="rowlClassName"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @cell-click="cellClick"
      @cell-dblclick="cellDblClick"
      @row-click="rowClick"
      @row-contextmenu="rowContextmenu"
      @row-dblclick="rowDblclick"
      @header-click="headerClick"
      @header-contextmenu="headerContextmenu"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @header-dragend="headerDragend"
      @expand-change="expandChange"
      @current-change="currentChange"
    >
      <slot></slot>
    </el-table>
    <Pagination
      class="table-pagination"
      v-if="showPagination"
      v-bind="$attrs"
      v-on="$listeners"
    ></Pagination>
  </div>
</template>
<script>
import Pagination from '@/components/table/Pagination'
export default {
  name: 'Table',
  components: {
    Pagination
  },
  props: {
    data: { // 显示的数据
      type: Array,
      default: () => {
        return []
      }
    },
    stripe: { // 是否为斑马纹 table
      type: Boolean,
      default: true
    },
    border: { // 是否带有纵向边框
      type: Boolean,
      default: true
    },
    size: { // Table 的尺寸
      type: String,
      default: 'small' // medium / small / mini
    },
    fit: { // 列的宽度是否自撑开
      type: Boolean,
      default: true
    },
    showPagination: { // 是否显示分页
      type: Boolean,
      default: true
    },
    rowlClassName: {
      type: Function,
      default: () => {
        return {}
      }
    }
  },
  watch: {
  },
  data () {
    return {
      tableData: []
    }
  },
  created () {
  },
  methods: {
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    select (selection, row) {
      this.$emit('select', selection, row)
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    selectAll (selection) {
      this.$emit('select-all', selection)
    },
    // 当选择项发生变化时会触发该事件
    selectionChange (selection) {
      console.log(selection, 'select')
      this.$emit('selection-change', selection)
    },
    // 当单元格 hover 进入时会触发该事件
    cellMouseEnter (row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    // 当单元格 hover 退出时会触发该事件
    cellMouseLeave (row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event)
    },
    // 当某个单元格被点击时会触发该事件
    cellClick (row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
    // 当某个单元格被双击击时会触发该事件
    cellDblClick (row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event)
    },
    // 当某一行被点击时会触发该事件
    rowClick (row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    // 当某一行被鼠标右键点击时会触发该事件
    rowContextmenu (row, column, event) {
      this.$emit('row-contextmenu', row, column, event)
    },
    // 当某一行被双击时会触发该事件
    rowDblclick (row, column, event) {
      this.$emit('row-dblclick', row, column, event)
    },
    // 当某一列的表头被点击时会触发该事件
    headerClick (column, event) {
      this.$emit('header-click', column, event)
    },
    // 当某一列的表头被鼠标右键点击时触发该事件
    headerContextmenu (column, event) {
      this.$emit('header-contextmenu', column, event)
    },
    // 当表格的排序条件发生变化的时候会触发该事件
    sortChange (sort) {
      this.$emit('sort-change', sort)
    },
    // 当表格的筛选条件发生变化的时候会触发该事件，参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组。
    filterChange (filters) {
      this.$emit('filter-change', filters)
    },
    // 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性
    currentChange (currentRow, oldCurrentRow) {
      this.$emit('table-current-page', currentRow, oldCurrentRow)
    },
    // 当拖动表头改变了列的宽度的时候会触发该事件
    headerDragend (newWidth, oldWidth, column, event) {
      this.$emit('header-dragend', newWidth, oldWidth, column, event)
    },
    // 当用户对某一行展开或者关闭的时候会触发该事件（展开行时，回调的第二个参数为 expandedRows；树形表格时第二参数为 expanded）
    expandChange (row, expand) {
      console.log(row, expand, 'expandexpand')
      this.$emit('expand-change', row, expand)
    }
  }
}
</script>
<style lang="scss" scoped>
.wust-table {
  .table-pagination {
    margin-top: $padding-md;
  }
}
</style>
