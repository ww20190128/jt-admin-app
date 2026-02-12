<template>
  <div class="content">
    <div class="card-warper">
      <span class="to-title"
        >亲爱的<span class="user">{{ userInfo?.userName }} </span>：</span
      >
      <div class="text-warper">
        <span>我购买了一个专业评测订单赠送给你，赶紧领取测试吧！</span>
      </div>
      <!-- 测评详情 -->
      <div
        class="test-warper"
        v-show="info?.testPaperInfo && info?.testPaperInfo?.mainImg"
      >
        <div class="give-icon">
          <img :src="giveIcon" />
        </div>
        <img :src="info?.testPaperInfo?.mainImg" />
        <div class="info">
          <div class="title">{{ info?.testPaperInfo?.name }}</div>
          <div class="subhead" v-if="info?.testPaperInfo?.subhead">
            {{ info?.testPaperInfo?.subhead }}
          </div>
          <div class="bottom">
            <div class="item" v-if="info?.testPaperInfo?.questionNum > 0">
              ● {{ info?.testPaperInfo?.questionNum }}道精选问题
            </div>
            <div class="item">
              ● {{ info?.testPaperInfo?.reportNum }}页专业报告
            </div>
            <div class="item">● {{ info?.testPaperInfo?.saleNum }}人测过</div>
          </div>
        </div>
      </div>
      <!-- 赠送人信息  -->
      <div
        class="give-user-warper"
        v-show="info?.giveUserInfo && info?.giveUserInfo?.userName"
      >
        <div
          class="user-img"
          v-show="info?.giveUserInfo && info?.giveUserInfo?.headImgUrl"
        >
          <van-image :src="info?.giveUserInfo?.headImgUrl" />
        </div>
        <div class="user-name">{{ info?.giveUserInfo?.userName }}</div>
        <div class="time">
          {{ $filters.formatDate(info?.createTime, "yyyy/MM/dd") }}
        </div>
      </div>
      <div class="button-warper animation-button">
        <template v-if="token">
          <div
            class="button disabled"
            v-if="!info?.isGiveUser && !info.isDrawUser && info.status !== 0"
          >
            c
          </div>
          <div v-else>
            <!-- 未领取，点击领取 -->
            <div class="button" @click="handleGet" v-if="info?.status === 0">
              点击领取
            </div>
            <!-- 已领取，未使用(没有生成订单) -->
            <div
              class="button"
              @click="confirm"
              v-if="info?.status === 1 && !info.testOrderInfo?.id"
            >
              立即测试
            </div>
            <!-- 已领取，生成订单，但是订单未完成 -->
            <div
              class="button"
              @click="handleContinue"
              v-if="
                info?.status === 1 && info.testOrderInfo?.testCompleteTime === 0
              "
            >
              继续测试
            </div>
            <!-- 生成订单，并且订单已完成 -->
            <div
              class="button"
              @click="handleReport"
              v-if="
                info?.status === 2 && info.testOrderInfo?.testCompleteTime > 0
              "
            >
              查看报告
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="footer">
      <div class="button" @click="handleGoHome">点这里返回测评大厅</div>
    </div>
  </div>

  <!-- 开通VIP弹窗 -->
  <VipDialog
    v-model:show="show"
    @confirm="confirm"
    buttonText="开始测试"
    :clearable="false"
  >
    <template #title> 领取成功 </template>
    <template #text>
      你已经成功领取了【{{ info?.testPaperInfo?.name }}】, 赶紧开始测试吧！
    </template>
  </VipDialog>

  <!-- 版本选择 -->
  <OptionsSelect2
    v-model:show="optionVisible2"
    v-model:current="optionCurrent"
    :versionConfig="info?.testPaperInfo?.versionConfig"
    :testPaperName="info?.testPaperInfo.name"
    @confirm="handleOptionConfirm"
  />
  <!-- 版本选择 -->
  <OptionsSelect
    v-model:show="optionVisible"
    v-model:current="optionCurrent"
    :versionConfig="info?.testPaperInfo?.versionConfig"
    @confirm="handleOptionConfirm"
  />
</template>

<script>
import { reactive, toRefs, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import VipDialog from "@/components/VipDialog";
import OptionsSelect from "@/components/OptionsSelect";
import OptionsSelect2 from "@/components/OptionsSelect2";
import { draw } from "@/api/give";
import { createTestOrder } from "@/api/testPaper";
import { useAgent } from "@/hooks/useAgent";
import { useStore } from "@/store";

import giveIcon from "@/assets/images/gift-01.png";
import giveBg from "@/assets/images/give-bg.png";

import { VueCanvasPoster } from "vue-canvas-poster";
export default {
  name: "giveDetail",
  components: {
    VipDialog,
    OptionsSelect,
    OptionsSelect2,
    VueCanvasPoster,
  },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const { giveId, shareCode } = route.query;
    const about = computed(() => store.getters.wechatInfo?.introduction);
    const token = computed(() => store.getters.token);
    const state = reactive({
      show: false,
      optionCurrent: undefined,
      optionVisible: false,
      optionVisible2: false,
      testOrderId: "",

      // 生成海报
      showPoster: true,
      posterImg: "", //生成的海报
      painting: {
        width: "750px",
        height: "1168px",
        background: "",
        views: [
          {
            type: "text",
            text: "",
            css: {
              top: "36%",
              right: "13.5%",
              width: "325px",
              maxLines: 1,
              textAlign: "center",
              fontSize: "70px",
              color: "#0068B7",
            },
          },
          {
            type: "text",
            text: "",
            css: {
              top: "44%",
              right: "13.5%",
              width: "325px",
              maxLines: 1,
              textAlign: "center",
              fontSize: "70px",
              color: "#0068B7",
            },
          },
        ],
      },
    });
    onMounted(async () => {
      if (store.getters.token) {
        init();
        store.dispatch("user/getUserInfo");
      } else {
        const { code } = route.query;
        if (code) {
          try {
            await store.dispatch("user/login", { code });
            // 登录完毕清除微信回调过来的code和state
            window.history.replaceState(
              null,
              null,
              `${window.location.origin}/user`
            );
            // 执行授权页的获取数据钩子
            init();
          } catch (error) {
            // 登录失败 回退上一页
            Toast("登录失败，请重新登录user/login");
            // setTimeout(() => {
            //   router.go(-1);
            // }, 1000);
          }
          // 登录完成 没有用户信息  获取用户信息
          if (!store.getters.hasUserInfo && store.getters.token) {
            store.dispatch("user/getUserInfo");
          }
        } else {
          state.loginDialogShow = true;
        }
      }
    });
    const userInfo = computed(() => store.getters.userInfo);
    const { md, ua, isWeChat, network, os } = useAgent();

    async function handleGet() {
      await draw({ giveId: props.info.id });
      state.show = true;
    }
    // 版本选择确定按钮
    function handleOptionConfirm() {
      createNewTestOrder();
    }

    function confirm() {
      if (props.info?.testPaperInfo?.versionConfig?.text) {
        if (props.info?.testPaperInfo?.mbtiStyle == 1) {
          state.optionVisible2 = true;
        } else {
          state.optionVisible = true;
        }
      } else {
        createNewTestOrder();
      }
    }

    // 创建新订单
    async function createNewTestOrder() {
      const { width, height } = window.screen;
      const deviceInfo = {
        // 设备信息
        phoneModel: "",
        browserVersion: ua,
        screenResolution: `${width}*${height}`,
        network,
        useEnv: isWeChat ? 1 : 2,
      };
      if (os == "iOS") {
        // ios系统
        deviceInfo.phoneModel = md.os() + md.version("iPhone");
      } else if (os == "AndroidOS") {
        // Android系统
        deviceInfo.phoneModel = md.os() + md.version("Android");
      }

      if (props.info?.promotionInfo?.answerStyleType == 1) {
        setTimeout(() => {
          goExam2();
        }, 500);
      } else {
        try {
          // 创建测试
          const { testOrderId } = await createTestOrder({
            giveId: giveId,
            testPaperId: props.info?.testPaperInfo?.id,
            ...deviceInfo,
            version: state.optionCurrent, // 题目版本
            shareCode: shareCode,
          });
          state.testOrderId = testOrderId;
          setTimeout(() => {
            goExam();
          }, 500);
        } catch (error) {}
      }
    }
    // 跳转做题页
    function goExam() {
      if (props.info?.testPaperInfo?.mbtiStyle == 1) {
        router.push({
          path: "/exam2",
          query: {
            testOrderId: state.testOrderId,
            testPaperId: props.info?.testPaperInfo?.id,
          },
        });
      } else {
        router.push({
          path: "/exam",
          query: {
            testOrderId: state.testOrderId,
            testPaperId: props.info?.testPaperInfo?.id,
          },
        });
      }
    }
    // 跳转做题页
    function goExam2() {
      if (props.info?.testPaperInfo?.mbtiStyle == 1) {
        router.push({
          path: "/exam2",
          query: {
            // testOrderId: state.testOrderId,
            testPaperId: props.info?.testPaperInfo?.id,
          },
        });
      } else {
        router.push({
          path: "/exam",
          query: {
            // testOrderId: state.testOrderId,
            testPaperId: props.info?.testPaperInfo?.id,
          },
        });
      }
    }
    onMounted(async () => {
      var ua = navigator.userAgent.toLowerCase();
      var isWeixin = ua.indexOf("micromessenger") != -1;
      if (!isWeixin) {
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=888";
        return false;
      }
    });

    // 继续答题
    function handleContinue() {
      if (props.info?.testPaperInfo?.mbtiStyle == 1) {
        router.push({
          path: "/exam2",
          query: {
            testOrderId: props.info?.testOrderInfo?.id,
            testPaperId: props.info?.testPaperInfo?.id,
          },
        });
      } else {
        router.push({
          path: "/exam",
          query: {
            testOrderId: props.info?.testOrderInfo?.id, // 测试订单id
            testPaperId: props.info?.testPaperInfo?.id, // 测评id
          },
        });
      }
    }

    // 跳转结果页
    function handleReport() {
      router.push({
        path: "/report",
        query: {
          testOrderId: props.info?.testOrderInfo?.id,
          testPaperId: props.info?.testPaperInfo?.id,
        },
      });
    }
    function handleGoHome() {
      router.push("/home");
    }
    //===============
    function open(item) {
      if (item.paintingWidth || item.paintingHeight) {
        this.painting.width = item.paintingWidth;
        this.painting.height = item.paintingHeight;
      }
      this.painting.background = item.bgImg;
      this.painting.views[0].content = item.codeUrl;
      this.painting.views[0].css = item.css;
      if (item.textObj) {
        this.painting.views[1].text = item.textObj.txt1;
        this.painting.views[2].text = item.textObj.txt2;
      }
    }
    function canvasSuccess(src) {}
    function canvasFail(err) {}
    function saveImg() {
      // wx.saveImageToPhotosAlbum({
      //   filePath: this.posterImg,
      //   success(res) { },
      //   fail(err) {
      //     console.log(err);
      //   },
      // });
    }

    return {
      canvasFail,
      canvasSuccess,
      saveImg,

      ...toRefs(state),
      handleGet,
      confirm,
      handleOptionConfirm,
      handleContinue,
      handleReport,
      about,
      token,
      userInfo,
      giveIcon,
      handleGoHome,
    };
  },
};
</script>

<style lang="less" scoped>
.content {
  background: #fff url("@/assets/images/give-bg.png") no-repeat;
  background-size: 100% auto;
  background-position: top center;
  position: relative;
  width: 100%;
  height: auto;

  padding: 0 20px 150px 20px;

  .card-warper {
    background: #fff;
    transform: translateY(70px) translateX(0%);
    background: #fff url("@/assets/images/bg_base.png") repeat !important;
    background-size: 1.6rem !important;

    border-radius: 10px;
    border: 1px solid #a1c4fd;
    box-shadow: 0px 0px 6px #d6d6d6;

    padding: 20px 30px 30px 30px;
    position: relative;
    width: 100%;
    height: auto;

    img {
      width: 100px;
      height: 100px;
    }

    .to-title {
      font-style: italic !important;
      padding-bottom: 5px;
      border-bottom: 1px solid hsla(240, 100%, 50%, 0.5);
      font-size: @font-size-lg;
      color: @light-black !important;

      .user {
        font-style: italic;
        font-size: @font-size-lg !important;
      }
    }

    .text-warper {
      font-style: italic;
      color: @light-black !important;
      margin-top: 40px;
      line-height: 30px;
      font-size: @font-size-lg !important;

      span {
        font-style: italic;
        padding-bottom: 5px;
        border-bottom: 1px solid hsla(240, 100%, 50%, 0.5);
      }
    }

    .test-warper {
      margin-top: 30px;
      position: relative;
      z-index: 1;

      .give-icon {
        z-index: 10;
        position: absolute;
        transform: translateY(-50%) translateX(-50%);
        top: 0;
        left: 50%;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        border: 2px solid #a1c4fd;
        background-color: #fff;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      width: 100%;
      height: auto;

      img {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        width: 100%;
        height: auto;
      }

      .info {
        z-index: 10;
        box-shadow: 0px 0px 6px #d6d6d6;
        // margin-top: -50px;

        transform: translateY(-20%) translateX(0%);
        background: #fff;
        text-align: center;
        padding: 10px 0 0 0;

        .title {
          font-size: @font-size-lg;
          line-height: 25px;
          font-weight: bold;
          font-size: @font-size-lg;
        }

        .subhead {
          color: @gray-color;
          font-size: @font-size-base;
        }

        .bottom {
          height: 22px;
          background-color: #c1eec9;
          margin-top: 10px;
          .space-between();

          .item {
            line-height: 22px;
            color: #fff;
            flex: 1;
            // color: @gray-color;
            text-align: center;
            font-size: @font-size-sm;
          }
        }
      }
    }

    position: relative;

    .give-user-warper {
      position: absolute;
      bottom: 10px;
      right: 30px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .user-img {
        width: 35px;
        height: 35px;
        // border: 2px solid #f1e5b3;
        border-radius: 50%;
        margin-bottom: 5px;
        overflow: hidden; // 防止图片溢出圆形区域
      }

      .user-name {
        padding-right: 5px;
        margin-bottom: 2px;
      }

      .time {
        color: @gray-color;
      }
    }
  }

  .button-warper {
    width: 100px;
    height: 100px;
    margin-top: 10px !important;
    // background-color: #a1c4fd;
    background: linear-gradient(
      to right,
      rgb(255, 111, 140),
      rgb(253, 70, 106)
    );
    margin: 0 auto;
    border-radius: 50%;
    display: flex;
    justify-content: center; // 水平居中
    align-items: center; // 垂直居中
    box-shadow: 0px 0px 6px #a1c4fd;

    .button {
      font-size: 18px;
      color: #fff;
      font-weight: 600;
    }

    &.animation-button {
      animation: scale 3s infinite;
      // background-image: linear-gradient(-60deg, #f09819 0%, #f09819 100%);
      color: #fff;
    }
  }

  .title-top {
    margin-top: 20px;
  }

  .introduce {
    font-size: 14px;
    line-height: 25px;
    color: @light-black;
  }
}

.footer {
  .fixed-bottom();
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px !important;

  .button {
    font-size: 18px;
    color: #fff;
    background-color: @theme-color;
    width: 90%;
    border-radius: 50px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
}
</style>