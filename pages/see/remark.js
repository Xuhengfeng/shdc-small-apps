// pages/see/remark.js
Page({
  data: {
    num: 1,
    tags: [1,1,1,1,1,1,1,11111,11,1,1,1]
  },
  onLoad(options) {
  
  },
  selectItem(e) {
    console.log(e.target.dataset.index)
    this.setData({num: e.target.dataset.index})    
  },
  
})