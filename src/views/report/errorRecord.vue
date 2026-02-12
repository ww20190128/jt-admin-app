<template>
  <div class="error-record-warper" :class="{ padding: !isWeChat && fromType === 'vipOpened' }"
    v-if="answerQuestionList && answerQuestionList.length > 0">
    <div class="warning-bar" v-if="!isWeChat && fromType === 'vipOpened'">
      <div class="text-content"><span class="warn">提醒：</span>请关注公众号使用您的VIP权益</div>
      <span class="button" @click="handleFocusOn">关注</span>
    </div>

    <!-- 题目区域 -->
    <div class="question-list-warp" v-for="item in answerQuestionList" :key="item.id">
      <!-- 题干 -->
      <div class="matter-warp">
        {{ item.index }}、 {{ item.matter }}
      </div>
      <!-- 题干图片 -->
      <div v-if="item.matterImg" class="matter-img-warp">
        <img :src="item.matterImg" />
      </div>
      <!-- 选项 -->
      <div class="selection-list-warp" :class="{ 'wrap-list': getShowImage(item) }">
        <div class="item" :class="{ 'user-answer': index == item.userAnswer, 'correct-answer': index == item.answer }"
          v-for="(selection, index) in item.selections" :key="index">
          <span class="option" v-if="!getShowImage(item)">{{
            optionNames[index]
          }}</span>
          <span>{{ selection.name }}</span>
          <img class="selection-img" :src="selection.img" v-if="getShowImage(item)" />
          <!-- <i class="fa fa-check-circle"></i> -->
          <!-- <i class="fa fa-close"></i> -->
          <div class="tag" v-if="getShowImage(item) && index == item.answer"> <span>正确</span></div>
          <div class="tag" v-if="getShowImage(item) && index == item.userAnswer"> <span>你的</span> </div>
        </div>
      </div>
      <!-- 答案 -->
      <div class="answer-warper">
        <div class="answer-content-text" v-if="!getShowImage(item)">
          <div class="item">你的答案：{{ getOption(item, false)?.name }}</div>
          <div class="item">正确答案：{{ getOption(item, true)?.name }}</div>
        </div>
        <div class="report-tag-red"><span>解析</span></div>
        <div class="analysis-warper" v-if="item?.analysis">{{ item?.analysis }}</div>
      </div>
    </div>
  </div>

  <div v-if="!answerQuestionList" class="exam_complete">
    <div class="title"><i class="fa fa-mortar-board" aria-hidden="true" />
      恭喜您，本次测试全部答对</div>
    <div class="text">你的智商超过135+</div>
    <div class="complete_content">鉴于瑞文标准智商测试对高智商评估的局限性，您可以通过瑞文高级智力评估进一步评估您在高智商人群中的水平。</div>

  </div>

  <div class="back" @click.stop="handleBack">
    <i class="icon fa fa-reply"></i>
  </div>
  <WeChatQr @close="vipFixedShow = true" v-model:show="warnVisible" title="重要提醒">
    <template #subhead>
      <p class="qr-subhead">您是VIP会员，请务必关注公众号</p>
      <p class="qr-subhead">才能使用你的特权</p>
    </template>
    <div class="qr-text">请截图保存二维码后，关闭弹窗</div>
  </WeChatQr>
  <WeChatQr v-model:show="wechatQrVisible" title="请扫描关注公众号">
    <span>关注公众号后使用VIP权益</span>
  </WeChatQr>
  <!-- VIP任意测 -->
  <VipFixed text="关注公众号" @click="warnVisible = true" v-if="!isWeChat && from_type === 'vipOpened'" />
</template>
<script setup>

import { nextTick, ref, computed } from "vue";
import { optionNames } from "@/views/exam/components/letter";
import { useAuth } from "@/hooks/useAuth";
import { useAgent } from "@/hooks/useAgent";
import { useRoute, useRouter } from "vue-router";
import WeChatQr from "@/components/WeChatQr";
import VipFixed from "@/components/VipFixed";
import { useStore } from "@/store";
// api 接口
import { getAnswerQuestionInfo } from "@/api/report";
const route = useRoute();
const router = useRouter();
const answerQuestionList = ref([]);
const wechatQrVisible = ref(false);
const warnVisible = ref(false);
const store = useStore();
const { isWeChat } = useAgent();
const wechatConf = computed(() => store.getters.wechatInfo || {});
const { testOrderId, fromType, testPaperId, promotionId } = route.query;
if (fromType === "vipOpened" && !isWeChat) {
  warnVisible.value = true;
}
async function init() {
  nextTick(() => {
    window.checkOrderLoading?.clear();
  });
  const { questionList } = await getAnswerQuestionInfo({ testOrderId: testOrderId, onlyError: 1 });
  answerQuestionList.value = questionList;
  document.title = `错题记录(${answerQuestionList.value.length}个)`;
}
function handleBack() {
  if (!isWeChat) {
    router.push({
      path: "report",
      query: route.query,
    });
  } else {
    router.back();
  }
}
// 跳转做题页
function goExam() {
  router.push({
    path: "/exam",
    query: {
      testPaperId: testPaperId,
    },
  });
}
async function evaluation() {
  if (!isWeChat) {
    goExam();
    return;
  }
  try {
    state.wechatQrVisible = true;
    state.qrModalTexts = {
      title: "你已购买该测评",
      subhead: '请先关注公众号，绑定微信身份后，在公众号里进行测试',
      content: `公众号名称：${wechatConf.value.name}`,
      subheadText: true,
    };
  } catch (error) { }
}
function getShowImage({ selections }) {
  const isImg = selections?.find((item) => item.img);
  return !!isImg;
}
function handleFocusOn() {
  wechatQrVisible.value = true;
}
function getOption({ userAnswer, answer, selections }, correct) {
  if (correct) {
    return selections[answer];
  } else {
    return selections[userAnswer];
  }
}

useAuth(
  {
    authType: 2,
  },
  init
);
</script>
<style scoped lang="less">
.qr-subhead {
  color: @theme-color;
  font-size: 15px;
  padding: 5px 20px;
}

.qr-text {
  font-size: 15px;
  color: #48ad4c;
  line-height: 25px;
}

.error-record-warper {
  background: #E4F0FF;
  padding: 10px;
  padding-bottom: 10px;

  .warning-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #f89633;
    font-size: @font-size-base;
    height: 44px;
    padding: 0 @padding-sm;
    color: #fff;
    .space-between();
    .align-center();
    .full-fixed();

    .warn {
      color: red;
      font-weight: bold;
    }

    .button {
      border-radius: 3px;
      background-color: #fff;
      font-size: @font-size-base;
      padding: 6px 12px;
      color: #f89633;
    }
  }

  .question-list-warp {
    padding-top: 10px;
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }

    // 题干
    .matter-warp {
      padding: 0 20px;
      font-weight: bold;
      font-size: 16px;
      line-height: 1.5;
    }

    // 题干图片
    .matter-img-warp {
      text-align: center;
      margin: @padding-sm 40px;
    }

    // 选项
    .selection-list-warp {
      padding: 0 30px;

      .item {
        background-color: #fff;
        border-radius: 2px;
        padding: 10px @padding-base;
        line-height: 25px;
        font-size: @font-size-base;
        display: flex;
        margin-bottom: 2%;
        cursor: pointer;
        position: relative;

        // height: 60px;
        // background-color: #48ad4c;

        .option {
          .align-center();
          padding-right: @padding-sm;
        }

        img {
          text-align: left;
          height: 100%;
          width: auto;
        }

        &.active {
          background-color: @theme-color;
          color: #fff;
        }


        .tag {
          position: absolute;
          left: 0px;
          top: 0px;
          height: 25px;
          width: 15px;
          line-height: 15px;
          text-align: center;
          border-radius: 2px 2px 10px 10px;
          opacity: 0.9;

          span {
            padding-top: 2px;
            font-size: 10px;
            color: #fff;
            writing-mode: vertical-rl;
            text-orientation: upright;
          }
        }

        &.user-answer {
          background-image: linear-gradient(270deg, #fdfcfb 0%, #e2d1c3 100%);

          .tag {
            background-color: #4facfe;
          }
        }

        &.correct-answer {
          background-image: linear-gradient(270deg, #fff 0%, #a1c4fd 100%);

          .tag {
            background-color: #fa709a;
          }
        }
      }
    }

    // 答案
    .answer-warper {
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      padding-top: 5px;
      background: @bg-color;
      box-shadow: 0px 0px 4px #e8e8e8;

      .answer-content-text {
        font-size: 14px;
        padding: 16px 10px;

        .item {
          padding: 4px 0;

          &:last-child {
            color: @gray-color
          }

          &:first-child {
            color: red;
          }
        }
      }

      .answer-content-img {
        font-size: 14px;
        display: flex;
        padding: 16px 10px;
        // border-top: 1px solid #e0e0e0;

        .item {
          width: 50%;
          display: flex;

          &:last-child {
            color: @gray-color
          }

          &:first-child {
            color: red;
          }

          .text {
            width: 58px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }

          .answer {
            img {
              height: 50px;
              margin: 0 6px;
            }
          }
        }
      }

      .report-tag-red {
        margin-left: 0 !important;
        margin-bottom: 10px;
        height: 25px;
        line-height: 25px;

        span {
          text-align: center;
          position: relative;
          padding-left: 15px;
          padding-right: 10px;
          height: 100%;
          color: #fff;
          font-size: 14px;
          font-weight: 400;
          line-height: 25px;
          margin-right: 5px;
        }
      }

      // 解析
      .analysis-warper {
        font-size: 14px;
        line-height: 22px;
        padding: 0 10px 10px 10px;

      }
    }
  }

  .title {
    font-weight: bold;
    font-size: 18px;
  }

  .wrap-list {
    display: flex;
    flex-wrap: wrap;

    .item {
      width: 49%;
      padding: 5px @padding-base !important;

      img {
        height: 50px;
        margin: 0 auto;
      }

      &:nth-child(2n + 1) {
        margin-right: 2%;
      }
    }
  }





}

.exam_complete {
  background-color: #fff;
  height: 100vh;
  text-align: center;

  .title {
    color: #000;
    font-size: 22px;
    font-weight: 700;
    padding-top: 30px;
  }

  .text {
    color: #f28b74;
    font-size: 20px;
    margin-top: 20px;
  }

  .complete_content {
    font-size: 16px;
    background-color: #fff;
    padding: 15px 20px;
    line-height: 27px;
    text-align: left;
  }

  .rw_report {

    padding: 0px 17px;
    margin-top: 20px;
    background: #fff;
  }

  .report_item {
    text-align: left;
    width: 100%;
    // background-color: #f1f0f5;
    border-radius: 0.256rem;
    margin-bottom: 0.42667rem;


    .top_conter {

      padding-top: 15px;
      padding-bottom: 15px;
      margin-left: 10px;

      .baweijiedu {
        padding: 3px 10px;
        color: #fff;
        background-color: rgb(234, 143, 107);
        text-align: center;
        border-radius: 50px;
      }

      .title2 {
        font-size: 13px;

      }

      .baweijiedu2 {
        font-size: 17px;
        padding-top: 10px;
      }

      .baweijiedu3 {
        padding-top: 5px;
        font-size: 12px;

      }

      .baweijieduImg {
        width: auto;
        height: 80px;
        padding-right: 10px;
      }

      .baweijieduImg2 {
        width: auto;
        height: 80px;
        padding-right: 10px
      }

      .baweijieduImg3 {
        width: auto;
        height: 80px;
        padding-right: 10px;
      }
    }

    .bottom_conter {
      margin: 0 10px;
      // border-top: 1px solid #d6d6d6;
      text-align: center;
      margin-top: 20px;
      margin-bottom: 10px;
      height: 35px;
      line-height: 35px;
      font-size: 14.5px;
      font-weight: 400;
      text-align: center;
      width: 100px;
      border-radius: 35px;
      color: #fff;

    }



    .bottom_zs {
      //渐变背景色
      background: linear-gradient(90deg, #2a8ddb 0%, #54a6e6 100%);
    }

  }
}

.back {
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 0 6px #0000001f;
  cursor: pointer;
  border-radius: 50%;
  position: fixed;
  left: calc((100vw - 375px) / 2 + 20px);
  bottom: calc(100px + constant(safe-area-inset-bottom));
  bottom: calc(100px + env(safe-area-inset-bottom));
  z-index: 5;
  background-color: #fff;
}
</style>