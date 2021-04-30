<template>
  <div class="customer-form contact-form">
    <el-form :model="form" ref="form" label-width="120px">
      <el-col
        v-for="(item, index) in config"
        :key="item.field"
        :xs="24"
        :sm="24"
        :md="24"
        :lg="index < 2 ? 12 : 24"
        :xl="12"
      >
        <el-form-item
          :label="item.label"
          :prop="item.validate ? item.field : ''"
          v-if="item.type == 'Input'"
        >
          <el-input
            v-model="form[item.field]"
            :placeholder="item.placeholder"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form-item
          v-for="(item, index) in form.addr"
          :label="'地址'"
          :key="'addr' + index"
        >
          <div class="contact-form-item">
            <el-input v-model="item.value" placeholder="请输入地址" />
            <i
              title="删除"
              @click="deleteItem(form.addr, index)"
              class="el-icon-remove-outline"
              :class="{
                'icon-ban': index === 0 && form.addr.length === 1
              }"
            />
            <i
              title="添加"
              @click="addItem(form.addr)"
              class="el-icon-circle-plus-outline"
            />
          </div>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form-item
          v-for="(item, index) in form.tel"
          :label="'电话'"
          :key="'tel' + index"
          :prop="'tel.' + index + '.value'"
        >
          <div class="contact-form-item">
            <el-input v-model="item.value" placeholder="请输入电话" />
            <i
              title="删除"
              @click="deleteItem(form.tel, index)"
              class="el-icon-remove-outline"
              :class="{
                'icon-ban': index === 0 && form.tel.length === 1
              }"
            />
            <i
              title="添加"
              @click="addItem(form.tel)"
              class="el-icon-circle-plus-outline"
            />
          </div>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form-item
          v-for="(item, index) in form.fax"
          :label="'传真'"
          :key="'fax' + index"
          :prop="'fax.' + index + '.value'"
          :rules="{ validator: validateFax }"
        >
          <div class="contact-form-item">
            <el-input v-model="item.value" placeholder="请输入传真" />
            <i
              title="删除"
              @click="deleteItem(form.fax, index)"
              class="el-icon-remove-outline"
              :class="{
                'icon-ban': index === 0 && form.fax.length === 1
              }"
            />
            <i
              title="添加"
              @click="addItem(form.fax)"
              class="el-icon-circle-plus-outline"
            />
          </div>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form-item
          v-for="(item, index) in form.post_code"
          :label="'邮编'"
          :key="'post_code' + index"
          :prop="'post_code.' + index + '.value'"
          :rules="{ validator: validatePost }"
        >
          <div class="contact-form-item">
            <el-input v-model="item.value" placeholder="请输入邮编" />
            <i
              title="删除"
              @click="deleteItem(form.post_code, index)"
              class="el-icon-remove-outline"
              :class="{
                'icon-ban': index === 0 && form.post_code.length === 1
              }"
            />
            <i
              title="添加"
              @click="addItem(form.post_code)"
              class="el-icon-circle-plus-outline"
            />
          </div>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import {
  validatePhone,
  validateNetwork,
  validateEmail,
  validateFax,
  validatePost
} from '../utils'

export default {
  props: ['form', 'config'],
  watch: {
    form: {
      immediate: true,
      handler (v) {
        this.form = v
      }
    }
  },
  data () {
    return {
      validatePhone,
      validateNetwork,
      validateEmail,
      validateFax,
      validatePost,
      validate: false
    }
  },
  methods: {
    deleteItem (arr, index) {
      this.$emit('deleteItem', arr, index)
    },
    addItem (arr) {
      this.$emit('addItem', arr)
    },
    /**
     * 表单验证
     */
    validateForm () {
      this.$refs.form.validate(valid => {
        this.validate = valid
      })
      return this.validate
    }
  }
}
</script>

<style lang="scss" scoped>
.contact-form {
  margin: 0 auto;
}
</style>
