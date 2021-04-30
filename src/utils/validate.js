/**
 * 验证电话号码，包括手机和固定电话
 * @param {*} value
 */

export const tel = (value) => {
  const mobile = /^1[3456789]\d{9}$/
  const tel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  if (mobile.test(value) || tel.test(value)) {
    return true
  } else {
    return false
  }
}

/**
 * 验证网址
 * @param {*} value
 */

export const network = (value) => {
  const reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-?%&=]*)?/
  return reg.test(value)
}
/**
 * 验证邮箱
 * @param {*} value
 */
export const email = (value) => {
  const reg = /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  return reg.test(value)
}
/**
 * 验证传真
 * @param {*} value
 */
export const fax = (value) => {
  const reg = /^(\d{3,4}-)?\d{7,8}$/
  return reg.test(value)
}

/**
 * 验证邮编
 * @param {*} value
 */

export const postcode = (value) => {
  const reg = /^[1-9][0-9]{5}$/
  return reg.test(value)
}
/**
 * 验证是否包含中文或空格
 * @param {*} value
 */
export const validateCode = (value) => {
  const reg = /[\u4E00-\u9FA5]|\s/
  return reg.test(value)
}
