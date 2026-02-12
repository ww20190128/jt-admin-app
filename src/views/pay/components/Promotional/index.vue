<template>
  <div class="pc-answer">
    <!-- 顶部题目信息 -->
    <div class="pc-title">{{ testPaperInfo?.name }}</div>
    <div class="pc-text">
      <div class="pc-item">{{ testPaperInfo?.questionNum }}道精选问题</div>
      <div class="pc-item">{{ testPaperInfo?.reportNum }}页专业报告</div>
      <!-- <div class="pc-item">{{ testPaperInfo.goods_vr_sale_count }}人测过</div> -->
      <!-- <div class="pc-item">98%的好评</div> -->
    </div>
    <!-- 支付 -->
    <div class="pc-info-content">
      <p class="pc-info-title">您的专属测评报告已生成</p>

      <div class="pc-detail">
        <!-- pc_pay_content -->
        <div class="pc-right" v-html="payInfo?.payDesc"></div>
      </div>

      <div class="pc-info-bottom">
        <div class="pc-check-button" @click="handleWechatPay">微信支付</div>
        <div class="pc-confirm-text" @click="onQrConfirm">
          我已支付，点此查看报告
        </div>
      </div>
    </div>

    <!-- 富文本内容 -->
    <!-- pc_pay_content -->
    <div class="pc-rich-text" v-html="payInfo.payPcContent"></div>
    <div class="qr-content">
      <img :src="wechatInfo?.wechat_qrcode" />
      <p>{{ wechatInfo?.wechat_qrcode_desc }}</p>
    </div>

    <ChooseBirthday
      v-if="testPaperInfo?.ageSet && Object.keys(testPaperInfo?.ageSet).length"
      :ageSet="testPaperInfo?.ageSet"
      v-model:show="dateShow"
      @confirm="handleBirthdayConfirm"
    />
    <!-- <ToCustomer v-if="testPaperInfo?.customerUrl" :link="testPaperInfo?.customerUrl" /> -->
    <WeChatPayQr
      v-model:show="qrPayShow"
      :url="payUrl"
      @confirm="onQrConfirm"
      @cancel="onQrCancel"
    />
    <!-- 红包 -->
    <RedPacketPC
      class="red-pack-pc-wrap"
      v-if="payInfo?.redPacketConfig"
      :redPacketConfig="payInfo?.redPacketConfig"
      :qrUrl="payUrl"
      v-model:show="redPacketShow"
    />
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onMounted,
  computed,
  watch,
  onBeforeUnmount,
  ref,
} from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import VueQr from "vue-qr/src/packages/vue-qr";

import { Toast, Dialog } from "vant";
import { useAuth } from "@/hooks/useAuth";
import ToCustomer from "@/views/detail/components/customer";
import ChooseBirthday from "@/components/ChooseBirthday";

import WeChatPayQr from "@/components/WeChatPayQr";
import RedPacketPC from "../RedPacket/RedPacketPC.vue";
import { useStore } from "@/store";
import NProgress from "nprogress";
// api接口
import { updateTestOrder, getTestOrderInfo } from "@/api/testPaper";
import { checkTestOrderPay, testOrderPay } from "@/api/order";
export default {
  name: "Promotional",
  components: {
    VueQr,
    ToCustomer,
    ChooseBirthday,
    WeChatPayQr,
    RedPacketPC,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const wechatInfo = computed(() => store.getters.wechatInfo || {});

    const state = reactive({
      qrPayShow: false,
      redPacketShow: false,
      redPacketType: 0,
      testPaperInfo: {}, // 测评信息
      percentage: 100, // 做题进度(只能为100)
      currentIndex: 0, // 当前做到第几题
      payInfo: {}, // 试卷信息
      payUrl: "", // 支付二维码URL
      time: 0, // 轮询次数
      dateShow: false,
      timer: null,
    });
    const hasRedPacket = computed(
      () =>
        state.payInfo?.redPacketConfig &&
        Object.keys(state.payInfo?.redPacketConfig)?.length > 0
    );
    watch(
      () => [state.qrPayShow, state.redPacketShow],
      ([qrPayShow, redPacketShow]) => {
        if (!qrPayShow || !redPacketShow) {
          clearTimeout(state.timer);
        }
      }
    );
    onBeforeUnmount(() => {
      clearTimeout(state.timer);
    });

    const { testOrderId, promotionId, testPaperId, percent } = route.query;
    state.currentIndex = percent;
    // 获取支付链接
    async function onPay() {
      const tradeType = "NATIVE"; // 支付类型
      try {
        state.payUrl = "";
        state.time = 0;
        const { info } = await testOrderPay({
          testOrderId, // 订单号
          paymentType: 1, // 1微信支付 2其他(暂无)
          tradeType, // 支付类型
          redirectUrl: window.location.href,
          redPacketType: state.redPacketType, // 红包类型 1第一个红包 2第二个红包
        });
        state.payUrl = info.code_url;
        if (!state.redPacketType) {
          state.qrPayShow = true;
        } else {
          state.redPacketShow = true;
        }
      } catch (error) {}
    }
    onMounted(() => {
      window.loading?.close?.();
    });
    // 检查订单状态
    const checkOrderStatus = async () => {
      const { needPay } = await checkTestOrderPay({ testOrderId });
      if (needPay !== 1) {
        // 不需要支付，并且完成，跳转到报告页
        clearLoading();
        goReport();
      }
    };
    function clearLoading() {
      window.createOrderLoading?.close();
      window.createOrderLoading = null;
    }
    // 轮询查询支付状态
    async function poll() {
      try {
        const { needPay } = await checkTestOrderPay({ testOrderId });
        if (needPay !== 1) {
          Toast("支付成功,准备跳转报告页");
          goReport(); // 跳转支付引导页
        } else {
          state.timer = window.setTimeout(() => {
            state.time++;
            if (state.time > 180) {
              return;
            }
            poll();
          }, 1000);
        }
      } catch (error) {}
    }
    async function handleConfirm() {
      try {
        const { needPay } = await checkTestOrderPay({ testOrderId });
        if (needPay !== 1) {
          Toast("支付成功,准备跳转报告页");
          goReport(); // 跳转支付引导页
        } else {
          Toast(
            `暂未查询到支付订单，如已支付请关注公众号:【${wechatInfo.value.name}】联系客服处理`
          );
        }
      } catch (error) {}
    }
    async function init() {
      try {
        const { testOrderInfo, testPaperInfo, payInfo } =
          await getTestOrderInfo({ testOrderId });
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute("content", testPaperInfo.subhead);
        document.title = `订单支付-${testPaperInfo.name}`;
        state.payInfo = payInfo;
        state.testPaperInfo = testPaperInfo;
        state.testOrderInfo = testOrderInfo;
        state.payStyleType = payInfo?.payStyleType;

        if (
          state.testPaperInfo?.ageSet &&
          Object.keys(state.testPaperInfo?.ageSet).length &&
          testOrderInfo?.age &&
          testOrderInfo?.age <= 0
        ) {
          // 显示年龄
          state.dateShow = true;
        }
        if (payInfo.status === 2 || payInfo.status === 3) {
          // 2 已支付 3 无需支付
          // 已支付的订单
          goReport();
        }
      } catch (error) {
        window.__bl?.api(
          "获取支付页失败(Promotional)",
          false,
          0,
          "error",
          `调用失败:${error}`
        );
        Dialog.alert({
          title: "出错了~",
          message: "请刷新页面后重试",
          theme: "round-button",
          showCancelButton: false,
          confirmButtonText: "立即刷新",
          confirmButtonColor: "#ff5d7d",
          onConfirm: () => {
            window.location.reload();
          },
        });
      }
    }
    // 生日选择确定按钮
    async function handleBirthdayConfirm(age) {
      await updateTestOrder({
        age: Number(age),
        testOrderId,
      });
      state.testOrderInfo.age = age;
      state.dateShow = false;
    }
    const storeNextPage = ref(true);
    // 跳转到报告
    function goReport() {
      storeNextPage.value = false;
      router.replace({
        path: "/report",
        query: {
          testOrderId,
          promotionId,
          testPaperId,
        },
      });
    }
    // 微信支付
    async function handleWechatPay() {
      await onPay();
      poll();
    }
    async function onQrConfirm() {
      handleConfirm();
      await updateTestOrder({
        testOrderId,
        redPacketStatus: 6,
      });
    }
    onBeforeRouteLeave(async (to, from, next) => {
      if (!storeNextPage.value) {
        localStorage.removeItem("year");
        next();
      } else {
        if (hasRedPacket.value) {
          next(false);
          NProgress.done();
          state.qrPayShow = false;
          state.redPacketShow = true;
          state.redPacketType = 1;
          await onPay();
          poll();
        } else {
          next();
        }
      }
    });
    async function onQrCancel() {
      if (hasRedPacket.value) {
        state.qrPayShow = false;
        state.redPacketShow = true;
        state.redPacketType = 1;
        await onPay();
        poll();
      } else {
        state.qrPayShow = false;
      }
      await updateTestOrder({
        testOrderId,
        redPacketStatus: 6,
      });
    }
    useAuth(
      {
        authType: 1,
      },
      hook
    );
    async function hook() {
      checkOrderStatus();
      await init();
    }
    return {
      ...toRefs(state),
      handleConfirm,
      handleBirthdayConfirm,
      onQrConfirm,
      onQrCancel,
      handleWechatPay,
      wechatInfo,
    };
  },
};
</script>

<style lang="less" scoped>
.qr-content {
  padding-bottom: 30px;
  text-align: center;
  img {
    width: 60%;
    height: auto;
    pointer-events: auto;
    border-radius: 20px;
  }
  p {
    text-align: center;
    font-size: @font-size-sm;
  }
}

.animate-next {
  animation-duration: 0.3s;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: next;
}

@keyframes next {
  0% {
    transform: translateX(500px) scale(0.7);
    opacity: 0.7;
  }

  80% {
    transform: translateX(0) scale(0.7);
    opacity: 0.7;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.active {
  background-color: @theme-color;
  color: #fff;
  transition: all 0.3s;
}

.pc-info-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px 0;

  .pc-check-button {
    .align-center();
    height: 40px;
    background-color: @theme-color;
    font-size: 16px;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    width: 250px;
    border-radius: 40px;
    background-color: #08c261;
  }

  .pc-confirm-text {
    font-size: 14px;
    color: #aaa;
    text-align: center;
    padding-top: 10px;
    cursor: pointer;
  }
}

.pc-info-content {
  margin-top: 20px;
  background: beige;
  border-radius: 20px;
  width: 100%;
  padding: 0 70px;
  border: 3px solid #08c261;
  margin-bottom: 30px;

  .pc-info-title {
    padding: 20px 0;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: #07c15e;
  }

  .pc-detail {
    display: flex;
    align-items: center;

    .pc-qr {
      .pc-qr-img {
        height: 100%;
        width: 160px;
        margin-right: 30px;
        position: relative;

        .pc-qrloading {
          width: 155px;
          height: 155px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          background-color: rgba(#fff, 0.9);
          position: absolute;
          left: 0;
          bottom: 0;

          .pc-refresh {
            cursor: pointer;
            color: #1890ff;
            font-size: 16px;
            margin: 5px;
            font-weight: bold;
          }

          :deep(.van-loading) {
            color: rgba(#000, 0.7);

            .van-loading__text {
              font-size: 16px;
              color: rgba(#000, 0.7);
            }
          }
        }
      }
    }

    .pc-right {
      width: 500px;
    }

    img {
      width: 100%;
      display: block !important;
    }
  }
}

.pc-right,
.pc-rich-text {
  font-size: @font-size-base;
  color: #3f3f3f;
  line-height: 24px;

  :deep(img) {
    display: block;
    width: 100%;
  }
}

.pc-answer {
  // position: absolute;
  position: relative;
  // width: 750px;
  width: 100%;
  margin: 0 auto;
  // left: 50%;
  // top: 0;
  // transform: translateX(-50%);
  .red-pack-pc-wrap {
  }
  .pc-title {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    padding: 10px;
  }

  .pc-text {
    display: flex;
    justify-content: center;
    font-size: 14px;
    color: @gray-color;

    .pc-item {
      font-size: 14px;
      padding: 0 5px;
    }
  }

  .pc-progress-content {
    .space-between();
    .align-center();
    padding: 10px 0;
    height: 60px;

    .pc-progress {
      flex: 1;
    }

    .pc-num {
      font-size: 14px;
      font-weight: bold;
      padding: 0 10px 0 5px;
    }

    .pc-reset {
      color: @theme-color;
      font-size: 14px;
      height: 100%;
      cursor: pointer;
      .align-center();
    }
  }
}
</style>
