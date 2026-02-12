// 提现
import request from '@/utils/request'

// 推广信息
export function info(params) {
    return request({
        url: '/brokerage/info',
        method: 'get',
        params,
    })
}

// 生成分享信息
export function createShareInfo(params) {
    return request({
        url: '/brokerage/createShareInfo',
        method: 'post',
        params,
    })
}

// 收益明细
export function yieldList(params) {
    return request({
        url: '/brokerage/yieldList',
        method: 'get',
        params,
    })
}

// 提现记录
export function withdrawList(params) {
    return request({
        url: '/brokerage/withdrawList',
        method: 'get',
        params,
    })
}

// 提现
export function withdrawApply(params) {
    return request({
        url: '/brokerage/withdrawApply',
        method: 'get',
        params,
    })
}

// 合作登记
export function businessApply(params) {
    return request({
        url: '/Backstage/businessApply',
        method: 'post',
        params,
    })
}

// 提现状态
export function wxTransferInfo(params) {
    return request({
        url: '/brokerage/wxTransferInfo',
        method: 'get',
        params,
    })
}

// 取消提现
export function wxTransferCancel(params) {
    return request({
        url: '/brokerage/wxTransferCancel',
        method: 'get',
        params,
    })
}