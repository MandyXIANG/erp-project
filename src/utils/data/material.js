// čˇĺçŠć
export default function () {
  return {
    methods: {
      getMaterialList (callback) {
        this.$http.get('/base/material/list').then(res => {
          const result = res.data
          callback(result)
        })
      }
    }
  }
}
