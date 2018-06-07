const Api = require("../../utils/url");
const utils = require("../../utils/util");
const filter = require("../../utils/filter");

Page(filter.loginCheck({
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
      this.getDataFromServer();    
    })
  },
  getDataFromServer() {
    let params = {pageNo: 1,unicode: wx.getStorageSync("userToken")}
    utils.get(Api.IP_COLLECTIONLIST, params)
    .then(data => {
      data.data.forEach((item) => {
        try{
          item.houseTag = item.houseTag.split(',');
        }catch(err){
          console.log(err);
        }
      })
      this.setData({houseList: this.data.houseList.concat(data.data)});
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
      //修正数据
      data.data.forEach((item) => {item.houseTag = item.houseTag.split(',')});
      this.setData({ houseList: this.data.houseList.concat(data.data)});
    })
  }
}));