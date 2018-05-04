'use strict';
const SERVERINDEX = 0;
const SERVER_IPS = ["http://112.74.181.229:7031/custAppApi"];//api接口
// const SERVER_IPS = ["http://192.168.16.173:7031/custAppApi"];//api接口
// const SERVER_IPS = ["http://192.168.16.173:7051/custService"];//api接口

const SERVER_IP = SERVER_IPS[SERVERINDEX];
//首页 接口
export const IP_INDEXCONSULT = SERVER_IPS + "/information/pubs/";//获取资讯
export const IP_CITYLIST = SERVER_IPS + "/dictionary/citys";//获取城市列表
export const IP_HOUSEUSED = SERVER_IPS + "/statistics/houseUsed/";//获取二手房成交量统计
export const IP_TWOHANDHOUSE = SERVER_IPS + "/house/query";//二手房所有数据(搜索)
export const IP_HOUSERECMDLIST = SERVER_IPS + "/house/recmdList/";//二手房(买房) 推荐
export const IP_TWOHANDHOUSEDETAIL = SERVER_IPS + "/house/getDetailInFo/";//二手房详情
export const IP_RENTRECMDLIST = SERVER_IPS + "/rentHouse/recmdList/";//租房(租房) 推荐
export const IP_APPOINTHOUSE = SERVER_IPS + "/appoint/house";//预约看房
export const IP_CURRENTDATETIME = SERVER_IPS + "/dictionary/currentDateTime";//预约看房时间
export const IP_SHOPS = SERVER_IPS + "/shop/shops";//门店信息列表
//首页猜你喜欢
export const IP_RENTHOUSELIKE = SERVER_IPS + "/house/queryLike";//首页猜你喜欢 二手房列表
export const IP_RENTHOUSERENTLIKE = SERVER_IPS + "/rentHouse/queryLike";//首页猜你喜欢 租房列表
//租售
export const IP_HOUSEENTRUSTAPPLYSELLHOUSE= SERVER_IPS + "/houseEntrustApply/sellHouse";//出售申请
export const IP_HOUSEENTRUSTAPPLYRENTHOUSE = SERVER_IPS + "/houseEntrustApply/rentHouse";//出租申请
// export const IP_HOUSEENTRUSTAPPLYLIST = SERVER_IPS + "/houseEntrustApply/houseEntrustApplyList";//租售房源列表
//经纪人
export const IP_BROKERSLIST = SERVER_IPS + "/broker/brokers";//经纪人
//详情页和收藏
export const IP_HOUSESEE = SERVER_IPS + "/house/houseSee/";//小区带看房源记录列表
export const IP_SAMEUSED = SERVER_IPS + "/build/same-used/";//同小区二手房
export const IP_SAMEUSEDRENT = SERVER_IPS + "/build/same-rent/";//同小区租房
//收藏
export const IP_HOUSECOLLECTION = SERVER_IPS + "/houseCollection/add/";//二手房收藏
export const IP_RENTCOLLECTION = SERVER_IPS + "/rentHCollection/add/";//租房收藏
export const IP_COLLECTIONADD = SERVER_IPS + "/buildCollection/add/";//小区收藏
export const IP_HOUSECOLLECTIONCANCEL = SERVER_IPS + "/houseCollection/cancel/";//二手房取消收藏
export const IP_RENTCOLLECTIONCANCEL = SERVER_IPS + "/rentHCollection/cancel/";//租房取消收藏
export const IP_COLLECTIONCANCEL = SERVER_IPS + "/buildCollection/cancel/";//小区取消收藏
export const IP_HOUSECOLLECTIONLIST = SERVER_IPS + "/houseCollection/collectionList";//二手房收藏列表
export const IP_RENTCOLLECTIONLIST = SERVER_IPS + "/rentHCollection/collectionList";//租房收藏列表
export const IP_COLLECTIONLIST = SERVER_IPS + "/buildCollection/collectionList";//小区收藏列表
//搜索
export const IP_AREADISTRICTS = SERVER_IPS + "/area/areaDistricts/";//区域
export const IP_DICTIONARY = SERVER_IPS + "/dictionary/dictionarys";//户型和类型 用途
export const IP_DICTIONARYCONDITION = SERVER_IPS + "/dictionary/";//价格 面积 （不同城市价格 面积 不一样）
export const IP_RENTHOUSE = SERVER_IPS + "/rentHouse/query";//租房所有数据
export const IP_RENTHOUSEDETAIL = SERVER_IPS + "/rentHouse/getDetailInFo/";//租房详情
export const IP_HOTBUILDING = SERVER_IPS + "/build/hotBuilding/";//热门小区
export const IP_BUILDLIST = SERVER_IPS + "/build/buildList/";//查询小区列表(小区找房) 
export const IP_BUILDINFO = SERVER_IPS + "/build/buildInfo/";//获取小区详情(包括关联小区)
export const IP_RIMHOUSING = SERVER_IPS + "/house/rimHousing";//获取房屋详情 二手房附近房源
//我的 接口
export const IP_SMSCODELOGIN = SERVER_IPS + "/member/smsCodelogin";//手机验证码登录
export const IP_GETSMSCODE= SERVER_IPS + "/member/fetchSmsCode";//获取验证码

//微信登录
export const weChatLogin = SERVER_IPS + "/member/loginWeixin";//微信手机号码和openid第三方登录
export const weChatRegister = SERVER_IPS + "/member/registerWeixin";//微信注册








