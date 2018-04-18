let Api = require("../../utils/url");
let md5 = require("../../utils/md5.js");
let app = getApp();
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
  getPhoneNumber(e) {//这个方法后面 如果是企业号 就可以获取用户手机号
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
          this.goBackSet(res);
        }
      })
    }else{
      wx.login({
        success: res1=> {
          if(res1.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: (res)=> {
                wx.request({
                  url: 'https://api.weixin.qq.com/sns/jscode2session',
                  data: {
                    js_code: res1.code,
                    appid: 'wxce209331358eecd8',
                    secret: '3258f8a5649ecdbfb3f1e3c43f5b2907',
                    grant_type: 'authorization_code'
                  },
                  success: response=> {
                    wx.setStorageSync('openId', response.data.openid);
                  }
                })
                this.goBackSet(res);
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
    if(this.data.inputValue1 !== "" && this.data.inputValue2 !== "" ) {
      let mobilePhone = this.data.inputValue1
      let smsCode = this.data.inputValue2
    
      wx.request({
        url: Api.IP_SMSCODELOGIN,
        data: {
          deviceCode: "wx",
          smsCode: smsCode,//验证码  暂时默认111111
          mobile: mobilePhone
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: (res) => {
          if (res.statusCode == 500) {
            wx.showModal({content: '手机或验证码不对!'})
          }else if(res.statusCode == 200) {
            wx.setStorage({
              key: 'userToken',
              data: res.data
            })
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1000
            })
            this.goBackSet(res);
          }
        }
      })
    }else{
      wx.showToast({
        title: '登录失败',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //返回刷新设置
  goBackSet(res) {
    let avatarUrl,nickName;
    try{
      avatarUrl = res.userInfo.avatarUrl;
      nickName = res.userInfo.nickName;
    }catch(e){
      avatarUrl = '';
      nickName = this.data.inputValue1;      
    }
    let pages = getCurrentPages();//当前页面路由栈的信息
    let prevPage = pages[pages.length - 2];//上一个页面
          prevPage.setData({
            nickName: nickName,
            avatarUrl: avatarUrl,
            showLogout: true
          })
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
  },
  //输入手机号
  bindKeyInput1(e) {
    this.setData( {
      inputValue1: e.detail.value
    })
  },
  //输入验证码
  bindKeyInput2(e) {
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
          console.log(res)
            //再次请求登录 获取验证码
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
                success: (res) => {}
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



