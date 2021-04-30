const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
export default {
  install: (Vue) => {
    Vue.directive('precision', {
      bind (el, binding, vnode) {
        const Input = el.querySelector('.el-input__inner')
        const dec = !isNaN(binding.value) && binding.value ? binding.value : 2
        // 输入过程中直接截取
        Input.onkeyup = (e) => {
          const value = String(e.target.value)
          const arr = value.split('.')
          if (arr.length > 1) {
            const res = `${arr[0]}.${arr[1].slice(0, dec)}`
            e.target.value = res
            trigger(Input, 'input')
          }
        }
        Input.onblur = (e) => {
          if (e.target.value) {
            e.target.value = Number(e.target.value)
          }
        }
      }
    })
  }
}
