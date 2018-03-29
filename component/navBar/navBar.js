var Api = require("../../utils/url");
const app = getApp();

Component({
  properties: {
    houseListType: {//二手房 租房 小区找房
      type: String,
      value: '二手房'
    },
    label: {//nav菜单
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
    num: {//控制nav显示对应content
      type: Number,
      value: 5
    },
    showModalStatus: {//遮罩层
      type: Boolean,
      value: false
    }
   },
  data: {
    //房源列表
    houseList: [],
    currentCity: '',

    page: 1,
    isScroll: true,
    scrollTop: 0,
    navHeight: null,
    loading: false,//加载圈
    
    //内部筛选条件
    areaCategories: 0,//区域分类
    areaCategoriesId: 0,//区域分类id(给后台的id）
    areaSubCategories: 0,//区域子分类
    areaSubCategoriesId: 0,//区域子分类id(给后台的id）
    
    houseTypeCategories: 0,//户型
    priceCategories: 0,//价格
    modeCategories: 0,//类型
    proportionCategories: 0,//面积

    //请求地址
    //二手房列表 租房列表 小区找房列表
    IPS: [Api.IP_TWOHANDHOUSE, Api.IP_BUILDLIST, Api.IP_RENTHOUSE],  
    IPSNUM: null,
    url: null,
  },
  
  attached() {
    // 修正显示
    // 修正url
    this.setData({num: 5});
    if (this.data.houseListType == '二手房') {
      this.setData({
        url: this.data.IPS[0]
      })
    } else if (this.data.houseListType == '租房') {
      this.setData({
        url: this.data.IPS[1]
      })
    } else if (this.data.houseListType == '小区') {
      this.setData({
        url: this.data.IPS[2]
      })
    }
    //第一页数据 首次请求
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        let params = {
            pageNo: 1,
            pageSize: 10,
            scity: res.data.value,
        }
        //修正 当前城市
        this.setData({currentCity: res.data.value})
        this.getDataFromServer(this.data.url, params);
      }
    })
  },
  methods: {
    selectItem(e) {//控制nav菜单
      this.setData({
        num: e.target.dataset.index,
        isScroll: false,
        showModalStatus: true,
      });
    },
    cancelModal(e) {//取消
      this.setData({
        num: 5,
        isScroll: true,
        showModalStatus: false
      })
      // this.triggerEvent('myevent', this.detail)
    },

    //二手房列表  租房列表
    getDataFromServer(url, params) {
      this.setData({
        loading: true,
        hasMore: true
      })
      wx.request({
        url: url,
        data: params,
        method: 'POST',
        success: (res)=> {
          this.setData({
            houseList: res.data.data,
            loading: false,
            hasMore: false
          })
          this.triggerEvent('myevent', this);
        },
        fail: (error)=> {
          wx.showModal({
            title: '提示',
            content: '请求超时',
            success: ()=> {
              setTimeout(()=>{
                this.setData({
                  loading: false,
                  hasMore: false
                })
              },2000)
            }
          })
        }
      })
    },



    //区域
    //切换城区分类
    changeCategories(e) {
      this.setData({
        areaCategories: e.target.dataset.num,
        areaCategoriesId: e.target.dataset.id,
        areaSubCategories: 0,
        scrollTop: 0
      })
      if (e.target.dataset.num == 0) {//第一列 不限
        let params = {
          pageNo: 1,
          pageSize: 10,
          scity: this.data.currentCity
        }
        this.cancelModal();
        this.getDataFromServer(this.data.url, params);
      }
      
    },
    //区域
    //切换城区子分类 进行请求
    changeSubCategories(e) {
      this.setData({
        areaSubCategories: e.target.dataset.num,
        areaSubCategoriesId: e.target.dataset.id
      })
      let params;
      if (e.target.dataset.num == 0) {//第二列 不限
        params = {
          pageNo: 1,
          pageSize: 10,
          scity: this.data.currentCity
        }
      } else {
        params = {
          pageNo: 1,
          pageSize: 10,
          scity: this.data.currentCity,
          districtId: this.data.areaSubCategoriesId,
          areaId: this.data.areaCategoriesId
        }
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
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


  
  
