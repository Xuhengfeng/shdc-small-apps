//页面拦截器
function loginCheck(pageObj) {
  console.log(pageObj)
  if(pageObj.onLoad) {
    let _onLoad = pageObj.onLoad;
      pageObj.onLoad = function(options) {
        if (wx.getStorageSync('userToken').data || wx.getStorageSync('openId')) {//验证用户是否登录
        //获取页面实例，防止this劫持
        let currentInstance = getPageInstance();
        _onLoad.call(currentInstance, options);
      }else{
        //跳转到登录页
        wx.redirectTo({
          url: "/pages/mine/login"
        });
      }
    }
  }
  return pageObj;
}
function getPageInstance() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

exports.loginCheck = loginCheck;