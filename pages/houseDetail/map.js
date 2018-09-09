var bmap = require('../../libs/bmap-wx.min.js');
var wxMarkerData = [];
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    markers: [],
    covers: [],
    latitude: '',
    longitude: '',
    placeData: {},
    info: {},
  },
  makertap(e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
    that.changeMarkerColor(wxMarkerData, id);
  },
  onLoad(options) {
    let obj = JSON.parse(options.obj);
    this.setData({info: obj.houseDetail});
    let name = obj.houseDetail.buildName||obj.houseDetail.houseTitle;
    let desc = obj.houseDetail.areaName;
    var BMap = new bmap.BMapWX({ak: '55An9ZpRGSA8v5Mw7uHxmONFCI3mkTW0'});
    var fail = function (data) {console.log(data)};
    var success = (data)=> {
      wxMarkerData = data.wxMarkerData;
      wxMarkerData = [{
        latitude: obj.latitude,
        longitude: obj.longitude,
        name: name,
        desc: desc,
      }];
      var covers = [{
        latitude: obj.latitude,
        longitude: obj.longitude,
        iconPath: '../../images/location.png',
        rotate: 15
      }]

      this.setData({
        latitude: obj.latitude,
        longitude: obj.longitude,
        covers: covers
      });
    }
    BMap.search({
      "query": '地铁',
      fail: fail,
      success: success,
      iconPath: '../../images/metro.png',
      iconTapPath: '../../images/metro.png'
    });
  },
  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      placeData: {
        title: '名称：' + data[i].title + '\n',
        address: '地址：' + data[i].address + '\n',
        telephone: '电话：' + data[i].telephone
      }
    });
  },
  changeMarkerColor: function (data, id) {
    var that = this;
    var markersTemp = [];
    for (var i = 0; i < data.length; i++) {
      if (i === id) {
        data[i].iconPath = "../../images/metro.png";
      } else {
        data[i].iconPath = "../../images/metro.png";
      }
      markersTemp[i] = data[i];
    }
    that.setData({
      markers: markersTemp
    });
  },
  navMap() {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: 15,
      name: this.data.info.buildName||this.data.info.houseTitle,
      desc: this.data.info.areaName
    })
  }
})