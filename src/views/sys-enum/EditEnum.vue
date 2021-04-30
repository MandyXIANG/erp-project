<template>
  <div class="enum-page-wraper">
    <Title
      :title="title"
      :back="true"
      @back="$router.go(-1)"
    ></Title>
    <div class="content-main">
      <div class="content-left">
        <div class="content-left-top">{{groupName}}</div>
        <div class="content-left-bottom">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
          >
            <div
              slot-scope="{ node, data }"
              class="custom-tree-node"
            >
              <div>{{ node.label }}</div>
              <div>
                <i
                  class="el-icon-plus"
                  @click="onNew(data)"
                ></i>
                <i
                  class="el-icon-edit"
                  @click="onEdit(data)"
                ></i>
                <i
                  class="el-icon-delete"
                  @click="onDelete(data)"
                ></i>
              </div>
            </div>
          </el-tree>
        </div>
      </div>
      <div
        class="content-right"
        v-if="!isFisrt"
      >
        <div class="content-right-top">
          <el-button
            @click="appendEnum"
            type="primary"
            v-if="isOperating && isGroup"
            :disabled="!enumForm.code || !enumForm.value || !enumForm.category || flageError"
            :loading="loading"
          >提交</el-button>
          <el-button
            @click="appendEnum"
            type="primary"
            v-if="isOperating && !isGroup"
            :disabled="!enumForm.code || !enumForm.value || flageError"
            :loading="loading"
          >提交</el-button>
        </div>
        <div class="content-right-bottom">
          <div
            v-if="isOperating"
            class="content-right-main"
          >
            <el-col
              class="item"
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="24"
              v-if="isGroup"
            >
              <div class="item-label">枚举名称</div>
              <div class="item-value">
                <el-input
                  v-model.trim="enumForm.category"
                  clearable
                  @input="regOparetion"
                  placeholder="请输入枚举名称"
                  :disabled="groupName? true:false"
                ></el-input>
                <span
                  class="attention"
                  v-if="categoryError"
                >{{categoryError}}</span>
              </div>
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
                v-if="isGroup"
              >内容</div>
              <div
                class="item-label"
                v-else
              >枚举内容</div>
              <div class="item-value">
                <el-input
                  v-model.trim="enumForm.value"
                  clearable
                  :placeholder="isGroup? '请输入内容':'请输入枚举内容'"
                ></el-input>
                <span
                  class="attention"
                  v-if="isGroup"
                >(根节点时【名称】和【内容】建议一致)</span>
              </div>
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
              <div class="item-value">
                <el-input
                  v-model.trim="enumForm.code"
                  clearable
                  placeholder="请输入Code"
                ></el-input>
              </div>
            </el-col>
          </div>
          <div
            class="no-data"
            v-else
          >
            <img
              src="@/assets/imgs/no-data.png"
              alt="没有数据"
            />
            <p>尚无数据,请选择要操作的枚举〜</p>
          </div>
        </div>
      </div>
      <div
        v-if="isFisrt"
        class="content-right"
      >
        <div class="content-right-top"></div>
        <div class="no-data">
          <img
            src="@/assets/imgs/no-data.png"
            alt="没有数据"
          />
          <p>尚无数据,请创建新的枚举〜</p>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="onNew(null)"
          >新建</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Title from '@/components/title/Title'
export default {
  value: 'EditEnum',
  components: {
    Title
  },
  data () {
    return {
      title: '新建枚举',
      enumForm: {
        category: null,
        value: null,
        code: null
      },
      groupName: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'value'
      },
      nodeId: null,
      isEdit: false,
      cId: null,
      parentId: null,
      isFisrt: true,
      isGroup: true,
      flag: false,
      isOperating: false,
      categoryError: null,
      loading: false,
      flageError: false
    }
  },
  computed: {},
  mounted () {
    this.groupName = this.$route.query.category
    if (this.groupName) {
      this.title = '编辑枚举'
      this.isFisrt = false
      this.initTree(this.groupName)
    }
  },
  methods: {
    initTree (name) {
      const params = {
        group: name
      }
      this.$http.get('/system/enums', { data: params }).then(res => {
        if (res.data.length) {
          this.treeData = res.data
          this.cId = res.data[0].id
        } else {
          this.$router.go(-1)
        }
      })
    },
    onNew (node) { // 新建节点
      if (node) {
        this.isGroup = false
        this.parentId = node.id
      } else {
        this.isFisrt = false
        this.isGroup = true
        this.cId = null
      }
      this.isOperating = true
      this.isEdit = false
      this.enumForm.value = null
      this.enumForm.code = null
      this.enumForm.category = null
    },
    onEdit (node) {
      this.isOperating = true
      this.isEdit = true
      this.isGroup = !!node.category
      this.enumForm.category = node.category
      this.enumForm.value = node.value
      this.enumForm.code = node.code
      this.parentId = node.parent
      this.nodeId = node.id
      this.cId = node.cid
    },
    onDelete (node) {
      this.$confirm(`此操作将删除枚举${node.value}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.del(`/system/enums/${node.id}`).then(res => {
          this.$message.success('删除成功')
          this.initTree(this.groupName)
          this.isOperating = false
        })
      }).catch(err => {
        console.log(err)
      })
    },
    appendEnum (enumForm) {
      this.flag = false
      this.handleChildren(this.treeData)
      if (this.flag) {
        this.$message.error('操作失败，存在相同Code枚举')
        return
      }
      this.loading = true
      const params = {
        category: this.enumForm.category,
        cid: this.cId,
        code: this.enumForm.code,
        parent: this.parentId,
        value: this.enumForm.value
      }
      if (this.isEdit) {
        params.id = this.nodeId
        this.$http.put('/system/enum', { data: params, error_return: true }).then(res => {
          this.loading = false
          this.$message.success('操作成功')
          if (this.enumForm.category) {
            this.groupName = this.enumForm.category
          }
          this.initTree(this.groupName)
        }, err => {
          if (err.code === 15) {
            this.$message.error('存在重复的枚举名称')
          } else if (err.code === 9) {
            this.$message.error('重复添加')
          } else {
            this.$message.error(err.msg)
          }
          this.loading = false
        })
      } else {
        this.$http.post('/system/enum', { data: params, error_return: true }).then(res => {
          this.loading = false
          this.$message.success('操作成功')
          if (this.enumForm.category) {
            this.groupName = this.enumForm.category
          }
          this.initTree(this.groupName)
        }, err => {
          if (err.code === 15) {
            this.$message.error('存在重复的枚举名称')
          } else if (err.code === 9) {
            this.$message.error('重复添加')
          } else {
            this.$message.error(err.msg)
          }
          this.loading = false
        })
      }
    },
    handleChildren (treeData) {
      let flag = false
      for (let i = 0; i < treeData.length; i++) {
        if (flag) {
          this.flag = true
          break
        }
        const item = treeData[i]
        if (item.code === this.enumForm.code) {
          if (this.isEdit) {
            if (this.nodeId !== item.id) {
              flag = true
            }
          } else {
            flag = true
          }
          if (flag) {
            if (i === this.treeData.length - 1) {
              this.flag = true
            }
          }
        } else {
          if (item.children) {
            this.handleChildren(item.children)
          }
        }
      }
    },
    regOparetion (value) {
      if (!(/^([a-zA-z_]{1})([\w]*)$/).test(value)) {
        this.categoryError = '只能输入数字,字母,下划线,开头的只能是下划线和字母'
        this.flageError = true
        // return callback(new Error('只能输入数字,字母,下划线,开头的只能是下划线和字母'))
      } else if (value.length > 18) {
        this.categoryError = '最多18位字符'
        this.flageError = true
      } else {
        this.categoryError = null
        this.flageError = false
      }
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
      .content-left-top {
        position: relative;
        height: 50px;
        line-height: 50px;
        padding: 0 $padding-xs;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        .title {
          position: absolute;
          font-size: 18px;
        }
      }
      .content-left-bottom {
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
    }
    .content-right {
      width: calc(100% - 400px);
      .content-right-top {
        height: 50px;
        line-height: 50px;
        padding: 0 $padding-xs;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      }
      .content-right-bottom {
        display: flex;
        flex-direction: 'row';
        justify-content: center;
        margin-top: $padding-md;
        .content-right-main {
          display: flex;
          flex-wrap: wrap;
          margin: $padding-md;
          max-width: 800px;
          .item {
            display: flex;
            margin-bottom: $padding-lg;
            .item-label {
              width: 150px;
              text-align: left;
            }
            .item-value {
              width: 100%;
              position: relative;
            }
            .attention {
              color: #ff7875;
              font-size: $--font-size-small;
              position: absolute;
              bottom: -20px;
              left: 0;
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
