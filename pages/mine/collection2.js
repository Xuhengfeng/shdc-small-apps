const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    houseList: [],
    showload: false,
    num: 0,
    currentCity: null,
    page: 1,
    hasMore: false,
    startX: 0,//手指起始位置
  },
  onLoad() {
    utils.storage('selectCity')
    .then((res)=>{
      this.setData({currentCity: res.data.value})
      this.onReachBottom();    
    })
  },
  touchS(e){
    if (e.touches.length == 1) {
      this.setData({startX: e.touches[0].clientX});
    }
  },
  touchM(e) {
    this.data.houseList.forEach(item =>{
      item.isMove = false;
    })
    if (e.touches.length == 1) {
        //手指移动时水平方向位置
        let moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值
        let disX = this.data.startX - moveX;
        let delBtnWidth = this.data.delBtnWidth;
        let flag = false;
        if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
          flag = false;
        }
        else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
          flag = true;
        }
        //获取手指触摸的是哪一项
        let index = e.currentTarget.dataset.index;
        let houseList = this.data.houseList;
        houseList[index].isMove = flag;
        //更新列表的状态
        this.setData({houseList: houseList});
    }
  },
  touchE(e){
    this.touchM(e);
  },
  delItem(e){
    let params = {"unicode": wx.getStorageSync("userToken"),"scity": this.data.currentCity};
    utils.post(Api.IP_RENTCOLLECTIONCANCEL + this.data.currentCity + '/' + e.currentTarget.dataset.id, params)
    .then(data => {
      this.onShow()
    });
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
  onShow() {
    //修正
    this.data.houseList=[];
    this.data.page = 1;
    this.onReachBottom();
  }
});