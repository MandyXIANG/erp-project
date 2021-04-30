<template>
  <div class="search-container">
    <el-form :model="form" class="search-form" ref="searchForm">
      <template v-for="(item, index) in params">
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="6"
          :xl="6"
          class="search-form-item"
          :key="index"
          v-if="expand || (!expand && index < max)"
        >
          <el-form-item
            v-if="item.type == 'Input'"
            :prop="item.field"
            :label="item.label"
          >
            <el-input
              v-model="form[item.field]"
              :placeholder="item.placeholder"
              @keyup.native.enter="onSubmit"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="item.type == 'Select'"
            :prop="item.field"
            :label="item.label"
          >
            <el-select
              v-model="form[item.field]"
              clearable
              :placeholder="item.placeholder"
              @keyup.native.enter="onSubmit"
            >
              <el-option
                v-for="ele in item.options"
                :key="ele.value"
                :label="ele.label"
                :value="ele.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="item.type == 'MultiSelect'"
            :prop="item.field"
            :label="item.label"
            @keyup.native.enter="onSubmit"
          >
            <el-select
              multiple
              clearable
              v-model="form[item.field]"
              :placeholder="item.placeholder"
            >
              <el-option
                v-for="ele in item.options"
                :key="ele.value"
                :label="ele.label"
                :value="ele.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="item.type == 'Date'"
            :prop="item.field"
            :label="item.label"
            @keyup.native.enter="onSubmit"
          >
            <el-date-picker
              v-model="form[item.field]"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="item.placeholder"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="item.type == 'Datetime'"
            :prop="item.field"
            :label="item.label"
            @keyup.native.enter="onSubmit"
          >
            <el-date-picker
              v-model="form[item.field]"
              align="right"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :placeholder="item.placeholder"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </template>
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <el-form-item class="search-form-item">
          <template v-if="params.length > max">
            <span class="expand" v-if="!expand" @click="onToggle">
              <i class="el-icon-arrow-down"></i>
              展开</span
            >
            <span class="expand" v-else @click="onToggle">
              <i class="el-icon-arrow-up"></i>
              收起</span
            >
          </template>

          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
/**
 * params参数说明：
 * [
 *   {
    single: true,  默认为false,query的key是否只是取field不处理成q[xx]
    label: '状态',  查询条件的标题
    field: 'state', 查询条件的字段
    placeholder: '请选择状态',   输入框的placeholder
    type: 'MultiSelect',   类型：Input || MultiSelect || Select || Date || Datetime
    operator_field: 'stateop',  后端需要的代表操作符的值, 默认无
    operator: 0,   后端拼接sql的操作符  比如：  IN, NOT IN，标识当前查询条件的查询方式，没有就是默认的like
    options: [  选择框的选项
      { label: '草稿', value:draft },
      { label: '中止', value: stop },
      { label: '待审核', value: wait_check },
      { label: '进行中', value: proces },
      { label: '拒绝', value:reject }
    ]
  }
 * ]
 */
export default {
  props: {
    max: {
      type: Number,
      default: 3 // 默认最多展示几个控件
    },
    params: {
      type: Array, // 请参考data里的配置
      default: () => []
    }
  },
  data () {
    return {
      expand: false,
      form: {},
      query: {}
    }
  },
  beforeCreate () {},
  mounted () {},
  methods: {
    onSubmit () {
      for (const key in this.form) {
        for (const item of this.params) {
          if (key === item.field) {
            let value = this.form[key]
            if (Array.isArray(value)) {
              value = value.join(',')
            }
            if (item.single) {
              // 不加任何处理的key
              this.query[key] = value
            } else {
              this.query[`q[${key}]`] = value // 模糊查询like 要加上 q[]
            }
            if (item.operator !== undefined || item.operator !== null) {
              if (item.operator_field && (value || '').length) {
                this.query[item.operator_field] = item.operator
              } else {
                delete this.query[item.operator_field]
              }
            }
          }
        }
      }
      for (const key2 in this.query) {
        if (
          this.query[key2] === undefined ||
          this.query[key2] === null ||
          this.query[key2] === ''
        ) {
          delete this.query[key2]
        }
      }
      this.$emit('onSearch', this.query)
    },
    onToggle () {
      this.expand = !this.expand
    },
    resetForm () {
      this.form = {}
      this.query = {}
      this.$emit('onReset', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  width: 100%;
  flex: 1;
  display: flex;
  // margin-top: 22px;
  .search-form {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    .search-form-item {
      /deep/ .el-form-item__label {
        text-align: left;
      }
      /deep/ .el-form-item__content {
        display: flex;
        div {
          width: 80% !important;
          .el-input {
            width: 100% !important;
          }
        }
        .expand {
          margin-right: 8px;
          cursor: pointer;
          color: $--color-primary;
        }
      }
    }
  }
}
</style>
