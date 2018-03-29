Page({
  data: {
    select: [
      {name: 'one', value: '我要出售', checked: 'true' },
      {name: 'two', value: '我要出租' },
    ],
    region: ['广东省', '广州市', '海珠区'],
    year: ['2018','2019'],
    month: ['1月','2月','3月'],
    day: [1,2,3,4],
    hiddenPicker: true
  },
  bindRegionChange(e) {//预定义城市控件
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  showOwnPicker() {//自定义城市控件
    this.setData({
      hiddenPicker: !this.data.hiddenPicker
    })
  },
  cancelBtn() {
    this.setData({
      hiddenPicker: !this.data.hiddenPicker
    })
  },
  confirmBtn() {
    this.setData({
      hiddenPicker: !this.data.hiddenPicker
    })
  },
  bindChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
  }
})