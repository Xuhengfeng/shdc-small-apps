// IP_BROKEREVALUATE
const Api = require("../../utils/url");
const utils = require("../../utils/util");
const filter = require("../../utils/filter.js");

Page(filter.loginCheck({
  data: {
     lookmore: '查看详情',
     showflag: false,
     isCancel: true,//委托取消
     isRequest: false,//申请中
     isCheck: false,//核实中
     isPublish: false,//已发布
     isMore: true,//更多
     flagName: '卖房',
     isShadow: false,
     requestId: null,//申请id
     IPS: [Api.IP_ENTRUSTSELL,Api.IP_ENTRUSTRENT],//卖房 租房
     num: 0,
     currentCity: null,
     dataDetail:null,
  },
  onLoad(options) {
    this.setData({flagName: options.flagName, num: options.num, requestId: options.id});
    utils.storage('selectCity')
    .then(res=>{
      this.setData({currentCity: res.data.value});
      this.entrustRequest();
    })
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
    console.log(1111111)
    let params = {
      unicode: wx.getStorageSync("userToken"),
      scity: this.data.currentCity
    }
    utils.get(this.data.IPS[this.data.num]+this.data.requestId,params)
    .then(data=>{
      console.log(data)
      let status = data.data.status;
      this.setData({dataDetail: data.data});
      this.statusParse(status);
    })
  },
  //状态检测
  statusParse(status) {
    switch(status){
      case 'ZERO':this.setData({isRequest: true});break;//申请中
      case 'ONE':this.setData({isRequest: true,isCheck: true});break;//核实中
      case 'TWO':this.setData({isCheck: true,isPublish: true});break;//已发布
      case 'CANCEL':this.setData({isCancel: false});break;//取消
    }
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
}))