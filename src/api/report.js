import request from '@/utils/request'
// 获取报告
export function getReportInfo(params) {
    return request({
        url: '/report/reportInfo',
        method: 'get',
        params
    })
}

// 报告收藏
export function reportCollect(params) {
    return request({
        url: '/report/reportCollect',
        method: 'get',
        params
    })
}

// 报告评论
export function reportComment(params) {
    return request({
        url: '/report/reportComment',
        method: 'get', // post
        params
    })
}

// 修改报告信息
export function updateReport(params) {
    return request({
        url: '/report/updateReport',
        method: 'get',
        params
    })
}

// 获取文章
export function getArticleInfo(params) {
    return request({
        url: '/report/articleInfo',
        method: 'get',
        params
    })
}

// 获取答题记录
export function getAnswerQuestionInfo(params) {
    return request({
        url: '/report/answerQuestionInfo',
        method: 'get',
        params
    })
}
