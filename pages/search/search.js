Page({
  data: {
    item: '二手房',//显示选中的
    num: 0,//控制item样式
    flag: false,//控制option显隐
    selectItem: ['二手房', '租房', '小区'],
    history: [],
    keyword: null,//获取用户输入值
  },
  onLoad() {
    // 缓存类型
    wx.setStorage({
      key: 'houseTypeSelect',
      data: this.data.selectItem[0]
    })

    wx.getStorage({//取缓存
      key: 'history',
      success: res => {
        this.setData({history: res.data})
      }
    })
  },
  Item() {//点击下拉选项显隐
    this.setData({
      flag: true
    })
  },
  selectItem(e) {//点击下拉选项操作
    this.setData({
      num: e.target.dataset.index,
      item: e.target.dataset.item,
      flag: false
    })
    // 缓存类型
    wx.setStorage({
      key: 'houseTypeSelect',
      data: this.data.item
    })
  },
  startsearch() {//点击icon搜索
    if (!this.data.keyword) {
      wx.showModal({
        content: '请输入关键词',
        success: (res)=> {
          if(res.confirm) {
            console.log('用户点击确定')
          }else if(res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }else{
      if(this.data.history.length <= 5) {
        if(this.data.history.indexOf(this.data.keyword) == -1) {
          this.data.history.unshift(this.data.keyword);
        }
      }else{
        this.data.history.unshift(this.data.keyword);
        this.data.history.pop();
      }
      this.setData({history: this.data.history})
      wx.setStorage({
        key: 'history',
        data: this.data.history,
        success: ()=> {
          wx.navigateTo({
            url: "../../pages/searchList/searchList?keywords=" + this.data.keyword + "&houseType=" + this.data.selectItem[this.data.num]
          })
        }
      })
      
    } 
  },
  cancelBtn() {//取消
    this.setData({inputTxt: null})
    wx.navigateBack();
  },
  userSearch(e) {//用户输入关键字
    this.setData({
      keyword: e.detail.value,
    })
  },
  historyLabel(e) {//历史纪录点击
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    wx.navigateTo({
      url: "../../pages/searchList/searchList?keywords=" + e.target.dataset.item+"&houseType=" + this.data.selectItem[this.data.num]
    })
  },
  searchSubmit() {
    this.startsearch();
  }
})