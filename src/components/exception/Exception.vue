<template>
  <div class="exception-container">
    <img v-if="title === '403'" src="@/assets/imgs/app/403.svg" />
    <img v-if="title === '404'" src="@/assets/imgs/app/404.svg" />
    <img v-if="title === '500'" src="@/assets/imgs/app/500.svg" />
    <div class="content">
      <h1 class="title">{{ title }}</h1>
      <div class="desc">{{ desc }}</div>
      <div class="actions">
        <el-button type="primary" @click="handleBack">{{ btnText }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    desc: {
      type: String // 错误描述
    },
    title: {
      type: String // 标题
    },
    btnText: {
      type: String // 按钮文字
    },
    backUrl: {
      type: String
    }
  },
  components: {},
  data () {
    return {}
  },
  mounted () {},
  methods: {
    tr (key) {},
    handleBack () {
      if (this.backUrl) {
        this.$router.push(this.backUrl)
      } else {
        this.$router.back()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.exception-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    margin-left: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
      font-size: 72px;
      color: #000;
    }
    .desc {
      font-size: 38 + 4px;
      color: #000;
      margin-bottom: 16px;
    }
  }
}
</style>
