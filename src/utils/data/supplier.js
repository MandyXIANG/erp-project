// 获取供应商列表
export default function () {
  return {
    methods: {
      getSupplierList (callback) {
        this.$http.get('/base/supplier/list').then(res => {
          const result = res.data
          callback(result)
        })
      }
    }
  }
}
