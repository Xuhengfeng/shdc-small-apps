var Api = require("../../utils/url");
const app = getApp();

Component({
  properties: {
    label: {//nav菜单
      type: Array,
      value: ''
    },
    area: {//区域
      type: Array,
      value: ''
    },
    houseType: {//户型
      type: Array,
      value: ''
    },
    price: {//价格
      type: Array,
      value: ''
    },
    proportion: {//面积
      type: Array,
      value: ''
    },
    mode: {//类型
      type: Array,
      value: ''
    },
    use: {//用途
      type: Array,
      value: ''
    },
    houseAge: {//楼龄
      type: Array,
      value: ''
    },
    num: {//控制nav显示对应content
      type: Number,
      value: 5
    },
    keyword: {//关键词
      type: String,
      value: ''
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

    //户型
    houseTypeCategories: 0,
    roomsNum: null,

    //价格
    priceCategories: 0,
    minPrice: null,
    maxPrice: null,

    //类型
    modeCategories: 0,
    modeCategoriesValue: null,

    //面积
    proportionCategories: 0,
    minBuildArea: null,
    maxBuildArea: null,
    
    


    //请求地址
    //二手房列表 租房列表 小区找房列表
    IPS: [Api.IP_TWOHANDHOUSE, Api.IP_RENTHOUSE, Api.IP_BUILDLIST],  
    IPSNUM: null,
    url: null,

    //显示 小区label 或  二手房 租房
    twoHouseOrArea: true
  },
  
  attached() {
    // 修正显示
    // 修正url
    this.setData({num: 5});
    wx.getStorage({
      key: 'houseTypeSelect',
      success: (res)=> {
        if (res.data == '二手房') {
          this.setData({
            url: this.data.IPS[0],
            twoHouseOrArea: true
          })
        } else if (res.data == '租房') {
          this.setData({
            url: this.data.IPS[1],
            twoHouseOrArea: true            
          })
        } else if (res.data == '小区') {
          this.setData({
            url: this.data.IPS[2],
            twoHouseOrArea: false            
          })
        }
      }
    })
    

    //第一页数据 首次请求
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        let params = {
            'pageNo': 1,
            'pageSize': 10,
            'scity': res.data.value,
            'keyword': this.data.keyword
        }
        console.log(params)
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
          if(res.data.data.length){
            this.setData({
              houseList: res.data.data,
              loading: false,
              hasMore: false
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '没有找任何数据!',
              success: ()=>{
                this.setData({
                  loading: false,
                  hasMore: false
                })
              }
            })
          }        
          let obj = {
            'params': params,
            'houseList': res.data.data
          }
          this.triggerEvent('myevent', obj);
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
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity
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
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'areaId': this.data.areaCategoriesId
        }
      } else {
        params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'districtId': this.data.areaSubCategoriesId,
          'areaId': this.data.areaCategoriesId
        }
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },

    //户型
    changeHouseType(e) {
      this.setData({
        houseTypeCategories: e.target.dataset.num,
        roomsNum: e.target.dataset.value
      })
    },
    changeHouseTypeUnlimit() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'roomsNum': ''
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    changeHouseTypeTrue() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'roomsNum': this.data.roomsNum
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },

    //价格
    pricelabel(e) {
      this.setData({
        priceCategories: e.target.dataset.num,
        minPrice: e.target.dataset.minprice.value.split('-')[0],
        maxPrice: e.target.dataset.maxprice.value.split('-')[1]
      })
    },
    pricelabelUnlimit() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'minPrice': '',
        'maxPrice': ''
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    pricelabelTrue() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'minPrice': this.data.minPrice,
        'maxPrice': this.data.maxPrice
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    minPrice(e) {
      this.setData({
        minPrice: e.detail.value
      })
    },
    maxPrice(e) {
      this.setData({
        maxPrice: e.detail.value
      })
    },

    //面积
    proportionlabel(e) {
      this.setData({
        proportionCategories: e.target.dataset.num,
        minBuildArea: e.target.dataset.minbuildarea.value.split('-')[0],
        maxBuildArea: e.target.dataset.maxbuildarea.value.split('-')[1]
      })
    },
    proportionlabelUnlimit() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'minBuildArea': '',
        'maxBuildArea': ''
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    proportionlabelTrue(e) {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'minBuildArea': this.data.minBuildArea,
        'maxBuildArea': this.data.maxBuildArea
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },

    //类型
    modelabel(e) {
      console.log(e.target)
      this.setData({
        modeCategories: e.target.dataset.num,
        modeCategoriesValue: e.target.dataset.value
      })
    },
    modelabeUnlimit() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'houseForm': ''
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    modelabelTrue() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'houseForm': this.data.modeCategoriesValue
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    }
  }
})


  
  
