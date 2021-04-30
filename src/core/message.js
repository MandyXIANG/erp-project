const confirmMsg = function (message, title) {
  return this.$confirm(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    confirmButtonClass: 'el-button--primary',
    type: 'warning'
  })
}

const confirmDelete = function (msg) {
  return this.$confirm(msg, {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    confirmButtonClass: 'el-button--danger',
    type: 'warning'
  })
}

const tipMessage = function (message, type, duration = 1500) {
  this.$message({
    showClose: true,
    message: message,
    type: type,
    duration: duration
  })
}

export { confirmMsg, confirmDelete, tipMessage }
export default { confirmMsg, confirmDelete, tipMessage }
