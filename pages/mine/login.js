var Api = require("../../utils/url");
var md5 = require("../../utils/md5.js");
var app = getApp();
Page({
  data: {
    inputValue1: "",//电话号码
    inputValue2: "",//验证码
    toast1Hidden: true,
    nickName: null,
    avatarUrl: null,
    isCancelLogin: true,  //是否登录
    code: '', //验证码
  }, 
  getPhoneNumber(e) {
    console.log(e)
    if(e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        showCancel: false,
        content: '未授权',
      })
    }else{
      wx.showModal({
        showCancel: false,
        content: '同意授权',
      })
    }
  },  
  getUseInfo() {
    var that = this;
    if(wx.getStorageSync('openId')) {
      wx.getUserInfo({
        success: (res)=> {
          var pages = getCurrentPages();//当前页面路由栈的信息
          var prevPage = pages[pages.length - 2];//上一个页面
          prevPage.setData({
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            showLogout: true
          })
          wx.navigateBack();
        }
      })
    }else{
      wx.login({
        success: res=> {
          if(res.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: (res_user)=> {
                wx.request({
                  url: 'https://api.weixin.qq.com/sns/jscode2session',
                  data: {
                    js_code: res.code,
                    appid: 'wx436c6a6576047a5f',
                    secret: '6084fb0068f085973119f82359dddd4f',
                    grant_type: 'authorization_code'
                  },
                  success: response=> {
                    wx.setStorageSync('openId', response.data.openid);
                  }
                })
                var pages = getCurrentPages();//当前页面路由栈的信息
                var prevPage = pages[pages.length - 2];//上一个页面
                prevPage.setData({
                  nickName: res_user.userInfo.nickName,
                  avatarUrl: res_user.userInfo.avatarUrl,
                  showLogout: true
                })
                wx.navigateBack();
              }, 
              fail: ()=> {
                wx.showModal({
                  title: '警告通知',
                  content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                  success: res=> {
                    if(res.cancel) {
                      this.setData({
                        isCancelLogin: false
                      })
                    }
                    if(res.confirm) {
                      wx.openSetting({
                        success: res=> {
                          if (res.authSetting["scope.userInfo"]) {//如果用户重新同意了授权登录
                            wx.login({
                              success: res_login=> {
                                if(res_login.code) {
                                  wx.getUserInfo({
                                    withCredentials: true,
                                    success: res_user=> {
                                      wx.request({
                                        url: 'https://api.weixin.qq.com/sns/jscode2session',
                                        data: {
                                          code: res_login.code,
                                          encryptedData: res_user.encryptedData,
                                          iv: res_user.iv
                                        },
                                        method: 'GET',
                                        header: {'content-type': 'application/json'},
                                        success: res=> {
                                          that.setData({
                                            nickName: res.data.nickName,
                                            avatarUrl: res.data.avatarUrl,
                                          })
                                          wx.setStorageSync('openId', res.data.openId);
                                        }
                                      })
                                    }
                                  })
                                }
                              }
                            });
                          }
                        } 
                      })
                    }
                  }
                })
              },
              complete: (res)=> {}
            })
          }
        }
      })
    }

  },
  login() {//手机短信验证码登录
    console.log(this.data.inputValue1)
    console.log(this.data.inputValue2)

    if(this.data.inputValue1 !== "" && this.data.inputValue2 !== "" ) {
     
      var mobilePhone = this.data.inputValue1

      wx.request({
        url: Api.IP_SMSCODELOGIN,
        data: {
          deviceCode: "wx",
          smsCode: '111111',//验证码  暂时默认111111
          mobile: mobilePhone
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: (res) => {
          console.log(res)
          wx.setStorage({
            key: 'userToken',
            data: res.data
          })
        }
      })
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1000
      })
      setTimeout(() => {
        wx.switchTab({
          url: "../index/index"
        })
      }, 1000);

    }else{
      wx.showToast({
        title: '登录失败',
        icon: 'none',
        duration: 1000
      })
    }
  },
  bindKeyInput1(e) {//输入手机号
    this.setData( {
      inputValue1: e.detail.value
    })
  },
  bindKeyInput2(e) {//输入验证码
    this.setData( {
      inputValue2: e.detail.value
    })
  },
  sendCode() {//发送验证码
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;//手机号正则
    if(!myreg.test(this.data.inputValue1)) {
      wx.showModal({content: '请输入正确的手机号'})
      return false;
    }
    let key = this.data.inputValue1 + "29e94f94-8664-48f2-a4ff-7a5807e13b68";
    
    if(this.data.inputValue1) {
      var mobilePhone = this.data.inputValue1
      //注册 
      wx.request({
        url: Api.IP_GETSMSCODE,
        data: {
          mobile: mobilePhone,
          sign: md5(key.toUpperCase()),
          operateType: "REGISTER" 
        },
        method: 'POST',
        header: {'content-type': 'application/json'},
        success: (res)=> {
            //再次请求登录
            if(res.data.status == 500) {//说明用户已经注册过
                wx.request({
                url: Api.IP_GETSMSCODE,
                data: {
                  mobile: mobilePhone,
                  sign: md5(key.toUpperCase()),
                  operateType: "LOGIN"
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: (res) => {
                  console.log(res)
                }
              })
            }
             
          }
        })
      }
  },
  back() {
    this.setData({
      isCancelLogin: true
    })
    wx.navigateBack();
  }
})



