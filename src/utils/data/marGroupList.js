// 获取HS列表
export default function () {
  return {
    methods: {
      getMarGroupList (callback) {
        this.$http.get('/base/materialgroup/').then(res => {
          const result = res.data
          callback(result)
        })
      }
    }
  }
}
