<template>
  <!-- 报告生成动画 -->
  <Animation
    :show="animationOver === 0"
    :reportProcessList="reportProcessList"
    :testPaperInfo="testPaperInfo"
    @over="animationOver = 1"
  />
  <transition name="van-fade">
    <div class="content" v-show="animationOver === 1">
      <div v-if="payStyleType != 1">
        <!-- 顶部支付 -->
        <div class="item">
          <!-- 卡片区域 -->
          <div v-if="testPaperInfo?.name">
            <div class="form">
              <div class="title">恭喜，您的报告已生成！</div>
              <div class="form-item">
                <div class="form-item-label">报告名称</div>
                <div class="form-item-input">{{ testPaperInfo?.name }}</div>
              </div>
              <div class="form-item" v-if="testOrderInfo?.testCompleteTime > 0">
                <div class="form-item-label">完成时间</div>
                <div class="form-item-input">
                  {{ $filters.formatDate(testOrderInfo?.testCompleteTime) }}
                </div>
              </div>
              <div class="form-item">
                <div class="form-item-label">答题数</div>
                <div class="form-item-input">
                  {{ testOrderInfo?.answerNum }}题
                </div>
              </div>
              <div class="form-item" v-if="testOrderInfo?.testUseTime > 0">
                <div class="form-item-label">用时</div>
                <div class="form-item-input">
                  {{ formatSecond(testOrderInfo.testUseTime) }}
                </div>
              </div>
              <div class="form-item" v-if="testOrderInfo?.age > 0">
                <div class="form-item-label">年龄</div>
                <div class="form-item-input">{{ testOrderInfo?.age }}岁</div>
              </div>
              <div
                class="form-item"
                v-if="
                  testOrderInfo?.versionName && testOrderInfo?.versionName != ''
                "
              >
                <div class="form-item-label">版本类型</div>
                <div class="form-item-input">
                  {{ testOrderInfo?.versionName }}
                </div>
              </div>
              <!-- 支付描述 -->
              <div
                class="rich-text rich-content"
                v-html="payInfo?.payDesc"
              ></div>
            </div>
          </div>
        </div>
        <div
          class="top-button"
          @click="unlockReport"
          :style="{ backgroundColor: payInfo?.ui_payBtnColor }"
        >
          立即解锁您专属报告
        </div>
      </div>
      <!-- 您的专属MBTI测试报告已生成 -->
      <Payment
        v-model:show="payModalShow2"
        @confirm="newhandlePay"
        @handlePay="handlePay"
        @cancel="onPayModalCancel"
        :payInfo="payInfo"
        :testPaperInfo="testPaperInfo"
        :testOrderInfo="testOrderInfo"
        :currentCoupon="currentCoupon"
        :showCoupon="showCoupon"
        :list="list"
        @ontab="ontab"
        :unlockIndex="unlockIndex"
        :testTypeList="testTypeList"
        v-else
      />

      <!-- PC微信扫码支付 -->
      <WeChatPayQr
        v-model:show="qrPayShow"
        :url="qrUrl"
        @confirm="qrConfirm"
        @cancel="qrConfirm"
      />

      <AgainPayModal
        v-model:show="againPayshow"
        @confirm="confirm"
        @cancel="cancel"
        :showGet="hasRedPacket && redPacketType != 2"
        @get="getRedPacket"
        :showExit="redPacketType == 2"
        @exit="onRedPacketCancel"
      >
        <template #close>
          <van-icon name="close" @click="closeAgainPayModal" />
        </template>
      </AgainPayModal>
      <!-- 选择生日 -->
      <ChooseBirthday
        :ageSet="testPaperInfo?.ageSet"
        v-if="
          testPaperInfo?.ageSet && Object.keys(testPaperInfo?.ageSet).length
        "
        v-model:show="dateShow"
        @confirm="handleBirthdayConfirm"
      />
      <!-- 红包 -->
      <RedPacket
        :priceInfo="redPacketPriceInfo"
        v-if="payInfo?.redPacketConfig"
        :redPacketConfig="payInfo?.redPacketConfig"
        v-model:show="redPacketShow"
        v-model:redPacketType="redPacketType"
        @confirm="handleConfirm"
        @cancel="onRedPacketCancel"
        :redPacketText="redPacketText"
      />

      <!--支付过度弹窗  -->
      <PayModal
        v-model:show="payModalShow"
        @confirm="handlePay"
        @cancel="onPayModalCancel"
        @onCoupon="couponShow = true"
        :currentCoupon="currentCoupon"
        :payInfo="payInfo"
        :showCoupon="showCoupon"
      />

      <Coupon
        v-model:show="couponShow"
        :data="couponList"
        v-model:currentCoupon="currentCoupon"
      />

      <van-dialog v-model:show="redPacketGiftShow" :showConfirmButton="false">
        <div class="red-packet-gift" v-if="payInfo?.redPacketConfig">
          <div class="title">您获得了领取新人专项大礼包的权益</div>
          <img :src="payInfo?.redPacketConfig?.image3" />
          <van-button @click="handlePay" color="#00AD25" round block>
            <span class="pay-button">立即支付</span>
            <span class="pay-text">领取所有优惠</span>
          </van-button>
          <div class="cancel" @click="onRedPacketGiftCancel">放弃领取</div>
          <div class="footer-text">
            使用说明：新人礼包中的优惠券每人限领取一次
          </div>
        </div>
      </van-dialog>

      <van-popup
        v-model:show="payModalShow3"
        round
        closeable
        position="bottom"
        :close-on-click-overlay="false"
        class="pay-modal"
        @click-close-icon="onPayModalCancel"
        style="--van-popup-close-color: #000; max-height: 82%"
      >
        <div slot="header">
          <van-icon
            name="arrow-left"
            @click="onPayModalCancel"
            size="24"
            color="#000"
            class="icon"
          ></van-icon>
        </div>
        <PayModal2
          @confirm="handlePay"
          @cancel="onPayModalCancel"
          @handlePay="handlePay"
          :payInfo="payInfo"
          :testPaperInfo="testPaperInfo"
          :testOrderInfo="testOrderInfo"
          @onCoupon="couponShow = true"
          :currentCoupon="currentCoupon"
          :showCoupon="showCoupon"
          :list="list"
          :redPacketType="redPacketType"
          :priceInfo="redPacketPriceInfo2"
          @ontab="ontab"
          :unlockIndex="unlockIndex"
        />
      </van-popup>
      <van-popup
        v-model:show="payModalShow4"
        round
        closeable
        position="bottom"
        :close-on-click-overlay="false"
        class="pay-modal"
        @click-close-icon="onPayModalCancel"
        style="--van-popup-close-color: #000; max-height: 82%"
      >
        <div slot="header">
          <van-icon
            name="arrow-left"
            @click="onPayModalCancel"
            size="24"
            color="#000"
            class="icon"
          ></van-icon>
        </div>
        <PayModal3
          @confirm="handlePay"
          @cancel="onPayModalCancel"
          @handlePay="handlePay"
          @onCoupon="couponShow = true"
          :payInfo="payInfo"
          :testPaperInfo="testPaperInfo"
          :testOrderInfo="testOrderInfo"
          :currentCoupon="currentCoupon"
          :showCoupon="showCoupon"
          :list="list2"
          :redPacketType="redPacketType"
          :priceInfo="redPacketPriceInfo2"
          @ontab="ontab"
          :goods_list="goods_list"
          :unlockIndex="unlockIndex"
        />
      </van-popup>
    </div>
  </transition>
</template>

<script>
import {
  reactive,
  toRefs,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  ref,
} from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { Toast, Dialog } from "vant";
import WeChatPayQr from "@/components/WeChatPayQr";

import { useAgent } from "@/hooks/useAgent";
import AgainPayModal from "../AgainPayModal";
import { loadingToast } from "@/plugins/vant";

import qs from "qs";
import { parseQueryString } from "@/utils/tools";
import { useAuth } from "@/hooks/useAuth";

import { useEventListener } from "@/hooks/useEventListener";
import ChooseBirthday from "@/components/ChooseBirthday";
import ToCustomer from "@/views/detail/components/customer";
import RedPacket from "../RedPacket";
import moment from "moment";
import { debounce } from "lodash";
import PayModal from "./PayModal";
import Payment from "../General/payment";
import PayModal2 from "../General/PayModa2";
import PayModal3 from "../General/PayModa3";
import Coupon from "./Coupon";
import Animation from "../Animation";
import { useStore } from "@/store";
import NProgress from "nprogress";
// 支付相关配置
import { list, list2, goods_list, testTypeList } from "@/config/pay.js";
// api 接口
import { checkTestOrderPay, testOrderPay } from "@/api/order";
import { getTestOrderInfo, updateTestOrder } from "@/api/testPaper";
export default {
  name: "pay",
  components: {
    WeChatPayQr,
    AgainPayModal,
    ChooseBirthday,
    ToCustomer,
    RedPacket,
    PayModal,
    PayModal2,
    PayModal3,
    Payment,
    Animation,
    Coupon,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      payModalShow: false, // 安卓支付引导弹窗
      payModalShow2: false, //安卓支付引导弹窗
      payModalShow3: false,
      payModalShow4: false,
      payInfo: {}, // 支付引导页信息
      qrPayShow: false, //PC支付二维码显示隐藏
      qrUrl: "", //PC支付二维码URL
      againPayshow: false, //再次支付提示弹窗
      time: 0, //轮询次数

      testPaperInfo: {}, // 测评信息
      timer: null, // 定时器
      testOrderInfo: {}, // 测评订单信息
      dateShow: false,
      footerButtonShow: false,

      redPacketGiftShow: false,
      redPacketType: Number(sessionStorage.getItem("redPacketType") || 0), // 第几次红包
      redPacketShow: false, // 红包弹出框
      animationOver: -1,
      reportProcessList: [],
      couponShow: false,
      couponList: [], // 可用的优惠券
      currentCoupon: {},
      showCoupon: false,
      payStyleType: 0, // 支付样式类型
      red_envelope_status: sessionStorage.getItem("red_envelope_status"),
      list: list,
      list2: list2,
      // 商品权限列表，有商品，图片，权限
      goods_list: goods_list,
      unlockIndex: 3, // 原goods_sale_price_type字段
      testTypeList: testTypeList,
    });
    const { on, off } = useEventListener();
    const store = useStore();
    const { testOrderId, testPaperId, promotionId, couponId } = route.query;
    const { env, os, isWeChat } = useAgent();

    onMounted(() => {
      window.loading?.close?.();
      window.loading = null;
      on(window, "scroll", onScroll);
    });
    onBeforeUnmount(() => {
      off(window, "scroll", onScroll);
      clearTimeout(state.timer);
    });

    const onScroll = debounce(async () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      state.footerButtonShow = scrollTop >= 250;
    }, 100);

    // 支付按钮
    async function handlePay(fay) {


      state.payModalShow = false;
      state.payModalShow3 = false;
      state.payModalShow4 = false;
      const loading = loadingToast("创建订单中...");

      // 支付类型
      const payType = {
        "wechat-mobile": "JSAPI",
        "wechat-pc": "NATIVE",
        "browser-mobile": "MWEB",
        "browser-pc": "NATIVE",
      };
      const tradeType = payType[env];

      try {
        const query = parseQueryString(window.location.href);
        const search = qs.stringify({
          ...query,
          fromType: "pay",
          testOrderId,
          redPacketType: state.redPacketType,
        });
        let redirectUrl = `${window.location.origin}/pay?${search}`;
        // if(hasRedPacket.value && state.redPacketType == 2){
        // 	redirect_url = `${window.location.origin}/PaymentReminder?${search}`;
        // }
        if (hasRedPacket.value && state.redPacketType != 0) {
          redirectUrl = `${window.location.origin}/PaymentReminder?${search}`;
        }
        if (env === "browser-mobile") {
          const { needPay } = await checkTestOrderPay({ testOrderId });
          if (needPay !== 1) {
            loading.clear();
            return goReport(); // 跳转结果页
          } else {
            if (hasRedPacket.value && state.redPacketType != 0) {
              sessionStorage.setItem("red_envelope_status", true);
            }
          }
        }
        let params = {
          couponId: state.currentCoupon.id,
          testOrderId, // 订单号
          paymentType: 1, // 1微信支付 2其他(暂无)
          tradeType, // 支付类型
          redirectUrl, // 回调地址
          redPacketType: state.redPacketType, // 红包类型 1第一个红包 2第二个红包
          unlockIndex: 0,
        };
        if (state.payStyleType == 1 || state.payStyleType == 2) {
          if (fay) {
            params.unlockIndex = 1;
          } else {
            params.unlockIndex = state.unlockIndex;
          }
        }
        const { info } = await testOrderPay(params);

        loading.clear();
        state.redPacketShow = false;

        if (info.noNeedPay === 1) {
          // 无需支付
          return goReport();
        } else {
          if (hasRedPacket.value && state.redPacketType != 0) {
            sessionStorage.setItem("red_envelope_status", true);
          }
        }
        switch (env) {
          case "browser-mobile": // H5支付
            if (info.mweb_url) {
              // 微信
              window.location.replace(info.mweb_url);
            } else {
              let divForm = document.getElementsByTagName("divform");
              if (divForm.length) {
                document.body.removeChild(divForm[0]);
              }
              const div = document.createElement("divform");
              div.innerHTML = info;
              document.body.appendChild(div);
              document.forms[0].submit();
            }
            break;
          case "wechat-mobile": // 微信浏览器内支付
            wechatPay(info);
            break;
          case "wechat-pc": // 微信浏览器内支付
            qrPay(info);
            break;
          case "browser-pc": // 微信浏览器内支付
            qrPay(info);
            break;
        }
      } catch (error) {
        loading.clear();
        console.log(error);
        Toast("订单创建失败");
      }
    }
    // PC支付(显示二维码)
    function qrPay({ code_url }) {
      state.qrUrl = code_url;
      state.qrPayShow = true;
      qrPoll(180);
    }
    // PC二维码确认按钮
    function qrConfirm() {
      state.qrPayShow = false;
      clearTimeout(state.timer);
      state.timer = null;
      state.time = 0;
      qrPoll(5);
    }
    // 红包支付
    function handleConfirm() {
      handlePay(true);
    }

    // PC二维码轮询
    async function qrPoll(count) {
      try {
        const { needPay } = await checkTestOrderPay({
          testOrderId,
        });
        if (needPay !== 1) {
          goReport(); // 跳转结果页
        } else {
          state.timer = window.setTimeout(async () => {
            state.time++;
            if (state.time > count) {
              Toast("暂未查询到支付订单，如已支付请关注公众号联系客服处理");
              return;
            }
            qrPoll(count);
          }, 1000);
        }
      } catch (error) {}
    }

    // 检查订单状态
    const checkOrderStatus = async () => {
      const { needPay } = await checkTestOrderPay({ testOrderId });
      if (needPay !== 1) {
        // 无需支付
        // 跳转支付引导页
        clearLoading();
        goReport();
      } else {
        // Toast("暂未查询到支付订单，如已支付请关注公众号联系客服处理");
      }
    };
    function clearLoading() {
      window.createOrderLoading?.close();
      window.createOrderLoading = null;
    }
    // 轮询查询支付状态
    async function poll(count, isConfirm) {
      if (!window.createOrderLoading && state.time < 1) {
        window.createOrderLoading = loadingToast("查询订单中...");
      }
      try {
        const { needPay } = await checkTestOrderPay({ testOrderId });
        if (needPay !== 1) {
          clearLoading(); // 跳转支付引导页
          goReport();
        } else {
          state.timer = window.setTimeout(async () => {
            state.time++;
            // 轮询到第5秒时清除loading 显示错误弹窗  但是继续轮询
            if (state.time === 1) {
              clearLoading();
              if (isConfirm) {
                Toast("暂未查询到支付订单，如已支付请关注公众号联系客服处理");
              } else {
                // state.againPayshow = true;
                // if (state.payStyleType == 1) {
                // 	state.payModalShow3 = true
                // }
                // const { redPacketType } = route.query;

                let redPacketType = 1;
                if (state.redPacketType == 1) {
                  redPacketType = 1;
                } else if (state.redPacketType == 2) {
                  redPacketType = 2;
                }
                const key = {
                  0: "value1",
                  1: "value1",
                  2: "value2",
                }[redPacketType];
                // 红包金额为0不弹出红包
                if (!Number(state.payInfo?.redPacketConfig[key])) return;
                state.redPacketType = redPacketType;

                // 缓存红包类型
                sessionStorage.setItem("redPacketType", redPacketType);
                state.redPacketShow = true;
              }
            }
            if (state.time > count) {
              return;
            }
            poll(count, isConfirm);
          }, 1000);
        }
      } catch (error) {
        clearLoading();
      }
    }

    // 重新支付
    async function confirm() {
      handlePay();
    }
    async function cancel() {
      clearTimeout(state.timer);
      state.timer = null;
      state.time = 0;
      poll(60, true);
    }
    // 微信内置浏览器支付
    function wechatPay(data) {
      WeixinJSBridge?.invoke("getBrandWCPayRequest", data, (res) => {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          goReport();
        } else {
          let redPacketType = 1;
          if (state.redPacketType == 1) {
            redPacketType = 1;
          }
          if (state.redPacketType == 2) {
            redPacketType = 2;
          }
          // 红包金额为0不弹出红包
          if (
            !state.payInfo?.redPacketConfig ||
            Object.keys(state.payInfo?.redPacketConfig).length <= 0
          ) {
            return;
          }
          const key = {
            1: "value1",
            2: "value2",
          }[redPacketType];
          // 红包金额为0不弹出红包
          if (!Number(state.payInfo?.redPacketConfig[key])) {
            return;
          }
          state.redPacketType = redPacketType;

          sessionStorage.setItem("redPacketType", redPacketType);
          state.redPacketShow = true;
          // Toast(sessionStorage.getItem("red_envelope_status")+12)
          if (
            hasRedPacket.value &&
            state.redPacketType != 0 &&
            sessionStorage.getItem("red_envelope_status")
          ) {
            storeNextPage.value = false;
            state.redPacketShow = false;

            router.push({
              path: "/PaymentReminder",
              query: {
                testOrderId,
                testPaperId,
                promotionId,
                couponId,
                redPacketType: state.redPacketType,
              },
            });
          }
        }
      });
    }
    // 跳转结果页
    function goReport() {
      storeNextPage.value = false;
      router.replace({
        path: "/report",
        query: {
          testOrderId,
          testPaperId,
          promotionId,
        },
      });
    }

    // 跳转开通vip界面
    function handleToVip() {
      storeNextPage.value = false;
      router.push({
        path: "/vipOpened",
        query: {
          testOrderId,
          testPaperId,
          promotionId,
          fromName: "pay",
        },
      });
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
    useAuth(
      {
        authType: 1,
      },
      async () => {
        checkOrderStatus();
        init();
        const { fromType } = route.query;
        if (fromType === "pay") {
          // localStorage.setItem('testOrderId', testOrderId);
          poll(60);
        }
      }
    );
    function formatSecond(second) {
      const m = Math.floor(second / 60);
      const s = second % 60;
      if (m > 0) {
        return `${m}分${s}秒`;
      } else {
        return `${second}秒`;
      }
    }
    // 获取支付引导页数据
    async function init() {
      const params = !isWeChat ? { couponId } : {};
      const loading = loadingToast("加载中...");
      try {
        const {
          testOrderInfo,
          testPaperInfo,
          couponInfo,
          couponList,
          reportProcessList,
          payInfo,
        } = await getTestOrderInfo({ testOrderId, ...params });

        const price = payInfo.price; // 原订单金额
        if (!isWeChat) {
          if (couponInfo?.id && Object.keys(couponInfo).length) {
            state.currentCoupon = couponInfo;
            state.showCoupon = true;
          }
        } else {
          const _couponList = couponList.sort(
            (a, b) => b.discountValue - a.discountValue
          );
          if (_couponList.length) {
            const [current] = _couponList;
            state.currentCoupon = current;
            // 优惠券信息
            state.couponList = _couponList;
            state.showCoupon = true;
          }
        }

        // 报告生成过程
        if (
          reportProcessList.length > 0 &&
          route.query.fromType !== "pay" &&
          route.query.animation !== "0"
        ) {
          state.animationOver = 0;
          state.reportProcessList = reportProcessList;
        } else {
          state.animationOver = 1;
        }
        document.title = `订单支付-${testPaperInfo.name}`;

        document
          .querySelector('meta[name="description"]')
          ?.setAttribute("content", testPaperInfo.subhead);

        state.payInfo = payInfo;
        state.testPaperInfo = testPaperInfo;
        state.testOrderInfo = testOrderInfo;

        state.payStyleType = payInfo?.payStyleType;

        // 只看测试结果
        state.list[0].price = payInfo?.price;
        state.list[0].originalPrice = payInfo?.originalPrice;
        // 完整解读 完整解读+职业推荐+交友指南
        state.list[1].price = payInfo?.price1;
        state.list[1].originalPrice = payInfo?.originalPrice1;
        // 完整解读Pro 完整解读+职业推荐+交友指南+八维报告+恋爱报告+职场规划
        state.list[2].price = payInfo?.price2;
        state.list[2].originalPrice = payInfo?.originalPrice2;

        state.isDataLoaded = true;

        if (state.list[state.unlockIndex - 1]) {
          state.list[state.unlockIndex - 1].fay = true;
        }

        // 只看智商分值
        state.list2[0].price = payInfo?.price;
        state.list2[0].originalPrice = payInfo?.originalPrice;
        // 完整解读
        state.list2[1].price = payInfo?.price1;
        state.list2[1].originalPrice = payInfo?.originalPrice1;
        // 完整解读Pro
        state.list2[2].price = payInfo?.price2;
        state.list2[2].originalPrice = payInfo?.originalPrice2;

        if (state.list2[state.unlockIndex - 1]) {
          state.list2[state.unlockIndex - 1].fay = true;
        }

        document.title = testPaperInfo.name;
        // 显示年龄
        if (
          testPaperInfo?.ageSet &&
          Object.keys(testPaperInfo?.ageSet).length &&
          testOrderInfo.age == 0
        ) {
          state.dateShow = true;
        }
        if (payInfo.status === 2 || payInfo.status === 3) { // 2 支付成功  3 无需支付
          goReport();
        }
      } catch (error) {
        window.__bl?.api(
          "获取支付页失败(General)",
          false,
          0,
          "error",
          `调用失败:${error}`
        );
        store.commit("app/SET_ERROR", true);
      } finally {
        loading.clear();
      }
    }
    const hasRedPacket = computed(
      () =>
        state.payInfo?.redPacketConfig &&
        Object.keys(state.payInfo?.redPacketConfig)?.length > 0
    );
    // 红包弹出
    function getRedPacket() {
      state.againPayshow = false;
      setRedPacketType();
    }

    function setRedPacketType() {
      const redPacketType = !state.redPacketType ? 1 : 2;
      const key = {
        1: "value1",
        2: "value2",
      }[redPacketType];
      // 红包金额为0不弹出红包
      if (!Number(state.payInfo?.redPacketConfig[key])) {
        return;
      }
      state.redPacketType = redPacketType;
      sessionStorage.setItem("redPacketType", redPacketType);
      state.redPacketShow = true;
    }

    // 关闭再次支付弹窗
    function closeAgainPayModal() {
      state.againPayshow = false;
      if (hasRedPacket.value) {
        if (state.redPacketType == 2) {
          onRedPacketCancel();
        } else {
          setRedPacketType();
        }
      }
    }
    watch(
      () => state.redPacketType,
      async (val) => {
        if (val == 2) {
          checkOrderStatus();
        }
        if ([1, 2].includes(Number(val))) {
          await updateTestOrder({
            testOrderId,
            redPacketType: state.redPacketType,
          });
        }
      }
    );

    function setGoodsListVisibility(unlockIndex) {
      state.goods_list.forEach((item) => {
        item.show = true;
      });
      const price_authority1 = [
        "智商天赋建议职业",
        "你的智力各维度指数分布",
        "智商基因各维度深入解析",
        "你的智力各维度专属建议",
        "智力构成因素",
        "影响智力的关键点",
        "智商与遗传的关系",
        "智力测验的理论依据",
        "您本次测试的错题解析",
        "瑞文高级智商进阶测试",
        "赠送免费重测三次",
        "您的智商鉴定报告下载",
        "360情商综合评估测试",
      ];
      const price_authority2 = [
        "您本次测试的错题解析",
        "赠送免费重测三次",
        "您的智商鉴定报告下载",
        "360情商综合评估测试",
      ];
      const price_authority3 = [];

      if (unlockIndex === 1) {
        state.goods_list.forEach((item) => {
          if (price_authority1.includes(item.name)) {
            item.show = false;
          }
        });
      }

      if (unlockIndex === 2) {
        state.goods_list.forEach((item) => {
          if (price_authority2.includes(item.name)) {
            item.show = false;
          }
        });
      }

      if (unlockIndex === 3) {
        state.goods_list.forEach((item) => {
          if (price_authority3.includes(item.name)) {
            item.show = false;
          }
        });
      }
    }

    function ontab(index) {
      state.list.forEach((item) => {
        item.fay = false;
      });
      state.list[index].fay = true;

      state.list2.forEach((item) => {
        item.fay = false;
      });
      state.list2[index].fay = true;
      state.unlockIndex = index + 1;

      setGoodsListVisibility(state.unlockIndex);
    }
    // 取消支付
    function onPayModalCancel() {
      state.payModalShow3 = false;
      state.payModalShow4 = false;
      checkOrderStatus();
      if (hasRedPacket.value) {
        state.redPacketShow = true;
        if (!state.redPacketType) {
          state.redPacketType = 1;
          sessionStorage.setItem("redPacketType", 1);
        }
      }
    }

    //点击按钮
    function newhandlePay() {
      checkOrderStatus();
      state.payModalShow3 = true;
    }
    const storeNextPage = ref(true);
    onBeforeRouteLeave(async (to, from, next) => {
      if (!storeNextPage.value) {
        localStorage.removeItem("year");
        sessionStorage.removeItem("redPacketType");
        sessionStorage.removeItem("red_envelope_status");
        next();
      } else {
        if (hasRedPacket.value) {
          if (
            state.redPacketType == 1 &&
            !Number(state.payInfo?.redPacketConfig?.value2)
          ) {
            sessionStorage.removeItem("redPacketType");
            sessionStorage.removeItem("red_envelope_status");
            return next();
          }

          next(false);
          NProgress.done();
          state.redPacketShow = true;
          if (!state.redPacketType) {
            state.redPacketType = 1;
            sessionStorage.setItem("redPacketType", 1);
          }
        } else {
          next();
        }
      }
    });
    function onRedPacketGiftCancel() {
      storeNextPage.value = false;
      router.push({
        path: "/wechatQr",
        query: route.query,
      });
    }
    // 退出弹框
    function onRedPacketCancel() {
      state.redPacketShow = false;
      state.againPayshow = false;
      storeNextPage.value = false;

      router.push({
        path: "/PaymentReminder",
        query: {
          testOrderId,
          testPaperId,
          promotionId,
          redPacketType: state.redPacketType,
        },
      });
    }
    // 获取红包信息 priceInfo
    const redPacketPriceInfo = computed(() => {
      let price = Number(state.payInfo.price); // 原价
      if (state.unlockIndex === 1 && state.payInfo?.price) {
        price = Number(state.payInfo.price); // 原价
      }
      if (state.unlockIndex === 2 && state.payInfo?.price1) {
        price = Number(state.payInfo.price1);
      }
      if (state.unlockIndex === 3 && state.payInfo?.price2) {
        price = Number(state.payInfo.price2);
      }
      return {
        one: // 红包1
        (price - Number(state.payInfo?.redPacketConfig?.value1))?.toFixed(2),
        two: // 红包2
        (price - Number(state.payInfo?.redPacketConfig?.value2))?.toFixed(2),
      };
    });

    const redPacketPriceInfo2 = computed(() => {
      if (state.redPacketType == 1) {
        return {
          value: state.payInfo?.redPacketConfig?.value1,
        };
      }
      if (state.redPacketType == 2) {
        return {
          value: state.payInfo?.redPacketConfig?.value2,
        };
      }
    });

    const redPacketText = computed(() => {
      if (state.payStyleType == 1 || state.payStyleType == 2) {
        if (state.payStyleType == 1) {
          return "全部结果";
        }
        if (state.payStyleType == 2) {
          return "全部报告";
        }
      } else {
        return "专属报告";
      }
    });
    // 立即解锁报告
    function unlockReport() {
      if (state.payStyleType == 2) {
        state.payModalShow4 = true;
        setGoodsListVisibility(state.unlockIndex);
      } else {
        state.payModalShow = true;
      }
    }

    return {
      ...toRefs(state),
      handleToVip,
      handlePay,
      confirm,
      cancel,
      qrConfirm,
      poll,
      checkOrderStatus,
      handleBirthdayConfirm,
      onRedPacketCancel,
      getRedPacket,
      closeAgainPayModal,
      hasRedPacket,
      os,
      onPayModalCancel,
      onRedPacketGiftCancel,
      formatSecond,
      handleConfirm,
      ontab,
      newhandlePay,
      redPacketPriceInfo,
      redPacketPriceInfo2,
      redPacketText,
      unlockReport,
    };
  },
};
</script>

<style lang="less" scoped>
:deep(.van-toast--unclickable) {
  cursor: pointer !important;
}

:deep(.van-popup .van-popup__close-icon) {
  color: #000 !important;
}

// :deep(.van-popup) {
// 	max-height: 80%
// }

:deep(.van-dialog .van-dialog__message--has-title) {
  padding-top: 10px !important;
}

:deep(.van-dialog .van-dialog__header) {
  font-weight: bold;
}

.icon {
  margin-left: 10px;
}

.red-packet-gift {
  background: linear-gradient(to bottom, #ff847c, #fff);
  padding: 12px 16px;
  text-align: center;

  .title {
    font-size: 16px;
    color: #fff;
    padding-bottom: 12px;
  }

  img {
    width: 100%;
    margin-bottom: 10px;
  }

  .cancel {
    font-size: 12px;
    color: grey;
    padding: 10px;
  }

  .footer-text {
    font-size: 12px;
    color: #333;
  }

  .pay-button {
    font-size: 16px;
    padding-right: 10px;
  }

  .pay-text {
    font-size: 14px;
  }
}

.rich-text {
  font-size: @font-size-base;
  padding-top: 10px;
  color: #3f3f3f;
  line-height: 24px;

  :deep(img) {
    display: block;
    width: 100%;
  }
}

.top-button {
  height: 45px;
  line-height: 45px;
  border-radius: 45px;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  margin: 20px 30px 50px;
}

.card {
  background: #fff;
  border-radius: @radius-base;
  padding: @padding-base;
  box-shadow: 0 1px 4px 0 rgba(#000, 0.2);
}

.content {
  position: relative;
  background-size: 100%;
}

.item {
  padding: 1px 15px 0px;

  .title-img {
    width: 100%;
    max-height: 20px;

    img {
      width: 100%;
      max-height: 20px;
    }
  }

  .card-pay {
    color: #007201;
    .card();
    font-size: @font-size-sm;
    background: none;
    box-shadow: 0 0 0 #000;

    .ispay {
      text-align: center;
      font-size: 14px;
    }

    .top {
      .space-between();

      .left {
        flex: 1;
        padding-right: @padding-base;
        .align-center();

        img {
          border-radius: @radius-base;
          width: 100%;
        }
      }

      .right {
        flex: 1;
        font-size: @font-size-base;
        font-weight: bold;
        line-height: 22px;

        .gray {
          color: @gray-color;
          font-weight: normal;
          font-size: @font-size-sm;

          &.del {
            text-decoration: line-through;
          }
        }

        .price {
          color: @theme-color;
          font-size: 18px;
          padding-right: 5px;
        }
      }
    }

    .non-vip {
      color: @theme-color;
      padding: 5px 0;
      text-align: center;
    }

    p {
      color: @light-black;
      line-height: 20px;
    }
  }
}

@keyframes bigasmall {
  0% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

.footer {
  .fixed-bottom();
  .align-center();
  justify-content: center;
  height: 60px;
  padding: 0 @padding-base;
  background-color: transparent;
  bottom: constant(safe-area-inset-bottom);
  /* 兼容 iOS < 11.2 */
  bottom: env(safe-area-inset-bottom);

  /* 兼容 iOS >= 11.2 */
  .button {
    width: 95%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-radius: 5px;
    color: #fff;
    background-color: #f9b236;
    font-size: 16px;
  }
}

.form {
  background-color: #fff;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0px 1px 2px #dbdbdb;
  margin: 20px 0;
  overflow: hidden;

  .title {
    font-size: 16px;
    text-align: center;
    background: #00c80138;
    padding: 5px;
    border-radius: 8px;
    color: #006e04;
    margin: 0 0 5px 0;
  }

  .button {
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    background-color: #00c801;
    border-radius: 44px;
    margin: 10px 0;
  }

  .to-pay-button {
    animation: bigasmall 1s infinite alternate;
  }

  .inline {
    text-align: center;
    font-size: 14px;

    .green {
      color: green;
    }
  }

  .timer {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 10px;

    .colon {
      display: inline-block;
      margin: 0 4px;
      color: #ee0a24;
    }

    .block {
      display: inline-block;
      width: 22px;
      height: 22px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      line-height: 22px;
      background-color: #ee0a24;
      border-radius: 4px;
    }

    .text {
      padding-left: 4px;
      color: #ee0a24;
    }
  }

  .red-packet-price {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
    font-size: 14px;

    img {
      height: 20px;
    }
  }
}
</style>

<style lang="less">
.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 43px;
  line-height: 43px;
  border-bottom: 0.5px solid #d5d5d585;

  .form-item-label {
    font-size: 14px;
    color: #000;
  }

  .form-item-input {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    color: #999;

    img {
      width: 14px;
      margin-right: 4px;
    }
  }

  .yellow {
    color: #fbd855 !important;
  }
}

.gray.del {
  text-decoration: line-through;
}

.gray {
  color: #898989;
  font-weight: 400;
  font-size: 14px;
}

.old-price {
  text-align: center;
}

.price-text {
  text-align: center;
  font-size: 14px;
  color: #9b9b9b;
}

.price {
  font-size: 0.6rem;
  color: red;
}

.footer-android {
  .fixed-bottom;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  z-index: 9;
  height: 60px;
  width: 100%;
  background-color: #5996b2;
  font-family: "优设标题";
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  z-index: 1;

  .title {
    font-size: 24px;
    line-height: 20px;
  }

  .num {
    font-size: 16px;
  }
}

.font {
  font-family: "优设标题";
}
</style>
