<script setup>
import { px2rem } from "@/utils/rem";
import Question from "@/components/Question";
import Steps from "./components/Steps2";
import { computed, ref } from "vue";

const props = defineProps({
  questionGroup: {
    type: Object,
    default: () => [],
  },
  testPaperInfo: {
    type: Object,
    default: () => { },
  },
  questionList: {
    type: Object,
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
  questionGroupIndex: {
    type: Number,
    default: 0,
  },
  isLast: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["option", "last", "next", "result", "questionVisible"]);
const steps = computed(() => props.questionGroup ? props.questionGroup : []);
const isLast = computed(() => props.isLast);
const name = computed(() => props.testPaperInfo?.name);

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
  if (stepQuestionNumber.value == 0) {
    return 0;
  }
  const value =
    (parseInt(stepQuestionNumber.value) / currentStepQuestions.value.length) * 100;

  return value >= 100 ? 100 : value;
});

const answerList = computed(() => props.answerList); // 答案列表
const questionList = computed(() => props.questionList); // 题目列表

// console.log('%c [ props ]-99', 'font-size:13px; background:pink; color:#bf2c9f;', props)
// 当前题目
const currentQuestion = computed(() => questionList.value[currentIndex.value]);
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
    questionList.value.length === answerList.value.length &&
    currentIndex.value === questionList.value.length - 1
  );
});
const animation = computed(() => {
  let animation = props.animation
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
const testPaperInfo = computed(() => props.testPaperInfo);
const styleType = computed(() => props.testPaperInfo?.extend?.styleType); // paper_info.style_type 只有MBTI性格测试专业版 有值  用mbtiStyle代替
// 获取秒的时间戳后6位
function getTimestamp() {
  var date = new Date();
  var timestamp = date.getTime();
  var timestamp_str = timestamp.toString();
  var timestamp_str_last6 = timestamp_str.substring(4, 10);
  return timestamp_str_last6;
}
const getPeople = computed(() => { // 人数
  return getTimestamp()
})
</script>

<template>
  <div class="container">
    <div class="head-name">
      <div class="title">
        {{ name }}
        <!-- <span>最近30天测试：{{ getPeople }}人</span> -->
        <span> 已有{{ testPaperInfo?.saleNum }}人参与测试</span>
      </div>
    </div>
    <div class="steps-wrapper" v-if="steps.length">
      <Steps :value="stepValue" :steps="steps" :currentStepNumber="stepQuestionNumber" />
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


    <div class="content-wrapper">
      <div>
        <div class="content">
          <div :class="{ animation }">
            <Question @select="handleOption" :data="currentQuestion" :showResultButton="showResultButton"
              :styleType="styleType" :value="currentQuestionAnswer?.answer" :isLast="isLast" />

          </div>

          <div class="footer">
            <div @click="handleLast" class="item" v-if="currentIndex > 0">
              <img class="icon1" src="@/assets/images/zuo.png" />
              上一题
            </div>
            <div @click="handleNext" class="item right" v-if="showNextButton && currentIndex < questionList.length - 1">
              下一题
              <img class="icon2" src="@/assets/images/you.png" />
            </div>
            <div @click="handleResult" class="item result" v-if="showResultButton">
              查看结果
            </div>
          </div>
        </div>
  
        <div class="notice-warp" v-if="testPaperInfo?.extend?.bottomInfo">
          <div class="notice-content" v-html="testPaperInfo?.extend?.bottomInfo"></div>
        </div>
        <!-- 版权信息 -->
        <div v-if="testPaperInfo?.copyright">
          <div class="notice2-warp" v-html="testPaperInfo?.copyright"></div>
        </div>
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

.notice-content {}

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



  .head-name {
    margin-top: 15px; // ww 修改 原值35
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
        text-align: center !important;
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
        font-size: 16px;
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


  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 5px;
    -webkit-touch-callout: none;
    /*系统默认菜单被禁用*/
    -webkit-user-select: none;
    /*webkit浏览器*/
    -khtml-user-select: none;
    /*早期浏览器*/
    -moz-user-select: none;
    /*火狐*/
    -ms-user-select: none;
    /*IE10*/
    user-select: none;



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

      .footer {
        display: flex;
        justify-content: space-between;
        padding-top: 30px;
        margin-bottom: 16px;
        margin-top: 12px;

        .right {
          margin-left: auto;
        }

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

    :deep(.notice-warp) {
      color: #7e7e7e;
      line-height: 24px;
      background-color: #f9f9f9;
      padding: 20px 15px 0 15px;


      // margin-bottom: 30px;
      // position: absolute;

      // top: 0;

      ul {
        display: flex;
        flex-wrap: wrap;
        line-height: 24px;
        text-align: center;

        li {
          font-size: 13px !important;
          list-style: disc;
          width: 50%;
          list-style: none;
        }


      }

      p {
        font-size: 12px !important;

      }

      // .notice-title {
      //   font-weight: bold;
      //   padding-bottom: 12px;
      //   text-align: center;
      // }
    }

    :deep(.notice2-warp) {
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
