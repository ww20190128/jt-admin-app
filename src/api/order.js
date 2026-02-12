// 订单
import request from '@/utils/request'

// 创建vip支付订单
export function createVipOrder(params) {
    return request({
        url: '/order/createVipOrder',
        method: 'get',
        params
    })
}

// vip订单支付
export function vipOrderPay(params) {
    return request({
        url: '/order/vipOrderPay',
        method: 'post',
        params
    })
}

// 测评订单支付
export function testOrderPay(params) {
    return request({
        url: '/order/testOrderPay',
        method: 'post',
        params
    })
}

// 检测测评订单是否支付 checkGoodsOrder
export function checkTestOrderPay(params) {
    params.t = new Date().getTime()
    return request({
        url: '/order/checkTestOrderPay',
        method: 'get',
        params,
    })
}

// 检测vip订单是否支付 checkGoodsOrder
export function checkVipOrderPay(params) {
    params.t = new Date().getTime()
    return request({
        url: '/order/checkVipOrderPay',
        method: 'get',
        params,
    })
}

// 创建正念课程支付订单
export function createMindfulnessOrder(params) {
    return request({
        url: '/order/createMindfulnessOrder',
        method: 'get',
        params
    })
}

// 正念课程订单支付
export function mindfulnessOrderPay(params) {
    return request({
        url: '/order/mindfulnessOrderPay',
        method: 'post',
        params
    })
}

// 检测正念订单是否支付
export function checkMindfulnessOrderPay(params) {
    params.t = new Date().getTime()
    return request({
        url: '/order/checkMindfulnessOrderPay',
        method: 'get',
        params,
    })
}