<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import changeColor from '@/utils/changeTheme.js'
export default {
  name: 'App',
  watch: {
    themeColor: {
      immediate: true,
      deep: true,
      handler (val) {
        changeColor(val)
      }
    }
  },
  computed: {
    ...mapState('app', ['themeColor'])
  },
  mounted () {
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;
  height: 100%;
  position: absolute;
  left: 0;
  width: 100%;
  top: 0;
  font-size: 14px;
}
</style>
