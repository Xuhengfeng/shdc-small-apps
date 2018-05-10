const Api = require("../../utils/url");
const utils = require("../../utils/util");
const filter = require("../../utils/filter");

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
    houseDetail: '',//房源
    flagPrice: '',
    //请求参数
    userName: '',
    userTelphone: '', 
    dataTime: '', //日期
    dayTime: '',//早 上 下 午 晚上
    nowDate: '',
    select: []//选中的房源对象
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
      dataTime: this.data.year + this.data.showTime.split(' ')[0]
    });
    // wx.getStorage({
    //   key: 'selectCity',
    //   success: (res) => {
    //     let params = {
    //       scity: res.data.value,
    //       sdid: this.data.houseDetailId,
    //       appointName: this.data.userName,
    //       appointMobile: this.data.userTelphone,
    //       appointDate: this.data.nowDate,
    //       appointRange: '全天'
    //     }
    //     utils.post(Api.IP_APPOINTHOUSE,params).then((data)=>{});
    //   }
    // })
  },
  //提交
  commit() {
    let select = this.data.select;
    wx.getStorage({
      key: 'selectCity',
      success: (res) => {
        wx.getStorage({
          key: 'userToken',
          success: (response)=> {
            let token = response.data;
            console.log(select)
            select.forEach((item)=>{
              let params = {
                scity: res.data.value,
                sdid: this.data.houseDetailId,
                appointName: this.data.userName,
                appointMobile: this.data.userTelphone,
                appointDate: this.data.dataTime,
                appointRange: this.data.dayTime,
                unicode: token,
                scity: item.scity,
                sdid: item.sdid
              };
              utils.post(Api.IP_APPOINTHOUSE,params).then((data)=>{});
            })
          }
        })
      }
    })
  },
  bindChange(e) {
    let newArr = this.data.dateArr[e.detail.value[0]].split(' ');
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
  onLoad(options) {
    //获取当前的时间
    utils.get(Api.IP_CURRENTDATETIME)
    .then((data)=>{
      let result = this.totalDay(data.data.currentDateTime);
      this.setData({
        currentTime: data.data.currentDateTime,
        dateArr: result.dateArr,//开始计算每月几天 日期
        year: result.year,
        select: JSON.parse(options.select)
      })
    })
  },
  totalDay(currentTime) {//计算一个月有几天 日期
    let curDate = new Date(currentTime)//转时间对象
    let curMonth = curDate.getMonth();//外国月份
    let curWeek = curDate.getDay();//当前的一周的周几
    let a = curDate.toISOString();//标准化时间
    let midArr = a.split('-');
    let nowDate = a.slice(0, 10);
    this.setData({nowDate: nowDate});

    curDate.setMonth(curMonth + 1);//中国月份
    curDate.setDate(0);//当月的最后一天

    let futureTime = 14;// 0 表示从现在开始至未来0天 假定是未来2周时间
    let cache = [];

      //每月天数时间判断跨界
      if(futureTime <= curDate.getDate()) {
        for (let i = 0; i < futureTime; i++) {
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
        //跨界天数处理
        for(let j=1;j<=diffTime;j++) {
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
      year: midArr[0]+'-',
    }
    return ret;
  },
  //获取用户姓名
  bindUserName(e) {
    this.setData({userName: e.detail.value})
  },
  //获取用户手机
  bindUserTelphone(e) {
    this.setData({ userTelphone: e.detail.value})
  },
  //补零
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  //选着经纪人
  jumpBroker() {
    wx.navigateTo({url: "../index/broker"});
  }
}))