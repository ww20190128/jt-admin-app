<template>
  <!-- 正念详情页 -->
  <div
    class="mindfulness-detail-warper"
    v-if="mindfulness && mindfulness.coverImg"
  >
    <!-- 图片 -->
    <div
      class="main-img-warper"
      :style="{ backgroundImage: `url(${mindfulness.coverImg})` }"
    >
      <div class="top-warper">
        <div class="left"></div>
        <div class="right"></div>
      </div>
      <div class="bottom-warper">
        <div class="left">
          <div class="info-tag">
            <span class="type">{{
              mindfulness.audioNum > 1 ? "系列" : "单课"
            }}</span
            ><span class="time">{{ mindfulness.totalTime }}分钟</span>
          </div>
        </div>
        <div class="right">
          <!-- 收藏按钮 -->
          <div
            class="collect-tag"
            :class="{ collected: mindfulness.collectStatus == 1 }"
            @click="handleDoCollect"
          >
            <i class="fa fa-heart" v-if="mindfulness.collectStatus == 1"></i>
            <i class="fa fa-heart-o" v-else></i>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-warper">
      <div class="top">
        <div
          class="tag-list"
          v-if="mindfulness.tagList && mindfulness.tagList.length > 0"
        >
          <div
            class="item"
            v-for="(item, index) in mindfulness.tagList"
            :class="{
              'orange-tag': index % 3 === 0,
              'purple-tag': index % 3 === 1,
              'green-tag': index % 3 === 2,
            }"
          >
            {{ item }}
          </div>
        </div>
        <div class="desc-warper">
          <div class="tag-name" v-if="mindfulness.desc">简介</div>
          <div
            class="desc"
            v-if="mindfulness.desc"
            v-html="mindfulness.desc"
          ></div>
          <div class="tag-name" v-if="mindfulness.fit">适用</div>
          <div
            class="fit"
            v-if="mindfulness.fit"
            v-html="mindfulness.fit"
          ></div>
        </div>
      </div>
      <div class="audio-list-title-warper">
        <div class="left">冥想技巧</div>
        <div
          class="right"
          @click="handleOpenVip"
          v-show="!userInfo?.vipInfo?.name && mindfulness.payStatus != 1"
        >
          <div class="button">立即解锁 VIP专属课</div>
          <div class="taps">限时活动 专属特惠</div>
        </div>
      </div>

      <div class="audio-list-warper">
        <div
          class="item"
          v-for="item in audioList"
          @click="handlePlayItem(item)"
        >
          <div
            class="play-icon"
            :class="{ current: gbPlayerState?.currentItem?.id == item.id }"
          >
            <div v-show="gbPlayerState?.state || true">
              <!-- 课程未解锁 -->
              <div v-if="item.payStatus == 2">
                <i class="fa fa-lock"></i>
              </div>
              <!-- 当前播放中 -->
              <div v-else-if="gbPlayerState?.currentItem?.id == item.id">
                <!-- 暂停中 -->
                <i
                  v-if="gbPlayerState?.state != 'playing'"
                  class="fa fa-play play"
                ></i>
                <!-- 播放中 -->
                <i v-else class="fa fa-pause"></i>
              </div>
              <!-- 等待播放 -->
              <div v-else>
                <i class="fa fa-play play"></i>
              </div>
            </div>
          </div>
          <div class="index">第{{ item.index }}部分</div>
          <div class="name">{{ item.name }}</div>

          <!-- 当前部分的音频 -->
          <div
            class="current-tag"
            v-if="gbPlayerState?.currentItem?.id == item.id"
          >
            <i
              class="show-pause"
              :class="{ playing: gbPlayerState?.state == 'playing' }"
            ></i>
          </div>
          <div
            class="tag"
            v-if="
              gbPlayerState?.currentItem?.id != item.id && item.showFreeTag == 1
            "
          >
            免费试听
          </div>
        </div>
      </div>
      <!-- 冥想技巧 -->
      <div></div>
      <!-- 相关冥想练习 -->
      <div></div>
      <!-- 相关文章 -->
    </div>
  </div>

  <!-- 支付相关 -->
  <OpenVipDialog
    v-model:show="openVipDialogShow"
    :mindfulness="mindfulness"
    :vipTypeList="vipTypeList"
    @handlePay="handlePay"
  ></OpenVipDialog>
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
import ClassifyBar from "./components/classifyBar";
import { reactive, toRefs, computed, onMounted, inject, provide } from "vue";

import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import CardList from "./components/CardList";
import OpenVipDialog from "./components/OpenVipDialog";
import { getMindfulnessInfo } from "@/api/mindfulness";
import { Toast } from "vant";

import { shareWx } from "@/hooks/shareWx";
import { doCollect } from "@/api/testPaper";

// api接口
import { useAgent } from "@/hooks/useAgent";
import { getVipConfig } from "@/api/app";
// 支付相关
import { loadingToast } from "@/plugins/vant";
import { parseQueryString } from "@/utils/tools";
import qs from "qs";
import {
  createMindfulnessOrder,
  mindfulnessOrderPay,
  checkMindfulnessOrderPay,
  createVipOrder,
  vipOrderPay,
} from "@/api/order";
import WeChatPayQr from "@/components/WeChatPayQr";
import AgainPayDialog from "@/components/AgainPayDialog";
export default {
  name: "mindfulnessDetail",
  components: {
    ClassifyBar,
    CardList,
    OpenVipDialog,
    AgainPayDialog,
    WeChatPayQr,
  },
  props: {},
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const { mindfulnessId } = route.query;
    // 调用全局播放器
    let gbPlayer = inject("gbPlayer");
    let gbPlayerState = inject("gbPlayerState");
    const state = reactive({
      mindfulness: {},
      audioList: [],
      openVipDialogShow: false,
      vipTypeList: [], // vip配置
      userInfo: {},
      // 支付相关
      orderId: "",
      qrPayShow: false,
      show: false,
      qrUrl: "",
      time: 0,
      timer: null,
      playAudioList: [],
    });
    const { md, isWeChat, ua, network, os } = useAgent();
    // 授权钩子
    useAuth(
      {
        authType: 2,
      },
      async () => {
        init();
        shareWx({ mindfulnessId: mindfulnessId }, "mindfulness");
        const { fromType, orderId } = route.query;
        if (fromType === "pay") {
          state.orderId = orderId;
          poll(10);
        }
      }
    );
    // 获取详情
    async function init() {
      try {
        const {
          userInfo,
          mindfulness, // 课程详情
          audioList, // 课程列表
        } = await getMindfulnessInfo({
          mindfulnessId: mindfulnessId, // 测评ID
        });
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute("content", mindfulness.name);
        document.title = mindfulness.name;
        state.mindfulness = mindfulness;
        state.audioList = audioList;
        state.userInfo = userInfo;
        try {
          const { vipConfigList } = await getVipConfig({});
          state.vipTypeList = vipConfigList;
        } catch (error) {}

        let newAudioList = [];
        state.audioList.forEach((audioItem) => {
          if (audioItem.payStatus != 2) {
            let newItem = {
              id: audioItem.id,
              name: audioItem.name,
              artist: audioItem.artist,
              url: audioItem.url,
              cover: state.mindfulness.coverImg,
              lrc: audioItem.lrc,
              mindfulnessId: state.mindfulness.id,
              mindfulnessName: state.mindfulness.name,
            };
            newAudioList.push(newItem);
          }
        });
        state.playAudioList = newAudioList;
      } catch (error) {}
    }
    // 课程播放切换
    function handlePlayItem(item) {
      if (item.payStatus == 1) {
        // 已解锁
        if (
          gbPlayerState?.value?.currentItem?.id &&
          gbPlayerState?.value?.currentItem?.id === item.id
        ) {
          // 当前有播放的内容
          gbPlayer.value.toggle();
        } else {
          // 当前无播放的内容，从头开始播放
          // 新的次序
          const newAudioIndex = state.audioList.findIndex(
            (audio) => audio.id === item.id
          );
          if (gbPlayerState?.value?.currentItem?.mindfulnessId) {
            // 当前有播放
            if (
              gbPlayerState?.value?.currentItem?.mindfulnessId !=
              state.mindfulness.id
            ) {
              // 非当前合集
              setTimeout(() => {
                gbPlayer.value.list.clear(); // 清空
                gbPlayer.value.list.add(state.playAudioList);
                gbPlayer.value.list.index = newAudioIndex;
                // gbPlayer.value.list.show(); // 默认显示列表
                gbPlayer.value.lrc.hide();
                gbPlayer.value.lrc.show = false; // 默认显示歌词
                gbPlayerState.value.show = false; // 显示播放组件
                // 先暂停 ，再切换
                gbPlayer?.value.pause();
                gbPlayer?.value?.list.switch(newAudioIndex);
                gbPlayer?.value.play();
              }, 500);
            } else {
              // 当前合集，切换
              gbPlayer?.value?.list.switch(newAudioIndex);
            }
          } else {
            // 当前无播放次序
            setTimeout(() => {
              gbPlayer.value.list.clear(); // 清空
              gbPlayer.value.list.add(state.playAudioList);
              // gbPlayer.value.list.show(); // 默认显示列表
              gbPlayer.value.lrc.hide();
              gbPlayer.value.lrc.show = false; // 默认显示歌词
              gbPlayerState.value.show = false; // 显示播放组件
              // 先暂停 ，再切换
              gbPlayer?.value.pause();
              gbPlayer?.value?.list.switch(newAudioIndex);
              gbPlayer?.value.play();
            }, 500);
          }
        }
      } else {
        // 开通VIP
        state.openVipDialogShow = true;
      }
    }
    // 收藏或取消收藏
    async function handleDoCollect() {
      if (!state.mindfulness.id) {
        return false;
      }
      const { collectStatus } = await doCollect({
        mindfulnessId: mindfulnessId,
      });
      state.mindfulness.collectStatus = collectStatus;
      Toast(state.mindfulness.collectStatus === 0 ? "取消收藏" : "加入收藏");
    }
    function handleOpenVip() {
      state.openVipDialogShow = true;
    }
    // 支付相关
    async function handlePay(selectPayType) {
      const loading = loadingToast("创建订单中...");
      clearTimeout(state.timer);
      state.timer = null;
      state.time = 0;
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
        // 支付类型
        const { env } = useAgent();
        const payType = {
          "wechat-mobile": "JSAPI",
          "wechat-pc": "NATIVE",
          "browser-mobile": "MWEB",
          "browser-pc": "NATIVE",
        };
        const tradeType = payType[env]; // 交易类型
        let order_info = {};
        if (selectPayType == 999) {
          // 单课程
          // 创建课程支付订单
          const { orderId } = await createMindfulnessOrder({
            mindfulnessId: mindfulnessId,
            ...deviceInfo,
          });
          state.orderId = orderId;
          const query = parseQueryString(window.location.href);
          const search = qs.stringify({
            ...query,
            fromType: "pay",
            orderId,
            mindfulnessId,
          });
          const redirectUrl = `${window.location.origin}/mindfulness/detail?${search}`;
          const { info } = await mindfulnessOrderPay({
            // 订单支付
            orderId: state.orderId,
            paymentType: 1, // 微信支付
            redirectUrl,
            tradeType, // 支付类型
          });
          order_info = info;
        } else {
          // 购买VIP
          const { id } = state.vipTypeList[selectPayType];
          // 创建vip支付订单
          const { orderId } = await createVipOrder({
            vipId: id,
            testPaperId: 0,
            couponId: 0,
            ...deviceInfo,
          });

          state.orderId = orderId;
          const query = parseQueryString(window.location.href);
          const search = qs.stringify({
            ...query,
            fromType: "pay",
            orderId,
            mindfulnessId,
          });
          const redirectUrl = `${window.location.origin}/mindfulness/detail?${search}`;
          const { info } = await vipOrderPay({
            // 订单支付
            orderId: state.orderId,
            paymentType: 1, // 微信支付
            redirectUrl,
            tradeType, // 支付类型
          });
          order_info = info;
        }
        switch (env) {
          case "browser-mobile": // H5支付
            if (order_info.mweb_url) {
              // 微信
              window.location.replace(order_info.mweb_url);
            } else {
              // 支付宝
              let divForm = document.getElementsByTagName("divform");
              if (divForm.length) {
                document.body.removeChild(divForm[0]);
              }
              const div = document.createElement("divform");
              div.innerHTML = order_info;
              document.body.appendChild(div);
              document.forms[0].submit();
            }
            break;
          case "wechat-mobile": // 微信浏览器内支付
            wechatPay(order_info);
            break;
          case "wechat-pc": // 微信浏览器内支付
            qrPay(order_info);
            break;
          case "browser-pc": // 微信浏览器内支付
            qrPay(order_info);
        }
      } catch (error) {}
      state.openVipDialogShow = false;
      loading?.clear();
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
          goMindfulnessDetail();
        } else {
          state.show = true;
        }
      });
    }
    // PC二维码轮询
    async function qrPoll(count) {
      try {
        const { needPay } = await checkMindfulnessOrderPay({
          orderId: state.orderId,
        });
        if (needPay === 0) {
          // 已完成支付
          goMindfulnessDetail();
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
    // 微信支付确认
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
        const { needPay } = await checkMindfulnessOrderPay({
          orderId: state.orderId,
        });
        if (needPay !== 1) {
          state.toast?.clear();
          goMindfulnessDetail();
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
    async function goMindfulnessDetail() {
      if (isWeChat) {
        await store.dispatch("user/getUserInfo");
      }
      const { orderId, fromName } = route.query;
      if (fromName === "pay") {
        const { needPay } = await checkMindfulnessOrderPay({ orderId });
        if (needPay !== 1) {
          location.reload();
        } else {
          Toast("未查询到订单支付状态");
        }
      } else {
        location.reload();
      }
    }
    return {
      ...toRefs(state),
      handlePlayItem,
      handleDoCollect,
      handleOpenVip,
      handlePay,
      qrConfirm,
      confirm,
      cancel,
      gbPlayer,
      gbPlayerState,
    };
  },
};
</script>

<style lang="less" scoped>
.mindfulness-detail-warper {
  padding: 10px;
  width: 100%;
  position: relative;
  // background: #F7F7F7;
  background: #fff;

  .main-img-warper {
    width: 100%;
    height: 180px;

    background-repeat: no-repeat;
    background-size: 100% auto;
    border-radius: 5px;
    position: relative;

    .top-warper {
      width: 100%;
      .space-between();

      .collect-tag {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: #000;
        text-align: center;
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 15px;
        z-index: 99;
        opacity: 0.3;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        &.collected {
          color: red !important;
          z-index: 999;
        }
      }
    }

    .bottom-warper {
      position: absolute;
      left: 0;
      bottom: 5px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;

      .info-tag {
        height: 14px;
        line-height: 14px;

        .type {
          padding: 2px 3px;
          color: #fff;
          font-size: 10px;
          display: inline-block;
          background-color: #9fd4ff;
        }

        .time {
          border: 1px solid #6bbbfd;
          display: inline-block;
          opacity: 0.8;
          color: #9fd4ff;
          padding: 1px 2px;
          font-size: 10px;
          background-color: #5a5a5a;
        }
      }

      .collect-tag {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: #000;
        text-align: center;

        font-size: 15px;
        z-index: 99;
        opacity: 0.3;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        &.collected {
          color: red !important;
          z-index: 999;
        }
      }
    }
  }

  // 内容
  .detail-warper {
    // background: #ffff;
    padding: 20px 0px 10px 0px;

    .tag-list {
      width: 100%;
      position: relative;

      .green-tag,
      .orange-tag,
      .purple-tag {
        display: inline-block;
        width: 40px;
        text-align: center;
        height: 20px;
        border-radius: 2px;
        font-size: 12px;
        color: @bg-color;
        line-height: 20px;
        margin-right: 10px;

        &.green-tag {
          background-color: #a9f0b4 !important;
        }

        &.orange-tag {
          background-color: #f8de81 !important;
        }

        &.purple-tag {
          background-color: #cdbcfc !important;
        }
      }
    }

    .title {
      font-size: @font-size-lg;
      margin-top: 10px;
      color: @light-black;
      font-weight: 600;
    }

    .desc-warper {
      width: 100%;
      position: relative;
      border-bottom: 1px solid #ecebeb;

      .tag-name {
        font-size: 14px;
        height: 16px;
        line-height: 16px;
        padding-left: 5px;
        border-left: 4px solid rgba(244, 164, 96, 0.9);
        font-weight: bold !important;
      }

      .desc,
      .fit {
        color: @gray-color;
        margin-top: 10px;
        font-size: 14px;
        line-height: 1.8;
        font-weight: 300;
        padding-bottom: 20px;
      }
    }
  }

  .audio-list-title-warper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 40px;
    position: relative;
    margin-top: 10px;
    margin-bottom: 20px;

    .left {
      display: flex;
      align-items: center;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
    }

    .right {
      display: flex;
      align-items: center;
      margin-left: 15px;

      .button {
        background: linear-gradient(to right, #f9d7b1, #f5c77a);
        padding: 4px 10px;
        font-size: 12px;
        color: #774603;
        border-radius: 20px;
        text-align: center;
        position: relative;

        // animation: scaleAnimation2 1s ease-in-out infinite;
        &::before {
          content: "";
          position: absolute;
          width: 50px;
          height: 2px;
          top: 50%;
          left: -100px;
          background-color: rgba(#fff, 0.2);
          transform: rotate(-45deg);
          animation: blink 1.8s ease-in-out 1.5s infinite;
        }
      }

      position: relative;

      .taps {
        padding: 1px 5px;
        background: linear-gradient(to right, #fb7473, #fda9a7);
        position: absolute;
        font-size: 10px;
        top: -10px;
        right: -25px;
        color: #fff;
        border-radius: 6px 6px 6px 0;
        // transform: translateX(10%) translateY(-60%);
        animation: scaleAnimation2 1.5s ease-in-out infinite;
      }
    }
  }

  @keyframes blink {
    0% {
      left: -50px;
    }

    100% {
      left: 100%;
    }
  }

  @keyframes scaleAnimation2 {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.02);
    }

    100% {
      transform: scale(1);
    }
  }

  .audio-list-warper {
    position: relative;
    width: 100%;

    .item {
      margin-top: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-weight: 300;

      .index {
        color: @gray-color;
        margin-left: 10px;
        font-size: 14px;
      }

      &:first-child {
        margin-top: 0;
      }

      position: relative;

      &:first-child {
        margin-top: 0;
      }

      .current {
        border: 3px solid rgba(203, 236, 245, 0.5);
      }

      &:not(:last-child) {
        &::after {
          content: "";
          display: block;
          height: 20px;
          width: 1px;
          background-color: #d1cece;
          position: absolute;
          left: 13px;
          bottom: -5px;
          transform: translateY(100%);
        }
      }

      .play-icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgba(203, 236, 245, 0.3);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // color: #67C8DB;
        color: rgb(147, 221, 241);

        &.current {
          background-color: rgb(147, 221, 241);
          color: #fff;
        }

        i {
          margin-left: 0px;
          font-size: 16px;
          margin-top: 2px;
          font-weight: 100;

          &.play {
            margin-left: 3px !important;
          }
        }
      }

      .name {
        margin-left: 10px;
        font-size: 14px;
        color: @light-black;
      }

      .tag {
        margin-left: 5px;
        padding: 1px 2px;
        background-color: #9fd4ff;
        text-align: center;
        border-radius: 1px;
        color: #fff;
        font-size: 10px;
      }

      .current-tag {
        margin-left: 10px;
        margin-top: 0px;
        width: 18px;
        height: 18px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .show-pause {
          width: 100%;
          height: 100%;
          background-image: url("@/assets/images/player.png");
          background-size: 100% auto;

          &.playing {
            animation: playing 800ms steps(10) infinite;
          }
        }

        @keyframes playing {
          0% {
            background-position: 0 0;
          }

          to {
            background-position: 0 -1000%;
          }
        }
      }
    }
  }
}
</style>
