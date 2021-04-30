<template>
  <div class="customer-detail-container">
    <PageHeader :title="pageTitle" :back="true" @back="goBack" />
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <Title title="基本信息" />
        </template>
        <div class="outer">
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">供应商代码</div>
            <div class="item-value">{{ item.code }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">简称</div>
            <div class="item-value">{{ item.name }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">全称</div>
            <div class="item-value">{{ item.fullname }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">等级</div>
            <div class="item-value">{{ classMap[item.class] }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">法人代表</div>
            <div class="item-value">{{ item.legal_rep }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">注册资金</div>
            <div class="item-value">{{ item.reg_capital }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">企业类型</div>
            <div class="item-value">{{ typeMap[item.corp_type] }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">公司状态</div>
            <div class="item-value">{{ stateMap[item.corp_state] }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">企业性质</div>
            <div class="item-value">{{ kindMap[item.corp_kind] }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">交易币种</div>
            <div class="item-value">{{ currMap[item.trans_curr] }}</div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">创建人</div>
            <div class="item-value">
              {{ item.owner_name }}({{ item.owner_fullname }})
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">备注</div>
            <div class="item-value">{{ item.remark }}</div>
          </el-col>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <Title title="联系信息" />
        </template>
        <div class="outer">
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">地址</div>
            <div class="value-area">
              <div
                v-if="!item.addr || !item.addr.length"
                class="item-value"
              ></div>
              <div
                v-else
                class="item-value"
                v-for="(ele, index) in item.addr"
                :key="index"
              >
                {{ ele }}
              </div>
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">电话</div>
            <div class="value-area">
              <div
                v-if="!item.tel || !item.tel.length"
                class="item-value"
              ></div>
              <div
                v-else
                class="item-value"
                v-for="(ele, index) in item.tel"
                :key="index"
              >
                {{ ele }}
              </div>
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">网址</div>
            <div class="value-area">
              <div
                v-if="!item.site || !item.site.length"
                class="item-value"
              ></div>
              <div
                v-else
                class="item-value"
                v-for="(ele, index) in item.site"
                :key="index"
              >
                {{ ele }}
              </div>
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">邮箱</div>
            <div class="value-area">
              <div
                v-if="!item.mail || !item.mail.length"
                class="item-value"
              ></div>
              <div
                v-else
                class="item-value"
                v-for="(ele, index) in item.mail"
                :key="index"
              >
                {{ ele }}
              </div>
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">传真</div>
            <div class="value-area">
              <div
                v-if="!item.fax || !item.fax.length"
                class="item-value"
              ></div>
              <div
                v-else
                class="item-value"
                v-for="(ele, index) in item.fax"
                :key="index"
              >
                {{ ele }}
              </div>
            </div>
          </el-col>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <Title title="联系人信息" />
        </template>
        <div class="noborder-outer">
          <Table
            :data="spliceTableData"
            :total="concat.length"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            @size-change="onSizeChange"
            @current-change="onCurrentChange"
          >
            <el-table-column
              :formatter="formatter"
              v-for="(item, key) in personTableCol"
              :key="key"
              :prop="item.prop"
              :label="item.label"
            >
            </el-table-column>
          </Table>
        </div>
      </el-collapse-item>
      <el-collapse-item name="4">
        <template slot="title">
          <Title title="财务信息" />
        </template>
        <div class="outer">
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="item-label">名称</div>
            <div class="item-value">
              {{ item.financial && item.financial.name }}
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="item-label">开户银行名称</div>
            <div class="item-value">
              {{ item.financial && item.financial.bank }}
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="item-label">开户银行账号</div>
            <div class="item-value">
              {{ item.financial && item.financial.bank_num }}
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="item-label">税号</div>
            <div class="item-value">
              {{ item.financial && item.financial.tax_num }}
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">地址</div>
            <div class="value-area">
              <div
                v-if="
                  !item.financial ||
                    !item.financial.addr ||
                    !item.financial.addr.length
                "
                class="item-value"
              ></div>
              <div
                v-else
                class="item-value"
                v-for="(ele, index) in item.financial.addr"
                :key="index"
              >
                {{ ele }}
              </div>
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">电话</div>
            <div class="value-area">
              <div
                v-if="
                  !item.financial ||
                    !item.financial.tel ||
                    !item.financial.tel.length
                "
                class="item-value"
              ></div>
              <div
                v-else
                class="item-value"
                v-for="(ele, index) in item.financial.tel"
                :key="index"
              >
                {{ ele }}
              </div>
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">邮编</div>
            <div class="value-area">
              <div
                v-if="
                  !item.financial ||
                    !item.financial.post_code ||
                    !item.financial.post_code.length
                "
                class="item-value"
              ></div>
              <div
                v-else
                class="item-value"
                v-for="(ele, index) in item.financial.post_code"
                :key="index"
              >
                {{ ele }}
              </div>
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">传真</div>
            <div class="value-area">
              <div
                v-if="
                  !item.financial ||
                    !item.financial.fax ||
                    !item.financial.fax.length
                "
                class="item-value"
              ></div>
              <div
                v-else
                class="item-value"
                v-for="(ele, index) in item.financial.fax"
                :key="index"
              >
                {{ ele }}
              </div>
            </div>
          </el-col>
        </div>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template slot="title">
          <Title title="结算方式" />
        </template>
        <div class="outer">
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">货到付款</div>
            <div class="item-second">
              <div class="second-item">
                <div class="second-label">
                  付款上限天数
                </div>
                <div class="second-value">
                  {{
                    item.settles &&
                      item.settles.arrival &&
                      item.settles.arrival.max_day
                  }}
                </div>
              </div>
              <div class="second-item">
                <div class="second-label">
                  开始计算日期
                </div>
                <div class="second-value">
                  {{
                    item.settles &&
                      item.settles.arrival &&
                      item.settles.arrival.start_time
                  }}
                </div>
              </div>
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">分期付款</div>
            <div class="item-second">
              <div class="second-item">
                <div class="second-label">
                  付款比例
                </div>
                <div
                  class="second-value"
                  v-if="
                    !item.settles ||
                      !item.settles.stage ||
                      !item.settles.stage.stage_conf.length
                  "
                ></div>
                <div
                  v-else
                  class="second-value"
                  v-for="(ele, index) in item.settles.stage.stage_conf"
                  :key="index"
                >
                  {{ ele.ratio }}%
                </div>
              </div>
              <div class="second-item">
                <div class="second-label">
                  付款时机
                </div>
                <div
                  class="second-value"
                  v-if="
                    !item.settles ||
                      !item.settles.stage ||
                      !item.settles.stage.stage_conf.length
                  "
                ></div>

                <div
                  v-else
                  class="second-value"
                  v-for="(ele, index) in item.settles.stage.stage_conf"
                  :key="index"
                >
                  {{ ele.time }}
                </div>
              </div>
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">预付款</div>
            <div class="item-second">
              <div class="second-item">
                <div class="second-label">
                  付款后发货周期
                </div>
                <div class="second-value">
                  {{
                    item.settles &&
                      item.settles.prepaid &&
                      item.settles.prepaid.delivery
                  }}
                  {{
                    item.settles &&
                      item.settles.prepaid &&
                      item.settles.prepaid.unit
                  }}
                </div>
              </div>
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-label">周期结算</div>
            <div class="item-second">
              <div class="second-item">
                <div class="second-label">
                  付款周期
                </div>
                <div
                  class="second-value"
                  v-if="
                    !item.settles ||
                      !item.settles.cycle ||
                      !item.settles.cycle.cycle_conf.length
                  "
                ></div>

                <div
                  v-else
                  class="second-value"
                  v-for="(ele, index) in item.settles.cycle.cycle_conf"
                  :key="index"
                >
                  {{ cycleMap[ele.unit]}} {{ ele.value }}
                </div>
              </div>
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">付款预警</div>
            <div class="item-value">
              {{
                item.settles && item.settles.cycle && item.settles.cycle.alert
                  ? "是"
                  : "否"
              }}
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">起始日期</div>
            <div class="item-value">
              {{
                item.settles && item.settles.cycle && item.settles.cycle.start_time
              }}
            </div>
          </el-col>
          <el-col class="item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="item-label">提前天数</div>
            <div class="item-value">
              {{
               item.settles && item.settles.cycle && item.settles.cycle.advance_day
              }}
            </div>
          </el-col>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Title from '@/components/collapse-title/CollapseTitle.vue'
import Table from '@/components/table/Table.vue'
import { personTableCol, API_MAP, ENUM_MAP, currency } from './config'
import PageHeader from '@/components/title/Title.vue'
import { getEnumGroup } from '@/utils/common.js'
import { getEnumMap } from '../customer/utils'
import { formatDate, transKey } from '@/utils/trans.js'
export default {
  components: { Title, Table, PageHeader },
  data () {
    return {
      item: {},
      activeNames: ['1', '2', '3', '4', '5'],
      personTableCol,
      selectId: null,
      classMap: {},
      stateMap: {},
      currency,
      currMap: {},
      kindMap: {},
      typeMap: {},
      pageTitle: '',
      concat: [],
      pagination: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      cycleMap: {
        day: '天（每隔多少天付款）',
        week: '周（每周哪一天付款）',
        month: '月（每个月几号付款）'

      }
    }
  },
  computed: {
    spliceTableData () {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = this.pagination.currentPage * this.pagination.pageSize
      return this.concat.slice(start, end)
    }
  },
  created () {
    getEnumGroup([
      ENUM_MAP.supplier_class,
      ENUM_MAP.supplier_states,
      ENUM_MAP.corp_kind,
      ENUM_MAP.corp_type
    ]).then(res => {
      for (const item of res) {
        if (item.category === ENUM_MAP.supplier_class) {
          this.classMap = getEnumMap(item.children, 'id', 'value')
        }
        if (item.category === ENUM_MAP.supplier_states) {
          this.stateMap = getEnumMap(item.children, 'id', 'value')
        }
        if (item.category === ENUM_MAP.corp_kind) {
          this.kindMap = getEnumMap(item.children, 'id', 'value')
        }
        if (item.category === ENUM_MAP.corp_type) {
          this.typeMap = getEnumMap(item.children, 'id', 'value')
        }
      }
      this.currMap = getEnumMap(this.currency, 'id', 'value')
    })
    this.initPage()
  },
  methods: {
    initPage () {
      this.selectId = this.$route.query.id || null
      this.$http.get(API_MAP.BASE_SUPPLIER + `/${this.selectId}`).then(res => {
        this.item = res.data || {}
        this.pageTitle = this.item.fullname
        this.getConcatList()
      })
    },
    // 当前页数改变时的事件
    onCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
    },
    // 当前条数改变时的事件
    onSizeChange (size) {
      this.pagination.pageSize = size
    },
    goBack () {
      this.$router.go(-1)
    },
    getConcatList () {
      this.concat = []
      const params = {
        state: 'valid,invalid',
        stateop: 0
      }
      this.$http
        .get(API_MAP.SUPPLIER_CONCAT + `/${this.selectId}`, { data: params })
        .then(res => {
          if (res.code === 0) {
            this.concat = res.data.data
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
.customer-detail-container {
  width: 100%;
  .noborder-outer {
    margin: 0 auto;
  }
  .outer {
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    border-right: 1px solid $border-detail-color;
    border-bottom: 1px solid $border-detail-color;
    .item {
      display: flex;
      font-size: 14px;
      .item-label {
        min-width: 150px;
        max-width: 150px;
        text-align: left;
        border: 1px solid $border-detail-color;
        border-bottom: none;
        border-right: none;
        background-color: $--color-primary-light-9;
        padding-left: 8px;
        color: #606266;
        display: flex;
        align-items: center;
      }
      .value-area {
        flex: 1;
      }
      .item-value {
        padding-left: 8px;
        padding-right: 8px;
        min-height: $detail-table-height;
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border: 1px solid $border-detail-color;
        border-bottom: none;
        border-right: none;
        &:hover {
          background-color: $detail-hover-bg-color;
        }
      }
      .item-second {
        flex: 1;
        .second-item {
          display: flex;
          border-top: 1px solid $border-detail-color;
          align-items: center;
          &:hover {
            background: $detail-hover-bg-color;
          }
          .second-label {
            width: 150px;
            padding-left: $padding-xs;
            border-left: 1px solid $border-detail-color;
            background-color: $--color-primary-light-9;
            display: flex;
            align-items: center;
            min-height: $detail-table-height;
            color: #606266;
          }
          .second-value {
            border-left: 1px solid $border-detail-color;
            padding-left: $padding-xs;
            display: flex;
            align-items: center;
            min-height: $detail-table-height;
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
