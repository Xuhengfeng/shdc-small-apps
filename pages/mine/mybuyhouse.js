// pages/mine/mybuyhouse.js
Page({
  data: {
    num: 'false'
  },
  onload() {

  },
  testClick(e) {
    console.log( e.currentTarget.dataset.num)
    this.setData({
      num: e.currentTarget.dataset.num
    })
  }
})