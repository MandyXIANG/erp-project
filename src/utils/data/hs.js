// 获取HS列表
export default function () {
  return {
    methods: {
      getHsList (callback) {
        this.$http.get('/base/hs').then(res => {
          const result = res.data
          callback(result)
        })
      }
    }
  }
}
