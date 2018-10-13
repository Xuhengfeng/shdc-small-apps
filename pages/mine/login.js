const Api = require("../../utils/url");
const utils = require("../../utils/util");
const md5 = require("../../utils/md5");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    inputValue1: "",//电话号码
    inputValue2: "",//验证码
    toast1Hidden: true,
    nickName: null,
    avatarUrl: null,
    isphoneLogin: false,//是否手机号快捷登录
    code: '', //验证码
    currentCity: null,
    times: 60,
    sendText: '获取验证码',
    flagBtn: true,
    text: '绑定手机号',
    phoneNumber: null
  }, 
  onLoad(options) {
    //判断缓存中是否已存在手机号
    if(options.userPhone!=null){
      this.setData({
        text: '快捷登录',
        isphoneLogin: true,
        phoneNumber: Number(options.userPhone)
      });
    }
    utils.storage('selectCity')
    .then(res=>{
      this.setData({currentCity: res.data.value});
    })
  },
  toggleClick() {
    wx.switchTab({url: '/pages/mine/mine'});
  },
  getPhoneNumber(e) {//这个方法后面 如果是企业号 就可以获取用户手机号
   
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg =='getPhoneNumber:fail:cancel to confirm login') {
        //切换到用户手机号登录
        this.setData({isphoneLogin: false});
    }else{
      //判断是否有凭证--------->>>>
      let ciphertext
          ,userInfo = JSON.parse(wx.getStorageSync('userInfo'));
          userInfo.userPhone=this.data.phoneNumber;
      try{
        ciphertext = JSON.parse(wx.getStorageSync('ciphertext'));
        this.loginRequest(e, ciphertext, userInfo);
      }catch(error){
        app.oLogin().then(res=>{
          this.loginRequest(e, res, userInfo);
        })
      }
    }
  },  
  loginRequest(e, ciphertext, userInfo) {
    let appId = 'wx2f29dfd350dc78d8';
    let Key = ciphertext.sessionKey;
    let params = {
      "authKey": ciphertext.authKey,
      "headImage": userInfo.avatarUrl,
      "nickname":  userInfo.nickName,
      "openid": ciphertext.openid,
      "phone": userInfo.userPhone,
      "sex": userInfo.gender
    }
    utils.post(Api.weChatRegister, params)
    .then(data => {
      let newParams = {
          "openid": ciphertext.openid,
          "phone": userInfo.userPhone,
      }
      return utils.get(Api.weChatLogin, newParams);
    })
    .then(data=>{
      wx.setStorage({ key: 'userToken', data: data.data });
      this.goBackSet(params,2);
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
  //返回刷新设置
  goBackSet(data,num) {
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
          wx.setStorageSync('userInfo2', JSON.stringify(newobj));
          break;
    }
    setTimeout(() => {
      wx.switchTab({ 
      url: '../index/index', 
      success: (e)=>{ 
        var page = getCurrentPages().pop(); 
        if (page == undefined || page == null) return; 
          page.onLoad(); 
        } 
      }) 
    }, 1000);
  },
  
  //输入手机号
  bindKeyInput1(e) {
    this.setData({inputValue1: e.detail.value})
  },
  //输入验证码
  bindKeyInput2(e) {
    this.setData({ inputValue2: e.detail.value})
  },
  //发送验证码(如果用户未注册 则先进行注册)
  sendCode() {
    if(this.data.flagBtn){
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
        wx.showLoading({title: '验证发送中...'});
        wx.request({
          url: Api.IP_GETSMSCODE,
          data: params,
          header: { 
            'Content-Type': 'application/json',
            'scity': this.data.currentCity,
          },
          method: "POST",
          success: res=>{
            //倒计时
            this.countDown();
            wx.hideLoading();
  
            if(res.data.status == 500){
              let params2 = {
                  mobile: mobilePhone,
                  sign: md5(key.toUpperCase()),
                  operateType: "LOGIN",
                  scity: this.data.currentCity
              }
              utils.post(Api.IP_GETSMSCODE,params2).then(res=>{})
            }

          }
        })
      }
    }
  },
  //倒计时
  countDown(num) {
    let timer;
    timer = setInterval(()=> {
      this.data.times--;
      if (this.data.times <= 0) {
        this.setData({
          sendText: '获取验证码',
          times: 60,
          flagBtn: true
        });
        clearInterval(timer);//清空定时器
      } else {
        this.setData({
          sendText: this.data.times+'s重试',
          flagBtn: false
        })
      }
    }, 1000);
  }
})



