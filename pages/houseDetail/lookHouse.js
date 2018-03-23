var Api = require("../../utils/url");
const app = getApp();
var filter = require("../../utils/filter.js");//页面拦截

Page(filter.loginCheck({
  data: {
    index: '',
    chineseWeek: ['周日', '星期一', '星期二', '星期三', '星期四', '星期五', '周六'],
    dateText: ['全天','上午','下午','晚上'],
    dateArr: null,//10-10 星期六   这种格式的时间数据;
    hiddenPicker: true,
    currentTime: null, //当前时间戳
    showTime: '',
    year: '',
    //请求参数
    houseDetailId: '',//房源id
    userName: '',
    userTelphone: '', 
    dataTime: '', //日期
    dayTime: '',//早 上 下 午 晚上
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
  confirmBtn() {//确认
    this.setData({
      hiddenPicker: !this.data.hiddenPicker,
      dataTime: this.data.year + this.data.showTime.split(' ')[0]
    });
    wx.getStorage({
      key: 'selectCity',
      success: (res) => {
        wx.request({
          url: Api.IP_APPOINTHOUSE,
          data: {
            scity: res.data.value,
            sdid: this.data.houseDetailId,
            appointName: this.data.userName,
            appointMobile: this.data.userTelphone,
            appointDate: this.data.dataTime,
            appointRange: '全天'
          },
          header: {
            "Content-Type": "application/json",
            "unique-code": wx.getStorageSync("userToken").data
          },
          method: 'POST',
          success: (res) => {
            console.log(res)
          },
        })
      }
    })
    
  },
  commit() {//提交
    
    wx.getStorage({
      key: 'selectCity',
      success: (res) => {
        wx.request({
          url: Api.IP_APPOINTHOUSE,
          data: {
            scity: res.data.value,
            sdid: this.data.houseDetailId,
            appointName: this.data.userName,
            appointMobile: this.data.userTelphone,
            appointDate: this.data.dataTime,
            appointRange: this.data.dayTime
          },
          header: {
            "Content-Type": "application/json",
            "unique-code": wx.getStorageSync("userToken").data
          },
          method: 'POST',
          success: (res) => {
            console.log(res)
          },
        })
      }
    })
  },
  bindChange(e) {
    let newArr = this.data.dateArr[e.detail.value[0]].split(' ');
    let dayTime;
    switch (this.data.dateText[e.detail.value[1]]) {
      case '全天':
        dayTime = 'ALL_DAY';
        break;
      case '上午':
        dayTime = 'FORENOON';
        break;
      case '下午':
        dayTime = 'AFTERNOON';
        break;
      case '下午':
        dayTime = 'NIGHT';
        break;        
    }
    this.setData({
      showTime: this.data.dateArr[e.detail.value[0]] + ' ' + this.data.dateText[e.detail.value[1]],
      dayTime: dayTime
    })
  },
  onLoad(options) {
    this.setData({
      houseDetailId: options.id
    })
    //获取当前的时间
    wx.request({
      url: Api.IP_CURRENTDATETIME,
      data: '',
      method: 'GET',
      success: (res)=> {
        let result = this.totalDay(res.data.data.currentDateTime);
        this.setData({
          currentTime: res.data.data.currentDateTime,
          dateArr: result.dateArr,//开始计算每月几天 日期
          year: result.year
        })
      },
    })
  },
  totalDay(currentTime) {//计算一个月有几天 日期
    let curDate = new Date(currentTime)//转时间对象
    let curMonth = curDate.getMonth();//外国月份
    let curWeek = curDate.getDay();//当前的一周的周几
    let midArr = curDate.toISOString().split('-');//标准化时间
    curDate.setMonth(curMonth + 1);//中国月份
    curDate.setDate(0);//当月的最后一天
    // console.log(curDate.getDate())//每月的天数 

    let futureTime = 35;// 0 表示从现在开始至未来0天
    let cache = [];

      //每月天数时间判断跨界
      if(futureTime <= curDate.getDate()) {
        for (let i = 0; i < 30; i++) {
          //判断星期 开始计算
          let chineseWeek;
          if(curWeek < 7) {
            chineseWeek = this.data.chineseWeek[curWeek];
            curWeek++;
          } else {
            curWeek = 1;
            chineseWeek = this.data.chineseWeek[0];
          }
          if(i == 0) {//今天
            chineseWeek = '今天';
          }else if(i == 1) {
            chineseWeek = '明天';        
          }
          let monthDay = midArr[1] + "-" + (parseInt(midArr[2].slice(0, 2)) + i) + " " + chineseWeek;
          cache.push(monthDay);
        }
      }else{
        let month = parseInt(midArr[1])+1;//下一个月
        let diffTime = parseInt(midArr[2].slice(0, 2)) + futureTime - curDate.getDate();//跨边界的天数
        let noTransboundary = futureTime - diffTime;//没有跨边界的天数
        for(let i = 0; i <= noTransboundary; i++) {//没有跨边界天数处理
          //判断星期 开始计算
          let chineseWeek;
          if (curWeek < 7) {
            chineseWeek = this.data.chineseWeek[curWeek];
            curWeek++;
          } else {
            curWeek = 1;
            chineseWeek = this.data.chineseWeek[0];
          }
          if (i == 0) {//今天
            chineseWeek = '今天';
          } else if (i == 1) {
            chineseWeek = '明天';
          }
          let monthDay = midArr[1] + "-" + (parseInt(midArr[2].slice(0, 2)) + i) + " " + chineseWeek;
          cache.push(monthDay);
        }        
        for(let j=1;j<=diffTime;j++) {//跨界天数处理
          //判断星期 开始计算
          let chineseWeek;
          if (curWeek < 7) {
            chineseWeek = this.data.chineseWeek[curWeek];
            curWeek++;
          } else {
            curWeek = 1;
            chineseWeek = this.data.chineseWeek[0];
          }
          let monthDay = this.formatNumber(month) + '-' + this.formatNumber(j) + " " + chineseWeek;
          cache.push(monthDay);
        }
      }
    var ret = {
      curDate: curDate.getDate(),
      dateArr: cache,
      year: midArr[0]+'-'
    }
    return ret;
  },
  bindUserName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  bindUserTelphone(e) {
    this.setData({
      userTelphone: e.detail.value
    })
  },
  formatNumber(n) {//补零
    n = n.toString()
    return n[1] ? n : '0' + n
  }
}))