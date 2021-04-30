const Params = [ // 列表搜索
  { label: '出库单编号', field: 'id', placeholder: '请输入出库单编号', type: 'Input' },
  {
    single: true,
    label: '状态',
    field: 'state',
    placeholder: '请选择状态',
    type: 'MultiSelect',
    operator_field: 'stateop',
    operator: 0,
    options: [
      { label: '草稿', value: 'draft' },
      { label: '待审核', value: 'wait_check' },
      { label: '拒绝', value: 'reject' },
      { label: '未开始', value: 'unstart' },
      { label: '进行中', value: 'process' },
      { label: '已出库', value: 'out' }
    ]
  }
]

const TableColumn = [ // 出库单列表的column
  { label: '出库单号', prop: 'id', sortable: 'true' },
  { label: '类型', prop: 'type', sortable: 'true' },
  { label: '来源', prop: 'source', sortable: 'true' },
  { label: '收货方名称', prop: 'receiptor_name', sortable: 'true' },
  { label: '订单号', prop: 'order_id', sortable: 'true' },
  { label: '仓库代码', prop: 'warehouse_code', sortable: 'true' },
  { label: '创建人', prop: 'owner_fullname', sortable: 'true' },
  { label: '状态', prop: 'state', sortable: 'true' }
]

const TypeList = [ // 入库类型的枚举
  { label: '销售出库', value: 'sale_out' },
  { label: '手动出库', value: 'handle_out' }
]

const DetailColumn = [ // 添加物料的column
  { label: '物料编码', prop: 'material_code' },
  { label: '物料名称', prop: 'material_name' },
  { label: '库存单位', prop: 'unit' },
  { label: '订单号', prop: 'order_code' },
  { label: '需求数量', prop: 'plan_amount' }
]

const orderColumn = [
  { label: '销售订单', prop: 'order_num' },
  { label: '物料名称', prop: 'material_name' },
  { label: '订单数量', prop: 'count' },
  { label: '销售单位', prop: 'sale_unit' },
  { label: '已发数量', prop: 'sent_sum' }
]

const stateColumn = [
  { label: '操作人', prop: 'owner', show: 'false' },
  { label: '操作时间', prop: 'log_time' },
  { label: '动作', prop: 'log_type' },
  { label: '备注', prop: 'remark' }
]

const prepareColumn = [
  { label: '料盒代码', prop: 'box_code' },
  { label: '供应商名称', prop: 'supplier_name' },
  { label: '备料人', prop: 'preparer', width: '120' },
  { label: '备料时间', prop: 'prepared_time', width: '150' },
  { label: '备料数量', prop: 'amount' },
  { label: '状态', prop: 'state' },
  { label: '发料人', prop: 'deliverier', width: '120' },
  { label: '发料时间', prop: 'delivery_time', width: '150' },
  { label: '发货单号', prop: 'delivery_id', width: '150' }
]

const outDetailColumn = [
  { label: '物料编码', prop: 'material_code' },
  { label: '物料名称', prop: 'material_name' },
  { label: '库存单位', prop: 'unit' },
  { label: '订单号', prop: 'order_code' },
  { label: '需求数量', prop: 'plan_amount' },
  { label: '已备数量', prop: 'prepared_amount' },
  { label: '状态', prop: 'state' }
]

const issueColumn = []

const Status = {
  draft: { label: '草稿', value: 'draft' },
  wait_check: { label: '待审核', value: 'wait_check' },
  cancel: { label: '取消', value: 'cancel' },
  process: { label: '进行中', value: 'process' },
  finish: { label: '完成', value: 'finish' }
}

export {
  Params,
  TableColumn,
  TypeList,
  DetailColumn,
  orderColumn,
  prepareColumn,
  outDetailColumn,
  Status,
  stateColumn,
  issueColumn
}

export default {
  Params,
  TableColumn,
  TypeList,
  DetailColumn,
  orderColumn,
  prepareColumn,
  outDetailColumn,
  Status,
  stateColumn,
  issueColumn
}
