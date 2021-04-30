// 获取客户列表
export default function () {
  return {
    methods: {
      getCustomerList (callback) {
        this.$http.get('/base/customer/list').then(res => {
          const result = res.data
          callback(result)
        })
      }
    }
  }
}
