const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//手机号码是否正确
const checkPhone = phone => {
  if(!(/^1[34578]\d{9}$/.test(phone))) {
    return false;
  }else{
    return true;
  }
}
module.exports = {
  formatTime: formatTime,
  checkPhone: checkPhone
}
