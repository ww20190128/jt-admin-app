// 首页
import request from "@/utils/request";

// 登录
export function userLogin(params) {
  return request({
    url: "/login",
    method: "post",
    params,
  });
}
