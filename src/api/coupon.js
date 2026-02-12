// 优惠券
import request from '@/utils/request'

// 用户优惠券列表 userCouponList
export function getUserCouponList(params) {
    return request({
        url: '/coupon/couponList',
        method: 'get',
        params,
    })
}

// 优惠券详情 
export function couponInfo(params) {
    return request({
        url: '/coupon/couponInfo',
        method: 'get',
        params,
    })
}

// 根据优惠券获取测评
export function getListByCouponId(params) {
    return request({
        url: '/coupon/getListByCouponId',
        method: 'get',
        params,
    })
}

// 领取优惠券 
export function receive(params) {
    return request({
        url: '/coupon/receive',
        method: 'get',
        params,
        showLoading: true,
    })
}