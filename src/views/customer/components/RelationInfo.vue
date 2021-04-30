<template>
  <div class="customer-form contact-form">
    <el-form :model="form" ref="form" label-width="120px" class="demo-dynamic">
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
      <el-form-item
        v-for="(item, index) in form.site"
        :label="'网址'"
        :key="'site' + index"
        :prop="'site.' + index + '.value'"
        :rules="{
          validator: validateNetwork
        }"
      >
        <div class="contact-form-item">
          <el-input v-model="item.value" placeholder="请输入http或https开头的网址" class="input-with-select">
          </el-input>
          <i
            title="删除"
            @click="deleteItem(form.site, index)"
            class="el-icon-remove-outline"
            :class="{
              'icon-ban': index === 0 && form.site.length === 1
            }"
          />
          <i
            title="添加"
            @click="addItem(form.site)"
            class="el-icon-circle-plus-outline"
          />
        </div>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in form.mail"
        :label="'邮箱'"
        :key="'mail' + index"
        :prop="'mail.' + index + '.value'"
        :rules="{
          validator: validateEmail
        }"
      >
        <div class="contact-form-item">
          <el-input v-model="item.value" placeholder="请输入邮箱" />
          <i
            title="删除"
            @click="deleteItem(form.mail, index)"
            class="el-icon-remove-outline"
            :class="{
              'icon-ban': index === 0 && form.mail.length === 1
            }"
          />
          <i
            title="添加"
            @click="addItem(form.mail)"
            class="el-icon-circle-plus-outline"
          />
        </div>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in form.fax"
        :label="'传真'"
        :key="'fax' + index"
        :prop="'fax.' + index + '.value'"
        :rules="{
          validator: validateFax
        }"
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
    </el-form>
  </div>
</template>

<script>
import {
  validatePhone,
  validateNetwork,
  validateEmail,
  validateFax
} from '../utils'
export default {
  props: ['form'],
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

<style></style>
