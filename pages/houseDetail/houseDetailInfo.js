Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',//房源详情介绍
    title: ''
  },
  onLoad(options) {
    console.log(options.content)
    this.setData({
      content: options.content,
      title: options.title
    })
  }
})