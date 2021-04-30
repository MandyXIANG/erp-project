<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    @prev-click="handleCurrentChange"
    @next-click="handleCurrentChange"
    :total="total"
    :current-page="local_currentPage"
    :page-size="pageSize"
    :page-sizes="pageSizes"
    :pager-count="pagerCount"
    :hide-on-single-page="hideOnSinglePage"
    :disabled="disabled"
    :layout="layout"
    :next-text="nextText"
    :prev-text="prevText"
    :popper-class="popperClass"
    :small="small"
    :page-count="pageCount"
    :background="background"
    :style="{ 'text-align': position }"
  >
  </el-pagination>
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    small: {
      // 是否使用小型分页样式
      type: Boolean,
      default: false
    },
    background: {
      // 是否为分页按钮添加背景色
      type: Boolean,
      default: true
    },
    'page-size': {
      // 每页显示条目个数，支持 .sync 修饰符
      type: Number,
      default: 10
    },
    total: {
      // 总条目数
      type: Number,
      default: 0
    },
    'page-count': {
      // 总页数 total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性
      type: Boolean,
      default: null
    },
    'pager-count': {
      // 页码按钮的数量，当总页数超过该值时会折叠
      type: Number,
      default: 7
    },
    'current-page': {
      // 当前页数，支持 .sync 修饰符
      type: Number,
      default: 1
    },
    layout: {
      // 组件布局，子组件名用逗号分隔
      type: String,
      default: 'total,sizes,prev, pager, next,slot,jumper'
    },
    'page-sizes': {
      // 每页显示个数选择器的选项设置
      type: Array,
      default: () => {
        return [10, 20, 30, 40, 50, 100, 200, 500, 1000]
      }
    },
    'popper-class': {
      // 每页显示个数选择器的下拉框类名
      type: String,
      default: ''
    },
    'prev-text': {
      // 替代图标显示的上一页文字
      type: String,
      default: ''
    },
    'next-text': {
      // 替代图标显示的下一页文字
      type: String,
      default: ''
    },
    disabled: {
      // 是否禁用
      type: Boolean,
      default: false
    },
    'hide-on-single-page': {
      // 只有一页时是否隐藏
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'right'
    }
  },
  watch: {
    pageSize: {
      immediate: true,
      deep: true,
      handler (v) {
        this.pageSize = v
      }
    },
    currentPage: {
      immediate: true,
      handler (v) {
        this.local_currentPage = v
      }
    }
  },
  data () {
    return {
      // local_pageSize: this.pageSize,
      local_currentPage: this.currentPage
    }
  },
  methods: {
    // pageSize 改变时会触发
    handleSizeChange (pageSize) {
      console.log(pageSize, 'pageSize')
      if (pageSize) {
        this.$emit('size-change', pageSize)
      } else {
        let index = -1
        for (let i = 0; i < this.pageSizes.length; i++) {
          const element = this.pageSizes[i]
          if (element === this.pageSize) {
            index = i
            break
          }
        }
        if (index === this.pageSizes.length - 1) {
          index = -1
        }
        console.log(this.pageSizes[index + 1], '111')
        this.$emit('size-change', this.pageSizes[index + 1])
      }
    },
    // currentPage 改变时会触发   // 用户点击上一页按钮改变当前页后触发 // 用户点击下一页按钮改变当前页后触发
    handleCurrentChange (currentPage) {
      this.$emit('current-change', currentPage)
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped></style>
