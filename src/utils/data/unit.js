// 获取单位列表
export default function () {
  return {
    methods: {
      getUnitList (callback) {
        this.$http.get('/system/units').then(res => {
          const result = res.data
          callback(result)
        })
      }
    }
  }
}
