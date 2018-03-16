// pages/index/hotHouse.js
Page({
  data: {
    houseList: [1,1,1,1,1],
    //热门小区  小区二手房
    contentType: null
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.title,
    })
    if(options.title == '小区二手房') {
      this.setData({contentType: 22});
    }else{
      this.setData({contentType: 11});
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})