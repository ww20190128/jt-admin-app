// 赠送
import request from '@/utils/request'

// 赠送/收到的订单 vipSendGoodsList
export function getGiveList(params) {
    return request({
        url: '/give/giveList',
        method: 'get',
        params,
    })
}

// 赠送/收到的订单 sendInfo
export function giveInfo(params) {
    return request({
        url: '/give/giveInfo',
        method: 'get',
        params,
    })
}

// 领取赠送的测评 receive
export function draw(params) {
    return request({
        url: '/give/draw',
        method: 'post',
        params,

    })
}

// 赠送 sendGoods
export function give(params) {
	return request({
		url: '/give/give',
		method: 'post',
		params,
		showLoading: true
	})
}