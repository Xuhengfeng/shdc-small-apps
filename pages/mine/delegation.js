// IP_BROKEREVALUATE
const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
     lookmore: '查看详情',
     showflag: false,
     isCancel: true,
     isPublish: false,//发布
     isCheck: true,//核实
     isMore: true,//更多
     flagName: '卖房',
     isShadow: false,
     requestId: null,//申请id
     IPS: [Api.IP_ENTRUSTSELL,Api.IP_ENTRUSTRENT],//卖房 租房
     num: 0,
  },
  onLoad(options) {
    this.setData({flagName: options.flagName, num: options.num, requestId: options.id});
    this.entrustRequest();
  },
  //更多
  lookmore( ) {
    if (this.data.isMore) {
      this.setData({
        lookmore: '查看详情',
        isMore: false
      })
    }else{
      this.setData({
        lookmore: '',
        isMore: true
      })
    }
  },
  //委托详情
  entrustRequest() {
    utils.get(this.data.IPS[this.data.num]+this.data.requestId)
    .then(data=>{
      console.log(data)
    })
  },
  //取消委托 卖房 租房
  cancelOrder() {
    this.setData({isShadow: true});
  },
  //取消预约 确定
  OrderConfirm() {
    // let params = {
    //   "cancelCause": this.data.content,
    //   "id": this.data.seeHouseId,
    //   "unicode": wx.getStorageSync("userToken"),
    //   "scity": this.data.currentCity
    // }
    // utils.post(Api.IP_ORDERCANCEL, params)
    // .then(data=>{
    //   let pages = getCurrentPages();//当前页面
    //   let prevPage = pages[pages.length - 2];//上一页面
    //       prevPage.onLoad();
    //   wx.navigateBack();
    // })
  },
  //取消委托 卖房 租房
  OrderCancel() {
    this.setData({isCancel: false,isShadow: false});
  },
})