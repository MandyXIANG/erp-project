<template>
  <div class="warehouse-detail">
    <PageHeader :title="pageTitle" :back="true" @back="goBack" />
    <div class="detail-content">
      <div class="left">
        <el-tree
          :data="item"
          :props="defaultProps"
          :default-expand-all="true"
          node-key="id"
          highlight-current
          :current-node-key="defaultCheck[0]"
          :expand-on-click-node="false"
          :default-checked-keys="defaultCheck"
          @node-click="handleNodeClick"
        >
          <div class="custom-tree-node" slot-scope="{ node }">
            <div
              :class="{
                'select-current-node': selectNode && selectNode.id == node.id
              }"
            >
              {{ node.label }}
            </div>
          </div>
        </el-tree>
      </div>
      <div class="right">
        <div v-if="!selectNode" class="no-data">
          <img src="../../assets/imgs/no-data.png" />
          <div>选择节点查看详情</div>
        </div>
        <el-collapse v-else v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title">
              <Title title="基本信息" />
            </template>
            <div class="outer">
              <el-col class="item" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="item-label">代码</div>
                <div class="item-value">{{ selectNode.code }}</div>
              </el-col>
              <el-col class="item" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="item-label">名称</div>
                <div class="item-value">{{ selectNode.name }}</div>
              </el-col>
              <el-col class="item" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="item-label">级别</div>
                <div class="item-value">{{ classI18n[selectNode.class] }}</div>
              </el-col>
              <el-col class="item" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="item-label">仓库类型</div>
                <div class="item-value">{{ kindMap[selectNode.kind] }}</div>
              </el-col>
              <el-col class="item" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="item-label">库位类型</div>
                <div class="item-value">
                  {{ stockMap[selectNode.stock_type] }}
                </div>
              </el-col>
              <el-col class="item" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="item-label">描述</div>
                <div class="item-value">{{ selectNode.description }}</div>
              </el-col>
              <el-col class="item" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="item-label">创建人</div>
                <div class="item-value">
                  {{ selectNode.owner_name }}({{ selectNode.owner_fullname }})
                </div>
              </el-col>
              <el-col
                class="item"
                v-if="selectNode.class === 'warehouse'"
                :xs="24"
                :sm="24"
                :md="12"
                :lg="8"
                :xl="8"
              >
                <div class="item-label">仓管员</div>
                <div class="item-value">
                  <el-tag
                    style="margin:4px"
                    type="info"
                    v-for="(item, index) in selectNode.clerks"
                    :key="index"
                  >
                    {{ item.clerk_name }}({{ item.clerk_fullname }})
                  </el-tag>
                </div>
              </el-col>
              <el-col
                v-if="selectNode.class === 'warehouse'"
                class="item"
                :xs="24"
                :sm="24"
                :md="12"
                :lg="8"
                :xl="8"
              >
                <div class="item-label">备注</div>
                <div class="item-value">{{ selectNode.remark }}</div>
              </el-col>
              <el-col
                v-if="selectNode.class !== 'warehouse'"
                class="item"
                :xs="24"
                :sm="24"
                :md="12"
                :lg="16"
                :xl="16"
              >
                <div class="item-label">备注</div>
                <div class="item-value">{{ selectNode.remark }}</div>
              </el-col>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <Title title="可存物料" />
            </template>
            <Table
              :data="nodeMaterialData"
              class="table"
              :total="pagination2.total"
              :current-page="pagination2.currentPage"
              :page-size="pagination2.pageSize"
              @size-change="onSizeChange2"
              @current-change="onCurrentChange2"
            >
              <el-table-column
                v-for="(item, key) in TableColsD"
                :key="key"
                :prop="item.prop"
                :label="item.label"
              ></el-table-column>
            </Table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { TableColsD, API_MAP, ENUM_MAP, classI18n } from './warehouse.config'
import PageHeader from '@/components/title/Title.vue'
import Title from '@/components/collapse-title/CollapseTitle.vue'
import Table from '@/components/table/Table'
import { getEnumGroup } from '@/utils/common.js'
export default {
  components: {
    PageHeader,
    Title,
    Table
  },
  data () {
    return {
      item: [],
      TableColsD,
      classI18n,
      activeNames: ['1', '2'],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      selectNode: null,
      pagination2: {
        total: 0, // 总条数
        pageSize: 10, // 每页显示条目个数
        currentPage: 1 // 当前页数
      },
      nodeMaterialData: [],
      pageTitle: '',
      clerkInfo: {},
      defaultCheck: [],
      kindMap: {}, // 仓库种类map
      stockMap: {} // 库位种类map
    }
  },
  created () {
    getEnumGroup([ENUM_MAP.warehouse_type, ENUM_MAP.location_type]).then(
      data => {
        for (const item of data) {
          if (item.category === ENUM_MAP.warehouse_type) {
            for (const jtem of item.children) {
              this.kindMap[jtem.id] = jtem.value
            }
          }
          if (item.category === ENUM_MAP.location_type) {
            for (const jtem of item.children) {
              this.stockMap[jtem.id] = jtem.value
            }
          }
        }
        this.getTreeData()
      }
    )

    this.pageTitle = this.$route.query.name
  },
  methods: {
    handleNodeClick (data) {
      this.selectNode = data
      this.getNodeMaterial()
    },
    goBack () {
      this.$router.go(-1)
    },
    getTreeData () {
      this.$http
        .get(API_MAP.TREE_DATA + `/${this.$route.query.id}`)
        .then(res => {
          if (res.code === 0) {
            this.handleNodeClick(res.data)
            this.defaultCheck = [res.data.id]
            this.item = [res.data]
          }
        })
    },
    /**
     * 获取节点的物料
     */
    getNodeMaterial () {
      this.nodeMaterialData = []
      const params = {
        page: this.pagination2.currentPage,
        count: this.pagination2.pageSize
      }
      this.$http
        .get(API_MAP.NODE_MATERIAL + `/${this.selectNode.id}`, { data: params })
        .then(res => {
          if (res.code === 0) {
            this.nodeMaterialData = res.data.data
            this.pagination2.total = res.data.total_records
          }
        })
    },
    // 所有物料表格当前页数改变时的事件
    onCurrentChange2 (currentPage) {
      this.pagination2.currentPage = currentPage
      this.getNodeMaterial()
    },
    // 所有物料表格当前条数改变时的事件
    onSizeChange2 (size) {
      this.pagination2.pageSize = size
      this.getNodeMaterial()
    }
  }
}
</script>

<style lang="scss" scoped>
.warehouse-detail {
  .detail-content {
    display: flex;
    border: 1px solid rgba(0, 0, 0, 0.2);
    .left {
      width: 400px;
      min-height: 600px;
      border-right: 1px solid rgba(0, 0, 0, 0.2);
    }
    .right {
      flex: 1;
      padding: $padding-xs;
      .no-data {
        margin: $padding-md auto;
        text-align: center;
        width: 200px;
        img {
          width: 100%;
        }
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
          // .value-area {
          //   flex: 1;
          // }
          .item-value {
            padding-left: 8px;
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
        }
      }
    }
  }
  /deep/ .select-current-node {
    color: $--color-primary !important;
  }
}
</style>
