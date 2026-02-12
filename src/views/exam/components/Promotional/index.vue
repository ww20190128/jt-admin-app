<template>
  <template v-if="!loading">
    <Gallup
      v-if="testPaperInfo.questionStypeType == 5"
      :testPaperInfo="testPaperInfo"
      :questionGroup="questionGroup"
      :questionList="questionList"
      :currentIndex="currentIndex"
      :animation="!animate"
      :answerList="answerList"
      @option="handleOption"
      @last="handleLast"
      @next="handleNext"
      @result="handleLookReport"
    />
    <div v-else class="pc-answer" :class="{ overflow: dateShow }">
      <!-- 顶部题目信息 -->
      <div class="pc-title">{{ testPaperInfo?.name }}</div>
      <div class="pc-text">
        <div class="pc-item">{{ testPaperInfo?.questionNum }}道精选问题</div>
        <div class="pc-item">{{ testPaperInfo?.reportNum }}页专业报告</div>
      </div>
      <!-- 进度条 -->
      <div class="pc-progress-content">
        <div class="pc-progress question-progress-wrapper">
          <van-progress
            class="progress-item"
            :percentage="percentage"
            stroke-width="8"
            :show-pivot="true"
            :pivot-text="`${currentIndex + 1} / ${questionList.length}`"
          />
        </div>

        <!-- <div class="pc-reset" @click="handleReset">重新测试</div> -->
      </div>
      <!-- 题目区域 -->

      <div class="pc-topic-content" :class="{ 'animate-next': animate }">
        <div class="pc-topic-title">
          {{ currentIndex + 1 }}、{{ current.matter }}
        </div>
        <!-- 文本类型的题目选项 -->
        <div class="pc-topic-text" v-if="!isImgSubject">
          <img
            v-if="current.matterImg"
            class="pc-topic-img"
            :src="current.matterImg"
          />
          <div
            class="item"
            :class="{ active: isActive(index) }"
            v-for="(item, index) in current.selections"
            :key="index"
            @click="handleOption(index)"
          >
            <div class="left">{{ optionNames[index] }}</div>
            <div class="right">{{ item.name }}</div>
          </div>
        </div>
        <!-- 图片类型的题目选项 -->
        <div class="pc-topic-picture" v-if="isImgSubject">
          <img class="pc-topic-img" :src="current.matterImg" />
          <div class="pc-card-content">
            <div
              class="pc-card-item"
              :class="{ active: isActive(index) }"
              v-for="(item, index) in current.selections"
              :key="index"
              @click="handleOption(index)"
            >
              <img class="pc-card-img" :src="item.img" />
            </div>
          </div>
        </div>
      </div>

      <!-- 上一题下一题 -->
      <div class="pc-last-next">
        <div class="pc-button" v-show="!isLast" @click="handleLast">上一题</div>
        <div class="pc-button" v-show="!isLast" @click="handleNext">下一题</div>

        <div
          class="pc-button check-report"
          :class="{ disabled: disabled }"
          v-show="isLast"
          @click="handleLookReport"
        >
          查看报告
        </div>
      </div>

      <!-- 做题须知 -->
      <div
        class="pc-instructions"
        v-if="testPaperInfo?.noticeTitle && testPaperInfo?.notice"
      >
        <div class="item">
          <p>{{ testPaperInfo.noticeTitle }}</p>
          <div v-html="testPaperInfo.notice"></div>
        </div>
        <div class="pc-qrcard-content">
          <QrCard class="pc-qrcard" vertical :showTitle="false" />
        </div>
      </div>
    </div>
  </template>

  <ToCustomer
    v-if="testPaperInfo?.customerUrl"
    :link="testPaperInfo?.customerUrl"
  />
  <HistoricalOrders v-if="historyOrderButtonShow" @confirm="historicalOrders" />
</template>

<script>
import {
  reactive,
  toRefs,
  unref,
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
} from "vue";

import { useRouter, useRoute } from "vue-router";
import QrCard from "@/components/QrCard";
import { Notify, Toast, Dialog } from "vant";
import { checkTestOrderPay } from "@/api/order";
import { optionNames } from "../letter";
import Gallup from "../../template/gallup";
import qs from "qs";
import { useCreate } from "../useCreate";
import { useAuth } from "@/hooks/useAuth";
import moment from "moment";
import ToCustomer from "../customer";
import HistoricalOrders from "../historicalOrders";

import {
  getTestPaperInfo,
  getTestOrderInfo,
  getAnswerRecord,
  submitAnswers,
  submitTest,
  showHistoryOrderButton,
} from "@/api/testPaper";
import { getPromotionInfo } from "@/api/promotion";
export default {
  name: "Promotional",
  components: {
    QrCard,
    Gallup,
    ToCustomer,
    HistoricalOrders,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const { testOrderId, testPaperId, promotionId } = route.query;

    const state = reactive({
      questionList: [], // 题目列表
      testPaperInfo: {}, // 测评信息
      testOrderId: "",
      lastTestOrderInfo: {},
      optionNames,
      questionVisible: false, // 评测须知显示隐藏
      currentIndex: 0, // 当前题目索引
      answerList: [], // 已回答的题目
      isStop: true,
      promotionInfo: {},
      dateShow: false, // 生日选择
      animate: true, // 动画显示隐藏
      tipList: {},
      loading: true,
      historyOrderButtonShow: false, // 是否显示历史订单按钮
    });

    // 当前题目
    const current = computed(
      () => state.questionList[state.currentIndex] || {}
    );
    // 当前题目答案
    const currentOptionAnswer = computed(() =>
      state.answerList.find((v) => v.id === current.value.id)
    );
    // 最后一题是否回答完毕
    const disabled = computed(
      () => state.answerList.length < state.questionList.length
    );
    // 是否已经是最后一题
    const isLast = computed(
      () => state.currentIndex === state.questionList.length - 1
    );
    // 查看报告
    function handleLookResult() {
      router.push({
        path: "/report",
        query: {
          testOrderId: state.testOrderId,
          testPaperId: state.testPaperInfo?.id,
          promotionId,
        },
      });
    }
    // 进度条当前进度
    const percentage = computed(() => {
      if (!state.questionList.length) return 0;
      if (state.currentIndex == 0) {
        return 0;
      }
      const value =
        ((state.currentIndex + 1) / state.questionList.length) * 100;
      if (value >= 100) {
        return 100;
      }
      return value;
    });
    async function loadTestPaperInfo() {
      const { promotionInfo, testPaperInfo, testOrderInfo } =
        await getPromotionInfo({ promotionId });

      try {
        const orderCache = window.localStorage.getItem("order_info")
          ? JSON.parse(window.localStorage.getItem("order_info"))
          : "";
        if (orderCache && testPaperInfo?.id == orderCache.testPaperId) {
          state.testOrderId = orderCache.testOrderId;
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
      state.promotionInfo = promotionInfo;
      state.testPaperInfo = testPaperInfo;
      state.lastTestOrderInfo = testOrderInfo;

      // 是否显示历史订单按钮
      const { showButton } = await showHistoryOrderButton({
        testPaperId: state.testPaperInfo?.id,
        promotionId: state.promotionInfo?.id,
      });
      state.historyOrderButtonShow = showButton;
    }
    // 初始化试卷
    async function init() {
      state.loading = true;
      const data = {};

      if (!testOrderId) {
        // 推广没有订单号
        const response = await getPromotionInfo2({ promotionId, version: 1 });
        Object.assign(data, response);
      } else {
        // 通过订单号查询
        const response = await getTestOrderInfo({ testOrderId });
        Object.assign(data, response);
      }
      const {
        testOrderInfo,
        questionList, //  题目
        testPaperInfo, // 测评信息
        questionGroup,
        tipList,
      } = data;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", testPaperInfo?.subhead);
      state.questionList = questionList;
      state.testPaperInfo = testPaperInfo;
      state.lastTestOrderInfo = testOrderInfo;
      state.tipList = Object.fromEntries(
        tipList.map((e) => [e.paper_detail_no, e.tips])
      );
      document.title = testPaperInfo?.subhead;
      state.loading = false;
    }
    // 根据订单号 获取已经答过的答案
    async function getAnswer() {
      if (!testOrderId) {
        return;
      }
      const { answerList } = await getAnswerRecord({ testOrderId });
      if (answerList.length > 0) {
        state.currentIndex = answerList.length - 1;
        state.answerList = answerList;
        if (route.path !== "/exam") {
          return;
        }
        state.notify = Notify({
          message: `已经加载${state.answerList.length}道答题记录，点此重新做题`,
          background: "#2196F3",
          duration: 0,
          className: "pc-notify",
          onClick: () => {
            state.answerList = [];
            state.currentIndex = 0;
            state.notify?.close();
          },
        });
      } else {
        if (
          state.testPaperInfo?.ageSet &&
          (state.testPaperInfo?.ageSet).length
        ) {
          goChooseYear();
        }
      }
    }

    // 题目点击
    async function handleOption(index) {
      state.notify?.close();
      if (!state.animate) {
        return;
      }
      if (currentOptionAnswer.value) {
        // 判断已回答列表中是否有该题目 没有则将答案及试卷id push进去
        const val = state.answerList.find((v) => v.id === current.value.id); // 有该条答案 则修改该答案
        val.answer = index;
      } else {
        state.answerList.push({
          id: current.value.id,
          answer: index,
        });
      }
      if (isLast.value) {
        // 判断最后一题是否回答完毕
        Notify({
          message: "答题完毕，请点击下方“查看报告”按钮",
          background: "#07c160",
          className: "pc-notify",
        });
      } else {
        handleNext();
      }

      if ((state.currentIndex + 1) % 5 === 0 || isLast.value) {
        if (testOrderId) {
          await submitAnswers({
            testOrderId,
            answerList: state.answerList,
          });
        }
      }
    }
    // 题目是否已选择
    function isActive(index) {
      return currentOptionAnswer.value?.answer === index;
    }

    // 下一题按钮
    function handleNext() {
      if (!currentOptionAnswer.value) {
        return Toast("请选择您的答案");
      }
      state.notify?.close();
      state.animate = false;

      window.setTimeout(() => {
        state.animate = true;
        state.currentIndex += 1;
        state.tipList[state.currentIndex] &&
          Dialog.alert({
            message: state.tipList[state.currentIndex],
            theme: "round-button",
          }).then(() => {});
      }, 300);
    }
    // 上一题按钮
    function handleLast() {
      if (state.currentIndex === 0) {
        return Toast("没有上一题了");
      }
      state.notify?.close();
      state.currentIndex += -1;
    }

    // 查看报告按钮
    async function handleLookReport() {
      if (disabled.value) return;
      if (state.testPaperInfo?.ageSet && Object.keys(state.testPaperInfo?.ageSet).length) {
        goChooseYear();
      } else {
         handleReport();
      }
    }
    // 查看报告
    const [create] = useCreate();
    // 查看报告
    async function handleReport() {
      try {
        if (!testOrderId) {
          const { testOrderId } = await create({
            answerList: state.answerList,
          });
          state.testOrderId = testOrderId;
          // 跳转支付引导页
          router.replace({
            path: "/pay",
            query: {
              testOrderId: state.testOrderId,
              testPaperId,
              promotionId,
            },
          });

          window.localStorage.setItem(
            "order_info",
            JSON.stringify({
              testPaperId,
              testOrderId: state.testOrderId,
            })
          );
        } else {
          await submitTest({
            testOrderId,
            answerList: state.answerList,
          });
          const { needPay } = await checkTestOrderPay({ testOrderId });
          // data为1 已支付状态
          const path = needPay === 1 ? "/pay" : "/report";

          // 跳转支付引导页
          router.replace({
            path,
            query: {
              testOrderId,
              testPaperId,
              promotionId,
              percent: state.answerList.length,
            },
          });
          window.localStorage.setItem(
            "order_info",
            JSON.stringify({
              testPaperId,
              testOrderId,
            })
          );
        }
      } catch (error) {
        console.log(error);
        Toast("网络异常，请重试");
      }
    }
    onBeforeUnmount(() => {
      state.notify?.close();
    });

    // 检查订单状态
    function checkStatus() {
      const { testOrderId, testPaperId, promotionId, type } = route.query;
      if (!testOrderId) {
        return;
      }
      return new Promise(async (resolve, reject) => {
        // 重测订单 则不检测 并清除重测参数
        if (type === "reset") {
          const query = {
            ...route.query,
            type: undefined,
          };
          const search = qs.stringify(query);
          window.history.replaceState(
            null,
            null,
            `${window.location.origin + route.path}?${search}`
          );
          resolve();
          return;
        }
        try {
          const { needPay } = await checkTestOrderPay({ testOrderId });
          if (needPay !== 1) {
            router.replace({
              path: "/detail",
              query: {
                testPaperId,
                promotionId,
              },
            });
            reject();
          } else {
            resolve();
          }
        } catch (error) {
          reject();
        }
      });
    }
    const goChooseYear = async () => {
      if (testOrderId) {
        await submitTest({
          testOrderId,
          answerList: state.answerList,
        });
      } else {
        const { testOrderId } = await create({
          answerList: state.answerList,
        });
        state.testOrderId = testOrderId;
      }

      window.localStorage.setItem(
        "order_info",
        JSON.stringify({
          testPaperId,
          testOrderId: state.testOrderId,
        })
      );
      localStorage.setItem("answerList", JSON.stringify(state.answerList));

      router.push({
        path: "/chooseYear",
        query: {
          ...route.query,
          testOrderId: testOrderId || state.testOrderId,
        },
      });
    };
    function historicalOrders() {
      isStop.value = false;
      // ww注释20240420
      // router.push({
      // 	path: "/order",
      // 	query: {
      // 		promotionId,
      // 		testPaperId: state.testPaperInfo?.id
      // 	},
      // });
    }
    useAuth(
      {
        authType: 2,
      },
      async () => {
        try {
          await checkStatus();
          // if (!testOrderId) {
          await loadTestPaperInfo();
          // }
          await init();
          getAnswer();
        } catch (error) {
          if (promotionId || testPaperId) {
            router.replace({
              path: "/detail",
              query: {
                promotionId,
                testPaperId,
              },
            });
          } else {
            router.replace("/");
          }
        }
      }
    );

    function handleReset() {
      state.currentIndex = 0;
      state.answerList = [];
    }
    const isImgSubject = computed(() => {
      const isImg = unref(current).selections?.find((item) => item.img);
      return !!isImg;
    });
    return {
      handleNext,
      handleLast,
      handleOption,
      isActive,
      handleLookReport,
      handleLookResult,
      isLast,
      disabled,
      percentage,
      current,
      handleReset,
      ...toRefs(state),
      isImgSubject,
      historicalOrders,
    };
  },
};
</script>
<style lang="less">
.pc-notify {
  width: 750px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
<style lang="less" scoped>
.animate-next {
  animation-duration: 0.3s;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: next;
}

.tips1 {
  height: 55px;
  font-size: 16px;
  display: flex;
  position: sticky;
  top: 0;
  left: 0;

  z-index: 999;

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

.overflow {
  height: 100vh;
  overflow: hidden;
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

.pc-qrcard-content {
  width: 160px;
  display: flex;
  justify-content: center;

  :deep(.pc-qrcard) {
    border: none;
    padding: 0;
    width: 160px;

    .left {
      width: 120px !important;
      height: 120px !important;
    }

    .right {
      justify-content: flex-start;
      font-size: 14px !important;
      padding: 10px 0 0 0;
      line-height: 20px;
      text-align: center;
    }
  }
}

.pc-answer {
  // position: absolute;
  // left: 50%;
  // top: 0;
  // transform: translateX(-50%);
  // width: 100%;
  // height: 100%;
  // overflow-x: hidden;
  .scroll-bar();

  .pc-title {
    text-align: center;
    font-size: 30px;
    color: @theme-color;
    font-weight: bold;
    padding: 10px;
  }

  .pc-text {
    display: flex;
    justify-content: center;
    font-size: 14px;
    color: @gray-color;

    .pc-item {
      padding: 0 5px;
    }
  }

  .pc-progress-content {
    .space-between();
    .align-center();
    padding: 10px 5px;
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

  .pc-topic-content {
    .pc-topic-title {
      font-size: 22px;
      font-weight: bold;
      padding: 10px 0 20px 0;
    }

    .pc-topic-text {
      .item {
        font-size: 16px;
        border-radius: 5px;
        border: 1px solid #e5e5e5;
        overflow: hidden;
        margin-bottom: 20px;
        cursor: pointer;
        .align-center;
        position: relative;

        .left {
          font-weight: bold;
          padding: 0 30px;
          background-color: @theme-color;
          color: #fff;
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 70px;
          .align-center;
        }

        .right {
          padding: 13px 0;
          margin-left: 90px;
          line-height: 25px;
        }
      }
    }

    .pc-topic-img {
      margin: 0 auto;
      width:180px;
    }

    .pc-topic-picture {
      .pc-card-content {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;

        .pc-card-item {
          width: 75px;
          height: auto;
          border: 1px solid #e5e5e5;
          margin: 0 10px 10px 0;
          .align-center;
          justify-content: center;
          cursor: pointer;
          .pc-card-img {
            width: 100%;
          }
        }
      }
    }
  }

  .pc-last-next {
    .align-center;
    justify-content: center;
    padding: 20px 0;
    border-bottom: 1px solid #eeeeee;

    .pc-button {
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 5px;
      color: #fff;
      background-color: @theme-color;
      margin-right: 10px;
      font-size: 16px;
      cursor: pointer;

      &.check-report {
        width: 160px;
      }
    }
  }

  .pc-instructions {
    padding: 30px 0;
    font-size: 14px;
    line-height: 30px;

    .item {
      flex: 1;
      padding-right: 30px;
    }

    .space-between();
  }
}
</style>
