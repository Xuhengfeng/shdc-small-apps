const Api = require("utils/url");
App({
  onLaunch() {
    //登录
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: Api.weChat,
            data: {"code": res.code},
            method: 'GET',
            success: response => {
              wx.setStorageSync('ciphertext', JSON.stringify(response.data.data));
            }
          })
        }
      }
    })
    // 获取用户信息  
    wx.getSetting({  
      success: res => {  
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框  
        this.getuserInfo();  
        this.getlocalinfo();  
      }  
    }) 
  },
  getuserInfo() {
    wx.getUserInfo({  
      success: res => {  
          // 可以将 res 发送给后台解码出 unionId  
          this.globalData.userInfo = res.userInfo  
          this.globalData.hasUserInfo = true  

          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回  
          // 所以此处加入 callback 以防止这种情况  
          if (this.userInfoReadyCallback) {  
              this.userInfoReadyCallback(res)  
          }  
      },  
      fail:()=>{  
          wx.showModal({  
              title: '提示',  
              content: '拒绝授权可能会影响部分功能使用，请删除小程序或设置授权',   
              confirmText: '去设置',  
              success:res => {  
                  if(res.confirm){  
                      wx.openSetting({  
                            
                      })  
                  }  
              }  
          })  
      }  
    })  
  },
  getlocalinfo() {  
    wx.getLocation({  
        success: res => {},  
        fail: ()=> {  
            wx.showModal({  
                title: '提示',  
                content: '拒绝授权可能会影响定位功能使用，请删除小程序或设置授权',  
                confirmText: '去设置',  
                success: res => {  
                    if (res.confirm) {  
                        wx.openSetting({})  
                    }  
                }  
            })  
        }  
    })  
  },
  globalData: {
    userInfo: null,
    ciphertext: null,
    hasUserInfo: false,  
    userAddress:null  
  }
})



