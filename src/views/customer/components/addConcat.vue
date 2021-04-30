<template>
  <div class="add-concat">
    <el-button type="primary" class="topbar-btn" @click="addConcat"
      >添加联系人</el-button
    >
    <Table
      :data="spliceTableData"
      :total="tableData.length"
      :current-page="pagination2.currentPage"
      :page-size="pagination2.pageSize"
      @size-change="onSizeChange2"
      @current-change="onCurrentChange2"
    >
      <el-table-column
        sortable
        :formatter="formatter"
        v-for="(item, key) in personTableCol"
        :key="key"
        :prop="item.prop"
        :label="item.label"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span class="table-detail" @click="onDelete(scope)">移除</span>
        </template>
      </el-table-column>
    </Table>
    <el-dialog
      :close-on-click-modal="false"
      title="添加联系人"
      :visible.sync="dialogFormVisible"
    >
      <el-input
        v-model="name"
        @keyup.native.enter="onSearch"
        placeholder="请输入姓名搜索"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="onSearch"
        ></i>
      </el-input>
      <Table
        :data="concatList"
        :total="pagination.total"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="corp" label="公司"></el-table-column>
        <el-table-column prop="source" label="来源"></el-table-column>
      </Table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/table/Table.vue'
import { formatDate, transKey } from '@/utils/trans.js'
export default {
  props: ['personTableCol', 'tableData', 'type', 'id'],
  watch: {
    tableData: {
      immediate: true,
      handler (v) {
        this.tableData = v
      }
    }
  },
  components: {
    Table
  },
  data () {
    return {
      personTableData: [],
      dialogFormVisible: false,
      selectData: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      pagination2: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      name: '',
      query: {},
      concatList: []
    }
  },
  computed: {
    spliceTableData () {
      const start =
        (this.pagination2.currentPage - 1) * this.pagination2.pageSize
      const end = this.pagination2.currentPage * this.pagination2.pageSize
      const cloneData = JSON.parse(JSON.stringify(this.tableData))
      return cloneData.slice(start, end)
    }
  },
  mounted () {},
  methods: {
    addConcat () {
      this.dialogFormVisible = true
      this.getConcatList()
    },
    handleSelectionChange (val) {
      this.selectData = val
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getConcatList()
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
      this.getConcatList()
    },
    // 当前页数改变时的事件
    onCurrentChange2 (currentPage) {
      this.pagination2.currentPage = currentPage
    },
    // 当前条数改变时的事件
    onSizeChange2 (size) {
      this.pagination2.pageSize = size
    },
    handleOk () {
      this.dialogFormVisible = false
      this.$emit('handleOk', this.selectData)
    },
    onDelete (scope) {
      this.$emit('onDelete', scope)
    },
    onSearch () {
      this.pagination.currentPage = 1
      this.query['q[name]'] = this.name
      this.getConcatList()
    },
    getConcatList () {
      this.concatList = []
      let params = {
        page: this.pagination.currentPage,
        count: this.pagination.pageSize,
        op: 1,
        ac: 0
      }
      params = Object.assign(params, this.query)
      let url
      if (this.type === 1) {
        url = '/base/supplier/contact/' + this.id
      } else {
        url = '/base/customer/contact/' + this.id
      }
      this.$http.get(url, { data: params }).then(res => {
        if (res.code === 0) {
          this.concatList = res.data.data || []
          this.pagination.total = res.data.total_records
        }
      })
    },
    formatter (row, column, cellValue, index) {
      if (column.property === 'birth') {
        return formatDate(row[column.property])
      } else if (column.property === 'state') {
        return transKey(row[column.property])
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  max-height: 550px;
  overflow: auto;
}
</style>
