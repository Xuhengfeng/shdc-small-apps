var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["买房", "租房", "小区"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    checkLogin: false,//判断是否登录
  },
  onLoad() {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    if(wx.getStorageSync('openId')) {
      that.setData({checkLogin: true});
    }
  },
  tabClick(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getUseInfo() {
    var that = this;
    if(wx.getStorageSync('openId')) {
      wx.getUserInfo({
        success: (res) => {
          var pages = getCurrentPages();//当前页面路由栈的信息
          var prevPage = pages[pages.length - 2];//上一个页面
          prevPage.setData({
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            showLogout: true
          })
          that.setData({checkLogin: true})
          wx.navigateBack();
        },
        fail: (error) => {
          console.log("获取失败！")
        },
        complete: () => {
          console.log("获取用户信息完成！")
        }
      })
    } else {
      wx.login({
        success: (res) => {
          if (res.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: function (res_user) {
                wx.request({
                  url: 'https://api.weixin.qq.com/sns/jscode2session',
                  data: {
                    js_code: res.code,
                    appid: 'wx436c6a6576047a5f',
                    secret: '6084fb0068f085973119f82359dddd4f',
                    grant_type: 'authorization_code'
                  },
                  success: (response) => {
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
                that.setData({ checkLogin: true })
                wx.navigateBack();
              },
              fail: function () {
                wx.showModal({
                  title: '警告通知',
                  content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {
                          if (res.authSetting["scope.userInfo"]) {//如果用户重新同意了授权登录
                            wx.login({
                              success: function (res_login) {
                                if (res_login.code) {
                                  wx.getUserInfo({
                                    withCredentials: true,
                                    success: function (res_user) {
                                      wx.request({
                                        url: 'https://api.weixin.qq.com/sns/jscode2session',
                                        data: {
                                          code: res_login.code,
                                          encryptedData: res_user.encryptedData,
                                          iv: res_user.iv
                                        },
                                        method: 'GET',
                                        header: { 'content-type': 'application/json' },
                                        success: (res) => {
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
                        },
                        fail: (res) => { }
                      })

                    }
                  }
                })
              },
              complete: (res) => { }
            })
          }
        }
      })
    }

  },

});