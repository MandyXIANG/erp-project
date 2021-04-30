export const API_MAP = {
  CUSTOMER_LIST: '/base/customer/list', // 获取客户列表
  NEW_CUSTOMER: '/base/customer/self', // 新建客户
  GET_CUSTOMER: '/base/customer/self', // 获取当前客户信息
  UPDATE_CUSTOMER: '/base/customer/self', // 编辑客户
  DELETE_CUSTOMER: '/base/customer/self',
  CUSTOMER_CONCAT: '/base/customer/contact'
}
// 枚举code 映射
export const ENUM_MAP = {
  corp_state: 'corpstate', // 公司状态
  corp_class: 'corp_class', // 公司等级
  corp_kind: 'corp_kind', // 企业性质
  corp_type: 'corp_type' // 企业类型
}
// 客户表格表头配置
export const tableCols = [

  {
    prop: 'code',
    label: '客户代码'
  },
  {
    prop: 'name',
    label: '简称'
  },
  {
    prop: 'fullname',
    label: '全称'
  },
  {
    prop: 'corp_state',
    label: '公司状态'
  },
  {
    prop: 'class',
    label: '等级'
  }
]
// 搜索框配置
export const searchParams = [
  {
    label: '客户代码',
    field: 'code',
    placeholder: '请输入客户代码',
    type: 'Input'
  },

  {
    label: '简称',
    field: 'name',
    placeholder: '请输入简称',
    type: 'Input'
  }
]
export const currency = [
  { value: '人民币', id: 'cny' },
  { value: '欧元', id: 'eur' },
  { value: '美元', id: 'usd' }
]

const relation = [
  { label: '财务联系人', value: '财务联系人' },
  { label: '业务联系人', value: '业务联系人' },
  { label: '工程联系人', value: '工程联系人' }
]

const personStatue = [
  { label: '有效', value: '有效' },
  { label: '无效', value: '无效' }
]

const genderOptions = [
  { label: '女', value: '女' },
  { label: '男', value: '男' }
]

export const classMap = [
  { value: '普通客户', id: 0 },
  { value: '一级客户', id: 1 },
  { value: '二级客户', id: 2 },
  { value: '三级客户', id: 3 },
  { value: '四级客户', id: 4 },
  { value: '五级客户', id: 5 },
  { value: '六级客户', id: 6 },
  { value: '七级客户', id: 7 },
  { value: '八级客户', id: 8 },
  { value: '九级客户', id: 9 },
  { value: '十级客户', id: 10 }
]
// 基本信息表单配置

export const basicForm = [
  { label: '客户代码', field: 'code', placeholder: '请输入客户代码', type: 'Input', validate: true, span: 12 },
  { label: '简称', field: 'name', placeholder: '请输入简称', type: 'Input', validate: true, span: 12 },
  { label: '全称', field: 'fullname', placeholder: '请输入全称', type: 'Input', validate: true, span: 12 },
  { label: '法人代表', field: 'legal_rep', placeholder: '请输入法人代表', type: 'Input', validate: false, span: 12 },
  { label: '注册资金', field: 'reg_capital', placeholder: '请输入注册资金', type: 'Input', validate: false, span: 12 },
  { label: '企业类型', field: 'corp_type', code: ENUM_MAP.corp_type, placeholder: '请选择企业类型', type: 'Select', validate: false, options: [], span: 12 },
  { label: '公司状态', field: 'corp_state', code: ENUM_MAP.corp_state, placeholder: '请选择公司状态', type: 'Select', validate: false, options: [], span: 12 },
  { label: '企业性质', field: 'corp_kind', code: ENUM_MAP.corp_kind, placeholder: '请选择企业性质', type: 'Select', validate: false, options: [], span: 12 },
  { label: '交易币种', field: 'trans_curr', placeholder: '请选择交易币种', type: 'Select', validate: false, options: currency, span: 12 },
  { label: '等级', field: 'class', placeholder: '请选择等级', type: 'Select', validate: false, options: classMap, span: 12 },
  { label: '备注', field: 'remark', placeholder: '请输入备注', type: 'Textarea', row: 3, validate: false, span: 24 }
]

// 新建或编辑联系人表单配置

export const relationForm = [
  { label: '姓名', field: 'name', placeholder: '请输入姓名', type: 'Input', validate: true },
  { label: '性别', field: 'gender', placeholder: '请选择性别', type: 'Select', options: genderOptions, validate: false },
  { label: '出生日期', field: 'birth', placeholder: '请选择出生日期', type: 'Date', validate: false },
  { label: '电话', field: 'mail', placeholder: '请输入', type: 'Input', validate: true },
  { label: '邮箱', field: 'email', placeholder: '请输入', type: 'Input', validate: true },
  { label: '部门', field: 'department', placeholder: '请输入', type: 'Input', validate: false },
  { label: '职位', field: 'work', placeholder: '请输入', type: 'Input', validate: false },
  { label: '状态', field: 'state', placeholder: '请输入', type: 'Select', validate: false, options: personStatue },
  { label: '联系人关系', field: 'relation', placeholder: '请输入', type: 'Select', validate: false, options: relation },
  { label: '备注', field: 'remark', placeholder: '请输入', type: 'Textarea', row: 3, validate: false }
]

// 财务信息静态表单

export const staticFinanceForm = [
  { label: '名称', field: 'name', placeholder: '请输入名称', type: 'Input', validate: false },
  { label: '税号', field: 'tax_num', placeholder: '请输入税号', type: 'Input', validate: false },
  { label: '开户银行名称', field: 'bank', placeholder: '请输入开户银行名称', type: 'Input', validate: false },
  { label: '开户银行账号', field: 'bank_num', placeholder: '请输入开户银行账号', type: 'Input', validate: false }
]
// 联系信息动态表单对象
export const dynamicForm = {
  addr: [{ value: '' }],
  tel: [{ value: '' }],
  site: [{ value: '' }],
  mail: [{ value: '' }],
  fax: [{ value: '' }]

}
// 财务信息动态表单对象
export const FdynamicForm = {
  tel: [{ value: '' }],
  addr: [{ value: '' }],
  fax: [{ value: '' }],
  post_code: [{ value: '' }]
}
// 联系人表格表头配置
export const personTableCol = [
  { prop: 'name', label: '姓名' },
  { prop: 'gender', label: '性别' },
  { prop: 'birth', label: '出生日期' },
  { prop: 'tel', label: '电话' },
  { prop: 'mail', label: '邮箱' },
  { prop: 'state', label: '状态' },
  { prop: 'department', label: '部门' },
  { prop: 'position', label: '职位' },
  { prop: 'relation', label: '联系人关系' }
]
