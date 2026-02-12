<script setup>
import { px2rem } from "@/utils/rem";
import Question from "@/components/Question";
import Steps from "./components/Steps2";
import { computed, ref } from "vue";

const props = defineProps({
  testPaperInfo: {
    type: Object,
    default: () => { },
  },
  questionGroup: { // 题组
    type: Array,
    default: () => [],
  },
  questionList: { // 题目
    type: Array,
    default: () => [],
  },
  answerList: { // 答案
    type: Array,
    default: () => [],
  },
  currentIndex: { // 当前题目次序
    type: Number,
    default: 0,
  },
  showNextButton: {
    type: Boolean,
    default: false,
  },
  animation: {
    type: Boolean,
    default: false,
  },

  questionGroupIndex: { // 当前题组次序
    type: Number,
    default: 0,
  },
  isLast: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["option", "last", "next", "result", "questionVisible"]);
const name = computed(() => props.testPaperInfo?.name);
const steps = computed(() => props.questionGroup);
const isLast = computed(() => props.isLast);
const copyright = computed(() => props.testPaperInfo?.copyright);
// 当前题目索引
const currentIndex = computed(() => props.currentIndex);
const questionNumber = computed(() => {
  const index = currentIndex.value + 1;
  return index > 9 ? index : `${index}`;
});

// 当前分组
const stepIndex = computed(() => {
  return steps.value.findIndex((item) => {
    const { start, end } = item;
    const number = currentIndex.value + 1;
    return number >= start && number <= end;
  });
});
const stepValue = computed(() => {
  if (
    stepIndex.value === steps.value.length - 1 &&
    answerList.value.length >= questionList.value.length
  ) {
    return stepIndex.value + 1;
  }
  return stepIndex.value;
});

const currentStep = computed(() => steps.value[stepIndex.value]);
const currentStepQuestions = computed(() => {
  if (!currentStep.value) return [];
  const { start, end } = currentStep.value;
  const startIndex = start - 1;
  return questionList.value.slice(startIndex, end);
});
const stepQuestionNumber = computed(() => {
  if (currentIndex.value === 0) return questionNumber.value;
  const index = currentStepQuestions.value.findIndex(
    (item) => item.id === currentQuestion.value?.id
  );
  const value = index + 1;
  return value > 9 ? value : `${value}`;
});
const currentStepPercentage = computed(() => {
  if (!currentStepQuestions.value?.length) return 0;
  const value =
    (parseInt(stepQuestionNumber.value) / currentStepQuestions.value.length) * 100;

  return value >= 100 ? 100 : value;
});
const answerList = computed(() => props.answerList); // 答案列表
const questionList = computed(() => props.questionList); // 题目列表
const currentQuestion = computed(() => questionList.value[currentIndex.value]); // 当前题目
const questionGroup = computed(() => props.questionGroup);
const questionGroupIndex = computed(() => props.questionGroupIndex);
// 当前题目答案
const currentQuestionAnswer = computed(() =>
  answerList.value.find((item) => item.id === currentQuestion.value.id)
);

// 进度条当前进度
const percentage = computed(() => {
  if (!questionList.value.length) return 0;
  if (currentIndex.value == 0) {
    return 0;
  }
  const value = ((currentIndex.value + 1) / questionList.value.length) * 100;
  return value >= 100 ? 100 : value;
});
const showNextButton = computed(() => props.showNextButton);
const showResultButton = computed(() => {
  return (
    questionList.value.length === answerList.value.length && currentIndex.value === questionList.value.length - 1
  );
});
const animation = computed(() => {
  let animation = props.animation
  // currentIndex!=currentIndex
});
function handleOption(index) {
  emit("option", index);
  // imGindex.value=img

}
function handleLast() {
  emit("last");
}
function handleNext() {
  emit("next");
}
function handleResult() {
  emit("result");
}
function questionVisible() {
  emit("questionVisible");
}
//获取秒的时间戳后6位
function getTimestamp() {
  var date = new Date();
  var timestamp = date.getTime();
  var timestamp_str = timestamp.toString();
  var timestamp_str_last6 = timestamp_str.substring(4, 10);
  return timestamp_str_last6;
}

const testPaperInfo = computed(() => props.testPaperInfo);
const styleType = computed(() => props.testPaperInfo?.extend?.styleType);
</script>

<template>
  <div class="container">
    <div class="head">
      <div class="title">
        {{ name }}
        <span> 已有{{ testPaperInfo?.saleNum }}人参与测试</span>
      </div>
    </div>


    <div class="steps-wrapper" v-if="steps.length">
      <Steps v-show="!currentQuestion.matterImg" :value="stepValue" :steps="steps"
        :currentStepNumber="stepQuestionNumber" />
      <div class="question-progress-wrapper" v-if="!currentQuestion.matterImg">
        <van-progress class="progress-item" :percentage="currentStepPercentage" stroke-width="8" :show-pivot="true"
          :pivot-text="`${stepQuestionNumber} / ${currentStepQuestions.length}`" />
      </div>
    </div>
    <div v-else class="question-progress-wrapper">
      <van-progress class="progress-item" :percentage="percentage" stroke-width="8" :show-pivot="true"
        :pivot-text="`${questionNumber} / ${questionList.length}`" />
    </div>


    <div class="content-wrapper">
      <div class="content">
        <div :class="{ animation }">
          <Question @select="handleOption" :data="currentQuestion" :showResultButton="showResultButton"
            :styleType="styleType" :value="currentQuestionAnswer?.answer" :isLast="isLast" />

        </div>

        <div class="footer">
          <div @click="handleLast" class="item" v-show="currentIndex > 0">
            上一题
          </div>
          <div @click="handleNext" class="item" v-show="showNextButton && currentIndex < questionList.length - 1">
            下一题
          </div>
          <div @click="handleResult" class="item result" v-show="showResultButton">
            查看报告
          </div>
        </div>
      </div>

      <div class="notice" v-if="testPaperInfo?.extend?.bottomInfo">
        <div class="notice-content" v-html="testPaperInfo?.extend?.bottomInfo"></div>
      </div>
      <div v-if="copyright">
        <div class="notice2" v-html="copyright"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.animation {
  animation-duration: 300ms;
  animation-fill-mode: both;
  animation-name: transform;
  // animation-duration: 0.3s;
  // animation-fill-mode: both;
  // animation-name: next;
}

@keyframes transform {
  0% {
    transform: translateX(375px);
    // transform: translateY(90px);
    // transform: scale(0);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    // transform: scale(1);
    opacity: 1;
  }
}

.container {
  display: flex;
  flex-direction: column;
  min-height: var(--container-min-height);
  position: relative;

  .header {
    height: 80px;
    background: linear-gradient(to right, #c5ddfd, #fbe2ff);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .book {
      width: 98px;
      position: absolute;
      top: 0;
      right: 16px;
    }
  }

  .header-content {
    // position: fixed;

    // position: sticky;
    //
    // left: 0;
    position: fixed;
    width: 100%;

    top: 0;
    z-index: 997;
    box-shadow: 0 1px 6px rgba(#000, 0.1);

    .full-fixed();

    .header {
      width: 100%;
      height: 48px;
      padding: 0 @padding-base;
      background-color: #fff;
      .space-between();
      .align-center();
      color: @gray-color;

      .van-icon {
        font-size: @font-size-base;
      }

      .van-count-down {
        font-size: @font-size-sm;
        color: @gray-color;
        padding-left: 5px;
      }

      .num {
        font-size: @font-size-sm;
        vertical-align: bottom;


        .currentIndex-num {
          font-size: @font-size-lg;
          color: #000;
          font-weight: bold;
        }
      }

      .time {
        .align-center();
      }

      .progress {
        width: 200px;
      }

      .question {
        font-size: @font-size-base;
        width: 20px;
        height: 20px;
        border: 1px solid #f1f3f4;
        border-radius: 3px;
        .align-center();
        justify-content: center;
      }
    }
  }

  .head {
    margin-top: 15px;
    // margin-bottom: 10px;
    display: flex;
    justify-content: center;

    .title {
      margin-top: 5px;
      color: #41464b;
      font-variant: tabular-nums;
      font-weight: 400 !important;
      font-size: 22px !important;
      text-align: center;

      span {
        display: block;
        font-size: 12px;
        margin: 5.5px 0 0;
        color: #aaa;
        text-align: center;
      }
    }
  }

  .progress-center {
    display: flex;
    justify-content: center;

    .cur {
      color: #1989fa;
    }

    .row1 {
      width: 40%;
      display: flex;
      align-items: center;
      position: relative;
      justify-content: center;
      flex-wrap: wrap;
      flex-direction: column;

      .yuan1 {
        width: 30px;
        height: 30px;
        border-radius: 50px;
        line-height: 30px;
        background: #1989fa;
        color: #fff;
        font-size: 15px;
        text-align: center;
      }

      .yuan2 {
        width: 30px;
        height: 30px;
        border-radius: 50px;
        line-height: 30px;
        color: #fff;
        font-size: 15px;
        text-align: center;
        background: #607d8b;
      }

      p {
        font-size: 15px;
        margin-top: 12px;
        margin-bottom: 12px;
      }

      .jd2 {
        font-size: 16px;
      }

      .line1 {
        height: 1px;
        width: 43px;
        background: #607d8b;
        position: absolute;
        right: 0;
      }

      .line2 {
        height: 1px;
        width: 43px;
        background: #607d8b;
        position: absolute;
        left: 0;
      }
    }
  }

  .steps-wrapper {

    .steps-progress {
      display: flex;
      align-items: center;
      padding-top: 15px;
      padding-bottom: 15px;
      margin: 0 28px;

      .value {
        font-size: 14px;
        padding-right: 10px;
        color: #b0b0b0;

        .current {
          font-weight: bold;
          font-size: 16px;
          color: #ff905b;
        }
      }

      .progress {
        flex: 1;
      }
    }
  }




  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 5px;

    .content {
      position: relative;
      z-index: 1;
      background-color: #fff;
      // border-radius: 8px;
      padding: 10px 20px;
      // margin: 0 10px;
      box-shadow: 0 4px 12px 2px rgba(#000, 0.03);
      overflow: hidden;

      // width: 768px;
      // margin: 0 auto;
      .title {
        font-size: 20px;
        font-weight: bold;

        .time {
          font-size: 12px;
          color: #7e7e7e;
          font-weight: normal;
        }
      }

      .tag-list {
        font-size: 12px;
        color: #7e7e7e;
        display: flex;
        padding: 6px 0 10px;

        .tag {
          background-color: #f6f6f6;
          border-radius: 4px;
          line-height: 24px;
          padding: 0 8px;
          margin-right: 4px;
        }
      }

      .info {
        .info-text {
          color: #7d4686;
          font-size: 16px;
          font-weight: bold;
        }

        .info-count {
          font-size: 12px;
          color: #7e7e7e;
          padding: 5px 0;
        }
      }





      .tips {
        padding: 8px 0;
        line-height: 24px;
        // background-color: #f8f6f9;
        background-color: #f1f1f1;
        text-align: center;
        font-size: 12px;
        border-radius: 4px;
        margin: 10px 0;
      }

      .footer {
        display: flex;
        justify-content: space-between;
        padding-top: 30px;
        margin-bottom: 16px;

        .icon1 {
          width: 16px;
          margin-bottom: 2px;
          margin-right: 5px;


        }

        .icon2 {
          width: 16px;
          margin-bottom: 2px;
          margin-left: 5px;
        }

        // padding: 10px 0;
        .item {
          height: 36px;
          // border-radius: 36px;
          line-height: 36px;
          text-align: center;
          // font-weight: bold;
          display: flex;
          align-items: center;
          // background-color: #9f6ba7;
          // background: #ffc0a3;
          color: #858585;
          font-size: 16px;
          padding-right: 3px;
          border-bottom: 1px solid #858585;
          //下划线
          // text-decoration: underline;

          &.result {

            animation: scale 3s infinite;
            background-image: linear-gradient(to right, #07c160, #07c160);
            //background-image: linear-gradient(-60deg, #f09819 0%, #f09819 100%);
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            width: 190px;
            font-weight: bold;
            border-radius: 36px;
            border-bottom: none;
          }
        }
      }
    }

    :deep(.notice) {
      color: #7e7e7e;
      font-size: 12px;
      line-height: 24px;
      // background-color: #f9f9f9;
      padding: 10px 15px 0 15px;
      // margin-top: 10px;
      margin-bottom: 30px;

      ul {
        display: flex;
        flex-wrap: wrap;
        // padding-left: 30px;
        line-height: 24px;
        text-align: center;

        li {
          list-style: disc;
          width: 50%;
          list-style: none;

          p {
            font-size: 12px;
          }
        }
      }
      p {
        font-size: 12px;
      }
      // .notice-title {
      //   font-weight: bold;
      //   padding-bottom: 12px;
      //   text-align: center;
      // }
    }

    :deep(.notice2) {
      color: #7e7e7e;
      font-size: 12px;
      line-height: 24px;
      background-color: #f9f9f9;
      padding: 0px 10px;
      text-align: center;
    }
  }
}
</style>
