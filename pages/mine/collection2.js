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
    utils.get(Api.IP_RENTCOLLECTIONLIST, params)
    .then(data => {
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
        this.statusParse(item, item.status);
      })
      console.log(data.data)
      this.setData({houseList: data.data})
    })
  },
  //状态检测
  statusParse(item, num) {
    console.log(item, num)
    switch(num){
      case 0:item.status="正常";break;//正常
      case 1:item.status="已售";break;//已售
      case 2:item.status="已失效";break;//已失效
      case 3:item.status="已停售";break;//已停售
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