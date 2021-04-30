
export const API_MAP = {
  SUPPLIER_LIST: '/base/supplier/list', // 供应商列表
  BASE_SUPPLIER: '/base/supplier/self', // 新建供应商
  SUPPLIER_CONCAT: '/base/supplier/contact'
}

export const ENUM_MAP = {
  supplier_class: 'supplier_class', // 供应商等级
  supplier_states: 'supplier_states', // 供应商状态
  corp_type: 'corp_type', // 企业类型
  corp_kind: 'corp_kind', // 企业性质
  currency: 'currency', // 币种
  delivery_cycle: 'delivery_cycle', // 发货周期
  payment_time: 'payment_time' // 付款时机
}

// 配置
export const tableCols = [

  {
    prop: 'code',
    label: '供应商代码'
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
    label: '供应商状态'
  },
  {
    prop: 'class',
    label: '等级'
  }
]

export const searchParams = [
  {
    label: '供应商代码',
    field: 'code',
    placeholder: '请输入供应商代码',
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

// 基本信息表单配置

export const basicForm = [
  { label: '供应商代码', field: 'code', placeholder: '请输入供应商代码', type: 'Input', validate: true, span: 12 },
  { label: '简称', field: 'name', placeholder: '请输入简称', type: 'Input', validate: true, span: 12 },
  { label: '全称', field: 'fullname', placeholder: '请输入全称', type: 'Input', validate: true, span: 12 },
  { label: '法人代表', field: 'legal_rep', placeholder: '请输入法人代表', type: 'Input', validate: false, span: 12 },
  { label: '注册资金', field: 'reg_capital', placeholder: '请输入注册资金', type: 'Input', validate: false, span: 12 },
  { label: '企业类型', field: 'corp_type', code: ENUM_MAP.corp_type, placeholder: '请选择企业类型', type: 'Select', validate: false, options: [], span: 12 },
  { label: '公司状态', field: 'corp_state', code: ENUM_MAP.supplier_states, placeholder: '请选择公司状态', type: 'Select', validate: false, options: status, span: 12 },
  { label: '企业性质', field: 'corp_kind', code: ENUM_MAP.corp_kind, placeholder: '请选择企业性质', type: 'Select', validate: false, options: [], span: 12 },
  { label: '交易币种', field: 'trans_curr', placeholder: '请选择交易币种', type: 'Select', validate: false, options: currency, span: 12 },
  { label: '等级', field: 'class', code: ENUM_MAP.supplier_class, placeholder: '请选择等级', type: 'Select', validate: false, options: [], span: 12 },
  { label: '备注', field: 'remark', placeholder: '请输入备注', type: 'Textarea', row: 3, validate: false, span: 24 }
]

// 新建或编辑联系人表单配置

export const relationForm = [
  { label: '姓名', field: 'name', placeholder: '请输入', type: 'Input', validate: true },
  { label: '性别', field: 'gender', placeholder: '请选择', type: 'Select', options: genderOptions, validate: false },
  { label: '出生日期', field: 'birth', placeholder: '请输入', type: 'Date', validate: false },
  { label: '电话', field: 'phone', placeholder: '请输入', type: 'Input', validate: true },
  { label: '邮箱', field: 'email', placeholder: '请输入', type: 'Input', validate: true },
  { label: '部门', field: 'department', placeholder: '请输入', type: 'Input', validate: false },
  { label: '职位', field: 'work', placeholder: '请输入', type: 'Input', validate: false },
  { label: '状态', field: 'status', placeholder: '请输入', type: 'Select', validate: false, options: personStatue },
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
export const DynamicForm = {
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
// 默认结算方式配置
export const payMethods = {
  arrival: {
    name: '货到付款',
    max_day: null, // 付款上限天数
    start_time: '签收日期' // 开始计算日期
    // stage_conf: [],
    // delivery: null,
    // cycle_conf: []
  },
  stage: {
    name: '分期付款',
    // max_day: '',
    // start_time: '',
    stage_conf: [ // ratio:付款比例  time:付款时机
      { ratio: null, time: '' }
    ]
    // delivery: null,
    // cycle_conf: []
  },
  prepaid: {
    name: '预付款',
    // max_day: null,
    // start_time: null,
    // stage_conf: [],
    delivery: null, // 付款后发货周期
    unit: '' // 周期的单位：天、周、月
    // cycle_conf: []
  },
  cycle: {
    name: '周期结算',
    // max_day: null,
    // start_time: null,
    // stage_conf: [],
    // delivery: null,
    // unit: '',
    alert: true, // 付款提醒
    start_time: null, // 起始日期,仅对周期单位为天的有效
    advance_day: null, // 提前天数
    cycle_conf: [ // unit:周期结算单位  value:周期结算值
      { unit: '', value: null }
    ]
  }
}
