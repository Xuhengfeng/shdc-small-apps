//时间简单格式化
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//补零
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
        if(res.data.status != 1) {
          wx.showModal({content: res.data.msg});
        }else{
          resove(res.data);
        }
      },
      fail:(error)=> {
        if(error.errMsg == "request:fail timeout"){
          wx.showModal({content: '请求超时'});
        }else{
          wx.showModal({content: error});
        }
        wx.hideLoading();  
        reject('fail')
      }
    })
  })
}
const requstGet = (url, data) => {
  return requst(url,'GET',data);
}
const requstPost = (url, data) => {
  return requst(url,'POST',data);
}
const requstDelete = (url, data) => {
  return requst(url,'DELETE',data);
}
//图片加载错误
const imgError = (e,item,that) => {
  let defaultPic = item+"[" + e.target.dataset.index + "].housePic";
  that.setData({[defaultPic]:'../../images/banner.png'})
}
//轮播图图片加载错误
const imgError2 = (e,item,that) => {
  let defaultPic = item+"[" + e.target.dataset.index + "]";
  that.setData({[defaultPic]:'../../images/banner2.png'})
}
//图片加载完毕(懒加载)
const imgLoaded = (e,item,that) => {
  let defaultFlag = item+"[" + e.target.dataset.index + "].flag";
  that.setData({[defaultFlag]: true})
}

function isDef(value) {
  return value !== undefined && value !== null;
}

function isObj(x) {
  const type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
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
  storage: storage,
  imgError: imgError,
  imgError2: imgError2,
  imgLoaded: imgLoaded,
  isObj,
  isDef
}
