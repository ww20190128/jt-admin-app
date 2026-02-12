<template>
  <!-- 顶部图片 -->
  <div class="opened-content">
    <div class="top-card">
      <div class="app-name">
        <span>{{ wechatInfo?.short_name }}</span>
      </div>
      <img :src="wechatInfo.logo" class="logo" />
      <img :src="vipImg" class="vip-img" />
      <!-- vip信息 -->
      <div class="vip-info-wrap">
        <img v-if="false" :src="userInfo?.headImgUrl" class="avatar-img" />
        <img
          src="../../assets/images/vip.png"
          class="vip-icon"
          v-if="vipInfo?.name"
        />
      </div>
    </div>

    <div class="content-card">
      <div class="card-options">
        <div
          :class="{ active: currentIndex === index }"
          class="item"
          v-for="(item, index) in vipTypeList"
          :key="item.id"
          @click="currentIndex = index"
        >
          <div class="head-title">{{ item?.name }}</div>
          <div class="bottom">
            <div
              class="price"
              :class="{ delete: item?.newPrice >= 0 && currentIndex === index }"
            >
              ￥{{ item?.price }}
            </div>
            <div
              class="new-price"
              v-if="item?.newPrice >= 0 && currentIndex === index"
            >
              折后￥{{ item?.newPrice }}
            </div>
            <div class="text">
              {{ item?.desc }}
            </div>
          </div>
        </div>
      </div>

      <div class="coupon" v-if="current?.newPrice >= 0">
        <span class="tag">优惠券已抵扣</span>

        立减{{ (current.price - current?.newPrice).toFixed(2) }}元，{{
          current.name
        }}仅
        <strong class="price">{{ current?.newPrice }}元</strong>
      </div>
      <div class="rich-text vip-desc" v-html="current?.intro"></div>
    </div>
    <div class="bottom-card">
      <!-- 权益说明 -->
      <div class="rights-card-warp">
        <div class="head-warp"><span>vip会员专属福利</span></div>
        <div class="item-list">
          <div class="item" v-for="item in icons" :key="item">
            <img :src="item?.icon" />
            <p>{{ item?.text }}</p>
          </div>
        </div>
      </div>

      <div class="right-title">
        <img
          src="@/assets/images/gallup/arrow-left.png"
          class="arrow arrow-left"
        />
        <span class="text">专属权益</span>
        <img
          src="@/assets/images/gallup/arrow-left.png"
          class="arrow arrow-right"
        />
      </div>

      <div
        :class="{
          'position-left': index % 2 == 0,
          'position-right': index % 2 == 1,
        }"
        class="right-item"
        v-for="(item, index) in current?.content"
        :key="index"
      >
        <div class="tag" v-html="item.title"></div>
        <div class="desc" v-html="item.value"></div>
      </div>
      <!-- 
      <div class="right-title">
        <img src="@/assets/images/gallup/arrow-left.png" class="arrow arrow-left" />
        <span class="text">会员精选</span>
        <img src="@/assets/images/gallup/arrow-left.png" class="arrow arrow-right" />
      </div> -->

      <div class="vip-img">
        <img src="../../assets/images/vip-bg03.png" />
      </div>
    </div>
    <!-- 底部立即开通 -->
    <footer class="footer-warp">
      <footer class="footer-fixed">
        <!-- <router-link to="/home"> -->
        <div class="left-warp">
          <router-link class="item" to="/home">
            <img src="../../assets/images/icon/icon-home-on.png" />
            <p>测评大厅</p>
          </router-link>
        </div>
        <!-- </router-link> -->
        <div class="right-warp">
          <div
            class="button"
            @click="handlePay"
            v-if="!vipInfo?.name"
          >
            立即开通
          </div>
          <div class="button vip" @click="handleVipCenter" v-else>
            VIP权益生效中
          </div>
        </div>
      </footer>
    </footer>
  </div>

  <!-- PC微信扫码支付 -->
  <WeChatPayQr
    v-model:show="qrPayShow"
    :url="qrUrl"
    @confirm="qrConfirm"
    @cancel="qrConfirm"
  />

  <AgainPayDialog
    v-model:show="show"
    confirmText="已完成支付"
    cancelText="取消支付"
    content="正在获取支付状态，请确认是否已完成支付"
    @confirm="confirm"
    @cancel="cancel"
  />
</template>

<script>
import vip1 from "@/assets/images/vip-1.png";
import vip2 from "@/assets/images/vip-2.png";
import vip3 from "@/assets/images/vip-3.png";
import vip4 from "@/assets/images/vip-4.png";
import vip5 from "@/assets/images/vip-5.png";
import vip6 from "@/assets/images/vip-6.png";

import vipImg from "@/assets/images/vip-img01.png";

import { reactive, toRefs, computed, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import WeChatPayQr from "@/components/WeChatPayQr";
import AgainPayDialog from "@/components/AgainPayDialog";
import { useAgent } from "@/hooks/useAgent";
import { useStore } from "@/store";
import { Toast } from "vant";
import { shareWx } from "@/hooks/shareWx";

import qs from "qs";
import { parseQueryString } from "@/utils/tools";
import { loadingToast } from "@/plugins/vant";
import { useAuth } from "@/hooks/useAuth";
// api接口
import { getVipConfig } from "@/api/app";

import {
  createVipOrder,
  vipOrderPay,
  checkTestOrderPay,
  checkVipOrderPay,
} from "@/api/order";
export default {
  name: "vipOpened",
  components: {
    AgainPayDialog,
    WeChatPayQr,
  },
  setup() {
    const icons = [
      {
        icon: vip6,
        text: "会员任意测",
      },
      {
        icon: vip2,
        text: "赠送好友",
      },
      {
        icon: vip3,
        text: "长久保存",
      },
      {
        icon: vip1,
        text: "专业分析",
      },
      {
        icon: vip5,
        text: "详细解读",
      },
      {
        icon: vip4,
        text: "专属指导",
      },
    ];
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      show: false,
      time: 0,
      currentIndexuseAgent: 0,
      orderId: "",
      vipTypeList: [],
      qrPayShow: false,
      qrUrl: "",
      timer: null,
      currentIndex: 0,
      couponInfo: {}, // 用户优惠卷信息
      vipInfo:{}
    });

    const { md, isWeChat, ua, network, os } = useAgent();
    const { couponId } = route.query; // couponId  优惠券ID
    const wechatInfo = computed(() => store.getters.wechatInfo);
    const userInfo = computed(() => store.getters.userInfo);
    useAuth(
      {
        authType: 1,
      },
      () => {
        shareWx({}, "app");
        init();
        const { fromType, orderId } = route.query;
        if (fromType === "pay") {
          state.orderId = orderId;
          poll(10);
        }
      }
    );

    // 获取套餐列表
    async function init() {
      try {
        const { vipConfigList, couponInfo, vipInfo } = await getVipConfig({ couponId });
        state.vipInfo = vipInfo;
        // 有优惠券
        if (couponInfo?.id) {
          state.couponInfo = couponInfo;
          if (state.couponInfo.forVip == 1) {
            // 对vip有效
            const [id] = couponInfo.targetIds; // 作用的vip  ID
            const index = vipConfigList.findIndex((item) => item.id === id);
            if (index !== -1) {
              state.currentIndex = index;
            }
            vipConfigList.map((item) => {
              let value = item.price;
              if (state.couponInfo.type == 1) {
                // 现金抵扣券
                value = item.price - state.couponInfo.value;
              } else if (state.couponInfo.type == 4) {
                // VIP 折扣券
                value = item.price * state.couponInfo.value * 0.01;
              }
              const newPrice = value < 0 ? 0 : value.toFixed(2);
              if (
                state.couponInfo.targetIds.includes(item.id) ||
                state.couponInfo.targetIds.length === 0
              ) {
                item.newPrice = newPrice;
              }
            });
          }
        }
      
        state.vipTypeList = vipConfigList;
      } catch (error) {}
    }
    // 当前选择的tab
    const current = computed(() => state.vipTypeList[state.currentIndex]);

    // 开通VIP
    async function handlePay() {
      const loading = loadingToast("创建订单中...");
      clearTimeout(state.timer);
      state.timer = null;
      state.time = 0;
      const { testPaperId } = route.query;
      try {
        // 设备信息
        const { width, height } = window.screen;
        const deviceInfo = {
          phoneModel: "",
          browserVersion: ua,
          screenResolution: `${width}*${height}`,
          network,
          useEnv: isWeChat ? 1 : 2,
          ...route.query,
        };
        if (os == "iOS") {
          deviceInfo.phoneModel = md.os() + md.version("iPhone");
        } else if (os == "AndroidOS") {
          deviceInfo.phoneModel = md.os() + md.version("Android");
        }
        const { id } = state.vipTypeList[state.currentIndex];
        // 创建vip支付订单
        const { orderId } = await createVipOrder({
          vipId: id,
          testPaperId: testPaperId,
          couponId: couponId,
          ...deviceInfo,
        });
        state.orderId = orderId;
        // 支付类型
        const { env } = useAgent();
        const payType = {
          "wechat-mobile": "JSAPI",
          "wechat-pc": "NATIVE",
          // "browser-mobile": "NATIVE",
          "browser-mobile": "MWEB", // 移动端浏览器支付
          "browser-pc": "NATIVE", // pc浏览器支付
        };
        const tradeType = payType[env]; // 交易类型

        const query = parseQueryString(window.location.href);
        const search = qs.stringify({
          ...query,
          fromType: "pay",
          orderId,
          testPaperId,
        });
        const redirectUrl = `${window.location.origin}/vipOpened?${search}`;

        const { info } = await vipOrderPay({
          // 订单支付
          orderId: state.orderId,
          paymentType: 1, // 微信支付
          redirectUrl,
          tradeType, // 支付类型
          couponId: current.value.newPrice ? couponId : 0,
        });

        loading?.clear();
        switch (env) {
          case "browser-mobile": // H5支付
            if (info.mweb_url) {
              // 微信
              window.location.replace(info.mweb_url);
            } else {
              // 支付宝
              let divForm = document.getElementsByTagName("divform");
              if (divForm.length) {
                document.body.removeChild(divForm[0]);
              }
              const div = document.createElement("divform");
              div.innerHTML = info;
              document.body.appendChild(div);
              document.forms[0].submit();
            }
            break;
          case "wechat-mobile": // 微信浏览器内支付
            wechatPay(info);
            break;
          case "wechat-pc": // 微信浏览器内支付
            qrPay(info);
            break;
          case "browser-pc": // 微信浏览器内支付
            qrPay(info);
        }
      } catch (error) {
        loading?.clear();
      }
    }
    function qrPay({ code_url }) {
      state.qrUrl = code_url;
      state.qrPayShow = true;
      qrPoll(180);
    }

    // 微信浏览器内支付
    function wechatPay(info) {
      WeixinJSBridge?.invoke("getBrandWCPayRequest", info, (res) => {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          goVipCenter();
        } else {
          state.show = true;
        }
      });
    }
    // PC二维码轮询
    async function qrPoll(count) {
      try {
        const { needPay } = await checkVipOrderPay({
          orderId: state.orderId,
        });
        if (needPay === 0) {
          // 已完成支付
          goVipCenter(); // 跳转支付引导页
        } else {
          //
          state.timer = window.setTimeout(() => {
            state.time++;
            if (state.time > count) {
              Toast("暂未查询到支付订单，如已支付请关注公众号联系客服处理");
              return;
            }
            qrPoll(count);
          }, 1000);
        }
      } catch (error) {}
    }
    // 组件卸载前清除定时器
    onBeforeUnmount(() => {
      clearTimeout(state.timer);
      state.timer = null;
    });
    function qrConfirm() {
      state.qrPayShow = false;
      clearTimeout(state.timer);
      state.timer = null;
      state.time = 0;
      qrPoll(1);
    }
    // 轮询查询支付状态
    async function poll(count, isConfirm) {
      if (!state.toast && state.time < 5) {
        state.toast = loadingToast("查询订单中...");
      }
      try {
        const { needPay } = await checkVipOrderPay({
          orderId: state.orderId,
        });
        if (needPay !== 1) {
          state.toast?.clear();
          goVipCenter();
        } else {
          state.timer = window.setTimeout(() => {
            state.time++;

            // 轮询到第5秒时清除loading 显示错误弹窗  但是继续轮询
            if (state.time === 5) {
              state.toast?.clear();
              state.toast = null;
              if (isConfirm) {
                Toast("暂未查询到支付订单，如已支付请关注公众号联系客服处理");
              } else {
                state.show = true;
              }
            }
            if (state.time > count) {
              return;
            }
            poll(count, isConfirm);
          }, 1000);
        }
      } catch (error) {
        state.toast?.clear();
      }
    }

    // 已完成支付
    async function confirm() {
      clearTimeout(state.timer);
      state.timer = null;
      state.time = 0;
      poll(5, true);
    }
    // 取消
    function cancel() {
      state.show = false;
    }

    async function goVipCenter() {
      if (isWeChat) {
        await store.dispatch("user/getUserInfo");
      }
      const { testOrderId, testPaperId, promotionId, fromName } = route.query;
      if (fromName === "pay") {
        // ww 注释，不知道是干什么用的
        // await buyVipCallback({ testOrderId });
        const { needPay } = await checkTestOrderPay({ testOrderId });
        if (needPay !== 1) {
          router.replace({
            path: "/report",
            query: {
              testOrderId,
              testPaperId,
              promotionId,
            },
          });
        } else {
          Toast("未查询到订单支付状态");
        }
      } else {
        if (isWeChat) {
          router.replace("/vipCenter");
        } else {
          router.replace("/vipOpenedSuccess");
        }
      }
    }
    // 开通VIP
    function handleVipCenter() {
      if (isWeChat) {
        router.replace("/vipCenter");
      } else {
        router.replace("/vipOpenedSuccess");
      }
    }
    return {
      qrConfirm,
      confirm,
      cancel,
      handlePay,
      ...toRefs(state),
      icons,
      current,
      wechatInfo,
      vipImg,
      userInfo,
      handleVipCenter,
    };
  },
};
</script>

<style lang="less" scoped>
.opened-content {
  position: relative;
  background-color: #b3d8fc;
  padding-top: 30px;
  margin-bottom: 20px;

  .top-card {
    background-image: url("../../assets/images/vip-bg01.png");
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    margin-top: 0px !important;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin: auto 15px;
    height: 80px;
    position: relative;

    .logo {
      position: absolute;
      border-radius: 50%;
      width: 38px;
      height: 38px;
      top: 40px;
      left: 10px;
      border: 2px solid #d2e1f0;
    }

    .vip-img {
      display: none;
      position: absolute;
      width: 30px;
      height: auto;
      top: 5px;
      left: 50px;
    }

    .app-name {
      position: absolute;
      top: 10px;
      left: 10px;

      span {
        font-size: 20px;
        font-weight: 500;
      }
    }

    .vip-info-wrap {
      height: 100%;
      width: 30%;
      position: absolute;
      right: 0px;
      top: 0px;
      height: 100%;
      text-align: center;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      .vip-icon {
        width: 60px;
      }
    }
  }

  // 内容
  .content-card {
    background-color: #fff;
    padding: 20px 10px;

    .card-options {
      text-align: center;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      .item {
        // width: 32%;
        width: 100%;
        border-radius: 5px;
        overflow: hidden;
        background-color: #f9f9f9;
        border: 1px solid #fde0b1;
        font-size: @font-size-sm;
        // margin-right: 2%;
        margin-bottom: 2%;
        // transform: skew(-5deg);

        &:nth-child(3n) {
          margin-right: 0;
        }

        .head-title {
          background-color: #ffd79b;
          color: #fff;
          height: 30px;
          line-height: 30px;
          position: relative;

          font-size: @font-size-lg;
        }

        .bottom {
          padding: @padding-sm;

          .price {
            font-size: 22px;
            font-weight: 400;
            color: @light-black;

            &.delete {
              font-size: 14px !important;
              text-decoration: line-through;
            }
          }

          .new-price {
            // background-color: @theme-color;
            color: @light-black;
            font-size: 16px;
            border-radius: 3px;
            padding: 4px 0;
          }

          .text {
            color: @light-black;
            padding-top: 5px;
          }
        }
      }

      .active {
        border-color: #fff9f0;
        background: #b3d8fc;

        .head-title {
          background-color: #fc7f7f;
        }

        .new-price,
        .price,
        .text {
          color: #fff !important;
        }
      }
    }

    .coupon {
      color: #c96500;
      // background: linear-gradient(270deg,
      //     rgba(242, 227, 85, 1) 0%,
      //     rgba(252, 232, 48, 1) 100%);
      background-color: #ffe0b1;
      width: 100%;
      height: 50px;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;

      .tag {
        background-color: #f79d00;
        color: #fff;
        padding: 4px 6px;
        border-radius: 4px;
        margin-right: 4px;
      }

      strong {
        font-size: 16px;
        color: @theme-color;
      }
    }

    .vip-desc {
      padding: 10px;
      width: 100%;
      margin-top: 10px;
      line-height: 25px;
      font-size: @font-size-base;
      color: @gray-color;
      text-align: left;
      // height: 150px;
      height: 100px;
      overflow: hidden;
    }
  }

  .bottom-card {
    position: relative;

    background-color: #f8f8f8;
    padding: 40px 25px 50px 25px;

    .rights-card-warp {
      background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
      border-radius: 15px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      position: relative;
      padding: 10px;

      .head-warp {
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        width: 60%;
        text-align: center;

        height: 35px;
        line-height: 35px;

        background-image: linear-gradient(to right, #ffdb9f 0%, #ffdb9f 100%);
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateY(-30%) translateX(-50%);
        z-index: 1;

        span {
          font-size: 22px;
          font-weight: 500;
          color: #fff;
          // color: rgb(100, 95, 95);
        }

        &:before {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          left: -12px;
          top: 0px;
          background-color: inherit;
          filter: brightness(0.7);
          clip-path: polygon(0 100%, 100% 0, 100% 100%);
          background-color: #fcd496;
        }

        &:after {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          right: -12px;
          top: 0px;
          background-color: inherit;
          filter: brightness(0.8);
          clip-path: polygon(0 0, 0 100%, 100% 100%);
          background-color: #fcd496;
        }
      }

      .item-list {
        position: relative;
        border: 1px solid #fff;
        border-radius: 15px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        padding-top: 35px;
        padding-bottom: 25px;
        // padding-left: 5px;
        // padding-right: 5px;

        .item {
          border-radius: 5px;
          background-image: linear-gradient(
            to bottom,
            #f5e9c9 0%,
            #ddc893 100%
          );
          margin: 15px 10px;
          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 15px 0px;

          img {
            height: 50px;
            width: auto;
            margin-bottom: 10px;
          }

          p {
            color: #fff;
            text-align: center;
            font-size: 16px !important;
            font-weight: 300;
          }
        }
      }
    }

    .right-title {
      color: #a1c4fd;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;

      padding-top: 40px;
      margin-bottom: 15px;

      .text {
        padding: 0 8px;
      }

      span {
        font-size: 22px;
      }

      .arrow {
        width: 80px;

        &.arrow-right {
          transform: rotate(-180deg);
        }
      }
    }

    .right-item {
      &.position-left {
        .tag {
          background-color: #c2e9fb;
          z-index: 1;
          left: 0;
        }

        .desc {
          background-color: #f3da86;
          padding-left: 30px;
          padding-right: 10px;
          left: 40px;
          justify-content: flex-start;
        }
      }

      &.position-right {
        .tag {
          background-image: linear-gradient(120deg, #f6d365 0%, #f3da86 100%);
          right: 0;
          z-index: 1;
        }

        .desc {
          background-color: #a1c4fd;
          padding-right: 30px;
          padding-left: 10px;
          right: 40px;
          justify-content: flex-end;
        }
      }

      height: 65px;
      width: 100%;

      margin-top: 0px;
      position: relative;

      .tag {
        position: absolute;
        border: 3px solid #f8f8f8;
        top: 0;

        text-align: center;
        width: 65px;
        border-radius: 50px;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: @font-size-lg;
        padding: 10px;
        color: #fff;
      }

      .desc {
        position: absolute;
        top: 50%;
        transform: translateY(-50%) translateX(0%);
        width: calc(100% - 90px);

        font-size: @font-size-base;
        color: #fff;
        height: 48px;
        display: flex;
        align-items: center;
        border-radius: 5px;
      }
    }
  }

  .vip-img {
    text-align: center;
    width: 70%;
    height: auto;
    margin: auto;
  }
}

:deep(.rich-text) {
  img {
    width: 100%;
  }
}

.footer-fixed {
  z-index: 999;
  box-shadow: 0px 0px 4px #e8e8e8;
  border-top-left-radius: 10px;
  border-top-right-radius: 50px;
  .fixed-bottom();
  .space-between();
  width: 100%;

  .left-warp {
    width: 25%;
  }

  .right-warp {
    box-shadow: 0px 0px 4px #e8e8e8;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    width: 75%;
    height: 50px;
    position: absolute;
    bottom: 0;
    right: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    // padding: 5px @padding-base;
    .button {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      height: 100%;
      color: #fff;
      font-size: 19px;
      font-weight: bold;
      letter-spacing: 5px;
      .align-center();
      justify-content: center;
      background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
      // border-radius: 50px;
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        width: 100px;
        height: 1px;
        top: 50%;
        left: -100px;
        background-color: rgba(#fff, 0.4);
        transform: rotate(-45deg);
        animation: blink 2.2s ease-in-out 2s infinite;
      }
      &.vip {
        background: linear-gradient(
          to right,
          rgb(255, 242, 129),
          rgb(231, 202, 0)
        );
        color: #a66300;
        letter-spacing: 1px;
        flex-direction: column;

        .text {
          font-size: @font-size-sm;
          font-weight: normal;
        }
      }
    }
  }

  // 左边
  .left-warp {
    .space-between();

    .item {
      flex: 1;
      .align-center();
      .pointer();
      flex-direction: column;
      justify-content: center;
      font-size: @font-size-sm;

      img {
        width: 21px;
      }
    }
  }
}

.disabled {
  color: #dadada;
}

@keyframes blink {
  0% {
    left: -50px;
  }

  100% {
    left: 100%;
  }
}
</style>
