import wx from "weixin-js-sdk"; // 引入微信SDK
import { Toast } from "vant";

import { useAgent } from "@/hooks/useAgent";

// 微信-提现钩子
export const wxTransfer = async (params, successCallback, errCallback) => {
  const { isWeChat } = useAgent(); // 是否为微信登录
  if (!isWeChat) {
    // 微信外不执行
    return;
  }

  wx.config({
    debug: debug ? true : false,
    appId,
    timestamp,
    nonceStr,
    signature,
    jsApiList,
    openTagList,
  });
  wx.ready(function () {
    wx.checkJsApi({
      jsApiList: ["requestMerchantTransfer"],
      success: function (res) {
        if (res.checkResult["requestMerchantTransfer"]) {
          WeixinJSBridge.invoke(
            "requestMerchantTransfer",
            {
              mchId: params.mchId,
              appId: params.appId,
              package: params.packageInfo,
            },
            function (res) {
              if (res.err_msg === "requestMerchantTransfer:ok") {
                if (typeof successCallback === "function") {
                  successCallback(); // 用户确认后执行回调
                }
              }
              if (res.err_msg === "requestMerchantTransfer:fail") {
                if (typeof errCallback === "function") {
                  errCallback(); // 失败后执行回调
                }
              }
              if (res.err_msg === "requestMerchantTransfer:cancel") {
                if (typeof errCallback === "function") {
                  errCallback(); // 用户取消后执行回调
                }
              }
            },
          );
        } else {
          Toast("你的微信版本过低，请更新至最新版本。");
        }
      },
    });
  });
};
