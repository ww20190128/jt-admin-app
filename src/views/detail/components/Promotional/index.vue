<template>
  <div class="content" v-if="!error">
    <!-- 最近一次测试订单 -->
    <div
      class="tips"
      @click="handleLookResult"
      v-if="lastTestOrderInfo.status === 2"
      v-show="tipsShow"
    >
      <div class="left">
        <van-icon
          name="close"
          style="font-size: 24px; margin: 0 6px"
          @click.stop="tipsShow = false"
        />
        你已经购买了该评测报告
      </div>
      <div class="right">查看报告</div>
    </div>
    <!-- jianjie -->
    <div
      class="rich-text tuigshop"
      v-if="promotionInfo?.styleType === 2 && promotionInfo?.desc"
      v-html="promotionInfo?.desc"
    ></div>
    <!--<ToCustomer></ToCustomer>-->
    <div class="goods-info" v-if="promotionInfo?.styleType === 1">
      <div class="card">
        <div class="head goods-name">{{ promotionInfo?.name }}</div>
        <div class="info" v-html="promotionInfo?.desc"></div>
      </div>
      <div class="card">
        <div class="head head2">测试指标</div>
        <div class="item">
          <div class="left" v-if="testPaperInfo?.questionNum > 0">题目数</div>
          <div class="right">{{ testPaperInfo?.questionNum }}题</div>
        </div>
        <div class="item">
          <div class="left" v-if="testPaperInfo?.reportNum > 0">报告页数</div>
          <div class="right">{{ testPaperInfo?.reportNum }}页</div>
        </div>
        <div class="item" v-if="testPaperInfo?.answerTimeLimit > 0">
          <div class="left">预计用时</div>
          <div class="right">{{ testPaperInfo?.answerTimeLimit }}分钟</div>
        </div>
      </div>
      <div
        class="button"
        v-if="promotionInfo?.ui_btnColor"
        @click="confirm"
        :style="{ backgroundColor: promotionInfo?.ui_btnColor }"
      >
        {{ promotionInfo?.ui_testBtnText }}
      </div>

      <div
        class="rich-text copyright"
        v-show="promotionInfo?.copyright"
        v-html="promotionInfo?.copyright"
      ></div>
    </div>

    <footer class="footer" v-if="promotionInfo?.styleType === 2">
      <div
        class="button publicity_2"
        @click="confirm"
        :style="{ backgroundColor: promotionInfo?.ui_btnColor }"
      >
        {{ promotionInfo?.ui_testBtnText }}
      </div>
    </footer>

    <!-- http://192.168.0.35:7000/goods?puid=655acebc&guid=61b72dd4&hasParams=1 -->
    <div
      class="rich-text tuigshop"
      v-show="promotionInfo?.backgroundImage"
      :style="{
        background: `url(${promotionInfo.backgroundImage}) no-repeat center center`,
        backgroundSize: '100% 100%',
        overflow: 'scroll',
        height: '100vh',
        overflowX: 'hidden',
      }"
      v-if="promotionInfo?.styleType === 5"
    >
      <div style="padding: 10% 6% 30% 6%" v-html="promotionInfo.desc"></div>
    </div>

    <footer class="footer" v-if="promotionInfo?.styleType === 5">
      <div
        class="button2 publicity_3"
        @click="confirm"
        :style="{ backgroundColor: promotionInfo.ui_btnColor }"
      >
        {{ promotionInfo.ui_testBtnText }}
      </div>
    </footer>

    <Mbti
      @confirm="confirm"
      :promotionInfo="promotionInfo"
      v-if="promotionInfo?.styleType === 3"
    />
    <Card
      @confirm="confirm"
      :promotionInfo="promotionInfo"
      v-if="promotionInfo?.styleType === 4"
    />
    <!-- 版本选择 -->
    <OptionsSelect
      v-model:show="optionVisible"
      v-model:current="optionCurrent"
      :versionConfig="testPaperInfo?.versionConfig"
      @confirm="handleOptionConfirm"
    />

    <ToCustomer
      v-if="testPaperInfo?.customerUrl"
      :link="testPaperInfo?.customerUrl"
    />
    <HistoricalOrders
      v-if="historyOrderButtonShow"
      @confirm="historicalOrders"
    />
  </div>
  <Error v-if="error">
    <template #footer>
      提示：如果多次刷新仍无法显示，可以关注公众号：{{
        wechatConf.name
      }}，进行测试。
    </template>
  </Error>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
// api 接口
import {
  getTestOrderInfo,
  createTestOrder,
  showHistoryOrderButton,
} from "@/api/testPaper";
import { getPromotionInfo } from "@/api/promotion";

import { useRoute, useRouter } from "vue-router";
import { useAgent } from "@/hooks/useAgent";
import { Toast, Dialog } from "vant";
import OptionsSelect from "@/components/OptionsSelect";
import ToCustomer from "../customer";
import HistoricalOrders from "../historicalOrders";
import { shareWx } from "@/hooks/shareWx";
import { useAuth } from "@/hooks/useAuth";
import { useEventListener } from "@/hooks/useEventListener";
import Mbti from "./Mbti/index.vue";
import Card from "./Card/index.vue";
import Error from "@/components/Error";
import { useStore } from "@/store";
export default {
  name: "Promotional",
  components: {
    OptionsSelect,
    ToCustomer,
    HistoricalOrders,
    Mbti,
    Card,
    Error,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const state = reactive({
      promotionInfo: {}, // 推广信息
      testPaperInfo: {}, // 测评信息
      optionCurrent: undefined, // 双版本选择值
      optionVisible: false, // 双版本选择显示隐藏
      errorCount: 0, // 错误次数

      lastTestOrderInfo: {},
      testOrderId: "",
      tipsShow: false,
      error: false,

      promotionId: "", // 推广ID
      historyOrderButtonShow: false, // 是否显示 历史订单按钮
    });
    const { md, ua, network, os, isWeChat } = useAgent();
    const { promotionId, testOrderId, shareCode } = route.query;

    const wechatConf = computed(() => store.getters.wechatInfo || {});
    const { on, off } = useEventListener();
    function onDialogConfirm() {
      handleContinue();
    }

    useAuth(
      {
        authType: 2,
      },
      async () => {
        try {
          await init();
          shareWx({ testPaperId: state.testPaperInfo?.id, promotionId });
        } catch (error) {
          state.error = true;
        }
      }
    );

    async function init() {
      // try {
      const { promotionInfo, testPaperInfo, testOrderInfo } =
        await getPromotionInfo({ promotionId });
      state.testPaperInfo = testPaperInfo;
      state.promotionInfo = promotionInfo;

      document.title = promotionInfo.name;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", testPaperInfo.subhead);
      // 最近的测评订单
      state.lastTestOrderInfo = testOrderInfo;
      if (state.lastTestOrderInfo?.id) {
        state.testOrderId = state.lastTestOrderInfo?.id;
      }
      try {
        // 缓存最新的订单信息
        let lastTestOrderData = window.localStorage.getItem("test_order_last")
          ? JSON.parse(window.localStorage.getItem("test_order_last"))
          : "";
        if (
          !isWeChat &&
          lastTestOrderData &&
          testPaperInfo.id == lastTestOrderData.testPaperId
        ) {
          state.testOrderId = lastTestOrderData.testOrderId;
          await getTestOrderInfoById();
        }
      } catch (error) {
        window.__bl?.api(
          "根据缓存订单号获取订单失败",
          false,
          0,
          "error",
          `加载失败:${error}`
        );
      }
      // 是否显示历史订单按钮
      const { showButton } = await showHistoryOrderButton({
        testPaperId: testPaperInfo?.id,
        promotionId: promotionId,
      });
      state.historyOrderButtonShow = showButton;
    }
    // 获取订单详情
    async function getTestOrderInfoById() {
      const { testOrderInfo } = await getTestOrderInfo({
        testOrderId: state.testOrderId,
      });
      state.tipsShow = true;
      state.lastTestOrderInfo = testOrderInfo;
    }

    // 立即测试
    async function confirm() {
      // isBack = false;
      if (!state.lastTestOrderInfo?.id) {
        if (state.testPaperInfo?.versionConfig?.options) {
          goChooseGeneral();
        } else {
          createNewTestOrder();
        }
      } else if (state.lastTestOrderInfo?.status === 0) {
        Dialog.confirm({
          title: "提示",
          message: "你有未做完的试卷，是否继续答题？",
          confirmButtonText: "继续做题",
          cancelButtonText: "重新开始",
        })
          .then(() => {
            handleContinue();
          })
          .catch(() => {
            if (state.testPaperInfo?.versionConfig?.options) {
              state.reset = true;
              goChooseGeneral();
            } else {
              createNewTestOrder();
            }
          });
      } else if (state.lastTestOrderInfo.status === 2) {
        Dialog.confirm({
          title: "提示",
          message: "你已有评测报告，可在报告页面免费重测，请问是否查看报告？",
          confirmButtonText: "查看报告",
          cancelButtonText: "重新开始",
          // showCancelButton: false,
        })
          .then(async () => {
            handleLookResult();
          })
          .catch(() => {
            if (state.testPaperInfo?.versionConfig?.options) {
              goChooseGeneral();
            } else {
              createNewTestOrder();
            }
          });
      } else if (state.lastTestOrderInfo?.status === 1) {
        // 未支付订单
        Dialog.confirm({
          title: "提示",
          message: "当前试卷已做完，请问是否去支付？支付完成后可查看报告。",
          confirmButtonText: "去支付",
          cancelButtonText: "重新开始",
        })
          .then(() => {
            handleGoPay();
          })
          .catch(() => {
            if (state.testPaperInfo?.versionConfig?.options) {
              goChooseGeneral();
            } else {
              createNewTestOrder();
            }
          });
      }
    }

    function historicalOrders() {
      // ww注释20240420
      // router.push({
      //   path: "/order",
      //   query: {
      //     promotionId: promotionId,
      //     testPaperId: state.testPaperInfo?.id,
      //   },
      // });
    }

    // 继续做题
    function handleContinue() {
      if (state.testPaperInfo?.mbtiStyle == 1) {
        router.push({
          path: "/exam2",
          query: {
            testOrderId: state.testOrderId,
            testPaperId: state.testPaperInfo?.id,
            promotionId: promotionId,
          },
        });
      } else {
        router.push({
          path: "/exam",
          query: {
            testOrderId: state.testOrderId,
            testPaperId: state.testPaperInfo?.id,
            promotionId: promotionId,
          },
        });
      }
    }
    // 查看报告
    function handleLookResult() {
      router.push({
        path: "/report",
        query: {
          testOrderId: state.testOrderId,
          testPaperId: state.testPaperInfo?.id,
          promotionId: promotionId,
        },
      });
    }
    // 跳转支付页
    function handleGoPay() {
      router.push({
        path: "/pay",
        query: {
          testOrderId: state.testOrderId,
          testPaperId: state.testPaperInfo?.id,
          promotionId: promotionId,
        },
      });
    }
    // 版本选择确定按钮
    function handleOptionConfirm() {
      createNewTestOrder();
    }

    // 创建新订单
    async function createNewTestOrder() {
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
        // ios系统的处理
        deviceInfo.phoneModel = md.os() + md.version("iPhone");
      } else if (os == "AndroidOS") {
        // Android系统的处理
        deviceInfo.phoneModel = md.os() + md.version("Android");
      }
      try {
        const { testOrderId } = await createTestOrder({
          testPaperId: state.testPaperInfo?.id,
          promotionId: promotionId,
          ...deviceInfo,
          version: state.optionCurrent,
          shareCode: shareCode,
        });
        state.testOrderId = testOrderId;
        // if (!isWeChat) {
        window.localStorage.setItem(
          "test_order_last",
          JSON.stringify({
            testPaperId: state.testPaperInfo?.id,
            testOrderId,
          })
        );
        // }
        goExam();
      } catch (error) {
        Toast(error);
      }
    }

    // 跳转做题页
    function goExam() {
      if (state.testPaperInfo?.mbtiStyle == 1) {
        router.push({
          path: "/exam2",
          query: {
            testOrderId: state.testOrderId,
            promotionId: promotionId,
            testPaperId: state.testPaperInfo?.id,
          },
        });
      } else {
        router.push({
          path: "/exam",
          query: {
            testOrderId: state.testOrderId,
            promotionId: promotionId,
            testPaperId: state.testPaperInfo?.id,
          },
        });
      }
    }
    // 选择性别
    const goChooseGeneral = () => {
      if (state.testPaperInfo?.mbtiStyle == 1) {
        router.push({
          path: "/chooseGender2",
          query: {
            promotionId: promotionId,
            testPaperId: state.testPaperInfo?.id,
          },
        });
      } else {
        router.push({
          path: "/chooseGender",
          query: {
            promotionId: promotionId,
            testPaperId: state.testPaperInfo?.id,
          },
        });
      }
    };
    return {
      ...toRefs(state),
      confirm,
      handleOptionConfirm,
      onDialogConfirm,
      handleLookResult,
      historicalOrders,
      wechatConf,
    };
  },
};
</script>

<style lang="less">
.tuigshop {
  background-color: #fff;
  text-align: center;
  position: relative;

  img {
    width: 100%;
  }

  h3 {
    font-size: 21px;
    line-height: 20px;
    color: #010101;
    font-weight: 500;
    margin-top: 15px;
  }

  h4 {
    font-size: 16px;
    line-height: 32px;
    color: #8c8c8c;
    font-weight: normal;
  }

  .measurement_love_ul {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .measurement_love_ul li {
    width: 33.33%;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 40px;
    color: #9a9a9a;
  }
}
</style>

<style lang="less" scoped>
:deep(.rich-text) {
  font-size: 14px;
  color: @light-black;
  line-height: 25px;

  img {
    display: block;
    width: 100%;
  }
}

.disabled {
  background-color: #cccccc;
}

.content {
  // width: 100vh;
  height: 100vh;

  //   overflow-y: auto;
  .tips {
    height: 55px;
    font-size: 16px;
    display: flex;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 99;

    .left {
      flex: 1;
      display: flex;
      align-items: center;
      background-color: #ffcf30;
      color: #383838;

      .close-icon {
        font-size: 24px;
        margin: 0 6px;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #d43030;
      color: #ffeb3b;
      padding: 0 20px;
    }
  }

  .footer {
    .fixed-bottom();
    .align-center();
    justify-content: center;
    background-color: transparent;
    padding-bottom: 25px;
    cursor: pointer;

    .button {
      width: 86% !important;
      height: 40px;
      text-align: center;
      line-height: 40px;
      border-radius: 40px;
      width: 100%;
      color: #fff;
      animation: scale 3s infinite;
      font-size: 18px;
    }

    .button2 {
      width: 86% !important;
      height: 48px;
      border-radius: 24px;
      background-color: #fde580;
      text-align: center;
      font-size: 18px;
      line-height: 48px;
      color: #131415;
      animation: scale 3s infinite;
      border: 1px solid #131415;
    }
  }
}

.goods-info {
  padding: @padding-base;

  .card {
    border-radius: 5px;
    overflow: hidden;
    background-color: #fff;
    margin-bottom: @padding-base;

    .info {
      padding: @padding-sm;
      font-size: 14px;
      color: @light-black;
      line-height: 25px;
    }

    .head {
      height: 45px;
      line-height: 45px;
      padding: 0 @padding-sm;
      background-color: #5398f7;
      font-size: 16px;
      font-weight: 600;

      &.goods-name {
        color: #fff;
      }
    }

    .head2 {
      background-color: #b7d4fd;
    }

    .item {
      .space-between();
      height: 30px;
      line-height: 30px;
      padding: 0 @padding-sm;
      margin: 5px 0;
      font-size: 14px;

      .left {
        font-weight: 500;
      }
    }
  }

  .button {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: @font-size-base;
    border-radius: 5px;
    margin-top: 20px;
  }

  .copyright {
    margin-top: 150px;
  }
}

@keyframes scale {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.1);
  }

  50% {
    transform: scale(1);
  }

  75% {
    transform: scale(1.1);
  }
}
</style>
