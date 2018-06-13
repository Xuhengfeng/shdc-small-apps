'use strict';
const SERVERINDEX = 1;
// const SERVER_IPS = ["https://custapis.shyj.cn/custAppApi"];//生产api接口
const SERVER_IPS = ["http://112.74.181.229:7031/custAppApi"];//测试api接口
const SERVER_IP = SERVER_IPS[SERVERINDEX];

//首页 接口
export const IP_DEFAULTCITY = SERVER_IPS + "/dictionary/defaultCity";//默认城市
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
export const IP_PLATE = SERVER_IPS + "/plate/query/";//四个栏目
export const IP_NEWINFO = SERVER_IPS + "/info/query/";//新盘推荐
export const IP_NEWBUILDINDEX = SERVER_IPS + "/newbuilding/index";//新房首页数据
export const IP_NEWBUILDING = SERVER_IPS + "/newbuilding/query/";//新房城市信息列表
export const IP_BUILDINGLIST = SERVER_IPS + "/build/buildList/";//小区列表
export const IP_BUILDINGLISTDZ = SERVER_IPS + "/build/building/dz/";//栋座号列表
export const IP_BUILDINGLISTDYFH = SERVER_IPS + "/build/building/dyfh";//单元或房号列表
export const IP_ALLH5PAGEURL = SERVER_IPS + "/dictionary/";//单元或房号列表


//预约看房
export const IP_APPOINTADD = SERVER_IPS + "/appoint/add";//加入待看列表
export const IP_APPOINTDELETE = SERVER_IPS + "/appoint/delete/";//取消加入待看列表
export const IP_DETAILLIST = SERVER_IPS + "/appoint/detailLsit";//待看列表
export const IP_READYLIST = SERVER_IPS + "/appoint/readyList";//待看日程列表
export const IP_READYDETAIL = SERVER_IPS + "/appoint/readyDetail/";//待看日程详情
export const IP_ORDERCANCEL = SERVER_IPS + "/appoint/cancel";//取消预约
export const IP_COMPLETE = SERVER_IPS + "/appoint/complete";//已看记录
export const IP_REPORTLIST = SERVER_IPS + "/report/list";//看房报告
export const IP_BROKEREVALUATE = SERVER_IPS + "/brokerEval/brokerEvaluates";//查询经纪人评价信息(我的评论)


//首页猜你喜欢
export const IP_RENTHOUSELIKE = SERVER_IPS + "/house/queryLike";//首页猜你喜欢 二手房列表
export const IP_RENTHOUSERENTLIKE = SERVER_IPS + "/rentHouse/queryLike";//首页猜你喜欢 租房列表

//租房 售房
export const IP_APPLYSELLHOUSE= SERVER_IPS + "/houseEntrustApply/sellHouse";//出售申请
export const IP_APPLYRENTHOUSE = SERVER_IPS + "/houseEntrustApply/rentHouse";//出租申请
export const IP_SELLAPPLYLIST= SERVER_IPS + "/houseEntrustApply/querySellApplyList";//我的卖房申请列表
export const IP_RENTAPPLYLIST= SERVER_IPS + "/houseEntrustApply/queryRentApplyList";//我的租房申请列表
export const IP_ENTRUSTSELL= SERVER_IPS + "/houseEntrustApply/sell/";//卖房委托详情
export const IP_ENTRUSTRENT= SERVER_IPS + "/houseEntrustApply/rent/";//租房委托详情

//经纪人
export const IP_BROKERSLIST = SERVER_IPS + "/broker/brokers";//经纪人列表
export const IP_BROKERSDETAIL = SERVER_IPS + "/broker/";//经纪人详情
export const IP_BROKERADD = SERVER_IPS + "/brokerCollection/add/";//添加收藏经纪人
export const IP_BROKERCANCEL = SERVER_IPS + "/brokerCollection/cancel/";//取消收藏经纪人
export const IP_FILLBROKEREVALUATE = SERVER_IPS + "/brokerEval/fillBrokerEvaluate";//用户提价经纪人评价
export const IP_FILLMEMBERMARK = SERVER_IPS + "/appoint/fillMemberRemark";//用户填写看房备注


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
export const IP_SEARCHRECORD = SERVER_IPS + "/searchRecord/list/";//搜索历史记录
export const IP_SEARCHRECORDCLEAR = SERVER_IPS + "/searchRecord/clear";//清空历史记录
export const IP_AREADISTRICTS = SERVER_IPS + "/area/areaDistricts/";//区域
export const IP_DICTIONARY = SERVER_IPS + "/dictionary/dictionarys";//户型和类型 用途
export const IP_RENTHOUSE = SERVER_IPS + "/rentHouse/query";//租房所有数据
export const IP_RENTHOUSEDETAIL = SERVER_IPS + "/rentHouse/getDetailInFo/";//租房详情
export const IP_HOTBUILDING = SERVER_IPS + "/build/hotBuilding/";//热门小区
export const IP_BUILDLIST = SERVER_IPS + "/build/buildList/";//查询小区列表(小区找房) 
export const IP_BUILDINFO = SERVER_IPS + "/build/buildInfo/";//获取小区详情(二手房关联小区)
export const IP_RIMHOUSING = SERVER_IPS + "/house/rimHousing";//二手房周边房源
export const IP_RENTRIMHOUSING = SERVER_IPS + "/rentHouse/rimHousing";//租房周边房源


//字典
export const IP_DICTIONARYCONDITION = SERVER_IPS + "/dictionary/";//价格 面积 经纪人评价...

//我的 接口
export const IP_SMSCODELOGIN = SERVER_IPS + "/member/smsCodelogin";//手机验证码登录
export const IP_GETSMSCODE= SERVER_IPS + "/member/fetchSmsCode";//获取验证码
export const IP_MYBROKERSLIST = SERVER_IPS + "/my/collectionList";//我的经纪人列表
export const IP_MYBROKERSCOLLECTIONLIST = SERVER_IPS + "/brokerCollection/collectionList";//经纪人收藏列表
export const IP_ADVICE= SERVER_IPS + "/feedback/advice";//意见反馈
export const IP_MYINFO = SERVER_IPS + "/member/myinfo"; //我的

//登录退出
export const weChatLogin = SERVER_IPS + "/member/loginWeixin";//微信手机号码和openid第三方登录
export const weChatRegister = SERVER_IPS + "/member/registerWeixin";//微信注册
export const weChat = SERVER_IPS + "/member/authWeixin";//微信登录
export const logout = SERVER_IPS + "/member/logout";//退出






