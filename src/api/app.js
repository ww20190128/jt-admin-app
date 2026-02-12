// 首页
import request from '@/utils/request'

// 记录参数
export function recordParam(params) {
    return request({
        url: '/app/recordParam',
        method: 'post',
        params
    })
}

// 获取微信jssdk配置 TODO  getJssdkConfig
export function getWeChatConfig(params) {
    return request({
        url: '/app/getWeChatConfig',
        method: 'get',
        params
    })
    // return request({ // https://adapi.monday1.top/v1/index/jssdkConfig
    //     baseURL: 'https://adapi.monday1.top',
    //     url: '/v1/index/jssdkConfig',
    //     method: 'get',
    //     params
    // })
    
}

// 获取微信授权请求地址 wechatOauth
export function getWeChatOauthUrl({
    authType,
    redirectUrl
}) {
   
    //return `https://adapi.monday1.top/v1/login/wechatOauth?auth_type=${authType}&self_redirect=${redirectUrl}`
    return `${process.env.VUE_APP_BASE_API}/app/authByWeChat?auth_type=${authType}&self_redirect=${redirectUrl}`
}

// 获取分享信息(app)
export function getShareAppInfo(params) {
    return request({
        url: '/app/getShareAppInfo',
        method: 'get',
        params
    })
}
// 获取分享信息(测评)
export function getShareTestPaperInfo(params) {
    return request({
        url: '/app/getShareTestPaperInfo',
        method: 'get',
        params
    })
}
// 获取分享信息(正念)
export function getShareMindfulnessInfo(params) {
    return request({
        url: '/app/getShareMindfulnessInfo',
        method: 'get',
        params
    })
}
// 获取分享信息(分销)
export function getShareBusinessInfo(params) {
    return request({
        url: '/app/getShareBusinessInfo',
        method: 'get',
        params
    })
}
// 获取首页数据
export function getHomeData() {
    return request({
        url: '/app/main',
        method: 'get',
    });
}

// 获取分类列表
export function getClassifyList(params) {
    return request({
        url: '/app/getClassifyList',
        method: 'get',
        params,
    })
}

// 获取测评
export function getListByClassify(params) {
    return request({
        url: '/app/getListByClassify',
        method: 'get',
        params,
    })
}

// 获取报VIP套餐 getVipPackage
export function getVipConfig(params) {
    return request({
        url: '/app/getVipConfig',
        method: 'get',
        params
    })
}

// 获取文章详情
export function getArticleInfo(params) {
    return request({
        url: '/app/getArticleInfo',
        method: 'get',
        params
    })
}

// 获取推荐
export function getRecommendList(params) {
    return request({
        url: '/app/getRecommendList',
        method: 'get',
        params,
    })
}

