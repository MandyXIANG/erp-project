const dbErr = {
  'unique violation': '重复添加'
}

export function errMap (msg) {
  return dbErr[msg] || msg
}
