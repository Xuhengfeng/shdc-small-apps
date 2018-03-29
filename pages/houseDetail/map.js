var bmap = require('../../libs/bmap-wx.min.js');
var wxMarkerData = [];
Page({
  data: {
    markers: [],
    covers: [],
    latitude: '',
    longitude: '',
    placeData: {}
  },
  makertap(e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
    that.changeMarkerColor(wxMarkerData, id);
  },
  onLoad(options) {
    console.log(options)
    var BMap = new bmap.BMapWX({
      ak: '55An9ZpRGSA8v5Mw7uHxmONFCI3mkTW0'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = (data)=> {
      console.log(data)
      wxMarkerData = data.wxMarkerData;
      wxMarkerData = [{
        latitude: options.latitude,
        longitude: options.longitude,
        name: 'T.I.T 创意园',
        desc: '我现在的位置'
      }];
      var covers = [{
        latitude: options.latitude,
        longitude: options.longitude,
        iconPath: '../../images/location.png',
        rotate: 10
      }]

      this.setData({
        // markers: wxMarkerData,
        latitude: options.latitude,
        longitude: options.longitude,
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
      latitude: parseInt(this.data.latitude),
      longitude: parseInt(this.data.longitude),
      scale: 18,
      name: 'T.I.T 创意园',
      desc: '我现在的位置'
    })
  }
})