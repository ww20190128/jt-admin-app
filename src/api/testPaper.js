// 测评及测评订单相关的接口
import request from '@/utils/request'

// 获取测评详情
export function getTestPaperInfo(params) {
	return request({
		url: '/TestPaper/getTestPaperInfo',
		method: 'get',
		params,
		showLoading: true,
	})
}

// 创建测试
export function createTestOrder(params) {
	return request({
		url: '/TestPaper/createTestOrder',
		method: 'post',
		params,
		showLoading: true
	})
}

// 获取测试订单
export function getTestOrderInfo(params) {
	return request({
		url: '/TestPaper/getTestOrderInfo',
		method: 'get',
		params,
		showLoading: true
	})
}

// 根据订单号查询已做的题目getDetailAnswer
export function getAnswerRecord(params) {
	return request({
		url: '/TestPaper/getAnswerRecord',
		method: 'get',
		params,
		showLoading: true
	})
}

// 答案提交 answerSave
export function submitAnswers(params) {
	return request({
		url: '/TestPaper/submitAnswers',
		method: 'post',
		params,
	})
}

// 试卷提交 examPaperSave
export function submitTest(params) {
	return request({
		url: '/TestPaper/submitTest',
		method: 'post',
		params,
		showLoading: true
	})
}

// 重新测试 resetPaper
export function resetTestOrder(params) {
    return request({
        url: '/TestPaper/resetTestOrder',
        method: 'post',
        params,
        showLoading: true,
    })
}

// 修改测试订单 
export function updateTestOrder(params) {
    return request({
        url: '/TestPaper/updateTestOrder',
        method: 'post',
        params,
        showLoading: true,
    })
}

// 获取重测订单列表
export function getResetTestOrderList(params) {
    return request({
        url: '/TestPaper/resetTestOrderList',
        method: 'get',
        params
    })
}
// 创建重测订单
export function createResetTestOrder(params) {
    return request({
        url: '/TestPaper/createResetTestOrder',
        method: 'get',
        params
    })
}

// 是否显示历史订单按钮
export function showHistoryOrderButton(params) {
    return request({
        url: '/TestPaper/showHistoryOrderButton',
        method: 'get',
        params
    })
}

// 收藏或取消收藏
export function doCollect(params) {
    return request({
        url: '/Collect/doCollect',
        method: 'get',
        params
    })
}

// 收藏列表
export function getCollectList(params) {
    return request({
        url: '/Collect/collectList',
        method: 'get',
        params
    })
}