'use strict';
const SERVERINDEX = 0;
const SERVER_IPS = ["http://192.168.16.173:7031/custAppApi"];//api接口
// const SERVER_IPS = ["https://192.168.16.173:8443/custAppApi"];//api接口
// const SERVER_IPS = ["http://192.168.16.108:7031/custAppApi"];//api接口


const SERVER_IP = SERVER_IPS[SERVERINDEX];
//首页 接口
export const IP_INDEXCONSULT = SERVER_IPS + "/information/pubs/";//获取资讯
export const IP_CITYLIST = SERVER_IPS + "/dictionary/citys";//获取城市列表
export const IP_HOUSEUSED = SERVER_IPS + "/statistics/houseUsed/";//获取二手房成交量统计
export const IP_TWOHANDHOUSE = SERVER_IPS + "/house/query";//二手房所有数据
export const IP_HOUSERECMDLIST = SERVER_IPS + "/house/recmdList/";//二手房(买房) 推荐
export const IP_TWOHANDHOUSEDETAIL = SERVER_IPS + "/house/getDetailInFo/";//二手房详情
export const IP_RENTRECMDLIST = SERVER_IPS + "/rentHouse/recmdList/";//租房(租房) 推荐
export const IP_APPOINTHOUSE = SERVER_IPS + "/appoint/house";//预约看房
export const IP_CURRENTDATETIME = SERVER_IPS + "/dictionary/currentDateTime";//预约看房时间



export const IP_RENTHOUSE = SERVER_IPS + "/rentHouse/query";//租房所有数据
export const IP_RENTHOUSEDETAIL = SERVER_IPS + "/rentHouse/getDetailInFo/";//租房详情
export const IP_HOTBUILDING = SERVER_IPS + "/build/hotBuilding/";//热门小区
export const IP_BUILDLIST = SERVER_IPS + "/build/buildList/";//查询小区列表(小区找房) 
export const IP_BUILDINFO = SERVER_IPS + "/build/buildInfo/";//获取小区详情(包括关联小区)
export const IP_RIMHOUSING = SERVER_IPS + "/house/rimHousing";//获取房屋详情 二手房附近房源



export const IP_RENTHOUSELIKE = SERVER_IPS + "/house/queryLike";//首页猜你喜欢 二手房列表
export const IP_RENTHOUSERENTLIKE = SERVER_IPS + "/rentHouse/queryLike";//首页猜你喜欢 租房列表



//我的 接口
export const IP_SMSCODELOGIN = SERVER_IPS + "/member/smsCodelogin";//手机验证码登录
export const IP_GETSMSCODE= SERVER_IPS + "/member/fetchSmsCode";//获取验证码












