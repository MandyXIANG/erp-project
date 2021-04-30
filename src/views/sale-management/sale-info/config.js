export const API_MAP = {
  SYS_CONF: '/system/conf/sale_base'
}

// 默认结算方式配置
export const payMethods = {
  arrival: {
    name: '货到付款',
    max_day: null, // 付款上限天数
    start_time: '签收日期' // 开始计算日期
  },
  stage: {
    name: '分期付款',
    stage_conf: [ // ratio:付款比例  time:付款时机
      { ratio: null, time: '' }
    ]
  },
  prepaid: {
    name: '预付款',
    delivery: null, // 付款后发货周期
    unit: '' // 周期的单位：天、周、月
  },
  cycle: {
    name: '周期结算',
    cycle_conf: [ // unit:周期结算单位  value:周期结算值
      { unit: '', value: '' }
    ]
  }
}
