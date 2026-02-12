<script setup>
import { px2rem } from "@/utils/rem";
import Question from "./components/Question";
import Steps from "./components/Steps";
import { computed } from "vue";
const props = defineProps({
  testPaperInfo: {
    type: Object,
    default: () => { },
  },
  questionGroup: {
    type: Array,
    default: () => [],
  },
  questionList: {
    type: Array,
    default: () => [],
  },
  answerList: {
    type: Array,
    default: () => [],
  },
  currentIndex: {
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
});

const emit = defineEmits(["option", "last", "next", "result"]);

const questionGroup = computed(() => props.questionGroup);

// 当前题目索引
const currentIndex = computed(() => props.currentIndex);
const questionNumber = computed(() => {
  const index = currentIndex.value + 1;
  return index > 9 ? index : `0${index}`;
});

// 当前分组
const stepIndex = computed(() => {
  return questionGroup.value.findIndex((item) => {
    const { start, end } = item;
    const number = currentIndex.value + 1;
    return number >= start && number <= end;
  });
});
const stepValue = computed(() => {
  if (
    stepIndex.value === questionGroup.value.length - 1 &&
    answerList.value.length >= questionList.value.length
  ) {
    return stepIndex.value + 1;
  }
  return stepIndex.value;
});

const currentStep = computed(() => questionGroup.value[stepIndex.value]);
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
  return value > 9 ? value : `0${value}`;
});
const currentStepPercentage = computed(() => {
  if (!currentStepQuestions.value?.length) return 0;
  if (stepQuestionNumber.value == 0) {
    return 0;
  }
  const value =
    (parseInt(stepQuestionNumber.value) / currentStepQuestions.value.length) *
    100;
  return value >= 100 ? 100 : value;
});

// 答案列表
const answerList = computed(() => props.answerList);
// 题目列表
const questionList = computed(() => props.questionList);
// 当前题目
const currentQuestion = computed(() => questionList.value[currentIndex.value]);

// 当前题目答案
const currentQuestionAnswer = computed(() =>
  answerList.value.find((item) => item.id === currentQuestion.value.id)
);
const animation = computed(() => props.animation);
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
    questionList.value.length === answerList.value.length &&
    currentIndex.value === questionList.value.length - 1
  );
});

function handleOption(index) {
  emit("option", index);
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

const testPaperInfo = computed(() => props.testPaperInfo);

</script>

<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/images/gallup/book.png" class="book" />
      <div class="info-warp">
        <div class="title">
          {{ testPaperInfo?.name }}
          <!-- <span class="time">8-10分钟</span> -->
        </div>
        <div class="info">
          <!-- <div class="info-text">{{ testPaperInfo?.extend?.centerText }}</div> -->
          <div class="info-text">科学的测出您的才干优势，未来成就</div>
          <div class="info-count">
            已有{{ testPaperInfo?.saleNum }}人参与测试
          </div>
        </div>
      </div>

    </div>

    <div class="content-wrapper">
      <div class="tag-list">
        <!-- <div class="tag" v-for="(text, index) in testPaperInfo?.extend?.headText?.split(
            '|'
          )" :key="index">
            {{ text }}
          </div> -->
        <div class="tag">
          盖洛普优势
        </div>
        <div class="tag">
          职场/副业天赋分析
        </div>
        <div class="tag">
          职业选择分析
        </div>
      </div>
      <div class="content">
        <div class="steps-wrapper" v-if="questionGroup.length">
          <Steps :value="stepValue" :steps="questionGroup" :currentStepNumber="stepQuestionNumber" />
          <!-- 进度条 -->
          <div class="question-progress-wrapper">
            <van-progress class="progress-item" :percentage="currentStepPercentage" stroke-width="8" :show-pivot="true"
              :pivot-text="`${stepQuestionNumber} / ${currentStepQuestions.length}`" />
          </div>
        </div>
        <div class="question-progress-wrapper" v-else>
          <van-progress class="progress-item" :percentage="percentage" stroke-width="8" :show-pivot="true"
            :pivot-text="`${questionNumber} / ${questionList.length}`" />
        </div>

        <div :class="{ animation }">
          <Question @select="handleOption" :data="currentQuestion" :value="currentQuestionAnswer?.answer" />
        </div>
        <div class="tips" v-if="testPaperInfo.extend?.bottomText" v-html="testPaperInfo.extend?.bottomText"></div>
        <div class="footer">
          <div @click="handleLast" class="item" v-show="currentIndex > 0">
            上一题
          </div>
          <div @click="handleNext" class="item" v-show="showNextButton && currentIndex < questionList.length - 1">
            下一题
          </div>
          <div @click="handleResult" class="item result" v-show="showResultButton">
            查看结果
          </div>
        </div>
      </div>

      <div class="notice" v-if="testPaperInfo?.copyright">
        <!-- <div class="notice-title">
          {{ goodsInfo.goods_notice_title }}
        </div> -->

        <div class="notice-content" v-html="testPaperInfo?.copyright"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.animation {
  animation-duration: 300ms;
  // animation-fill-mode: both;
  // animation-name: transform;
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

  // 头部
  .header {
    padding: 10px;
    height: 160px;
    background: linear-gradient(-225deg, #B8DCFF 0%, #e9d1f5 48%, #69EACB 100%);
    // background-image: linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%);

    width: 100%;

    .book {
      height: 120px !important;
      position: absolute;
      top: 20px;
      right: 10px;
      width: auto !important;

    }

    img {
      height: 120px !important;
      width: auto !important;
    }

    .info-warp {
      margin-top: 15px;
      color: #fff;
      text-align: left;

      .title {
        font-size: 20px;
        font-weight: 500;

      }

      .info {
        margin-top: 20px;

        .info-text {
          font-size: 16px;
          font-weight: 500;
        }

        .info-count {
          font-size: 12px;
          padding: 5px 0;
        }
      }
    }
  }

  .content-wrapper {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    position: relative;
    background: #fff;
    margin-top: -40px;
    padding-top: 10px;

    .tag-list {

      display: flex;
      padding-left: 20px;
      margin-top: 10px;

      .tag {
        font-size: 14px;
        background-color: #f6f6f6;
        border-radius: 4px;
        line-height: 24px;
        padding: 0 8px;
        margin-right: 4px;
      }
    }

    .content {

      position: relative;
      z-index: 1;
      background-color: rgba(#fff, 0.8);
      border-radius: 10px;
      padding: 10px 10px;
      margin: 0 10px;
      // box-shadow: 0 4px 12px 2px rgba(#000, 0.03);
      overflow: hidden;

      .title {
        font-size: 22px !important;
        font-weight: bold;

        .time {
          font-size: 12px;
          color: #7e7e7e;
          font-weight: normal;
        }
      }

      .steps-wrapper {
        .steps-progress {
          display: flex;
          align-items: center;

          .value {
            font-size: 14px;
            padding-right: 10px;

            .current {
              font-weight: bold;
              font-size: 16px;
            }
          }

          .progress {
            flex: 1;
          }
        }
      }



      .tips {
        text-align: center !important;
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
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        // padding: 10px 0;
        .item {
          width: 120px;
          height: 36px;
          border-radius: 36px;
          line-height: 36px;
          text-align: center;
          font-weight: bold;
          background-color: #87b7e7;
          color: #fff;
          font-size: 16px;

          &.result {
            animation: scale 3s infinite;
            background-image: linear-gradient(-60deg, #f09819 0%, #f09819 100%);
            width: 150px;

          }
        }
      }
    }

    :deep(.notice) {
      color: #7e7e7e;
      font-size: 14px;
      line-height: 24px;
      background-color: #f2f2f2;
      padding: 20px 0;
      margin-top: 10px;

      ul {
        display: flex;
        flex-wrap: wrap;
        padding-left: 30px;

        li {
          list-style: disc;
          width: 50%;
        }
      }

      // .notice-title {
      //   font-weight: bold;
      //   padding-bottom: 12px;
      //   text-align: center;
      // }
    }
  }
}
</style>