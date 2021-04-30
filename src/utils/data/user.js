// 获取客户列表
export default function () {
  return {
    data () {
      return {
        userList: []
      }
    },
    methods: {
      getUserList (val) {
        const params = {
          'q[name]': val,
          'q[fullname]': val,
          op: 1
        }
        this.$http.get('/system/user/list', { data: params }).then(res => {
          if (res.code === 0) {
            this.userList = res.data.data
          }
        })
      }
    }
  }
}
