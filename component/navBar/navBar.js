// component/navBar/navBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {//传递数据
    label: {
      type: Object,
      value: ''
    },
    area: {//区域
      type: Object,
      value: ''
    },
    houseType: {//户型
      type: Object,
      value: ''
    },
    price: {//价格
      type: Object,
      value: ''
    },
    proportion: {//面积
      type: Object,
      value: ''
    },
    mode: {//类型
      type: Object,
      value: ''
    }

  },
  /**
   * 组件的初始数据
   */
  data: {
    houseList: [],//房源列表
    num: null,//控制nav菜单
    page: 1,
    isScroll: true,
    showModalStatus: false,//遮罩层
    scrollTop: 0,
    togglelabel: true,
    houseDetail: null,//二手房(买房)、租房、小区
    navHeight: null,
    areaCategories: 0,//区域分类
  },
  ready() {
    this.getRect();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selectItem(e) {//控制nav菜单
      this.setData({
        num: e.target.dataset.index,
        isScroll: false,
        showModalStatus: true,
      });
      //this.util();//开启动画
      this.triggerEvent('myevent', this.data)
    },
    pricelabel(e) {//价格标签 筛选
      console.log(e.target.dataset.num)
    },
    cancelModal(e) {//取消
      this.setData({
        num: null,
        isScroll: true,
        showModalStatus: false
      })
    },
    refresh() {
      console.log('下拉刷新..')
    },
    loadMore() {
      this.setData({ page: this.data.page + 1 })
      console.log("上拉加载更多" + this.data.page)
      this.getDataFromServer(this.data.page)
    },
    getRect() {
      wx.createSelectorQuery().select('#mynav').boundingClientRect((rect) => {
        this.setData({
          navHeight: rect.height
        })
      }).exec()
    },
    getDataFromServer(page) {//请求
      this.setData({
        loading: false,
        hasMore: true
      })
      app.httpClient(API_URL + page, (error, data) => {
        if (data.retCode == 200) {
          this.setData({
            caiItems: data.result.list,
            loading: true,
            hasMore: false
          })
          console.log(this.data.caiItems)
        } else {
          console.log('服务器异常')
        }
      })
    },
    util() {
      var that = this;
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease-in",
        transformOrigin: "0 0 0",
        delay: 0
      });
      this.animation = animation;
      // 第3步：执行第一组动画  
      animation.translateY(-35).step();
      // 第4步：导出动画对象赋给数据对象储存  
      this.setData({
        animationData: animation.export()
      })
      // 第5步：设置定时器到指定时候后，执行第二组动画  
      setTimeout(function () {
        // 执行第二组动画  
        let num = that.data.navHeight?that.data.navHeight : 35;
        animation.translateY(num).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
        this.setData({animationData: animation});
      }.bind(this), 200)
    },
    changeCategories(e) {//切换城区分类
      this.setData({
        areaCategories: e.target.dataset.index
      })
    }
  }
})


  
  
