// 获取销售订单 参数加上scl: 1 为已发数量sent_sum小于订单数量count的
export default function () {
  return {
    methods: {
      async getSaleOrderList (id, callback) {
        const params = { slc: 1 }
        await this.$http.get(`/business/sales/main/${id}`, { data: params }).then(res => {
          const result = res.data
          callback(result)
        })
      }
    }
  }
}
