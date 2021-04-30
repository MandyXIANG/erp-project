<template>
  <div class="home-container">
    <el-row
      :gutter="20"
      v-if="$permission('contact_manager_read')
    ||$permission('purchase_order_read')
    ||$permission('sale_check_read')
    ||$permission('purchase_order_check_read')
    ||$permission('stockin_read_wait_check')
    ||$permission('outbound_check_manage_read')"
    >
      <el-col
        :span="12"
        v-if="$permission('contact_manager_read')"
      >
        <Card
          :icon="'iconshengridangao'"
          :title="'生日提醒'"
          :tableData="contactData"
          :tableCols="contactTableCols"
          @row-click="selectRow($event,'ContactInfo')"
          @sort-change="sortChange($event,'contact')"
        ></Card>
      </el-col>
      <el-col
        :span="12"
        v-if="$permission('purchase_order_read')"
      >
        <Card
          :icon="'iconfukuantongzhi'"
          :title="'待付款'"
          :tableData="pendingPaymentData"
          :tableCols="pendingPaymentTableCols"
          @row-click="selectRow($event,'purchase-detail')"
          @sort-change="sortChange($event,'purchaseDetail')"
        ></Card>
      </el-col>
      <el-col
        :span="12"
        v-if="$permission('sale_check_read')"
      >
        <Card
          :icon="'icondaibanshixiang5'"
          :title="'待审核销售订单'"
          :tableData="salesData"
          :tableCols="salesTableCols"
          @row-click="selectRow($event,'sale-check-detail')"
          @sort-change="sortChange($event,'sales')"
        ></Card>
      </el-col>
      <el-col
        :span="12"
        v-if="$permission('purchase_order_check_read')"
      >
        <Card
          :icon="'icondaibanshixiang5'"
          :title="'待审核采购订单'"
          :tableData="purchaseData"
          :tableCols="purchaseTableCols"
          @row-click="selectRow($event,'purchase-check')"
          @sort-change="sortChange($event,'purchase')"
        ></Card>
      </el-col>
      <el-col
        :span="12"
        v-if="$permission('stockin_read_wait_check')"
      >
        <Card
          :icon="'icondaibanshixiang5'"
          :title="'待审核收料单'"
          :tableData="receiptData"
          :tableCols="receiptTableCols"
          @row-click="selectRow($event,'stockin-edit-wait-check')"
          @sort-change="sortChange($event,'receipt')"
        ></Card>
      </el-col>
      <el-col
        :span="12"
        v-if="$permission('outbound_check_manage_read')"
      >
        <Card
          :icon="'icondaibanshixiang5'"
          :title="'待审核出库单'"
          :tableData="stockOutData"
          :tableCols="stockOutTableCols"
          @row-click="selectRow($event,'check-detail')"
          @sort-change="sortChange($event,'stockout')"
        ></Card>
      </el-col>
    </el-row>

    <div
      v-if="!$permission('contact_manager_read')
    &&!$permission('purchase_order_read')
    &&!$permission('sale_check_read')
    &&!$permission('purchase_order_check_read')
    &&!$permission('stockin_read_wait_check')
    &&!$permission('outbound_check_manage_read')"
      class="empty"
    >欢迎来到我的地盘~~~</div>
  </div>
</template>

<script>
import { ContactTableCols, SalesTableCols, PurchaseTableCols, ReceiptTableCols, StockOutTableCols, PendingPaymentTableCols } from './home.config'
import Card from './Card'
export default {
  components: {
    Card
  },
  data () {
    return {
      contactData: [],
      contactTableCols: ContactTableCols,
      salesData: [],
      salesTableCols: SalesTableCols,
      purchaseData: [],
      purchaseTableCols: PurchaseTableCols,
      receiptTableCols: ReceiptTableCols,
      receiptData: [],
      stockOutTableCols: StockOutTableCols,
      stockOutData: [],
      pendingPaymentTableCols: PendingPaymentTableCols,
      pendingPaymentData: [],
      contactCol: 'id',
      contactOrder: 0,
      salesCol: 'id',
      salesOrder: 0,
      purchaseCol: 'id',
      purchaseOrder: 0,
      receiptCol: 'id',
      receiptOrder: 0,
      stockOutCol: 'id',
      stockOutOrder: 0,
      pendingPaymentCol: 'id',
      pendingPaymentOrder: 0
    }
  },
  mounted () {
    /** 获取全部数据 */
    this.getContactData()
    this.getSalesData()
    this.getPurchaseData()
    this.getReceiptData()
    this.getStockOutData()
    this.getPendingPaymentData()
  },
  methods: {
    /** 获取联系人生日列表 */
    getContactData () {
      const params = {
        col: this.contactCol,
        order: this.contactOrder
      }
      this.$http.get('/base/contacts/birth', { data: params }).then(res => {
        console.log(res, 'res')
        this.contactData = res.data.data
        this.contactData.map((item, index) => {
          item.birth_day = item.birth.birth_day.replace(/\d{4}-/, '')
          item.no = index + 1
        })
      })
    },
    getSalesData () {
      const params = {
        state: 'wait_check,pass',
        stateop: 0,
        col: this.salesCol,
        order: this.salesOrder
      }
      this.$http.get('/business/sales/mains', { data: params }).then(res => {
        console.log(res, 'res')
        this.salesData = res.data.data
        this.salesData.map((item, index) => {
          item.no = index + 1
        })
      })
    },
    getPurchaseData () {
      const params = {
        state: 'wait_check,pass',
        stateop: 0,
        col: this.purchaseCol,
        order: this.purchaseOrder
      }
      this.$http.get('/business/purchase/main', { data: params }).then(res => {
        console.log(res, 'datadatadatadatadata')
        this.purchaseData = res.data.data ? res.data.data : []
        this.purchaseData.map((item, index) => {
          item.no = index + 1
        })
      })
    },
    /** 待审核收料单 */
    getReceiptData () {
      const params = {
        col: this.receiptCol,
        order: this.receiptCol,
        state: 'wait_check'
      }
      this.$http.get('/business/stockin/watch/receipt', { data: params }).then(res => {
        console.log(res, 'resres')
        this.receiptData = res.data.data
        this.receiptData.map((item, index) => {
          item.no = index + 1
        })
      })
    },
    /** 待审核出库单 */
    getStockOutData () {
      const params = {
        col: this.stockOutCol,
        order: this.stockOutOrder,
        state: 'wait_check'
      }
      this.$http.get('/business/stockout', { data: params }).then(res => {
        this.stockOutData = res.data.data
        this.stockOutData.map((item, index) => {
          item.no = index + 1
        })
      })
    },
    getPendingPaymentData () {
      const params = {
        col: this.pendingPaymentCol,
        order: this.pendingPaymentOrder
      }
      this.$http.get('/business/purchase/unpaid', { data: params }).then(res => {
        console.log(res, 'resresresres')
        this.pendingPaymentData = res.data
        this.pendingPaymentData.map((item, index) => {
          item.no = index + 1
        })
      })
    },
    /** 选中某一行数据 */
    selectRow (value, route) {
      console.log(value, route, '选中某行')
      if (route === 'sale-check-detail' || route === 'purchase-check') {
        this.$router.push({
          path: `main/${route}`,
          query: {
            id: value.id,
            state: value.state,
            date: value.effective_date
          }
        })
      } else {
        this.$router.push(`main/${route}?id=${value.id}`)
      }
    },
    /** 表头排序 */
    sortChange (column, flag) {
      switch (flag) {
        case 'contact':
          console.log(column, 'column')
          if (column.prop === 'birth_day') {
            this.contactCol = 'birth.birth_day'
          } else {
            this.contactCol = column.prop
          }
          column.order === 'descending' ? this.contactOrder = 0 : this.contactOrder = 1
          this.getContactData()
          break
        case 'sales':
          this.salesCol = column.prop
          column.order === 'descending' ? this.salesOrder = 0 : this.salesOrder = 1
          this.getSalesData()
          break
        case 'purchase':
          this.purchaseCol = column.prop
          column.order === 'descending' ? this.purchaseOrder = 0 : this.purchaseOrder = 1
          this.getPurchaseData()
          break
        case 'receipt':
          this.receiptCol = column.prop
          column.order === 'descending' ? this.receiptOrder = 0 : this.receiptOrder = 1
          this.getReceiptData()
          break
        case 'stockout':
          this.stockOutCol = column.prop
          column.order === 'descending' ? this.stockOutOrder = 0 : this.stockOutOrder = 1
          this.getStockOutData()
          break
        default:
          this.pendingPaymentCol = column.prop
          column.order === 'descending' ? this.pendingPaymentOrder = 0 : this.pendingPaymentOrder = 1
          this.getPendingPaymentData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.empty {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 32px;
  color: #999;
  text-align: center;
  // position: absolute;
  // top:50%;
  // left: 50%;
  // transform:translate(-50%,-50%) ;
  text-align: center;
}
</style>
