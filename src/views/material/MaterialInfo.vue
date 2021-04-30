<template>
    <div class="page-info">
      <PageHeader :title="formData.code" :back="true" @back="goBack"></PageHeader>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
            <template slot="title">
              <Collapse-Title :title="'基本信息'"></Collapse-Title>
            </template>
            <div class="cell-group">
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">物料名称</div><div class="cell_value"> {{formData.name }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">物料编码</div><div class="cell_value"> {{formData.code }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">物料描述</div><div class="cell_value"> {{formData.description }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">基本单位</div><div class="cell_value"> {{formData.basic_unit }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">创建时间</div><div class="cell_value"> {{ formData.create_at }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">创建人</div><div class="cell_value"> {{ formData.owner_name }}({{formData.owner_fullname}})</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">类别</div><div class="cell_value"> {{formData.class }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">物料简称</div><div class="cell_value"> {{formData.abbr }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">物料组</div><div class="cell_value"> {{formData.group_name }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">生产日期</div><div class="cell_value" v-if="formData.prod_date"> {{formData.prod_date}}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">有效期至</div><div class="cell_value" v-if="formData.valid_period" > {{formData.valid_period}}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="18" :md="24" :lg="16" :xl="8">
                  <div class="cell_title">备注</div><div class="cell_value"> {{formData.remark }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">销售单位</div><div class="cell_value" v-if="formData.unit_info"> {{formData.unit_info.sale }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">基本单位</div><div class="cell_value"> {{formData.basic_unit }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">转换系数</div><div class="cell_value" v-if="formData.unit_info"> {{formData.unit_info.sale_ratio }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">采购单位</div><div class="cell_value" v-if="formData.unit_info"> {{formData.unit_info.purchase }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">基本单位</div><div class="cell_value"> {{formData.basic_unit }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">转换系数</div><div class="cell_value " v-if="formData.unit_info"> {{formData.unit_info.purchase_ratio }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">库存单位</div><div class="cell_value" v-if="formData.unit_info"> {{formData.unit_info.stock }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">基本单位</div><div class="cell_value"> {{formData.basic_unit }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <div class="cell_title">转换系数</div><div class="cell_value" v-if="formData.unit_info"> {{formData.unit_info.stock_ratio }}</div>
                </el-col>
            </div>
        </el-collapse-item>
        <el-collapse-item name="2">
            <template slot="title">
              <Collapse-Title :title="'物料属性'"></Collapse-Title>
            </template>
            <div>
              <el-table :data="formData.property" border>
                <el-table-column prop="name" label="属性名称"></el-table-column>
                <el-table-column prop="code" label="属性代码"></el-table-column>
                <el-table-column prop="control" label="是否管控">
                  <template slot-scope="scope">
                    <span v-if="scope.row.control==true">是</span>
                      <span v-if="scope.row.control==false">否</span>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="属性值"></el-table-column>
              </el-table>
            </div>
        </el-collapse-item>
        <el-collapse-item name="3">
            <template slot="title">
              <Collapse-Title :title="'仓储信息'"></Collapse-Title>
            </template>
            <div class="cell-group">
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">默认仓库</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.warehouse_name }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">默认区位</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.area_name }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">默认库位</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.location_name }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">库存单位</div><div class="cell_value" v-if="formData.unit_info"> {{formData.unit_info.stock }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">仓库结算方式</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.settle_method_name}}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">是否免检</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.verify ? '是' : '否' }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">超发方式</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.over_sale_name}}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">最大库存预警</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.max_alert ? '是' : '否' }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">最小库存预警</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.min_alert ? '是' : '否' }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">安全库存预警</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.safe_alert ? '是' : '否' }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">最大库存量</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.max_num }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">最小库存量</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.min_num }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">安全库存量</div><div class="cell_value" v-if="formData.warehouse_info"> {{formData.warehouse_info.safe_num}}</div>
              </el-col>
            </div>
        </el-collapse-item>
        <el-collapse-item name="4">
            <template slot="title">
              <Collapse-Title :title="'采购信息'"></Collapse-Title>
            </template>
            <div class="cell-group">
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">采购物料单位</div><div class="cell_value" v-if="formData.unit_info"> {{formData.unit_info.purchase  }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">默认供应商</div><div class="cell_value" v-if="formData.purchase"> {{formData.purchase.supplier_name }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">允许退料</div><div class="cell_value" v-if="formData.purchase"> {{formData.purchase.withdraw ? '是' : '否' }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">到货提醒</div><div class="cell_value" v-if="formData.purchase"> {{formData.purchase.notify ? '是' : '否'  }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">收货提前天数</div><div class="cell_value" v-if="formData.purchase"> {{formData.purchase.ahead }}</div>
              </el-col>
               <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">最小订货量</div><div class="cell_value" v-if="formData.planing"> {{formData.planing.min }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">固定批量</div><div class="cell_value" v-if="formData.planing"> {{formData.planing.fixed }}</div>
               </el-col>
            </div>
        </el-collapse-item>
        <el-collapse-item name="5">
            <template slot="title">
              <Collapse-Title :title="'销售信息'"></Collapse-Title>
            </template>
            <div class="cell-group">
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">销售物料单位</div><div class="cell_value" v-if="formData.unit_info"> {{formData.unit_info.sale }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">计价单位</div><div class="cell_value" v-if="formData.sales"> {{(formData.sales.sale_unit === 'yuan')? '元' : '万元' }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">起订量</div><div class="cell_value" v-if="formData.sales"> {{formData.sales.start_num }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">基准币种</div><div class="cell_value" v-if="formData.sales"> {{(formData.sales.trans_curr === 'cny' ? '人民币' : (formData.sales.trans_curr === 'eur' ? '欧元' : '美元') ) }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">最低折扣</div><div class="cell_value" v-if="formData.sales"> {{formData.sales.min_discount }}%</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">允许退货</div><div class="cell_value" v-if="formData.sales"> {{formData.sales.withdraw ? '是' : '否' }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">零售价</div><div class="cell_value" v-if="formData.sales"> {{formData.sales.retail_price }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">一级客户价</div><div class="cell_value" v-if="formData.sales && formData.sales.level_price"> {{formData.sales.level_price[0] }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">二级客户价</div><div class="cell_value" v-if="formData.sales && formData.sales.level_price"> {{formData.sales.level_price[1] }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">三级客户价</div><div class="cell_value" v-if="formData.sales && formData.sales.level_price"> {{formData.sales.level_price[2] }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">四级客户价</div><div class="cell_value" v-if="formData.sales && formData.sales.level_price"> {{formData.sales.level_price[3] }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">五级客户价</div><div class="cell_value" v-if="formData.sales && formData.sales.level_price"> {{formData.sales.level_price[4] }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">六级客户价</div><div class="cell_value" v-if="formData.sales && formData.sales.level_price"> {{formData.sales.level_price[5] }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">七级客户价</div><div class="cell_value" v-if="formData.sales && formData.sales.level_price"> {{formData.sales.level_price[6] }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">八级客户价</div><div class="cell_value" v-if="formData.sales && formData.sales.level_price"> {{formData.sales.level_price[7] }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">九级客户价</div><div class="cell_value" v-if="formData.sales && formData.sales.level_price"> {{formData.sales.level_price[8] }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">十级客户价</div><div class="cell_value" v-if="formData.sales && formData.sales.level_price"> {{formData.sales.level_price[9] }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">配套配件</div><div class="cell_value"> {{accessories}}</div>
              </el-col>
            </div>
        </el-collapse-item>
        <el-collapse-item name="6">
            <template slot="title">
              <Collapse-Title :title="'其他信息'"></Collapse-Title>
            </template>
            <div class="cell-group">
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">增值税</div><div class="cell_value" v-if="formData.trans_tax"> {{(formData.trans_tax * 100)+'%' }}</div>
              </el-col>
              <el-col class="cell" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <div class="cell_title">HS编码</div><div class="cell_value" v-if="formData.hscode"> {{formData.hscode.code }}</div>
              </el-col>
            </div>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>
<script>
import PageHeader from '@/components/title/Title'
import CollapseTitle from '@/components/collapse-title/CollapseTitle'
import { formatDate, formatTime } from '@/utils/trans.js'
export default {
  name: 'MaterialInfo',
  components: { CollapseTitle, PageHeader },
  data () {
    return {
      activeNames: ['1', '2', '3', '4', '5', '6'],
      createAt: '',
      accessories: '',
      formData: {
        unit_info: {},
        property: [],
        hscode: {},
        planing: {},
        purchase: {},
        sales: {},
        warehouse_info: {}
      }

    }
  },
  created () {
    const id = this.$route.query.id
    this.getData(id)
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getData (id) {
      this.$http.get(`/base/material/self/${id}`).then(res => {
        const result = res.data
        this.formData = result
        this.formData.prod_date = formatDate(result.prod_date)
        this.formData.valid_period = formatDate(result.valid_period)
        this.formData.create_at = formatTime(result.create_at)
        if (this.formData.sales && this.formData.sales.accessories) {
          const assArr = this.formData.sales.accessories
          this.accessories = (assArr.map(item => item.name)).join(',')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import'@/styles/infoForm'
</style>
