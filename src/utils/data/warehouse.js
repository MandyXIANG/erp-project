// 获取仓库信息
export default function () {
  return {
    methods: {
      getWarehouseList () {
        this.$http.get('/base/warehouse/list').then(res => {
          const result = res.data.data
          this.loading = false
          this.warehouseList = result
        })
      },
      getSpaceArea (id, callback) {
        this.$http.get(`/base/warehouse/tree/${id}`).then(res => {
          const result = res.data
          callback(result)
        })
      }
    }
  }
}
