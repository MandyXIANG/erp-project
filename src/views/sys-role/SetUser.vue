<template>
  <div class="set-user-page-wraper">
    <Title
      :title="name"
      :back="true"
      @back="$router.go(-1)"
    ></Title>
    <el-row
      type="flex"
      justify="center"
    >
      <el-transfer
        :data="userData"
        :filterable="true"
        :value="value"
        filter-placeholder="请输入用户名或全名搜索"
        :titles="['全部用户名','已选用户名']"
        @change="handleChange"
        :filter-method="filterUser"
      >
        <div
          slot-scope="{ option }"
          style="position: relative;"
        >
          <span>{{ option.label }}</span>
          <span style="position: absolute;right:0">{{ option.value }}</span>
        </div>
      </el-transfer>
    </el-row>
    <el-row
      type="flex"
      justify="center"
      class="btns"
    >
      <el-button
        type="primary"
        @click="onSubmit"
        :loading='loading'
      >提交</el-button>
    </el-row>
  </div>
</template>
<script>
import Title from '@/components/title/Title'
export default {
  components: {
    Title
  },
  data () {
    return {
      name: null,
      loading: false,
      userData: [],
      value: [],
      filterUser (value, item) {
        return item.value.includes(value) || item.label.includes(value)
      },
      sourceData: [],
      initVlaue: []
    }
  },
  mounted () {
    this.name = this.$route.query.name
    // 获取全部用户
    this.$http.get('/system/user/list').then(res => {
      this.$http.get(`/system/userm/${Number(this.$route.query.id)}`).then(item => {
        this.sourceData = res.data.data ? res.data.data : []
        const data = res.data.data
        if (data) {
          data.forEach(element => {
            this.userData.push({
              key: element.id,
              label: element.name,
              value: element.fullname
            })
          })
        }
        if (item.data.length) {
          item.data.forEach(element => {
            this.value.push(element.id)
            this.initVlaue.push(element.id)
          })
        }
      })
    })
  },
  methods: {
    /**
     * 搜索数据
     */

    handleChange (value) {
      this.value = value
    },
    onSubmit () {
      this.loading = true
      const handleData = this.handleCheckData(this.value, this.initVlaue, this.sourceData)
      const add = handleData.add
      const del = handleData.del
      const params = {
        add: add,
        del: del,
        role_id: Number(this.$route.query.id)
      }
      this.$http.post('/system/userm', { data: params }).then(res => {
        this.loading = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.$router.go(-1)
      }, err => {
        console.log(err)
        this.loading = false
      })
    },
    handleCheckData (value, initValue, sourceData) {
      const add = []
      const del = []
      if (!value.length && initValue.length) { // 选中的没有 初始化的有 代表只进行删除操作
        // add = []
        sourceData.forEach(el => {
          initValue.forEach(item => {
            if (el.id === item) {
              del.push(el)
            }
          })
        })
      } else if (value.length && !initValue.length) { // 初始化的没有 选中的有 代表只进行了增加操作
        // del = []
        sourceData.forEach(el => {
          value.forEach(item => {
            if (el.id === item) {
              add.push(el)
            }
          })
        })
      } else { // 代表进行了增或删或者两者都有操作
        // 初始化数据比 选中的数据多 进行了 删除操作
        for (let i = 0; i < initValue.length; i++) {
          const element = initValue[i]
          for (let j = 0; j < value.length; j++) {
            const item = value[j]
            if (item === element) {
              break
            }
            if (j === value.length - 1 && item !== element) {
              sourceData.forEach(el => {
                if (el.id === element) {
                  del.push(el)
                }
              })
            }
          }
        }
        // 初始化数据 没有选中的数据多  进行了 增加操作
        for (let i = 0; i < value.length; i++) {
          const element = value[i]
          for (let j = 0; j < initValue.length; j++) {
            const item = initValue[j]
            if (element === item) {
              break
            }
            if (j === initValue.length - 1 && item !== element) {
              sourceData.forEach(el => {
                if (el.id === element) {
                  add.push(el)
                }
              })
            }
          }
        }
      }
      return {
        add: add,
        del: del
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.set-role-page-wraper {
  width: 100%;
  margin-top: 16px;
  .btns {
    margin-top: 16px;
  }
}
/deep/ .el-transfer-panel {
  width: 300px;
  height: 700px;
}
/deep/ .el-transfer-panel__list.is-filterable {
  height: 600px;
}
/deep/ .el-transfer-panel__list.is-filterable .el-checkbox:last-of-type {
  margin-right: 30px;
}
</style>
