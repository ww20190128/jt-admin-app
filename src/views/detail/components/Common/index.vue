<template>
  <div class="content" v-show="!loading">
    <div class="test-info">
      <div
        class="collect-tag"
        :class="{ collected: collectStatus == 1 }"
        @click="handleDoCollect"
      >
        <i class="fa fa-heart" v-if="collectStatus == 1"></i>
        <i class="fa fa-heart-o" v-else></i>
      </div>
      <img
        class="main-img"
        v-if="testPaperInfo?.mainImg"
        :src="testPaperInfo?.mainImg"
      />
      <div class="info-warper" :class="{ unvip: !userInfo?.vipInfo?.name }">
        <div class="title">{{ testPaperInfo?.name }}</div>
        <div class="subhead">{{ testPaperInfo?.subhead }}</div>

        <div class="free" v-if="testPaperInfo?.price <= 0" @click="confirm">免费测试</div>
        <div class="price" v-else>
          ￥{{ testPaperInfo?.price
          }}<span class="original-price"
            >￥{{
              couponInfo?.id &&
              couponInfo.discountValue > 0 &&
              testPaperInfo?.oldPrice
                ? testPaperInfo?.oldPrice
                : testPaperInfo.originalPrice
            }}</span
          >
        </div>

        <!-- 使用的优惠券信息 -->
        <div class="coupon-wrap" v-if="couponInfo?.id">
          <div class="left">
            <span class="text">优惠券已抵扣</span>
            <span class="coupon-title" v-if="couponInfo?.discountValue > 0">{{
              `立减${couponInfo?.discountValue}元`
            }}</span>
          </div>
          <div class="right">
            <span class="coupon-price">券后</span>
            <span class="coupon-price" v-if="couponInfo?.newPrice > 0"
              >￥{{ couponInfo?.newPrice }}</span
            >
            <span class="coupon-price free-num" v-else>免费</span>
          </div>
        </div>
        <div
          class="status-button warning"
          v-if="lastTestOrderInfo?.status === 0"
          @click="handleContinue"
        >
          你有未做完的测试订单，点此继续做题
        </div>
        <div
          class="status-button pink"
          v-if="lastTestOrderInfo?.status === 2"
          @click="handleLookResult"
        >
          你已经购买并测试过，点此进入测评报告
        </div>
        <div
          class="status-button blue"
          v-if="lastTestOrderInfo?.status === 1"
          @click="handleGoPay"
        >
          你有已做完未支付的订单，点此支付查看报告
        </div>
        <div class="bottom">
          <div class="item">● {{ testPaperInfo?.questionNum }}道精选问题</div>
          <div class="item">● {{ testPaperInfo?.reportNum }}页专业报告</div>
          <div class="item">● {{ testPaperInfo?.saleNum }}人测过</div>
        </div>
        <div
          class="vip-warp"
          v-if="!userInfo?.vipInfo?.name"
          @click="$router.push('/vipOpened')"
        >
          <div class="left">
            <img
              src="../../../../assets/images/vip-icon3.png"
              class="vip-icon"
            />
          </div>
          <div class="center">
            <p class="p1">推荐升级会员，可享全站免费测试</p>
            <p class="p2">加入会员，本测评可0元测试</p>
          </div>
          <div class="right">
            <div class="vip-button">立即开通</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-content">
      <!-- 测评说明 -->
      <!-- <div class="item rich-text" v-if="testPaperInfo?.contentTitle && testPaperInfo?.content">
				<Title>{{ testPaperInfo.contentTitle }}</Title>
				<div class="rich-text-content" v-html="testPaperInfo.content"></div>
			</div> -->
      <!-- 商品报告 -->
      <!-- ww 暂时注释 -->
      <!-- <div class="item rich-text" v-if="testPaperInfo.has_goods_report">
				<Title>{{ testPaperInfo.goods_report_title }}</Title>
				<div class="rich-text-content" v-html="testPaperInfo.goods_report"></div>
			</div> -->
      <!-- 文献 -->
      <!-- ww 暂时注释 -->
      <!-- <div class="item rich-text" v-if="testPaperInfo.has_goods_doc">
				<Title>{{ testPaperInfo.goods_doc_title }}</Title>
				<div class="rich-text-content" v-html="testPaperInfo.goods_doc"></div>
			</div> -->

      <!-- 测评须知 -->
      <Introduce :testPaperInfo="testPaperInfo"></Introduce>
      <!-- <div class="item rich-text" v-if="testPaperInfo?.noticeTitle && testPaperInfo?.notice">
				<Title>{{ testPaperInfo.noticeTitle }}</Title>
				<div class="rich-text-content" v-html="testPaperInfo.notice"></div>
			</div> -->

      <!-- 专业团队出品  暂时关闭 -->
      <div class="item rich-text" v-if="false && wechatInfo?.team_info">
        <Title>{{ wechatInfo?.team_info_title }}</Title>
        <div class="rich-text-content" v-html="wechatInfo?.team_info"></div>

        <QrCard />
      </div>
      <div class="item" v-if="commentList.length">
        <Title>用户评价</Title>
        <Comments :data="commentList" />
      </div>
      <div class="item recommended">
        <Title>猜你喜欢</Title>
        <CellCardList :data="choicenessList" />
        <div class="button" @click="$router.push('/classify')">
          查看更多测评
          <van-icon name="arrow" />
        </div>
      </div>
      <CopyRight backgroundColor="#fff" />
    </div>
  </div>

  <!-- VIP任意测 -->
  <!-- <VipFixed v-if="!userInfo?.vipInfo?.name" v-show="!loading" @click="$router.push('/vipOpened')" /> -->
  <VipFixed
    v-if="!userInfo?.vipInfo?.name"
    v-show="!loading"
    @click="giveClick"
  />
  <!-- 版本选择 -->
  <OptionsSelect
    v-model:show="optionVisible"
    v-model:current="optionCurrent"
    :versionConfig="testPaperInfo?.versionConfig"
    @confirm="handleOptionConfirm"
  />
  <!-- 底部操作栏 -->
  <ActionBar
    :resultOff="lastTestOrderInfo?.status === 2"
    :vipInfo="userInfo?.vipInfo"
    @confirm="confirm"
    @reslutClick="reslutClick"
    @giveClick="giveClick"
    v-show="!loading"
  />

  <!-- 赠送好友弹窗 -->
  <GiveFriendDialog v-model:show="giveVisible" @confirm="handleGive">
    <div class="give-content">
      <div class="title">{{ testPaperInfo?.name }}</div>
      <div class="text">
        温馨提示：您是({{ userInfo?.vipInfo?.name }})，当前您享有{{
          userInfo?.vipInfo?.vipGiveLimit
        }}次免费赠送的权益，现在还剩{{
          userInfo?.vipInfo?.vipGiveLimit - userInfo?.vipInfo?.vipGiveNum
        }}次。
      </div>
    </div>
    <template #button>
      <span
        v-if="userInfo?.vipInfo?.vipGiveLimit > userInfo?.vipInfo?.vipGiveNum"
        >立即免费赠送</span
      >
      <span v-else>我知道了</span>
    </template>
  </GiveFriendDialog>

  <WeChatQr v-model:show="wechatQrVisible">
    <span>关注公众号，解锁赠送功能哦！</span>
  </WeChatQr>

  <!-- 提示开通VIP -->
  <VipDialog
    v-model:show="vipOpenVisible"
    @confirm="$router.push('/vipOpened')"
    buttonText="立即开通"
  >
    <template #title>VIP专属特权</template>
    <template #text>开通VIP无限测，还可以免费赠送好友免费测试哦。</template>
  </VipDialog>
  <!-- <ToCustomer v-if="testPaperInfo?.customerUrl" :link="testPaperInfo?.customerUrl" /> -->
</template>
<!-- 测评详情页 -->
<script>
import Title from "./components/Title";
import QrCard from "@/components/QrCard";
import ActionBar from "./components/ActionBar";
import VipFixed from "@/components/VipFixed";
import Comments from "./components/Comments";
import VipDialog from "@/components/VipDialog";
import GiveFriendDialog from "@/components/GiveFriendDialog";
import OptionsSelect from "@/components/OptionsSelect";
import CellCardList from "@/components/CellCardList";
import CopyRight from "@/components/CopyRight";
import WeChatQr from "@/components/WeChatQr";
import ToCustomer from "../customer";
import { Dialog } from "vant";
import { useAuth } from "@/hooks/useAuth";
import { reactive, toRefs, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAgent } from "@/hooks/useAgent";
import { shareWx } from "@/hooks/shareWx";
import { useStore } from "@/store";
import { Toast } from "vant";

import Introduce from "@/components/Introduce";
// api接口
import { give } from "@/api/give";
import {
  getTestPaperInfo,
  createTestOrder,
  resetTestOrder,
  getTestOrderInfo,
  doCollect,
} from "@/api/testPaper";

export default {
  name: "detail",
  components: {
    Title,
    QrCard,
    CellCardList,
    ActionBar,
    VipFixed,
    Comments,
    OptionsSelect,
    VipDialog,
    GiveFriendDialog,
    WeChatQr,
    CopyRight,
    ToCustomer,
    Introduce,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const { md, isWeChat, ua, network, os } = useAgent();
    const state = reactive({
      testPaperInfo: {}, // 测评详情数据
      vipOpenVisible: false,
      commentList: [], // 评论内容
      choicenessList: [], // 推荐商品
      userInfo: {}, // 用户信息
      lastTestOrderInfo: {}, // 测评订单信息
      optionVisible: false, // 版本选择显示隐藏
      optionCurrent: undefined, // 当前版本选择的id

      giveVisible: false, // 赠送弹窗
      wechatQrVisible: false, // 微信公众号号弹窗
      loading: true,
      testOrderId: 0,
      reset: false,
      couponInfo: {}, // 优惠券信息
      collectStatus: 0, // 是否已经收藏
    });
    const wechatInfo = computed(() => store.getters.wechatInfo);
    const { testPaperId, couponId, shareCode } = route.query;

    // 收藏或取消收藏
    async function handleDoCollect() {
      const { collectStatus } = await doCollect({ testPaperId: testPaperId });
      state.collectStatus = collectStatus;
      Toast(state.collectStatus === 0 ? "取消收藏" : "加入收藏");
    }
    // 继续做题
    function handleContinue() {
      const { id } = state.lastTestOrderInfo;
      if (state.testPaperInfo?.mbtiStyle == 1) {
        router.push({
          path: "/exam2",
          query: {
            testOrderId: id,
            testPaperId,
            couponId,
          },
        });
      } else {
        router.push({
          path: "/exam",
          query: {
            testOrderId: id,
            testPaperId,
            couponId,
          },
        });
      }
    }
    // 查看报告
    function handleLookResult() {
      const { id, testPaperId } = state.lastTestOrderInfo;
      router.push({
        path: "/report",
        query: {
          testOrderId: id,
          testPaperId: testPaperId,
        },
      });
    }
    // 授权钩子
    useAuth(
      {
        authType: 2,
      },
      async () => {
        init();
        shareWx({ testPaperId });
      }
    );

    // 获取详情
    async function init() {
      try {
        const {
          testPaperInfo, // 测评详情
          commentList, // 评论列表
          userInfo, // 用户信息
          lastTestOrderInfo,
          choicenessList, // 推荐
          couponInfo, // 用户优惠卷信息
          collectStatus,
        } = await getTestPaperInfo({
          testPaperId: testPaperId, // 测评ID
          couponId, // 优惠劵ID
        });

        // 优惠券信息
        if (couponInfo?.id) {
          state.couponInfo = couponInfo;
        }
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute("content", testPaperInfo.subhead);
        document.title = testPaperInfo.name;
        state.testPaperInfo = testPaperInfo;
        state.commentList = commentList;
        state.userInfo = userInfo?.userInfo || userInfo;
        state.lastTestOrderInfo = lastTestOrderInfo;
        state.choicenessList = choicenessList.list;
        state.loading = false;
        state.collectStatus = collectStatus;
        if (!state.lastTestOrderInfo) {
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
            getTestOrderInfoById();
          }
        }
      } catch (error) {}
    }

    // 获取订单详情
    async function getTestOrderInfoById() {
      const { testOrderInfo } = await getTestOrderInfo({
        testOrderId: state.testOrderId,
      });
      state.lastTestOrderInfo = testOrderInfo;
    }

    // 立即测试
    async function confirm() {
      if (state.lastTestOrderInfo?.id && state.lastTestOrderInfo?.id !== 0) {
        // 有历史订单
        if (state.lastTestOrderInfo?.status === 0) {
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
        } else if (state.lastTestOrderInfo?.status === 2) {
          Dialog.confirm({
            title: "提示",
            message: "你已有评测报告，可在报告页面免费重测，请问是否查看报告？",
            confirmButtonText: "查看报告",
            cancelButtonText: "重新购买",
          })
            .then(() => {
              handleLookResult();
            })
            .catch(() => {
              if (state.testPaperInfo?.versionConfig?.options) {
                goChooseGeneral();
              } else {
                createNewTestOrder();
              }
            });
        }
      } else {
        // 开始新的订单
        if (state.testPaperInfo?.versionConfig?.options) {
          goChooseGeneral();
        } else {
          createNewTestOrder();
        }
      }
    }

    // 重测
    async function onResetTestOrder() {
      const { id } = await resetTestOrder({
        testOrderId: state.lastTestOrderInfo.testOrderId,
        id,
        version: state.optionCurrent,
      });
      state.testOrderId = id;
      goExam();
    }

    // 版本选择确定按钮
    function handleOptionConfirm() {
      if (state.reset) {
        onResetTestOrder();
      } else {
        createNewTestOrder();
      }
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
        deviceInfo.phoneModel = md.os() + md.version("iPhone");
      } else if (os == "AndroidOS") {
        deviceInfo.phoneModel = md.os() + md.version("Android");
      }
      try {
        // 创建测试
        const { testOrderId } = await createTestOrder({
          testPaperId,
          ...deviceInfo,
          version: state.optionCurrent,
          shareCode: shareCode,
        });
        state.testOrderId = testOrderId;
        goExam();
      } catch (error) {
        Toast(error?.message || "创建订单失败");
      }
    }

    // 跳转做题页
    function goExam() {
      if (state.testPaperInfo?.mbtiStyle == 1) {
        router.push({
          path: "/exam2",
          query: {
            testOrderId: state.testOrderId,
            testPaperId,
            couponId,
          },
        });
      } else {
        router.push({
          path: "/exam",
          query: {
            testOrderId: state.testOrderId,
            testPaperId: testPaperId,
            couponId,
          },
        });
      }
    }

    // 跳转支付页
    function handleGoPay() {
      router.push({
        path: "/pay",
        query: {
          testOrderId: state.lastTestOrderInfo.id,
          testPaperId: testPaperId,
          couponId,
        },
      });
    }
    // 查看报告
    function reslutClick() {
      handleLookResult();
    }
    // 赠送
    function giveClick() {
      if (isWeChat) {
        if (state.userInfo?.vipInfo && state.userInfo?.vipInfo?.name) {
          state.giveVisible = true;
        } else {
          state.vipOpenVisible = true;
        }
      } else {
        state.wechatQrVisible = true;
      }
    }
    // 免费赠送
    async function handleGive() {
      if (
        state.userInfo?.vipInfo.vipGiveLimit <=
        state.userInfo?.vipInfo.vipGiveNum
      ) {
        state.giveVisible = false;
        return;
      }
      try {
        const { giveId } = await give({
          testPaperId: testPaperId,
        });
        state.giveVisible = false;
        router.push({
          path: "/giveDetail",
          query: {
            giveId: giveId,
          },
        });
        await store.dispatch("user/getUserInfo");
      } catch (error) {}
    }

    const goChooseGeneral = () => {
      if (state.testPaperInfo?.mbtiStyle == 1) {
        router.push({
          path: "/chooseGender2",
          query: {
            couponId,
            shareCode,
            testPaperId,
          },
        });
      } else {
        router.push({
          path: "/chooseGender",
          query: {
            couponId,
            testPaperId,
            shareCode,
          },
        });
      }
    };

    return {
      ...toRefs(state),
      confirm,
      reslutClick,
      giveClick,
      handleOptionConfirm,
      handleGive,
      handleContinue,
      handleLookResult,
      handleGoPay,
      wechatInfo,
      Introduce,
      handleDoCollect,
    };
  },
};
</script>

<style lang="less" scoped>
.original-price {
  font-size: @font-size-sm;
  padding-left: 5px;
  text-decoration: line-through;
  color: #a1a1a1;
}
.test-info {
  position: relative;
  width: 100%;

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

  .main-img {
    width: 100%;
    height: auto;
    margin-bottom: -50px;
  }

  .info-warper {
    position: relative;
    // bottom: 0;
    // left: 0;
    width: 100%;
    color: @gray-color;
    text-align: center;
    box-shadow: 0px 0px 2px #e8e8e8;
    background-color: #fff;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    padding-top: 10px;

    &.unvip {
      padding-bottom: 20px;
      border-bottom-left-radius: 0px !important;
      border-bottom-right-radius: 0px !important;
    }

    img {
      width: 100%;
    }

    .title {
      font-size: @font-size-lg;
      line-height: 40px;
      color: #000;
      font-weight: 500;
    }

    .subhead {
      line-height: 30px;
      font-size: @font-size-base;
    }

    .price {
      color: @theme-color;
      font-size: 14px;
      margin: 6px 0;
    }

    .free {
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 4px;
      background-color: @theme-color;
      color: #fff;
      width: 70px;
      margin: 0 auto;
      margin-top: 6px;
    }

    .bottom {
      display: flex;

      .item {
        flex: 1;
        height: 52px;
        line-height: 52px;
        text-align: center;
        font-size: @font-size-sm;
      }
    }

    .vip-warp {
      .space-between();
      // padding: 10px 10px 5px 10px;
      padding-left: 5px;
      padding-right: 5px;
      margin: 0 auto;
      height: 45px;
      z-index: 2;
      width: 90%;
      background-color: white;
      border-radius: 5px;
      background-color: #b0cae4;

      box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      color: #fff;
      display: flex;

      .left,
      .center,
      .right {
        display: flex;
        align-items: center;
      }

      .left {
        .vip-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      .center {
        display: flex;

        flex-direction: column;

        justify-content: center;

        text-align: left;

        .p1 {
          overflow: hidden;
          text-align: left;
          font-size: 14px;
        }

        .p2 {
          overflow: hidden;
          text-align: left;
          font-size: 12px;
        }
      }

      .right {
        .vip-button {
          background-image: linear-gradient(to right, #ecd8bd 0%, #f7af4b 100%);
          color: white;
          padding: 0 3px;
          font-size: @font-size-sm;
          border-radius: 5px;
          height: 25px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .status-button {
      position: fixed;
      bottom: calc(41px + constant(safe-area-inset-bottom));
      bottom: calc(41px + env(safe-area-inset-bottom));
      left: 0;
      width: 100%;
      height: 40px;
      line-height: 40px;
      z-index: 999;
      color: #fff;
      font-size: @font-size-base;
      text-align: center;

      &.warning {
        // background-color: #ff9800;
        background: linear-gradient(to right, rgba(#ff9800, 0.7), #ff9800);
      }

      &.pink {
        // background-color: #ff5d7d;
        background: linear-gradient(to right, rgba(#ff5d7d, 0.7), #ff5d7d);
      }

      &.blue {
        // background-color: #1b97f3;
        background: linear-gradient(to right, rgba(#1b97f3, 0.7), #1b97f3);
      }
    }
  }
}

:deep(.rich-text) {
  padding-bottom: @padding-base;
  font-size: @font-size-base;
  color: #3f3f3f;
  line-height: 24px;

  .rich-text-content {
    padding-bottom: 25px;
  }

  img {
    display: block;
    width: 100%;
  }
}

.coupon-wrap {
  background-color: #feefec;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 8px;
  margin: 0 40px;
  margin-top: 10px !important;
  .left {
    font-size: 12px;
    .text {
      color: #fff;
      background-color: #fe4650;
      border-radius: 2px;
      padding: 2px 4px;
      margin-right: 6px;
    }

    .coupon-title {
      font-size: 14px;
    }
  }

  .right {
    display: flex;
    align-items: center;
    .coupon-price {
      font-size: 14px;
      color: #000;
      padding-right: 8px;
      color: @theme-color;
      font-weight: bold;
      &.free-num {
        color: #fe4650;
      }
    }
  }
}

.content {
  .gray-page();
}

.bottom-content {
  .item {
    padding: 0 @padding-base;
    background-color: #fff;
    margin-bottom: @padding-base;
    line-height: 28px;
    color: @light-black;
  }

  .recommended {
    padding-bottom: @padding-sm;
    margin-bottom: 0;

    .button {
      margin: 0 auto;
      font-size: @font-size-base;
      height: 45px;
      line-height: 45px;
      color: @theme-color;
      border-radius: 2px;
      box-shadow: 0px 0px 4px #e8e8e8;
      width: 100%;
      text-align: center;
    }
  }
}

.give-content {
  font-size: @font-size-sm;

  .title {
    font-size: 18px;
    font-weight: bold;
    padding-top: @padding-base;
    text-align: center;
  }

  .text {
    padding-top: @padding-sm;
    font-size: @font-size-base;
    line-height: 22px;
  }

  .record {
    color: #0000ee;
    cursor: pointer;
  }
}
</style>
