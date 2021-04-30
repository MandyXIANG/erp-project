<template>
  <div class="purchase-info-container">
    <PageHeader title="采购基本信息"/>
    <div class="info-form">
      <div class="item" v-for="(item, index) in form.mrp_cycle" :key="index">
        <div class="item-label">MRP周期</div>
        <div class="item-value">
          <el-input-number :min="1" v-model="item.value"></el-input-number>
          <el-select class="unit" v-model="item.label" placeholder="请选择">
            <el-option
              v-for="item in cycleUnits"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <i
          class="el-icon-remove-outline"
          title="删除"
          :class="{
            'icon-ban': index === 0 && form.mrp_cycle.length === 1
          }"
          @click="deleteItem(index)"
        />
        <i
          @click="addItem()"
          title="添加"
          class="el-icon-circle-plus-outline"
        />
      </div>
      <div class="item">
        <div class="item-label">MRP策略</div>
        <div class="item-value">
          <el-radio-group v-model="form.mrp_ploy">
            <el-radio :label="item.value" v-for="item in mrpPloy" :key="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cycleUnits, mrpPloy } from './config'
import PageHeader from '@/components/title/Title.vue'
export default {
  components: { PageHeader },
  data () {
    return {
      form: {
        // 表单默认配置
        mrp_cycle: [{ label: '周', value: '5' }],
        mrp_ploy: '按订单合并'
      },
      mrpPloy,
      cycleUnits
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      this.form = {
        // 初始化表单
        mrp_cycle: [{ label: '周', value: '' }],
        mrp_ploy: '按订单合并'
      }
    },
    addItem () {
      this.form.mrp_cycle.push({ label: '周', value: '' })
    },
    deleteItem (index) {
      if (this.form.mrp_cycle.length > 1) {
        this.form.mrp_cycle.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.purchase-info-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  .info-form {
    margin: 0 auto;
    .item {
      display: flex;
      align-items: center;
      margin-bottom: $padding-md;
      .item-label {
        margin-right: $padding-xs;
        width: 120px;
        text-align: left;
      }
      .item-value {
        .unit {
          width: 80px;
          margin-left: $padding-xs;
        }
      }
      i {
        font-size: 26px;
        margin-left: 16px;
        cursor: pointer;
      }
      .icon-ban {
        color: #c0c4cc;
        cursor: not-allowed !important;
      }
    }
  }
}
</style>
