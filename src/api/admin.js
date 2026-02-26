// 首页
import request from "@/utils/request";

// 登录
export function userLogin(params) {
  return request({
    url: "/login",
    method: "post",
    data: params,
  });
}

// 获取用户信息
export function getUserInfo(params) {
  return request({
    url: "/getinfo",
    method: "get",
    data: params,
  });
}

// 获取代理列表
export function getAgentTopupList(params) {
  return request({
    url: "/agent/topuplist",
    method: "get",
    params: params,
  });
}

// 获取用户列表
export function getMembersList(params) {
  return request({
    url: "/members/list",
    method: "get",
    params: params,
  });
}

// 创建用户
export function buyvip(params) {
  return request({
    url: "/members/buyvip",
    method: "post",
    data: params,
  });
}
// 获取方案
export function getPlan(params) {
  return request({
    url: "/plan/" + params.id,
    method: "get",
    params: params,
  });
}
// 更新方案
export function setPlan(params) {
  return request({
    url: "/plan/" + params.id,
    method: "post",
    data: params,
  });
}
// 充值审核
export function topuplist(params) {
  return request({
    url: "/agent/topuplist",
    method: "get",
    params: params,
  });
}

// 上传图片
export function uploadFile(params) {
  return request({
    url: "/public/uploadFile",
    method: "post",
    data: params,
  });
}

// 充值
export function topup(params) {
  return request({
    url: "/agent/topup",
    method: "post",
    data: params,
  });
}

// 训练记录
export function trainlog(params) {
  return request({
    url: "/members/trainlog",
    method: "post",
    data: params,
  });
}

// 游戏列表
export function gameList(params) {
  return request({
    url: "/games/list",
    method: "get",
    params: params,
  });
}
