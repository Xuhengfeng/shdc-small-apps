const bmap = require("libs/bmap-wx.min.js");//百度地图sdk
const pinyin = require("libs/browser.js"); //汉字转拼音
//app.js
App({
  httpRequest(url, options, callback) {
    wx.request({
      url: url,
      data: {},
      method: options,
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        callback(null, res.data);
      },
      fail: (error) => {
        callback(error);
      }
    })
  },
  location() {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res)
        // // 百度地图地址解析
        var BMap = new bmap.BMapWX({
          ak: '55An9ZpRGSA8v5Mw7uHxmONFCI3mkTW0'
        });
        // 发起regeocoding检索请求 
        BMap.regeocoding({
          location: res.latitude + ',' + res.longitude,//这是根据之前定位出的经纬度
          success: (data) => {
            var citytoPinyin = data.originalData.result.addressComponent.city.slice(0, -1);
            var currentCity = pinyin.convertToPinyin(citytoPinyin, '', true)
            var currentCityName = data.originalData.result.addressComponent.city.slice(0, -1);
            wx.setStorage({
              key: 'selectCity',
              data: {
                name: currentCityName,
                value: currentCity
              }
            });
          }
        });
      },
      fail: (error) => {
        wx.showModal({
          title: '警告通知',
          content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
          success: res => {
            if (res.confirm) {
              wx.openSetting({
                success: res => {
                  console.log(res)
                  if (res.authSetting["scope.userLocation"]) {//如果用户重新同意了授权登录
                    wx.getLocation({
                      type: 'gcj02',
                      success: (res) => {
                        console.log(res)
                        // // 百度地图地址解析
                        var BMap = new bmap.BMapWX({
                          ak: '55An9ZpRGSA8v5Mw7uHxmONFCI3mkTW0'
                        });
                        // 发起regeocoding检索请求 
                        BMap.regeocoding({
                          location: res.latitude + ',' + res.longitude,//这是根据之前定位出的经纬度
                          success: (data) => {
                            var citytoPinyin = data.originalData.result.addressComponent.city.slice(0, -1);
                            var currentCity = pinyin.convertToPinyin(citytoPinyin, '', true)
                            var currentCityName = data.originalData.result.addressComponent.city.slice(0, -1);
                            wx.setStorage({
                              key: 'selectCity',
                              data: {
                                name: currentCityName,
                                value: currentCity
                              }
                            });
                          }
                        });
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  onLaunch() {
    this.location();
    //展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)


    // //获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log(res);
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(res)
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null
  }
})