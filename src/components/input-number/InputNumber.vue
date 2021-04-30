<template>
  <div class="erp-number">
    <el-input-number
      style="width:100%"
      :value="data"
      v-bind="$attrs"
      v-on="$listeners"
      :controls="controls"
      @change="change"
    ></el-input-number>
    <div class="erp-suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      default: null
    },
    controls: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      data: null
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (v) {
        if (v === null || v === '') {
          v = undefined
        }
        this.data = v
      }
    }
  },
  methods: {
    change (e) {
      if (e === null || e === '') {
        e = undefined
      }
      this.data = e
      this.$emit('change', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.erp-number {
  position: relative;
  .erp-suffix {
    position: absolute;
    color: #c0c4cc;
    top: 0;
    right: 10px;
  }
}
</style>
