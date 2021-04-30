<template>
    <div class="page-info">
      <PageHeader :title="formData.name" :back="true" @back="goBack"></PageHeader>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
            <template slot="title">
              <Collapse-Title :title="'基本信息'"></Collapse-Title>
            </template>
            <div class="cell-group">
                <el-col class="cell" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <div class="cell_title">物料组名称</div><div class="cell_value"> {{formData.name }}</div>
                </el-col>
                <el-col class="cell" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <div class="cell_title">备注</div><div class="cell_value"> {{formData.remark }}</div>
                </el-col>
            </div>
        </el-collapse-item>
        <el-collapse-item name="2">
            <template slot="title">
              <Collapse-Title :title="'物料组属性'"></Collapse-Title>
            </template>
            <div>
              <el-table :data="formData.property" border>
                <el-table-column prop="name" label="属性名称"></el-table-column>
                <el-table-column prop="code" label="属性代码"></el-table-column>
                <el-table-column prop="control" label="是否管控">
                  <template slot-scope="scope">
                    <span v-if="scope.row.control==true">是</span>
                      <span v-if="scope.row.control==false">否</span>
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="属性值"></el-table-column>
              </el-table>
            </div>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>
<script>
import PageHeader from '@/components/title/Title'
import CollapseTitle from '@/components/collapse-title/CollapseTitle'
import infoColumn from './materialGroupConfig'
export default {
  name: 'GroupInfo',
  components: { CollapseTitle, PageHeader },
  data () {
    return {
      infoColumn,
      activeNames: ['1', '2'],
      formData: {}

    }
  },
  created () {
    const id = this.$route.query.id
    this.getData(id)
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getData (id) {
      this.$http.get(`/base/materialgroup/${id}`).then(res => {
        const result = res.data
        this.formData = result
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import'@/styles/infoForm'
</style>
