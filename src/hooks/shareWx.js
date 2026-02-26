
import wx from "weixin-js-sdk"; // 引入微信SDK
import { useAgent } from "@/hooks/useAgent";
//
export const shareWx = async (params, type = "testPaper") => {
  const { isWeChat } = useAgent(); // 是否为微信登录
  if (!isWeChat) {
    // 微信外不执行
    return;
  }
  // 获取微信的配置
  const {
    debug,
    appId,
    timestamp,
    nonceStr,
    signature,
    jsApiList,
    openTagList,
    url,
  } = await getWeChatConfig({ url: window.location.href });

  wx.config({
    debug: debug ? true : false,
    appId,
    timestamp,
    nonceStr,
    signature,
    jsApiList,
    openTagList,
  });
  let func = "";
  let funcParams = {};
  if (type === "app") {
    func = getShareAppInfo;
  } else if (type === "mindfulness") {
    func = getShareMindfulnessInfo;
    funcParams = {
      mindfulnessId: params.mindfulnessId,
    };
  } else if (type === "business") {
    func = getShareBusinessInfo;
  } else {
    // 默认测评
    func = getShareTestPaperInfo;
    funcParams = {
      testPaperId: params.testPaperId,
      link: params.link || "",
      promotionId: params.promotionId || 0,
      shareCode: params?.shareCode || "",
      desc: params?.desc || "",
    };
  }

  const { title, desc, link, imgUrl } = await func(funcParams);
  const shareData = {
    title,
    desc,
    link: params.link || link, // 如果传了link就用传递过来的link  没有则用接口返回的link
    imgUrl,
    success: () => {
      console.log("初始化分享成功！");
    },
  };
  wx.ready(() => {
    wx.updateAppMessageShareData(shareData);
    wx.updateTimelineShareData(shareData);
  });
};
