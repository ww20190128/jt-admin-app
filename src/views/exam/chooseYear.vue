<template>
    <div class="pc-answer" :class="{ 'overflow': dateShow }">
      <!-- 年龄选择 -->
      <ChooseBirthday :ageSet="ageSet" v-model:show="dateShow" @confirm="handleBirthdayConfirm" />
    </div>
  </template>
  
  <script>
  import { reactive, toRefs, onMounted, onBeforeUnmount } from "vue";
  import ChooseBirthday from "@/components/ChooseBirthday";
  import { useRouter, useRoute } from "vue-router";
  import QrCard from "@/components/QrCard";
  import { Notify, Toast } from "vant";

  import { updateTestOrder } from "@/api/testPaper";
  import { checkTestOrderPay } from "@/api/order";
  import { Picker } from 'vant'
  import { loadingToast } from "@/plugins/vant";
  // api 接口
  import {
	  getTestPaperInfo,
  } from "@/api/testPaper";
  export default {
    name: "chooseYear",
    components: {
      ChooseBirthday,
      QrCard,
      Picker
    },
  
    setup() {
      const router = useRouter();
      const route = useRoute();
      const { testOrderId, testPaperId, promotionId, couponId } = route.query;
      const state = reactive({
        questionVisible: false,  // 评测须知显示隐藏
        currentIndex: 0, // 当前题目索引
        answerList: [], // 已回答的题目
        isStop: true,
        testPaperInfo: {}, // 测评信息
        dateShow: true, // 生日选择
        animate: true, // 动画显示隐藏
        ageSet: {},
        columns: new Array(75).fill(1).map((e, i) => i + 1),
        showPicker: true
      });
  
      // 生日选择确定按钮
      async function handleBirthdayConfirm(age) {
        await updateTestOrder({
          age: Number(age),
          testOrderId: testOrderId,
        });
        handleReport()
      }
  
      // 查看报告
      async function handleReport() {
        try {
          const { testComplete, needPay } = await checkTestOrderPay({ testOrderId:testOrderId });
          window.loading = loadingToast()
          if (testComplete == 1 && needPay === 0) { // 完成测试并且不需要支付，跳转到报告
            router.replace({
              path: "/report",
              query: {
                testOrderId,
                testPaperId,
                promotionId,
                percent: state.answerList.length,
              },
            });
          } else {
            router.replace({
              path: "/pay",
              query: {
                testOrderId: testOrderId,
                testPaperId: testPaperId,
                promotionId,
                percent: state.answerList.length,
                couponId
              },
            });
          }
        } catch (error) {
          Toast("网络异常，请重新提交");
        }
      }
      onBeforeUnmount(() => {
        state.notify?.close();
      });
      async function init() {
        const { testPaperInfo } = await getTestPaperInfo({ testPaperId : testPaperId });
        state.ageSet = testPaperInfo?.ageSet
      }
      onMounted(async () => {
        window.loading?.close?.()
        await init();
      })
      const onConfirm = (e) => {}
      return {
        handleBirthdayConfirm,
        onConfirm,
        ...toRefs(state),
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
  .van-haptics-feedback {
    font-size: 18px;
  }
  .van-picker__confirm {
    font-weight: 500;
    color: #ff5d7d;
  }
  .van-picker-column__item--selected {
    font-size: 20px;
  }
  </style>
  <style lang="less" scoped>
  .animate-next {
    animation-duration: 0.3s;
    animation-duration: 0.3s;
    animation-fill-mode: both;
    animation-name: next;
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
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    overflow-x: hidden;
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
        width: 340px;
      }
  
      .pc-topic-picture {
        .pc-card-content {
          display: flex;
          flex-wrap: wrap;
          margin-top: 20px;
  
          .pc-card-item {
            width: 170px;
            height: 80px;
            border: 1px solid #e5e5e5;
            margin: 0 10px 10px 0;
            .align-center;
            justify-content: center;
            cursor: pointer;
  
            .pc-card-img {
              height: 90%;
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