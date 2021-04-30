
import { tel, network, email, fax, postcode } from '@/utils/validate'

/**
 * 验证电话
 */
function validatePhone (rule, value, callback) {
  if (value && value.length) {
    const res = tel(value)
    if (!res) {
      callback(new Error('电话格式不正确'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
/**
 * 验证网址
 */
function validateNetwork (rule, value, callback) {
  if (value && value.length) {
    const res = network(value)
    if (!res) {
      callback(new Error('网络地址格式不正确'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
/**
 * 验证邮箱
 */
function validateEmail (rule, value, callback) {
  if (value && value.length) {
    const res = email(value)
    if (!res) {
      callback(new Error('邮箱格式不正确'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
/**
 * 验证传真
 */
function validateFax (rule, value, callback) {
  if (value && value.length) {
    const res = fax(value)
    if (!res) {
      callback(new Error('传真格式不正确'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
/**
 * 验证邮编
 */
function validatePost (rule, value, callback) {
  if (value && value.length) {
    const res = postcode(value)
    if (!res) {
      callback(new Error('邮编格式不正确'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

/**
 * 获取枚举项的映射关系
 * @param {*} arr
 * @param {*} key
 * @param {*} value
 */

function getEnumMap (arr, key, value) {
  const res = {}
  for (const item of arr) {
    res[item[key]] = item[value]
  }
  return res
}

export {
  validatePost,
  validateFax,
  validatePhone,
  validateNetwork,
  validateEmail,
  getEnumMap
}
