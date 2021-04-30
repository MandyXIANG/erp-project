<template>
  <div class="check-detail">
    <PageHeader :title="orderId" :back="true" @back="goBack" />
    <Detail :header="false" :order="orderId" />
    <div class="review-form">
      <el-form
        v-if="orderState === 'wait_check'"
        ref="form"
        :model="form"
        label-width="120px"
      >
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item
            label="审核结果"
            prop="state"
            :rules="[
              {
                required: true,
                message: '请选择审核结果',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-select
              v-model="form['state']"
              @change="stateChange"
              placeholder="请选择审核结果"
              style="width:100%"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="备注">
            <el-input
              v-model="form['remark']"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-form
        v-if="orderState === 'pass'"
        ref="form"
        :model="form"
        label-width="120px"
      >
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <el-form-item
            label="审核结果"
            prop="state"
            :rules="[
              {
                required: true,
                message: '请选择审核结果',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-select
              v-model="form['state']"
              disabled
              placeholder="请选择审核结果"
              style="width:100%"
            >
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <el-form-item
            label="生效时间"
            prop="effective_time"
            :rules="[
              {
                required: true,
                message: '请选择生效时间',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-date-picker
              v-model="form['effective_time']"
              type="datetime"
              placeholder="请选择生效时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <el-form-item label="备注">
            <el-input
              v-model="form['remark']"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="btm">
        <el-button type="primary" :loading="btnLoading" @click="onSubmit"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import * as moment from 'moment'

import Detail from '../sale-order/Detail'
import PageHeader from '@/components/title/Title.vue'
import { formatTime } from '@/utils/trans.js'
import { API_MAP } from './config'

export default {
  components: {
    Detail,
    PageHeader
  },
  data () {
    return {
      form: {
        effective_time: null
      },
      options: [
        { label: '通过', value: 'pass' },
        { label: '拒绝', value: 'reject' }
      ],
      options2: [{ label: '生效', value: 'effect' }],
      item: {},
      API_MAP,
      orderId: null,
      orderState: null,
      btnLoading: false
    }
  },
  mounted () {
    this.orderId = this.$route.query.id
    this.orderState = this.$route.query.state
    this.initPage()
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    initPage () {
      if (this.orderState === 'pass') {
        this.form.state = 'effect'
        if (this.$route.query.date) {
          this.form.effective_time = formatTime(this.$route.query.date)
        }
      } else {
        this.form.state = 'pass'
      }
    },

    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.form.state !== 'effect') {
            // 审核
            this.$http
              .put(
                API_MAP.SALES_STATE +
                  `/${this.orderId}?logtype=${this.form.state}`,
                {
                  data: this.form
                }
              )
              .then(res => {
                if (res.code === 0) {
                  this.$message.success('操作成功')
                  this.btnLoading = false
                  this.goBack()
                }
              })
          } else {
            const params = {
              effective_time: moment(this.form.effective_time).format(
                'YYYY-MM-DDTHH:mm:ssZ'
              ),
              remark: this.form.remark,
              state: this.form.state
            }
            this.$http
              .put(
                API_MAP.SALES_ESTATE +
                  `/${this.orderId}?logtype=${this.form.state}`,
                { data: params }
              )
              .then(res => {
                if (res.code === 0) {
                  this.$message.success('操作成功')
                  this.btnLoading = false
                  this.goBack()
                }
              })
          }
        }
      })
    },
    stateChange (val) {
      this.form.state = val
      this.form = JSON.parse(JSON.stringify(this.form))
    }
  }
}
</script>

<style lang="scss" scoped>
.check-detail {
  .review-form {
    margin-top: $padding-xs;
    .btm {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
