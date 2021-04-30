
<template>
  <div class="enum-page-wraper">
    <Title
      :title="groupName"
      :back="true"
      @back="$router.go(-1)"
    ></Title>
    <div class="content-main">
      <div class="content-left">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          @node-click="selectRow"
        >
        </el-tree>
      </div>
      <div
        class="content-right"
        v-if="!initFlag"
      >
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title">
              <CollapseTitle title="枚举信息" />
            </template>
            <div class="outer">
              <el-col
                class="item"
                :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                :xl="24"
                v-if="detail.category"
              >
                <div class="item-label">枚举名称</div>
                <div class="item-value">{{ detail.category }}</div>
              </el-col>
              <el-col
                class="item"
                :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                :xl="24"
              >
                <div
                  class="item-label"
                  v-if="detail.category"
                >内容</div>
                <div
                  class="item-label"
                  v-else
                >枚举内容</div>
                <div class="item-value">{{ detail.value }}</div>
              </el-col>
              <el-col
                class="item"
                :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                :xl="24"
              >
                <div class="item-label">Code</div>
                <div class="item-value">{{ detail.code }}</div>
              </el-col>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div
        class="content-right"
        v-if="initFlag"
      >
        <div class="no-data">
          <img
            src="@/assets/imgs/no-data.png"
            alt="没有数据"
          />
          <p>尚无数据,请选择需要查看的枚举〜</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Title from '@/components/title/Title'
import CollapseTitle from '@/components/collapse-title/CollapseTitle.vue'
export default {
  value: 'EditEnum',
  components: {
    Title,
    CollapseTitle
  },
  data () {
    return {
      initFlag: true,
      groupName: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'value'
      },
      detail: {},
      activeNames: ['1']
    }
  },
  computed: {},
  mounted () {
    this.groupName = this.$route.query.category
    console.log(this.groupName, 'groupName')
    if (this.groupName) {
      this.initTree(this.groupName)
    }
  },
  methods: {
    initTree (name) {
      const params = {
        group: name
      }
      this.$http.get('/system/enums', { data: params }).then(res => {
        const result = res.data
        this.treeData = result
      })
    },
    selectRow (event) {
      this.initFlag = false
      this.detail = event
      console.log(event, 'eventevent')
    }
  }
}
</script>
<style lang="scss" scoped>
.enum-page-wraper {
  .content-main {
    display: flex;
    min-height: 650px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    .content-left {
      width: 400px;
      border-right: 1px solid rgba(0, 0, 0, 0.2);
      padding: $padding-md $padding-xs;
      .custom-tree-node {
        display: flex;
        justify-content: space-between;
        width: 100%;
        i {
          padding-right: $padding-md;
          opacity: 0;
        }
        &:hover {
          i {
            opacity: 1;
            &:hover {
              color: $--color-primary;
            }
          }
        }
      }
    }
    .content-right {
      width: calc(100% - 400px);
      padding: $padding-md;
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
            width: 250px;
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
      .no-data {
        margin-top: 100px;
        text-align: center;
        p {
          margin: $padding-md 0;
        }
      }
    }
  }
}
</style>
