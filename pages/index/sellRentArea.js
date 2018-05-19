const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    estate: [],//小区
    keyword: null,//关键词
    params: {
      "areaId": 0,
      "businessType": null,
      "districtId": 0,
      "houseType": null,
      "keyword": null,
      "maxSellPrice": 0,
      "minSellPrice": 0,
      "pageNo": 0,
      "pageSize": 0,
      "scity": null,
      "useYear": null
    },
    currentCity: null,//当前城市
    houseTypes: 0,//租房 或 售房
  },
  onLoad(options) {
    this.setData({houseTypes: options.houseTypes});
    utils.storage('selectCity2')
    .then(data=>{
      this.setData({currentCity:data.data.value});
      let params = {pageNo:1,scity:data.data.value};
      this.selectItemRequest(params);
    })
    .catch(error=>{
      wx.showModal({
        content:'请先选着城市',
        success: (res)=>{
          res.confirm&wx.navigateBack();
        }
      })
    })
  },
  //小区请求
  selectItemRequest(params) {
    utils.post(Api.IP_BUILDINGLIST,params)
    .then(data=>{
      this.setData({estate: data.data});
    })
  },
  //选着小区
  selectItem(e){
    let target = e.currentTarget.dataset.item;
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({houseRimName: target.buildName,houseRimId: target.id,phcolorFlag3:false,houseInfoContent: '房源信息'});
    wx.setStorage({key:'sellRentXiaoQu',data: target.buildName});
    wx.navigateBack();
  },
  //获取用户输入关键字
  userSearch(e) {
    this.setData({ keyword: e.detail.value })
  },
  //点击icon搜索 或 确定按钮
  startsearch() {
    this.searchSubmit();
  },
  //键盘回车搜索
  searchSubmit() {
    if (!this.data.keyword) {
      wx.showModal({ content: '请输入关键词' });
    } else {
      let params = {
        keyword: this.data.keyword,
        pageNo: 1,
        scity: this.data.currentCity
      }
      this.selectItemRequest(params)
    }
  },
})