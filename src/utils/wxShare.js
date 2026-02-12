import {wxSignatureVerification} from '@/api/wx'
import {Toast} from 'vant'
//import wx from 'weixin-js-sdk';
import wx from 'weixin-jsapi';
//
		//要用到微信API								
function getJSSDK(url,shareData) {
  let params={url}
  wxSignatureVerification(params).then(res => {

    if(res.code!='2000')return Toast.fail('微信验签失败')
    let result=res.data.wxConfig
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: res.data.appId, // 必填，公众号的唯一标识
      timestamp: result.timestamp, // 必填，生成签名的时间戳
      nonceStr: result.nonceStr, // 必填，生成签名的随机串
      signature: result.signature, // 必填，签名
      jsApiList:[
        'onMenuShareTimeline', 
        'onMenuShareAppMessage'
      ] 
    })
    wx.ready(function () {
        //分享给微信朋友
      wx.onMenuShareAppMessage({
        title: shareData.title,
        desc: shareData.des,
        link: shareData.linkurl,
        imgUrl: shareData.img,
        success: function success(res) {
          Toast.success('分享成功')
        },
        cancel: function cancel(res) {
          console.log('已取消');
        },
        fail: function fail(res) {
          //alert(JSON.stringify(res));
        }
      });
      // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
      wx.onMenuShareTimeline({
        title: shareData.title,
        link: shareData.linkurl,
        imgUrl: shareData.img,
        success: function success(res) {
          //alert('已分享');
        },
        cancel: function cancel(res) {
          //alert('已取消');
        },
        fail: function fail(res) {
          //alert(JSON.stringify(res));
        }
      });
	// 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
    //   wx.onMenuShareQQ({
    //     title: shareData.title,
    //     desc: shareData.desc,
    //     link: shareData.linkurl,
    //     imgUrl: shareData.img,
    //     trigger: function trigger(res) {
    //       //alert('用户点击分享到QQ');
    //     },
    //     complete: function complete(res) {
    //       alert(JSON.stringify(res));
    //     },
    //     success: function success(res) {
    //       //alert('已分享');
    //     },
    //     cancel: function cancel(res) {
    //       //alert('已取消');
    //     },
    //     fail: function fail(res) {
    //       //alert(JSON.stringify(res));
    //     }
    //   });
      // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
    //   wx.onMenuShareWeibo({
    //     title: shareData.title,
    //     desc: shareData.desc,
    //     link: shareData.linkurl,
    //     imgUrl: shareData.img,
    //     trigger: function trigger(res) {
    //       //alert('用户点击分享到微博');
    //     },
    //     complete: function complete(res) {
    //       // alert(JSON.stringify(res));
    //     },
    //     success: function success(res) {
    //       //alert('已分享');
    //     },
    //     cancel: function cancel(res) {
    //       // alert('已取消');
    //     },
    //     fail: function fail(res) {
    //     // alert(JSON.stringify(res));
    //     }
    //   });
    })
    wx.error(function (res) {
      //alert("微信验证失败");
    });
  })
}
export default {
  // 获取JSSDK
  getJSSDK
}