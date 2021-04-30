<template>
  <div class="switch-theme">
    <ColorPicker
      size="small"
      @change="onColorChange"
      v-model="theme"
      :predefine="[
        '#409EFF',
        '#1890ff',
        '#304156',
        '#212121',
        '#11a983',
        '#19BFA9',
        '#13c2c2',
        '#6959CD',
        '#f5222d',
      ]"
      class="theme-picker"
      popper-class="theme-picker-dropdown"
    />
  </div>
</template>

<script>
import { ColorPicker } from 'element-ui'
import { mapState, mapMutations } from 'vuex'

import { SET_THEME_COLOR } from '@/store/storeConst'
export default {
  components: {
    ColorPicker
  },
  data () {
    return {
      theme: this.themeColor
    }
  },
  computed: {
    ...mapState('app', ['themeColor'])
  },
  mounted () {
    this.theme = this.themeColor
  },
  methods: {
    ...mapMutations('app', [SET_THEME_COLOR]),
    onColorChange (color) {
      this[SET_THEME_COLOR](color)
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-theme {
  display: flex;
  align-items: center;
  margin-right: 8px;
}
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}
.theme-picker {
  margin-right: 4px;
  padding: 2px;
}
.el-color-picker--small .el-color-picker__trigger {
  width: 20px !important;
  height: 20px !important;
}
.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
