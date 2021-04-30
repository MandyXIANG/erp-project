<template>
  <div>
    <div class="customer-form">
      <div class="topbar-btn">
        <el-button type="primary" :disabled="true">添加联系人</el-button>
        <el-button type="primary" @click="onNewBtnClick">新建联系人</el-button>
      </div>
      <Table :data="personTableData">
        <el-table-column
          v-for="(item, key) in personTableCol"
          :key="key"
          :prop="item.prop"
          :label="item.label"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popconfirm
              title="确定要删除吗？"
              @onConfirm="deletePerson(scope)"
            >
              <span slot="reference" class="operation">删除</span>
            </el-popconfirm>
            <el-divider direction="vertical"></el-divider>
            <span class="operation" @click="editPersion(scope)">编辑</span>
          </template>
        </el-table-column>
      </Table>
    </div>

    <!-- 新建联系人弹框 -->
    <el-dialog title="新建联系人"  :close-on-click-modal="false" :visible.sync="newFormVisible">
      <el-form :model="personForm" ref="personForm" :label-width="'120px'">
        <template v-for="item in relationForm">
          <el-form-item
            v-if="item.type == 'Input'"
            :key="item.field"
            :label="item.label"
            :prop="item.validate ? item.field : ''"
            :rules="
              item.field == 'name'
                ? {
                    required: true,
                    message: '请输入联系人姓名',
                    trigger: ['blur', 'change']
                  }
                : item.field == 'phone'
                ? { validator: validatePhone }
                : item.field == 'email'
                ? { validator: validateEmail }
                : {}
            "
          >
            <el-input
              :placeholder="item.placeholder"
              v-model="personForm[item.field]"
            ></el-input>
          </el-form-item>
          <el-form-item
            :key="item.field"
            v-if="item.type == 'Date'"
            :label="item.label"
            :prop="item.validate ? item.field : ''"
          >
            <el-date-picker
              v-model="personForm[item.field]"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="item.placeholder"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            :key="item.field"
            v-if="item.type == 'Select'"
            :label="item.label"
            :prop="item.validate ? item.field : ''"
          >
            <el-select v-model="personForm[item.field]" placeholder="请选择">
              <el-option
                v-for="jtem in item.options"
                :key="jtem.value"
                :label="jtem.label"
                :value="jtem.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :key="item.field"
            v-if="item.type == 'Textarea'"
            :label="item.label"
            :prop="item.validate ? item.field : ''"
          >
            <el-input
              v-model="personForm[item.field]"
              :placeholder="item.placeholder"
              type="textarea"
              :rows="item.row"
            />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/table/Table.vue'
import { validatePhone, validateNetwork, validateEmail, validateFax } from '../utils'
export default {
  props: ['personTableData', 'personTableCol', 'relationForm'],
  components: {
    Table
  },
  data () {
    return {
      validatePhone,
      validateNetwork,
      validateEmail,
      validateFax,
      newFormVisible: false,
      isNew: false,
      personForm: {}, // 联系人表单对象
      editPersonIndex: null
    }
  },
  methods: {
    onNewBtnClick () {
      this.newFormVisible = true
      this.personForm = {}
      this.isNew = true
    },
    /**
     *编辑联系人
     */
    editPersion (scope) {
      this.newFormVisible = true
      this.isNew = false
      this.personForm = scope.row
      this.editPersonIndex = scope.$index
    },
    /**
     * 新建或编辑联系人弹框确认按钮
     */
    handleOk () {
      this.$refs.personForm.validate(valid => {
        if (valid) {
          this.newFormVisible = false
          if (this.isNew) {
            // 新建
            this.personTableData.push(this.personForm)
          } else {
            this.personTableData[this.editPersonIndex] = this.personForm
          }
        } else {
          this.$message.error('表单验证未通过')
        }
      })
    },
    /**
     * 删除联系人
     */
    deletePerson (scope) {
      this.personTableData.splice(scope.$index, 1)
    }
  }
}
</script>

<style></style>
