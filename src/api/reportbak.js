

import request from '@/utils/request'
// 获取报告结果
export function getReportResult(params) {
    return request({
        url: '/v1/paper/result',
        method: 'get',
        params,
        showLoading: true
    })
}
// 管理员查看报告结果页
export function getBackendCheck(params) {
    return request({
        url: '/v1/paper/backendCheck',
        method: 'get',
        params,
        showLoading: true
    })
}
// 结果页热门商品
export function getHotGoodsList(params) {
    return request({
        url: '/v1/goods/getHotGoodsList',
        method: 'get',
        params,
    })
}


// 结果页重测
export function createResetPaper(data) {
    return request({
        url: '/v1/paper_order/createResetPaper',
        method: 'post',
        data,
    })
}
// 已完成订单列表
export function resetOrderList(params) {
    return request({
        url: '/v1/paper_order/resetOrderList',
        method: 'get',
        params,
    })
}

// 用户错题记录
export function getCuotiList(params) {
    return request({
        url: '/v1/cuotijiexi/getCuotiList',
        method: 'get',
        params,
        showLoading: true
    })
}
// 查看错题支付页
export function payPage(params) {
    return request({
        url: '/v1/cuotijiexi/payPage',
        method: 'get',
        params,
        // showLoading: true
    })
}
// 支付
export function pay(data) {
    return request({
        url: '/v1/cuotijiexi/pay',
        method: 'post',
        data,
        showLoading: true
    })
}
// 查看错题支付
export function queryPay(params) {
    return request({
        url: '/v1/cuotijiexi/queryPay',
        method: 'get',
        params,
    })
}
// 结果页优惠券
export function getGoodsOrderCoupon(params) {
    return request({
        url: '/v1/paper_order/getGoodsOrderCoupon',
        method: 'get',
        params,
    })
}
// 结果页错题数量
export function getCuotiTotal(params) {
    return request({
        url: '/v1/cuotijiexi/getCuotiTotal',
        method: 'get',
        params,
    })
}
// 解读报告
export function getPl07Contentl(params) {
    return request({
        url: '/v1/mbti/pl07Content',
        method: 'get',
        params,
    })
}

// 支付
export function mbtipay(data) {
    return request({
        url: '/v1/mbti/pay',
        method: 'post',
        data,
        // showLoading: true
    })
}

// 查询支付状态
export function checKmbti(params) {
    return request({
        url: '/v1/mbti/queryPay',
        method: 'get',
        params
    })
}
export function uploadResultImg(data) {
    return request({
        url: '/v1/paper/uploadResultImg',
        method: 'post',
        data,
        // showLoading: true
    })
}
