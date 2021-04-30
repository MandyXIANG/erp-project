<template>
  <div class="el-page-header" :class="{ 'with-border': border }">
    <div v-if="back" @click="goBack()" class="el-page-header__left">
      <i class="el-icon-back"></i>
      <div class="el-page-header__title">返回</div>
    </div>
    <div class="el-page-header__content">
      <div>{{ title }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {}
  },
  props: {
    title: {
      type: String,
      default: '标题'
    },
    back: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goBack () {
      this.$emit('back')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-page-header {
  padding-bottom: $padding-md / 2;
  margin-bottom: $padding-xs;
  // position: fixed;
}
.with-border {
  border-bottom: 1px solid #eaeefb;
}
</style>
