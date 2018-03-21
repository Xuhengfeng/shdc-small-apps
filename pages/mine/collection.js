var filter = require("../../utils/filter.js");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page(filter.loginCheck({
  data: {
    tabs: ["买房", "租房", "小区"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
  },
  onLoad() {
    console.log(123213213)
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
}));