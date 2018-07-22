const Api = require("../../utils/url");
const utils = require("../../utils/util");
const filter = require("../../utils/filter");

Page({
  data: {
    houseList: [],
    showload: false,
    currentCity: null,
    page: 1,
  },
  onLoad() {
    utils.storage('selectCity')
    .then((res)=>{
      this.setData({currentCity: res.data.value});
      this.onReachBottom();    
    })
  },
  onReachBottom() {
    let params = {
      scity: this.data.currentCity,
      pageNo: this.data.page++,
      unicode: wx.getStorageSync("userToken")
    }
    utils.get(Api.IP_COLLECTIONLIST, params)
    .then(data => {
      data.data.forEach((item) => {
        try{
          item.houseTag = item.houseTag.split(',');
        }catch(err){}
      })
      this.setData({houseList: this.data.houseList.concat(data.data)});
    })
  },
  //缓存房源类型 可以改变的 
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value)
  },
  xiaoqu(e) {
    this.cacheHouseType('小区');
    wx.navigateTo({url: "../houseDetail/houseDetail2?id="+e.currentTarget.dataset.id+"&scity="+e.currentTarget.dataset.scity});
  },
  onShow() {
    //修正
    this.data.houseList=[];
    this.data.page = 1;
    this.onReachBottom();
  }
});