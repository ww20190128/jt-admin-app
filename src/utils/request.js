import axios from "axios";
import { Toast, Dialog } from "vant";
import { removeToken } from "@/utils/auth";
import { loadingToast } from "@/plugins/vant";
import { store } from "@/store";
import { useAgent } from "@/hooks/useAgent";
import { parseQueryString } from "@/utils/tools";
import { router } from "../router";
import { h } from "vue";
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 接口地址
  timeout: 30 * 1000, // 超时时间
});
import loginImg from "@/assets/images/login.png"; // 登录图片
// 请求前拦截
service.interceptors.request.use(
  (config) => {
    if (config.showLoading) {
      window.loading?.clear?.();
      window.loading = loadingToast();
    }
    const token = store.getters.token;
    if (token) {
      config.headers["Authorization"] = token.includes("Bearer")
        ? token
        : "Bearer " + token;
    }
    const { pmerch } = parseQueryString(window.location.href);
    if (pmerch) {
      config.headers["X-Pmerch"] = pmerch;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 请求后拦截{"status":0,"errorCode":"","data":{"testId":"1"}}
service.interceptors.response.use(
  (response) => {
    const status = response.data.status; // 请求状态码
    const responseData = response.data.data; // 获取的数据
    window.loading?.clear?.();
    if (status !== 0) {
      // 请求异常
      if (status === 2) {
        // 重新登陆
        Toast("登录已失效，请重新登录");
        removeToken();
        const { isWeChat } = useAgent();
        if (isWeChat) {
          // window.setTimeout(() => {
          //     window.location.reload()
          // }, 500);

          try {
            Dialog.alert({
              title: "请先登录再进行操作",

              message: h("div", { class: "dialog-tips" }, [
                h("img", { class: "icon", src: loginImg }),
                h("p", { class: "text" }, ""),
              ]),

              theme: "round-button",
              showCancelButton: true,
              cancelButtonText: "去首页",
              confirmButtonText: "立即登录",
              confirmButtonColor: "#ff5d7d",
              cancelButtonColor: "#6EA9FB",
              onConfirm: () => {
                store.dispatch("user/auth", { authType: 2 });
                // store.dispatch('user/auth', { authType: 2, redirectUrl: `${window.location.origin}/user` })
              },
              onCancel: () => {
                router.replace("/");
              },
            });
          } catch (error) {
            router.replace("/");
          }
        } else {
          router.replace("/");
        }
      } else {
        // 提示错误码
        const errorCode = response.data?.errorCode; // 错误码
        if (!response.config.hideErrorMessage) {
          Toast(errorCode || "加载错误，请刷新页面重试~");
          window.loading?.clear?.();
          return Promise.reject(errorCode);
        }
      }
      return Promise.reject(responseData || "网络错误，请重试~");
    } else {
      // 请求正常，返回数据
      return responseData;
    }
  },
  (error) => {
    // Toast('网络异常，请重试~')
    console.error("错误信息：", error);
    window.loading?.clear?.();
    return Promise.reject(error);
  }
);
export default service;
