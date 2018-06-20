const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    houseList: [],
    showload: false,
    num: 0,
    currentCity: null,
    page: 1,
    hasMore: false,
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
      case 1:item.status="已售";break;//已售
      case 2:item.status="已失效";break;//已失效
      case 3:item.status="已停售";break;//已停售
    }
  },
  onReachBottom() {
    this.setData({hasMore: true});
    let params = {
      scity: this.data.currentCity,
      pageNo: this.data.page++,
      unicode: wx.getStorageSync("userToken")
    }
    utils.get(Api.IP_RENTCOLLECTIONLIST, params)
    .then(data => {
      data.data.forEach((item) => {
        try{
          item.houseTag = item.houseTag.split(',');
          this.statusParse(item, item.status);
        }catch(err){}
      })
      this.setData({hasMore: false});
      this.setData({ houseList: this.data.houseList.concat(data.data)})
    })
  },
  //缓存房源类型 可以改变的 
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value)
  },
  zufang(e) {
    this.cacheHouseType('租房');
    wx.navigateTo({url: "../houseDetail/houseDetail3?id="+e.currentTarget.dataset.id+"&scity="+e.currentTarget.dataset.scity});
  },
});