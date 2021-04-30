<template>
  <div class="page-info">
    <PageHeader
      :title="formData.name"
      :back="true"
      @back="goBack"
    ></PageHeader>
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <Collapse-Title :title="'基本信息'"></Collapse-Title>
        </template>
        <div class="cell-group">
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">姓名</div>
            <div class="cell_value"> {{formData.name }}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">性别</div>
            <div class="cell_value"> {{formData.gender }}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">出生日期</div>
            <div
              class="cell_value"
              v-if="formData.birth"
            > {{formData.birth.birth_day}}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">生日提醒</div>
            <div
              class="cell_value"
              v-if="formData.birth"
            > {{trans(formData.birth.remind)}}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">提前期</div>
            <div
              class="cell_value"
              v-if="formData.birth"
            > {{formData.birth.ahead_of_time}}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">创建人</div>
            <div class="cell_value">{{ formData.owner_name }}({{formData.owner_fullname}})</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">电话号码</div>
            <div class="cell_value"> {{formData.tel }}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">电子邮箱</div>
            <div class="cell_value"> {{formData.mail }}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">状态</div>
            <div class="cell_value"> {{(formData.state === 'valid') ? '有效' : '无效'}}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">关系</div>
            <div class="cell_value"> {{formData.relation }}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">来源</div>
            <div class="cell_value"> {{formData.source }}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">公司</div>
            <div class="cell_value"> {{formData.corp}}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">部门</div>
            <div class="cell_value"> {{formData.department }}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">职位</div>
            <div class="cell_value"> {{formData.position }}</div>
          </el-col>
          <el-col
            class="cell"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="cell_title">备注</div>
            <div class="cell_value"> {{formData.remark }}</div>
          </el-col>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import PageHeader from '@/components/title/Title'
import CollapseTitle from '@/components/collapse-title/CollapseTitle'
export default {
  name: 'ContactInfo',
  components: { PageHeader, CollapseTitle },
  data () {
    return {
      activeName: ['1'],
      formData: {}
    }
  },
  mounted () {
    const id = this.$route.query.id
    this.getFormData(id)
  },
  methods: {
    getFormData (id) {
      this.$http.get(`/base/contact/${id}`).then(res => {
        const result = res.data
        this.formData = result
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    trans (value) {
      if (value) {
        return '是'
      } else {
        return '否'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/infoForm';
</style>
