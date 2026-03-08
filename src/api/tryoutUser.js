// 首页
import request from "@/utils/request";

// 体验帐号列表
export function tryoutuserlist(params) {
  return request({
    url: "/agent/tryoutuserlist",
    method: "get",
    params: params,
  });
}

// 体验帐号创建
export function tryoutuseradd(params) {
  return request({
    url: "/agent/tryoutuseradd",
    method: "post",
    data: params,
  });
}
// 体验帐号修改密码接口
export function tryoutuserchangepwd(params) {
  return request({
    url: "/agent/tryoutuserchangepwd",
    method: "post",
    data: params,
  });
}
