// pages/mine/delegation.js
Page({
  data: {
     lookmore: '查看详情',
     drop: 'rotate(0deg)', //三角
     showflag: false
  },
  onLoad(options) {

  },
  moreopitons( ) {
    if (this.data.showflag) {
      this.setData({
        lookmore: '查看详情',
        drop: 'rotate(180deg)',
        showflag: false
      })
    }else{
      this.setData({
        lookmore: '',
        drop: 'rotate(0deg)',
        showflag: true
      })
    }
    
  }

})