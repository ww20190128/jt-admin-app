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