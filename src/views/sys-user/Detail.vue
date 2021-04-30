<template>
  <div class="user-container">
    <Title
      :title="title"
      :back="true"
      @back="$router.go(-1)"
    ></Title>
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
          用户名
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
          全名
        </el-col>
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >{{detail.fullname}}</el-col>
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
          工号
        </el-col>
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >
          {{detail.code}}
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
          状态
        </el-col>
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <template v-for="(item,key) in statusList">
            <span
              v-if="item.value === detail.state"
              :key="key"
            >
              {{item.label}}
            </span>
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
          性别
        </el-col>

        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <template v-for="(item,key) in genderList">
            <span
              v-if="item.value === detail.gender"
              :key="key"
            >
              {{item.label}}

            </span>
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
          角色
        </el-col>

        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <template v-for="(item,key) in roleList">
            <el-tag
              :key="key"
              class="tag-btn"
            >
              {{item.name}}

            </el-tag>
          </template>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Title from '@/components/title/Title'
import { StatusList, GenderList } from './user.config'
export default {
  components: {
    Title
  },
  data () {
    return {
      detail: {},
      statusList: StatusList,
      genderList: GenderList,
      title: null,
      roleList: []
    }
  },
  mounted () {
    this.getDeatilById()
  },
  methods: {
    getDeatilById () {
      const id = Number(this.$route.query.id)
      this.$http.get(`/system/user/get/${id}`).then((res) => {
        this.detail = res.data
        this.title = res.data.name
      })
      this.$http.get(`/system/roleperm/user/${id}`).then((res) => {
        console.log(res, 'resresresresres')
        this.roleList = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-container {
  .row-padding {
    padding: $padding-md;
  }
  .col-text {
    text-align: right;
    padding-right: $padding-md;
  }
  .tag-btn {
    margin-right: $padding-md;
    margin-bottom: $padding-md;
  }
}
</style>
