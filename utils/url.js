'use strict';
const SERVERINDEX = 0;
const SERVER_IPS = ["http://192.168.16.173:7031/custAppApi"];//api接口
// const SERVER_IPS = ["http://192.168.16.108:7031/custAppApi"];//api接口
// const SERVER_IPS = ["http://112.74.181.229:7031/custAppApi"];//api接口


const SERVER_IP = SERVER_IPS[SERVERINDEX];
//首页 接口
export const IP_INDEXCONSULT = SERVER_IPS + "/information/pubs/";//获取资讯
export const IP_CITYLIST = SERVER_IPS + "/dictionary/citys";//获取城市列表
export const IP_HOUSEUSED = SERVER_IPS + "/statistics/houseUsed/";//获取二手房成交量统计
export const IP_TWOHANDHOUSE = SERVER_IPS + "/house/query";//二手房所有数据(猜你喜欢)
export const IP_RENTHOUSE = SERVER_IPS + "/rentHouse/query";//租房所有数据
export const IP_RENTHOUSELIKE = SERVER_IPS + "/house/queryLike";//首页猜你喜欢 二手房列表
export const IP_RENTHOUSERENTLIKE = SERVER_IPS + "/rentHouse/queryLike";//首页猜你喜欢 租房列表





//我的 接口
export const IP_SMSCODELOGIN = SERVER_IPS + "/member/smsCodelogin";//手机验证码登录
export const IP_GETSMSCODE= SERVER_IPS + "/member/fetchSmsCode";//获取验证码












