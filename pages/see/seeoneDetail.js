Page({
  data: {
    isLoding: true,//正在为你安排经纪人
    isCancel: false,//取消中 正常显示样式
    isShadow: false,//取消对话框
    //显示对应的进度
    show3: true,
    show2: true,
    show1: true,
  
  },
  onLoad(options) {
    
  },
  //取消预约
  cancelOrder() {
    this.setData({isShadow: true});
  },
  //取消预约 确定
  OrderConfirm() {
    // wx.navigateBack();
    this.setData({isCancel: true,isShadow: false});
  },
  //取消预约 取消
  OrderCancel() {
    this.setData({isCancel: false,isShadow: false});
  },
})