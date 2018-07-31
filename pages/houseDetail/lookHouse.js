const Api = require("../../utils/url");
const utils = require("../../utils/util");
const filter = require("../../utils/filter");
Page(filter.loginCheck({
  data: {
    index: '',
    chineseWeek: ['周日', '星期一', '星期二', '星期三', '星期四', '星期五', '周六'],
    dateText: ['全天','上午','下午','晚上'],
    dateType: [{key:'ALL_DAY',value:'全天'},{key:'FORENOON',value:'上午'},{key:'AFTERNOON',value:'下午'},{key:'NIGHT',value:'晚上'}],
    dateArr: null,//10-10 星期六   这种格式的时间数据;
    hiddenPicker: true,
    showTime: '',//显示时间
    year: '',//年
    houseDetail: '',//房源
    flagPrice: '',
    userName: '',
    userTelphone: '', 
    dataTime: '', //日期
    dayTime: '',//早 上 下 午 晚上
    select: [],//选中的房源对象
    broker: '',
    brokerId: '',
    userPhone: "",//用户手机号
    houseDetailSdid: '',
    currentCity: '',
    dateitem:[],//时间戳
    dateList: [],//时间戳对应月日list
   },
   onLoad(options) {
    //userPhone获取用户手机号
    utils.storage('userPhone')
    .then(res=>{
      let str = res.data;
      this.setData({
        userTelphone: str,
        userPhone: str.slice(0,3)+"****"+str.slice(7,11)
      });
    })
    //获取当前的时间
    utils.get(Api.IP_CURRENTDATETIME)
    .then((data)=>{
      let result = this.totalDay(data.data.currentDateTime);
      this.setData({
        dateArr: result,//月 日 
        select: JSON.parse(options.select),
      });
      this.setData({
        showTime: result[0] +" "+ "全天",//默认时间(前台)
        dataTime: result[0],//默认时间(丢后台)
        dayTime: 'ALL_DAY',
      })
    })
  },
   //自定义城市控件
  showOwnPicker() {
    this.setData({hiddenPicker: !this.data.hiddenPicker});
  },
  //取消
  cancelBtn() {
    this.setData({hiddenPicker: !this.data.hiddenPicker});
  },
  //确认
  confirmBtn() {
    this.setData({
      hiddenPicker: !this.data.hiddenPicker,
      dataTime: this.data.dataTime
    });
  },
  //提交
  commit() {
    let select = this.data.select;
    //城市
    wx.getStorage({
      key: 'selectCity',
      success: (res) => {
        this.setData({currentCity: res.data.value})
        //用户token
        wx.getStorage({
          key: 'userToken',
          success: (response)=> {
            let token = response.data;
            let params = {
              appointName: this.data.userName,
              appointMobile: this.data.userTelphone,
              appointDate: this.data.dataTime,
              appointRange: this.data.dayTime,
              unicode: token,
              scity: this.data.currentCity,
              brokerId: this.data.brokerId,
              houseList: this.data.select
            };
            utils.post(Api.IP_APPOINTHOUSE,params).then((data)=>{
              if(data.data == null){
                wx.showModal({content: data.msg});
              }else{
                wx.navigateBack();
              } 
            })
          }
        })
      }
    })
  },
  //改变触发
  bindChange(e) {
    let dayTime;
    switch (this.data.dateText[e.detail.value[1]]) {
      case '全天':dayTime = 'ALL_DAY';break;
      case '上午':dayTime = 'FORENOON';break;
      case '下午':dayTime = 'AFTERNOON';break;
      case '下午':dayTime = 'NIGHT';break;        
    }
    this.setData({
      showTime: this.data.dateArr[e.detail.value[0]] + ' ' + this.data.dateText[e.detail.value[1]],
      dayTime: dayTime
    })
  },
  totalDay(currentTime) {//日期 日 
    let cache = [];
    for(let i=0;i<7;i++){
      this.data.dateitem.push(currentTime);
      let midDate = new Date(currentTime);//当前天的时间搓
      let monthDate = "";//月数
      let dayDate = "";//天数
      parseInt(midDate.getMonth())+1>9?monthDate=parseInt(midDate.getMonth())+1:monthDate="0"+(parseInt(midDate.getMonth())+1);//补零
      parseInt(midDate.getDate())>9?dayDate=midDate.getDate():dayDate="0"+midDate.getDate();
      cache.push(midDate.getFullYear()+"-"+monthDate+"-"+dayDate)
      currentTime = currentTime + 86400*1000;//往后加一天时间戳
    }
    cache[0]="今天";
    cache[1]="明天";
    cache[2]="后天";
    return cache;
  },
  //获取用户姓名
  bindUserName(e) {
    this.setData({userName: e.detail.value})
  },
  //获取用户手机
  bindUserTelphone(e) {
    this.setData({ userTelphone: e.detail.value})
  },
  //选着经纪人
  jumpBroker() {
    let select = JSON.stringify(this.data.select);
    console.log(select);
    wx.navigateTo({url: `../houseDetail/brokerList?select=${select}`});
  }
}))