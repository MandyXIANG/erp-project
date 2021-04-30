<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="物料库存" name="0">
        <MaterialInventory />
      </el-tab-pane>
      <el-tab-pane label="仓库库存" name="1">
        <WarehouseInventory />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MaterialInventory from './MaterialInventory'
import WarehouseInventory from './WarehouseInventory'
export default {
  components: {
    MaterialInventory,
    WarehouseInventory
  },
  data () {
    return {
      activeName: '0'
    }
  },
  methods: {
    handleClick (tab, event) {
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
