<template>
  <div class="role-container">
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
          角色编码
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
          角色名
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
    </div>
  </div>
</template>
<script>
import Title from '@/components/title/Title'
import { StatusList } from './role.config'
export default {
  components: {
    Title
  },
  data () {
    return {
      detail: {},
      title: null,
      statusList: StatusList
    }
  },
  mounted () {
    this.getDeatilById()
  },
  methods: {
    getDeatilById () {
      const id = Number(this.$route.query.id)
      this.$http.get(`/system/roleperm/get/${id}`).then((res) => {
        this.detail = res.data
        this.title = res.data.code
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.role-container {
  .row-padding {
    padding: $padding-md;
  }
  .col-text {
    text-align: right;
    padding-right: $padding-md;
  }
}
</style>
