// component/navBar/navBar.js
Component({
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
    },
    num: {//控制nav菜单
      type: Number,
      value: 5
    },
    showModalStatus: {//遮罩层
      type: Boolean,
      value: false
    }
   },
  /**
   * 组件的初始数据
   */
  data: {
    houseList: [],//房源列表
    page: 1,
    isScroll: true,
    scrollTop: 0,
    togglelabel: true,
    houseDetail: null,//二手房(买房)、租房、小区
    navHeight: null,
    areaCategories: 0,//区域分类
    areaSubCategories: 0,//区域子分类
    houseTypeCategories: 0,//户型
    priceCategories: 0,//价格
    modeCategories: 0,//类型
    proportionCategories: 0,//面积
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
    },
    pricelabel(e) {//价格标签 筛选
      console.log(e.target.dataset.num)
    },
    cancelModal(e) {//取消
      this.setData({
        num: 5,
        isScroll: true,
        showModalStatus: false
      })
      this.triggerEvent('myevent', this.detail)
    },
    refresh() {
      console.log('下拉刷新..')
    },
    loadMore() {
      this.setData({ page: this.data.page + 1 })
      console.log("上拉加载更多" + this.data.page)
      this.getDataFromServer(this.data.page)
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
    //区域
    changeCategories(e) {//切换城区分类
      this.setData({
        areaCategories: e.target.dataset.num,
        areaSubCategories: 0,
        scrollTop: 0
      })
    },
    changeSubCategories(e) {//切换城区子分类
      this.setData({
        areaSubCategories: e.target.dataset.num
      })
    },
    //户型
    changeHouseType(e) {
      this.setData({
        houseTypeCategories: e.target.dataset.num
      })
    },
    //价格
    pricelabel(e) {
      this.setData({
        priceCategories: e.target.dataset.num
      })
    },
    //面积
    proportionlabel(e) {
      this.setData({
        proportionCategories: e.target.dataset.num
      })
    },
    //类型
    modelabel(e) {
      this.setData({
        modeCategories: e.target.dataset.num
      })
    }
  }
})


  
  
