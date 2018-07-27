const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    brokers: [],
    showload: false,
    num: 0,
    currentCity: null,
    page: 1,
  },
  onLoad() {
    utils.storage('selectCity')
    .then((res)=>{
      this.setData({currentCity: res.data.value})
      this.onReachBottom();    
    })
  },
  //状态检测
  statusParse(item, num) {
    switch(num){
      case 0:item.status="正常";break;//正常
      case 1:item.status="已离职";break;//已售
    }
  },
  brokerDetial(e) {
    console.log(e.currentTarget.dataset.item)
    let item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({url: `./brokterInfo?item=${item}`});
  },
  onReachBottom() {
    this.setData({hasMore: true});    
    let params = {
      scity: this.data.currentCity,
      pageNo: this.data.page++,
      unicode: wx.getStorageSync("userToken")
    }
    utils.get(Api.IP_MYBROKERSCOLLECTIONLIST, params)
    .then(data => {
      data.data.forEach((item) => {
        try{
          item.houseTag = item.houseTag.split(',');
        }catch(err){}
      })
      this.setData({hasMore: false});
      this.setData({brokers: this.data.brokers.concat(data.data)});
    })
  },
  onShow() {
    //修正
    this.data.brokers=[];
    this.data.page = 1;
    this.onReachBottom();
  }
});