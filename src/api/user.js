// 用户
import request from '@/utils/request'

// 获取用户信息 getUserInfo
export function getUserInfo() {
    return request({
        url: '/user/userInfo',
        method: 'get',
        showLoading: true,
    })
}

// 微信登录 TODO wechatLogin
export function loginByWeChat(params) {
    return request({
        url: '/user/loginByWeChat',
        method: 'post',
        params,
        showLoading: true,
    })
    // return request({
    //     baseURL: 'https://adapi.monday1.top',
    //     url: '/v1/login/wechatLogin',
    //     method: 'post',
    //     params,
    //     showLoading: true,
    // })
}

// 获取用户试卷信息 getPaperOrderList
export function getTestOrderList(params) {
    return request({
        url: '/user/testOrderList',
        method: 'get',
        params
    })
}

