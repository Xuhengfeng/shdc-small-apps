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
//封装获取缓存
const storage = (key)=> {
  return new Promise((resolve, reject)=> {
    wx.getStorage({
      key: key,
      success: resolve,
      fail: reject 
    })
  })
}

//用户登录
const login = ()=> {
  return new Promise((resolve,reject) => wx.login({
    success:resolve,
    fail:reject
  }))
}

//获取用户信息
const getUserInfo = ()=> {
  return login().then(res => new Promise((resolve,reject) => 
    wx.getUserInfo({
      success:resolve,
      fail:reject
    })
  ))
}

//封装Request请求方法
const requst = (url,method,data = {})=> {
  let title = data.title ? data.title : '加载中...';
  let scity = data.scity?data.scity : null;
  let unicode = data.unicode ? data.unicode : null;
  delete data.unicode;
  delete data.title;
  wx.showLoading({title: title})
  return new Promise((resove,reject) => {
    wx.request({
      url: url,
      data: data,
      header: { 
        'Content-Type': 'application/json',
        'scity': scity,
        'unique-code':  unicode,
      },
      method: method.toUpperCase(), // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: (res)=> {
        wx.hideLoading();
        if(res.statusCode == 200) {
          if(res.data.status == 0) {
            wx.showModal({title: res.data.msg});
          }
          if(res.data.data !== ""||res.data.data.length !== "") {
            resove(res.data);
          }
        }else if(res.statusCode == 500) {
          wx.showModal({title: '500错误'});
        }  
      },
      fail:(msg)=> {
        console.log('reqest error',msg)
        wx.hideLoading();  
        reject('fail')
      }
    })
  })
}

const requstGet = (url, data)=> {
  return requst(url,'GET',data);
}
const requstPost = (url, data)=> {
  return requst(url,'POST',data);
}
const requstDelete = (url, data)=> {
  return requst(url,'DELETE',data);
}

module.exports = {
  formatTime: formatTime,
  checkPhone: checkPhone,
  get: requstGet,
  post: requstPost,
  delete: requstDelete,
  requst: requst,
  login: login,
  getUserInfo: getUserInfo,
  storage: storage
}
