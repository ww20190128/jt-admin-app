// 正念
import request from '@/utils/request'

// 推广信息
export function info(params) {
    return request({
        url: '/mindfulness/info',
        method: 'get',
        params,
    })
}

// 根据分类Id获取数据
export function getListByClassify(params) {
    return request({
        url: '/mindfulness/getListByClassify',
        method: 'get',
        params,
    })
}

// 获取课程信息
export function getMindfulnessInfo(params) {
    return request({
        url: '/mindfulness/mindfulnessInfo',
        method: 'get',
        params,
    })
}