var Api = require("../../utils/url");
const app = getApp();

Page({
  data: {
    select: [
      {name: 'one', value: '我要出售', checked: 'true' },
      {name: 'two', value: '我要出租' },
    ],
    city: '请选择您房源所在城市',
    phcolorFlag: true,
    selectFlag: true,
    year: ['2018','2019'],
    month: ['1月','2月','3月'],
    day: [1,2,3,4],
    hiddenPicker: true,
    // 售租
    requestType: ['RENT', 'SELL'],
    IPS: [Api.IP_HOUSEENTRUSTAPPLY, Api.IP_HOUSEENTRUSTAPPLYLIST],
    IPSnum: 0
  },
  jumpCityList() {
    wx.navigateTo({
      url: '../location/location?origin=sellRent',
    })
  },
  cancelBtn() {
    this.setData({
      hiddenPicker: !this.data.hiddenPicker
    })
  },
  selectOne() {
    
  },
  selectTwo() {

  },
  confirmBtn() {
    this.setData({
      hiddenPicker: !this.data.hiddenPicker
    })
  },
  bindChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
  },
  selectItem(e) {
    this.setData({
      IPSnum: e.target.dataset.index
    })
  }
})