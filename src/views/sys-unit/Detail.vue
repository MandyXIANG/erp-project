<template>
  <div class="unit-container">
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
          单位编码
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
          名称
        </el-col>
        <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >{{detail.name}}</el-col>
      </el-row>
    </div>
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
      detail: {},
      title: null
    }
  },
  mounted () {
    this.getDeatilById()
  },
  methods: {
    getDeatilById () {
      const code = this.$route.query.code
      const params = {
        code: code
      }
      this.$http.get('/system/unit', { data: params }).then((res) => {
        console.log(res, 'resres')
        this.detail = res.data[0]
        this.title = res.data[0].name
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.unit-container {
  .row-padding {
    padding: $padding-md;
  }
  .col-text {
    text-align: right;
    padding-right: $padding-md;
  }
}
</style>
