const Api = require("utils/url");
App({
  onLaunch(options) {
    this.globalData.scene = options.scene;
    this.oLogin();
    this.getSet();
  },
  //登录
  oLogin() {
    return new Promise(resolve=>{
        wx.login({
          success: res => {
            if (res.code) {
              wx.request({
                url: Api.weChat,
                data: {"code": res.code},
                method: 'GET',
                success: response => {
                  resolve(response.data.data);
                  wx.setStorageSync('ciphertext', JSON.stringify(response.data.data));
                }
              })
            }
          }
        })
    })
  }, 
  getSet() {
    // 获取用户信息  
    wx.getSetting({  
      success: res => {  
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
                      wx.openSetting({});  
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
                        wx.openSetting({});  
                    }  
                }  
            })  
        }  
    })  
  },
  onShow(options) {
    this.globalData.scene = options.scene;
    let that = this;
    wx.getSystemInfo({
      success: res=>{
        that.globalData.statusBarHeight = res.statusBarHeight;
        that.globalData.windowWidth = res.windowWidth;
      }
    })
  },
  //自定义页面滚动监听回调
  oScroll(res) {
    const denominator  = wx.getSystemInfoSync().windowWidth / 375 * 330;
    let percent = res.scrollTop / denominator;
    let scrollNum = percent>=1 ? 1 : percent;
    let changeBg = 'rgba(250,250,250,'+scrollNum+')';
    if(scrollNum<=0.4) changeBg = "#fff";
    return {
      scrollNum: scrollNum,
      changeBg: changeBg
    }
  },
  globalData: {
    statusBarHeight: 20,
    winWidth: 0,
    userInfo: null,//用户信息
    ciphertext: null,//鉴权信息
    hasUserInfo: false,//用户是否授权获取用户信息  
    userAddress:null,//用户位置
    scene:null //用户使用场景值
  }
})



