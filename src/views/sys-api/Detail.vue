<template>
  <div class="api-container">
    <Title :title="'API详情'"></Title>
    <div>
      <el-row
        type="flex"
        justify="center"
        class="row-padding"
      >
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          class="col-text"
        >
          apiCode
        </el-col>
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >{{detail.code}}</el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
        class="row-padding"
      >
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          class="col-text"
        >
          api名字
        </el-col>
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >{{detail.name}}</el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
        class="row-padding"
      >
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          class="col-text"
        >
          api分组
        </el-col>
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >{{detail.group}}</el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
        class="row-padding"
      >
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          class="col-text"
        >
          请求方式
        </el-col>
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <template v-for="(element,key) in detail.action">
            <el-tag
              :key="key"
              style="margin-right:8px"
              type="info"
            >{{element}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
        class="row-padding"
      >
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          class="col-text"
        >
          类型
        </el-col>
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >{{detail.type}}</el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
        class="row-padding"
      >
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          class="col-text"
        >
          简介
        </el-col>
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >{{detail.description}}</el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
        class="row-padding"
      >
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import { ActionList } from './api.config'
import Title from '@/components/title/Title'
export default {
  components: {
    Title
  },
  data () {
    return {
      detail: {},
      actionList: ActionList
    }
  },
  mounted () {
    this.getDeatilById()
  },
  methods: {
    getDeatilById () {
      const id = Number(this.$route.query.id)
      console.log(id, 'idididi')
      const params = {
        id: id
      }
      this.$http.get(`/role/${id}`, { data: params }).then((res) => {
        console.log(res, 'resres')
        this.detail = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.api-container {
  .row-padding {
    padding: $padding-md;
  }
  .col-text {
    text-align: right;
    padding-right: $padding-md;
  }
}
</style>
