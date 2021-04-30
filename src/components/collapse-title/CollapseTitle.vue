<template>
  <div>
    <span class="title">{{ title }}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  border-left: 5px solid $--color-primary;
  padding-left: $padding-xs;
  font-weight: 500;
  font-size: 16px;
}
</style>
