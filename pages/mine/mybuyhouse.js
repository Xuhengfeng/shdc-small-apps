const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    IPS: [Api.IP_SELLAPPLYLIST,  Api.IP_RENTAPPLYLIST],//我的卖房列表 我的租房列表
    num: 0,
    currentCity: null,
    houseRequestList: [],
    page: 1,
    statusName: '',
    isStatus: true
  },
  onLoad(options) {
    wx.setNavigationBarTitle({title: options.title});
    this.setData({num: options.num});
    utils.storage('selectCity')
    .then(res=>{
      this.setData({currentCity: res.data.value});
      this.onReachBottom(1)
    })
  },
  //我的卖房 我的租房
  houseListRequest(page) {
    let params = {
      unicode: wx.getStorageSync("userToken"),
      scity: this.data.currentCity
    }
    utils.get(this.data.IPS[this.data.num]+"?pageNo="+ page ,params)
    .then(data=>{
      data.data.forEach(item => {
         item.applicationTime1 = item.applicationTime.split(' ')[0];
         switch(item.status){
           case 'ZERO':(item.statusName='申请中',item.isStatus=true);break;
           case 'ONE':(item.statusName='核实中',item.isStatus=true);break;
           case 'TWO':(item.statusName='已发布',item.isStatus=true);break;
           case 'CANCEL':(item.statusName='已取消',item.isStatus=true);break;
         }
      });
      this.setData({houseRequestList: data.data});
    })
  },
  //上拉加载
  onReachBottom(pageNo) {
    var pageNo = this.data.page++;
    this.houseListRequest(pageNo);
  },
  //点击选着
  selectItem(e) {
    wx.navigateTo({url:"delegation?id="+e.currentTarget.dataset.id+"&num="+this.data.num});
  }
})