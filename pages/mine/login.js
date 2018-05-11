const Api = require("../../utils/url");
const utils = require("../../utils/util");
const md5 = require("../../utils/md5.js");
const WXBizDataCrypt = require("../../utils/Rdwxbizdatacrypt.js");
const app = getApp();

Page({
  data: {
    inputValue1: "",//电话号码
    inputValue2: "",//验证码
    toast1Hidden: true,
    nickName: null,
    avatarUrl: null,
    isphoneLogin: true,  //是否登录
    code: '', //验证码
  }, 
  getPhoneNumber(e) {//这个方法后面 如果是企业号 就可以获取用户手机号
    if(e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      //拒绝 -------------->>>>>
      //用户手机号登录
      this.setData({isphoneLogin: false});
    }else{
      //接受
      //判断是否有appid--------->>>>
      let ciphertext = JSON.parse(wx.getStorageSync('ciphertext'));
      let userInfo = JSON.parse(wx.getStorageSync('userInfo'));

      let appId = 'wxce209331358eecd8';
      let Key = ciphertext.sessionKey;
      let iv = e.detail.iv;
      let encryptedData = e.detail.encryptedData;
      let pc = new WXBizDataCrypt(appId, Key)
      let data = pc.decryptData(encryptedData, iv)
      console.log('解密后 data: ', data)
      wx.setStorage({ key: 'userPhone', data: data});

      //当前页面路由栈的信息
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
          prevPage.setData({
            nickName: data.phoneNumber,
            avatarUrl: userInfo.avatarUrl,
            showLogout: true
          })
      let params = {
        "authKey": ciphertext.authKey,
        "headImage": userInfo.avatarUrl,
        "nickname":  userInfo.nickname,
        "openid": ciphertext.openid,
        "phone": data.phoneNumber,
        "sex": userInfo.gender
      }
      utils.post(Api.weChatRegister, params)
      .then((data) => {
        let newParams = {
            "openid": ciphertext.openid,
            "phone": data.phoneNumber
        }
        return utils.get(Api.weChatLogin, newParams);
      })
      .then((data)=>{
        wx.setStorage({ key: 'userToken', data: data.data });
        wx.showToast({ title: '登录成功', icon: 'success', duration: 500});
        wx.navigateBack();
      })
    }
  },  
  onLoad(options) {
    this.getUseInfo();
  },
  //用户基本信息
  getUseInfo() {
    //获取用户信息
    wx.getSetting({
      success: res => {
         if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync('userInfo', JSON.stringify(res.userInfo));
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
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
            wx.setStorage({ key: 'userToken',data: res.data})
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
        setTimeout(() => {wx.navigateBack()}, 1000);
  },
  //直接返回
  goback() {
    this.setData({isphoneLogin: true})
    wx.navigateBack();
  },
  //输入手机号
  bindKeyInput1(e) {
    this.setData({inputValue1: e.detail.value})
  },
  //输入验证码
  bindKeyInput2(e) {
    this.setData({ inputValue2: e.detail.value})
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
  }
})



