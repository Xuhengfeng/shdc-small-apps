Page({
  data: {
    isLoding: true,//正在为你安排经纪人
    isCancel: false,//取消中 正常显示样式
    isShadow: false,//取消对话框
    //显示对应的进度
    show3: true,
    show2: true,
    show1: true,
    itemIndex: 0,//判断是那个跳转进来的
  
  },
  onLoad(options) {
    
  },
  //取消预约
  cancelOrder() {
    this.setData({isShadow: true});
  },
  //取消预约 确定
  OrderConfirm() {
    let flag = 'houseList['+this.data.itemIndex+'].isCancel';
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
        prevPage.setData({[flag]: true});
    this.setData({isCancel: true,isShadow: false});
    wx.navigateBack();
  },
  //取消预约 取消
  OrderCancel() {
    this.setData({isCancel: false,isShadow: false});
  },
  //查看房源
  seeHouse() {
    wx.navigateTo({url: 'house'});
  }
})