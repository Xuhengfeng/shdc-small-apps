const Api = require("../../utils/url");
const utils = require("../../utils/util");
const filter = require("../../utils/filter.js");
let app = getApp();

Page(filter.loginCheck({
  data: {
    selectFlag1: true,//出售
    selectFlag2: false,//出租    
    phcolorFlag: true,//城市
    phcolorFlag2: true,//经纪人
    phcolorFlag3: true,//小区
    phcolorFlag4: true,//房源信息 
    city: '请选择您房源所在城市',
    broker: '请选择跟进联系人',
    houseRimName: '房源所在的小区',
    houseInfoContent: '房源信息',
    houseRimId: '',//房源小区id
    brokerId: '',
    selectCity: '',//当前的定位城市

    requestType: ['RENT', 'SELL'],
    //出售 出租
    IPS: [Api.IP_HOUSEENTRUSTAPPLYSELLHOUSE, Api.IP_HOUSEENTRUSTAPPLYRENTHOUSE],
    num: 0,

    inputValue1: '',//姓名
    inputValue2: '',//电话
    // inputValue3: '',//小区
    // inputValue4: '',//栋座
    // inputValue5: '',//单元号
    inputValue6: '',//房号
    inputValue7: '',//具体地址

    banner: ''
  },
  onLoad() {
    utils.storage('selectCity')
    .then(res=>{
      this.setData({selectCity: res.data.vlaue});
      this.bannerRequest(0);
    })
  },
  bannerRequest(num) {
    //banner 出租 出售
    let types = ['WILL_HOUSE_SELL_BANNER', 'WILL_HOUSE_RENT_BANNER']
    utils.get(Api.IP_INDEXCONSULT + this.data.selectCity + '/' + types[num])
    .then(data=>{
      this.setData({ banner: data.data });
    })
  },
  //输入姓名
  bindKeyInput1(e) {
    this.setData({inputValue1: e.detail.value});
  },
  //输入电话
  bindKeyInput2(e) {
    this.setData({inputValue2: e.detail.value});
  },
  //输入房号
  bindKeyInput6(e) {
    this.setData({inputValue6: e.detail.value})
  },
  //输入具体地址
  bindKeyInput7(e) {
    this.setData({inputValue7: e.detail.value})
  },
  //出售
  selectOne() {
    this.setData({selectFlag1: true,selectFlag2: false,num: 0});
    this.bannerRequest(0);
  },
  //出租
  selectTwo() {
    this.setData({selectFlag1: false,selectFlag2: true,num: 1});
    this.bannerRequest(1);
  },
  //城市
  jumpCityList() {
    wx.navigateTo({url: '../location/location?origin=sellRent'});
  },
  //经纪人
  jumpBrokerList() {
    wx.navigateTo({url: 'broker'});
  },
  //房源所在的小区
  houseRim() {
    wx.navigateTo({url: `sellRentArea?houseTypes=${this.data.num}`});
  },
  //房源信息
  houseInfo() {
    wx.navigateTo({url: `sellRentArea1?houseRimId=${this.data.houseRimId}`});
  },
  //提交
  commit(IP) {
      wx.showLoading({
        title: '加载中...'
      })
      let params = {
        "cityCode": this.data.city,//城市编码
        "brokerId": this.data.brokerId,//经纪人id
        "linkman": this.data.inputValue1,//姓名
        "phone": this.data.inputValue2,//联系电话
        "buildingName": this.data.houseRimName,//小区名字
        "buildNum": this.data.inputValue4,//栋号
        "unitNum": this.data.inputValue5,//单元号
        "roomNum": this.data.inputValue6,//房号
        "address": this.data.inputValue7,//详细地址
      }
    

      if (this.data.inputValue1 == '' ||
          this.data.inputValue2 == '' ||
          this.data.inputValue3 == '' ||
          this.data.inputValue4 == '' ||
          this.data.inputValue5 == '' ||
          this.data.inputValue6 == '' ||
          this.data.inputValue7 == '' ){
          wx.showModal({
            title: '信息不能为空!'
          })
      }else{
        let params = {"unicode": wx.getStorageSync("userToken")};
        utils.post(this.data.IPS[this.data.IPSnum],params)
        .then(data=>{});
      }
  }
}))