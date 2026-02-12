// 推广相关的接口
import request from '@/utils/request'
export function getPromotionInfo(params) {
	return request({
		url: '/Promotion/getPromotionInfo',
		method: 'get',
		params,
		showLoading: true,
	})
}

// 促销相关的接口
export function getPromotionInfo2(params) {
	return request({
		url: '/Promotion/getPromotionInfo2',
		method: 'get',
		params,
		showLoading: true,
	})
}