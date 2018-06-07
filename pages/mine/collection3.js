const Api = require("../../utils/url");
const utils = require("../../utils/util");
const filter = require("../../utils/filter");

Page(filter.loginCheck({
  data: {
    isOriginHouse: true,//是否原始房源
    houseList: [],
    showload: false,
    num: 0,
    currentCity: null,
    page: 1,
  },
  onLoad() {
    utils.storage('selectCity')
    .then((res)=>{
      this.setData({currentCity: res.data.value})
    })
    this.getDataFromServer(0);    
  },
  getDataFromServer(num) {
    let params = {pageNo: 1,unicode: wx.getStorageSync("userToken")}
    utils.get(Api.IP_MYBROKERSCOLLECTIONLIST, params)
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
  //状态检测
  statusParse(item, num) {
    switch(num){
      case 0:item.status="正常";break;//正常
      case 1:item.status="已离职";break;//已售
    }
  },
  onReachBottom() {
    let params = {
      scity: this.data.currentCity,
      pageNo: this.data.page++,
      unicode: wx.getStorageSync("userToken")
    }
    utils.get(this.data.IPS[this.data.num], params)
    .then(data => {
      //修正数据
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
      })
      this.setData({ houseList: this.data.houseList.concat(data.data)})
    })
  }
}));