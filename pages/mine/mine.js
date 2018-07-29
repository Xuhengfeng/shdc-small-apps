const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    showLogout: false,
    nickName: null,
    myInfo: null,
    isAuth: '未授权'
  },
  onLoad() {
    if(!wx.getStorageSync('userToken')) {
      //未登录
      this.setData({showLogout: false});
    }else{
      //登录
      this.setData({isAuth: '已授权',showLogout: true});
      this.getMyInfo();
    }
  },
  //授权信息
  userInfoHandle(e) {
    //拒绝授权
    if(e.detail.errMsg=='getUserInfo:fail auth deny'){
      wx.showModal({content: '授权失败'});
    }
    //同意授权
    else{
      wx.setStorage({
        key:'userInfo',
        data: JSON.stringify(e.detail.userInfo),
        success:()=>{
          this.setData({isAuth: '已授权'});
        }
      })
    }
  },
  //拨打电话
  telphone() {
    let phone = this.data.myInfo.custServerPhone?this.data.myInfo.custServerPhone:"0755-26411815";
    wx.makePhoneCall({phoneNumber: phone});
  },
  //退出
  logout() {
    let params = {"unicode": wx.getStorageSync("userToken")};
    utils.post(Api.logout,params)
    .then(data=>{
      this.setData({
        showLogout: false,
        nickName: null,
        myInfo: null,
        isAuth: '未授权'
      })
      //清空缓存
      wx.clearStorageSync();
    })
  },
  //登录
  login() {
    if (wx.getStorageSync("userInfo")) {
      //已授权
      return wx.redirectTo({url: "/pages/mine/login"});
    }else{
      //未授权
      return wx.showModal({
        title: '注意',
        showCancel: true,
        confirmText:'好去授权',
        content: '为了您更好的体验,请先同意授权',
        success: res => { }
      })  
    }
  },
  //跳转
  active(e) {
    let num = e.currentTarget.dataset.num;
    switch(num){
      case '1':wx.navigateTo({url:"collection"});break;//委托
      case '2':
          if(wx.getStorageSync('userToken')) {
            wx.navigateTo({url:"mybuyhouse?title=我的卖房&num=0"});//卖房
          }else{
            wx.showModal({content: '用户未登录'});
          }
          break;
      case '3':
          if(wx.getStorageSync('userToken')) {
            wx.navigateTo({url:"mybuyhouse?title=我的租房&num=1"});break;//租房
          }else{
            wx.showModal({content: '用户未登录'});
          }
          break;
      case '5':
          if(wx.getStorageSync('userToken')) {
            wx.setStorageSync('currentPage', '我的');wx.navigateTo({url:"mybroker"});break;//我的经纪人
          }else{
            wx.showModal({content: '用户未登录'});
          }
          break;
      case '6' : 
          if(wx.getStorageSync('userToken')) {
            wx.navigateTo({url:"comment"});//我的评论
          }else{
            wx.showModal({content: '用户未登录'});
          }
          break;
      case '7':
          if (wx.getStorageSync('userToken')) {
            wx.navigateTo({ url: "suggest" });//意见反馈
          } else {
            wx.showModal({ content: '用户未登录' });
          }
          break;
      case '8':wx.navigateTo({url:"../h5Pages/h5Pages?redirect=https://custh5s.shyj.cn/about/aboutus.html"});break;//关于我们
      case '9':
          if(wx.getStorageSync('userToken')) {
            wx.navigateTo({url:"collection1"});break;//二手房收藏
          }else{
            wx.showModal({content: '用户未登录'});
          }
          break;
      case '10':
          if(wx.getStorageSync('userToken')) {
            wx.navigateTo({url:"collection2"});//租房收藏
          }else{
            wx.showModal({content: '用户未登录'});
          }
          break;
      case '11':
          if(wx.getStorageSync('userToken')) {
            wx.navigateTo({url:"collection3"});//经纪人收藏
          }else{
            wx.showModal({content: '用户未登录'});
          }
          break;
      case '12':
          if(wx.getStorageSync('userToken')) {
            wx.navigateTo({url:"collection4"});//小区收藏
          }else{
            wx.showModal({content: '用户未登录'});
          }
          break;         
    }
  },
  //二手房收藏数量
  //租房收藏数量
  //经纪人收藏数量
  //小区收藏数量
  getMyInfo() {
    let params = {"unicode": wx.getStorageSync("userToken")};
    utils.get(Api.IP_MYINFO,params)
    .then(data=>{
      data.data.custServerPhone = data.data.custServerPhone.slice(0,4)+"-"+data.data.custServerPhone.slice(4);
      let userInfo2 = wx.getStorageSync('userInfo2');
      if(userInfo2) {
        data.data.headImage = JSON.parse(userInfo2).avatarUrl;
        data.data.mobile = JSON.parse(userInfo2).nickName;
      }
      this.setData({myInfo: data.data});  
    })
  },
  onShow() {
    //刷新页面数据
    if(wx.getStorageSync("userToken")) this.getMyInfo();
  },
  onHide() {
    //回到顶部
    wx.pageScrollTo({scrollTop: 0, duration: 0});
  }
})