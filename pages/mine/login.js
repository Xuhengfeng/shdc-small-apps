const Api = require("../../utils/url");
const utils = require("../../utils/util");
const md5 = require("../../utils/md5");
const WXBizDataCrypt = require("../../utils/Rdwxbizdatacrypt");
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
    currentCity: null
  }, 
  getPhoneNumber(e) {//这个方法后面 如果是企业号 就可以获取用户手机号
  console.log(e.detail)
  if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg =='getPhoneNumber:fail:cancel to confirm login') {
      //切换到用户手机号登录
      this.setData({isphoneLogin: false});
    }else{
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
      let params = {
        "authKey": ciphertext.authKey,
        "headImage": userInfo.avatarUrl,
        "nickname":  userInfo.nickName,
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
        this.goBackSet(params,2);
      })
    }
  },  
  onLoad(options) {
    this.getUseInfo();
    utils.storage('selectCity')
    .then(res=>{
      this.setData({currentCity: res.data.value});
    })
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
      let params = {
        "deviceCode": "wx",
        "smsCode": smsCode,//验证码  暂时默认111111
        "mobile": mobilePhone
      }
      utils.post(Api.IP_SMSCODELOGIN,params)
      .then(data=>{
        wx.setStorage({ key: 'userToken', data: data.data });
        wx.setStorage({ key: 'userPhone',data: mobilePhone});
        this.goBackSet(null,1);
      })
     }else{
      wx.showToast({ title: '登录失败', icon: 'none', duration: 1000 });
    }
  },
  //切回到快捷登录
  toggleClick() { 
    this.setData({isphoneLogin: true});
  },
  //返回刷新设置
  goBackSet(data,num) {
    console.log(data)
    wx.showToast({title: '登录成功',icon: 'success',duration: 1000});
    let newobj;
    switch(num){
      case 1: 
          newobj = {
            nickName: this.data.inputValue1,
            avatarUrl: '',
            showLogout: true
          }
          break;
      case 2:  
          newobj = {
            nickName:  data.nickname,
            avatarUrl:  data.headImage,
            showLogout: true
          }
          break;
    }
    wx.setStorageSync('userInfo2', JSON.stringify(newobj));

    //上一个页面刷新
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    if(prevPage){
      prevPage.onLoad();
    }
    setTimeout(() => {wx.navigateBack()}, 1000);
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
      let mobilePhone = this.data.inputValue1
      let params = {
        mobile: mobilePhone,
        sign: md5(key.toUpperCase()),
        operateType: "REGISTER",
        scity: this.data.currentCity
      }
      utils.post(Api.IP_GETSMSCODE,params)
      .then(data=>{
        if(data.data.status == 500){
          let params2 = {
            mobile: mobilePhone,
            sign: md5(key.toUpperCase()),
            operateType: "LOGIN",
            scity: this.data.currentCity
          }
          return utils.post(Api.IP_GETSMSCODE,params2)
        }
      })
      .then(data2=>{
         console.log(data2)
      })
    }
  }
})



