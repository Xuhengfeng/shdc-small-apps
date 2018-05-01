let Api = require("../../utils/url");
let app = getApp();

Component({
  properties: {
    area: {//区域
      type: Array,
      value: ''
    },
    houseTy: {//户型
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
    highSelectItem: false,//打开高亮
    
    //内部筛选条件
    areaCategories: 0,//区域分类
    areaCategoriesId: 0,//区域分类id(给后台的id）
    areaSubCategories: 0,//区域子分类
    areaSubCategoriesId: 0,//区域子分类id(给后台的id）

    //户型
    houseTypeCategories: 0,
    roomsNum: null,

    //价格 租金
    priceCategories: 0,
    minPrice: null,
    maxPrice: null,

    //类型1 二手房 租房 
    modeCategories: 0,
    modeCategoriesValue: null,

    //类型2 小区
    mode2Categories: 0,
    mode2CategoriesValue: null,

    //面积
    proportionCategories: 0,
    minBuildArea: null,
    maxBuildArea: null,
    
    //用途
    useCategories: 0,
    useCategoriesValue: null,
    
    //楼龄
    houseAgeCategories: 0,
    houseAgeCategoriesValue: null,

    //请求地址
    //二手房列表 租房列表 小区找房列表
    IPS: [Api.IP_TWOHANDHOUSE, Api.IP_RENTHOUSE, Api.IP_BUILDLIST],  
    url: null,

    //显示 小区label 或  二手房 租房
    label: [], 
    twoHouseOrArea: true,
    params: {},

    //二手房查询请求参数
    params1: {
      "areaId": null,
      "districtId": null,
      "houseDecor": "",
      "houseDirec": "",
      "houseFeature": "",
      "houseForm": "",
      "keyword": "",
      "maxBuildArea": null,
      "maxPrice": null,
      "minBuildArea": null,
      "minPrice": null,
      "pageNo": null,
      "roomsNum": null,
      "scity": ""
    },
    //租房查询请求参数
    params2: {
      "areaId": null,
      "districtId": null,
      "keyword": "",
      "maxBuildArea": null,
      "maxRentPrice": null,
      "minBuildArea": null,
      "minRentPrice": null,
      "pageNo": null,
      "pageSize": null,
      "roomsNum": null,
      "scity": ""
    },
    //小区查询请求参数
    params3: {
      "areaId": null,
      "businessType": "",
      "districtId": null,
      "houseType": "",
      "keyword": "",
      "pageNo": null,
      "pageSize": null,
      "scity": "",
      "useYear": ""
    }
  },
  
  attached() {
    // 修正显示
    // 修正url
    this.setData({num: 5});
    let name = wx.getStorageSync('houseTypeSelect');
    if(name == '二手房') {
      this.setData({
        url: this.data.IPS[0],
        label: ["区域", "户型", "价格", "面积", "类型"],
        twoHouseOrArea: true, 
        params: this.data.params1       
      });
    } else if (name == '租房') {
      this.setData({
        url: this.data.IPS[1],
        label: ["区域", "户型", "租金", "面积"],       
        twoHouseOrArea: true, 
        params: this.data.params2       
      })
    }else if(name == '小区') {
      this.setData({
        url: this.data.IPS[2],
        label: ['区域', '用途', '类型', '楼龄'],
        twoHouseOrArea: false,
        params: this.data.params3            
      })
    }    

    //第一页数据 首次请求
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        let params = {
            'pageNo': 1,
            'scity': res.data.value,
            'keyword': this.data.keyword
        }
        let newParams = Object.assign(this.data.params, params);
        //修正 当前城市
        this.setData({currentCity: res.data.value})
        this.getDataFromServer(this.data.url, newParams);
      }
    })
  },
  methods: {
    selectItem(e) {//控制nav菜单
      this.setData({num: e.target.dataset.index,showModalStatus: true});
    },
    cancelModal(e) {//取消
      this.setData({num: 5,showModalStatus: false})
    },

    //请求二手房列表  租房列表 小区列表
    getDataFromServer(url, params) {
      app.httpRequest(url, params, (error, data)=>{
        let List = data.data.length?data.data:"";
        let obj = {params: params, houseList: List}
        console.log(obj)
        this.setData({houseList: List})
        this.triggerEvent('myevent', obj);
      }, 'POST')
    },

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
          'scity': this.data.currentCity
        }
        let newParams = Object.assign(this.data.params, params);
        this.cancelModal();
        this.getDataFromServer(this.data.url, newParams);
      }
      
    },

    //切换城区子分类 进行请求
    changeSubCategories(e) {
      let id = e.target.dataset.num;
      let label = 'label['+0+']';
      this.setData({
        areaSubCategories: e.target.dataset.num,
        areaSubCategoriesId: e.target.dataset.id,
        highSelectItem: true,
        num: 0,
        [label]: this.data.area[this.data.areaCategories].districts[id].name
      })
      let params;
      if (e.target.dataset.num == 0) {//第二列 不限
        params = {
          'pageNo': 1,
          'scity': this.data.currentCity,
          'areaId': this.data.areaCategoriesId
        }
      } else {
        params = {
          'pageNo': 1,
          'scity': this.data.currentCity,
          'districtId': this.data.areaSubCategoriesId,
          'areaId': this.data.areaCategoriesId
        }
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },

    //户型
    changeHouseType(e) {
      let label = 'label[' +1 + ']';
      this.setData({
        houseTypeCategories: e.target.dataset.num,
        roomsNum: e.target.dataset.value,
        [label]: this.data.houseTy[e.target.dataset.num].name
      })
    },
    changeHouseTypeUnlimit() {
      let params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'roomsNum': ''
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },
    changeHouseTypeTrue() {
      let params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'roomsNum': this.data.roomsNumroomsNum
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },

    //价格
    pricelabel(e) {
      let label = 'label[' + 2 + ']';
      this.setData({
        priceCategories: e.target.dataset.num,
        minPrice: e.target.dataset.minprice.value.split('-')[0],
        maxPrice: e.target.dataset.maxprice.value.split('-')[1],
        [label]: this.data.price[e.target.dataset.num].name
      })
    },
    pricelabelUnlimit() {
      let params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'minPrice': '',
          'maxPrice': ''
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },
    pricelabelTrue() {
      let params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'minPrice': this.data.minPrice,
        'maxPrice': this.data.maxPrice
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
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
      let label = 'label[' + 3 + ']';
      this.setData({
        proportionCategories: e.target.dataset.num,
        minBuildArea: e.target.dataset.minbuildarea.value.split('-')[0],
        maxBuildArea: e.target.dataset.maxbuildarea.value.split('-')[1],
        [label]: this.data.proportion[e.target.dataset.num].name
      })
    },
    proportionlabelUnlimit() {
      let params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'minBuildArea': '',
          'maxBuildArea': ''
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },
    proportionlabelTrue(e) {
      let params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'minBuildArea': this.data.minBuildArea,
          'maxBuildArea': this.data.maxBuildArea
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },

    //类型 二手房 租房
    modelabel(e) {
      let label = 'label[' + 4 + ']';
      this.setData({
        modeCategories: e.target.dataset.num,
        modeCategoriesValue: e.target.dataset.value,
        [label]: this.data.mode[e.target.dataset.num].name
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
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },
    modelabelTrue() {
      let params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'houseForm': this.data.modeCategoriesValue
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },

    //用途
    uselabel(e) {
      let label = 'label[' + 1+ ']';
      this.setData({
        useCategories: e.target.dataset.num,
        useCategoriesValue: e.target.dataset.value,
        [label]: this.data.use[e.target.dataset.num].name
      })
    },
    uselabelUnlimit() {
      let params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'businessType': ''
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },
    uselabelTrue() {
      let params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'businessType': this.data.useCategoriesValue
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },

    //类型2 小区
    modelabel2(e) {
      let label = 'label[' + 2 + ']';
      this.setData({
        mode2Categories: e.target.dataset.num,
        mode2CategoriesValue: e.target.dataset.value,
        [label]: this.data.mode[e.target.dataset.num].name
      })
    },
    modelabe2Unlimit() {
      let params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'houseType': ''
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },
    modelabel2True() {
      let params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'houseType': this.data.mode2CategoriesValue
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },
 
    //楼龄
    houseAgelabel(e) {
      let label = 'label[' + 3 + ']';
      console.log(this.data)
      this.setData({
        houseAgeCategories: e.target.dataset.num,
        houseAgeCategoriesValue: e.target.dataset.value,
        [label]: this.data.houseAge[e.target.dataset.num].name
      })
    },
    houseAgelabelUnlimit() {
      let params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'useYear': ''
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    },
    houseAgelabelTrue() {
      let params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'useYear': this.data.houseAgeCategoriesValue
      }
      let newParams = Object.assign(this.data.params, params);
      this.cancelModal();
      this.getDataFromServer(this.data.url, newParams);
    }
  }
})


  
  
