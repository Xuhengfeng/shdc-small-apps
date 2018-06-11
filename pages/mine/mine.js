const Api = require("../../utils/url");
const utils = require("../../utils/util");
const filter = require("../../utils/filter");


Page(filter.loginCheck({
  data: {
    showLogout: false,
    nickName: null,
    avatarUrl: null,
    myInfo: null
  },
  onLoad() {
    this.getMyInfo();
    try {
      let value = wx.getStorageSync('userInfo2');
      if (value) {
        let data = JSON.parse(value);
        this.setData({
          showLogout: data.showLogout,
          nickName: data.nickName,
          avatarUrl: data.avatarUrl
        })
      }
    } catch (e) {
    }
  },
  //拨打电话
  telphone() {
    wx.makePhoneCall({phoneNumber: this.data.myInfo.custServerPhone});
  },
  //登录
  login() {
    if(!wx.getStorageSync('userToken')) {
      wx.navigateTo({url: 'login'})
    }
  },
  //退出
  logout() {
    this.setData({
      showLogout: false,
      nickName: null,
      avatarUrl: null
    })
    wx.removeStorageSync('userToken');
    wx.removeStorageSync('userInfo2');
  },
  //跳转
  active(e) {
    let num = e.currentTarget.dataset.num;
    switch(num){
      case '1':wx.navigateTo({url:"collection"});break;//委托
      case '2':wx.navigateTo({url:"mybuyhouse?title=我的卖房&num=0"});break;//卖房
      case '3':wx.navigateTo({url:"mybuyhouse?title=我的租房&num=1"});break;//租房
      case '5':wx.setStorageSync('currentPage', '我的');wx.navigateTo({url:"mybroker"});break;//我的经纪人
      case '6':wx.navigateTo({url:"comment"});break;//我的评论
      case '7':wx.navigateTo({url:"suggest"});break;//意见反馈
      case '8':wx.navigateTo({url:"../h5Pages/h5Pages?redirect=http://www.baidu.com"});break;//关于我们
      case '9':wx.navigateTo({url:"collection1"});break;//二手房收藏
      case '10':wx.navigateTo({url:"collection2"});break;//租房收藏
      case '11':wx.navigateTo({url:"collection3"});break;//经纪人收藏
      case '12':wx.navigateTo({url:"collection4"});break;//小区收藏
    }
  },
  //二手房收藏数量
  //租房收藏数量
  //经纪人收藏数量
  //小区收藏数量
  getMyInfo() {
    let params = {
      "unicode": wx.getStorageSync("userToken")
    }
    utils.get(Api.IP_MYINFO,params)
    .then(data=>{
      data.data.custServerPhone = data.data.custServerPhone.slice(0,4)+"-"+data.data.custServerPhone.slice(4);
      this.setData({myInfo: data.data});
    })
  }
}))