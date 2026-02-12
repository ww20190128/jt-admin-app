<template>
  <div v-if="isDataLoaded">
    <div class="answer" v-if="payStyleType == 0 || !payStyleType">
      <div
        class="head-title"
        :style="{ background: class_type == 1 ? '#09ce13' : '#ee0a24' }"
      >
        本次测试已为您抵扣
        <span class="dianji">{{ getDecimal(redPacketValue) }}元</span>
        红包<span class="dianji">（限时）</span
        >，支付完成后将自动进入报告查看页面。
      </div>

      <div class="conter">
        <div class="conter-title">
          <img class="img-right" src="@/assets/images/baise_right.png" alt="" />
          <span class="title">已为您生成深度分析报告</span>
          <img class="img-left" src="@/assets/images/baise_left.png" alt="" />
        </div>
        <div class="card-box">
          <div class="card-item top">
            <div class="card-item-title">
              <img :src="testPaperInfo?.coverImg" class="card-item-icon" />

              <div class="card-item-title-text">
                <p class="text-title">
                  {{ promotionInfo?.name }} 个人深度分析报告
                </p>
                <p class="text-desc">新用户专享限优惠价：</p>
                <p class="text-price">
                  ￥{{ (payInfo?.price - Number(redPacketValue))?.toFixed(2) }}
                  <span class="text-price-desc"
                    >已抵扣{{ getDecimal(redPacketValue) }}元红包</span
                  >
                </p>
                <p class="text-people">{{ testPaperInfo?.saleNum }}人已测</p>
              </div>
            </div>

            <div class="timer">
              <van-count-down :time="10 * 60 * 1000" millisecond>
                <template #default="timeData">
                  <span class="colon">红包优惠于</span>
                  <span class="block">{{
                    String(timeData.minutes).padStart(2, "0")
                  }}</span>
                  <span class="colon">分</span>
                  <span class="block">{{
                    String(timeData.seconds).padStart(2, "0")
                  }}</span>
                  <span class="colon">秒</span>
                  <span class="block">{{
                    timeData.milliseconds.toString().slice(0, 2)
                  }}</span>
                  <span class="text">后失效</span>
                </template>
              </van-count-down>
            </div>

            <div class="card-item-footer" @click="buttonPay">
              {{
                (payInfo?.price - Number(redPacketValue))?.toFixed(2)
              }}元解锁你的专属测试报告
            </div>

            <div class="tishi-text" @click="checkOrderStatus(true)">
              若您已支付，请点这里<a class="chakanjg">查看结果</a>
            </div>
          </div>
        </div>
      </div>

      <div class="conter-title">
        <img class="img-right" src="@/assets/images/huangse_right.png" alt="" />
        <span class="title">购买该测评报告后可获得</span>
        <img class="img-left" src="@/assets/images/huanse_left.png" alt="" />
      </div>

      <div class="card-box2">
        <div class="card-item">
          <div class="rich-text" v-html="payInfo.payDesc"></div>
          <img src="@/assets/images/1.png" alt="" class="img1" />
          <div class="give">
            另外赠送您一份价值<span class="red">88元</span
            >的新人礼包：包含20元测评抵扣券两张、价值19.9元主题测评五折券、年度测评会员优惠券等。<span
              class="red"
              >本次支付完成后，在您的测试结果页即可领取！</span
            >
          </div>
          <img
            class="gift-img"
            src="https://img.yzcdn.cn/vant/giftcard-gift.png"
            alt=""
          />
        </div>

        <img src="@/assets/images/2.png" alt="" class="img2" />
        <img src="@/assets/images/3.png" alt="" class="img3" />

        <img src="@/assets/images/6.png" alt="" class="img6" />
      </div>
      <div
        class="speciality"
        v-if="testPaperInfo?.payDescMobile || wechatInfo?.team_info"
      >
        <img src="@/assets/images/baogao.png" alt="" class="speciality-img" />
        报告专业度说明
      </div>
      <div
        class="card-box3"
        v-if="testPaperInfo?.payDescMobile || wechatInfo?.team_info"
      >
        <div class="card-item">
          <!-- background: rgb(238, 185, 10); -->

          <div class="part-title">
            <div class="part-title-num">PART 1</div>
            <span class="part-title-text">报告专业度说明</span>
          </div>
          <div class="rich-text" v-html="testPaperInfo?.payDescMobile"></div>
          <div class="part-title">
            <div class="part-title-num">PART 2</div>
            <span class="part-title-text">专业团队打造</span>
          </div>

          <!-- 专业团队出品 -->
          <div class="item rich-text" v-if="wechatInfo?.team_info">
            <Title>{{ wechatInfo?.team_info_title }}</Title>
            <div class="rich-text-content" v-html="wechatInfo?.team_info"></div>
            <QrCard />
          </div>
        </div>

        <img
          src="@/assets/images/4.png"
          style="height: 116px"
          alt=""
          class="img4"
        />
        <img
          src="@/assets/images/5.png"
          style="height: 116px"
          alt=""
          class="img5"
        />
      </div>

      <!-- 富文本内容 -->
      <!-- <div class="pc-rich-text" v-html="payInfo.pc_pay_content"></div> -->
      <div class="btn" v-if="botShow" @click="buttonPay">
        <div id="after-pay" class="btn-round">
          {{
            (payInfo?.price - Number(redPacketValue))?.toFixed(2)
          }}元解锁你的专属测试报告
        </div>
      </div>
    </div>
    <div v-else-if="payStyleType == 1" class="pay-box">
      <PayModal2
        v-model:show="payModalShow"
        @confirm="handlePay"
        @cancel="onPayModalCancel"
        :testPaperInfo="testPaperInfo"
        :payInfo="payInfo"
        @handlePay="handlePay"
        :currentCoupon="currentCoupon"
        :showCoupon="showCoupon"
        :list="list"
        @ontab="ontab"
        :unlockIndex="unlockIndex"
        :priceInfo="redPacketPriceInfo2"
        :redPacketType="redPacketType"
      />
    </div>
    <div v-else-if="payStyleType == 2" class="pay-box">
      <PayModal3
        v-model:show="payModalShow"
        @confirm="handlePay"
        @cancel="onPayModalCancel"
        :testPaperInfo="testPaperInfo"
        :payInfo="payInfo"
        @handlePay="handlePay"
        :currentCoupon="currentCoupon"
        :showCoupon="showCoupon"
        :list="list2"
        @ontab="ontab"
        :unlockIndex="unlockIndex"
        :priceInfo="redPacketPriceInfo2"
        :redPacketType="redPacketType"
        :goods_list="goods_list"
      />
    </div>

    <!-- PC微信扫码支付 -->
    <WeChatPayQr
      v-model:show="qrPayShow"
      :url="payUrl"
      @confirm="qrConfirm"
      @cancel="onQrCancel"
    />
    <!-- 红包 -->
    <RedPacket2
      :priceInfo="redPacketPriceInfo"
      v-if="payInfo?.redPacketConfig"
      :redPacketConfig="payInfo?.redPacketConfig"
      v-model:show="redPacketShow"
      v-model:priceType="redPacketType"
      @confirm="handleConfirm"
      @cancel="onRedPacketCancel"
    />
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onMounted,
  computed,
  watch,
  onBeforeUnmount,
  ref,
} from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import VueQr from "vue-qr/src/packages/vue-qr";
import { Toast, Dialog } from "vant";
import { useAuth } from "@/hooks/useAuth";
import ToCustomer from "@/views/detail/components/customer";
import { getTestOrderInfo, updateTestOrder } from "@/api/testPaper";
import WeChatPayQr from "@/components/WeChatPayQr";

import RedPacket2 from "../RedPacket2";
import { useStore } from "@/store";
import { useAgent } from "@/hooks/useAgent";
import QrCard from "@/components/QrCard";
import PayModal2 from "../General/PayModa2";
import PayModal3 from "../General/PayModa3";
import { loadingToast } from "@/plugins/vant";
import { parseQueryString } from "@/utils/tools";
import Title from "@/views/detail/components/Common/components/Title";
import qs from "qs";

import { checkTestOrderPay, testOrderPay } from "@/api/order";
export default {
  name: "PaymentReminder",
  components: {
    VueQr,
    ToCustomer,
    WeChatPayQr,
    RedPacket2,
    QrCard,
    PayModal2,
    PayModal3,
    Title,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      qrPayShow: false,
      redPacketShow: false,
      redPacketType: 2,

      testOrderInfo: {},
      testPaperInfo: {},
      couponInfo: {},
      couponList: [],
      reportProcessList: [],
      payInfo: {},
      promotionInfo: {},

      percentage: 100, // 做题进度(只能为100)
      currentIndex: 0, // 当前做到第几题
      payInfo: {}, // 试卷信息
      payUrl: "", // 支付二维码URL
      time: 0, // 轮询次数
      timer: null,
      botShow: false,
      tishitShow: false,

      payModalShow: false,
      redPacketValue: 0, // 红包数量
      payStyleType: 0,
      currentCoupon: {},
      class_type: 1,
      isDataLoaded: false,
      list: [
        {
          id: 1,
          fay: false,
          name: "测试结果",
          price: 1,
          originalPrice: 1,
          center: "只看测试结果",
        },
        {
          id: 2,
          fay: false,
          name: "完整解读",
          price: 1,
          originalPrice: 1,
          center: "完整解读+职业推荐+交友指南",
        },
        {
          id: 3,
          fay: false,
          name: "完整解读Pro",
          price: 1,
          originalPrice: 1,
          center: "完整解读+职业推荐+交友指南+八维报告+恋爱报告+职场规划",
        },
      ],
      list2: [
        {
          id: 1,
          fay: false,
          name: "测试结果",
          price: 1,
          originalPrice: 1,
          center: "只看智商分值",
        },
        {
          id: 2,
          fay: false,
          name: "完整解读",
          price: 1,
          originalPrice: 1,
          center: "完整解读+高级智力进阶测试",
        },
        {
          id: 3,
          fay: false,
          name: "完整解读Pro",
          price: 1,
          originalPrice: 1,
          center: "完整解读+错题解析+免费重测3次+高级智力进阶测试+情商鉴定测试",
        },
      ],
      //商品权限列表，有商品，图片，权限
      goods_list: [
        {
          id: 1,
          name: "您的智商分值",
          img: require("../../../../assets/images/detail.png"),
          show: true,
        },
        {
          id: 2,
          name: "超越同龄人比例",
          img: require("../../../../assets/images/detail.png"),
          show: true,
        },
        {
          id: 3,
          name: "智商鉴定分享海报",
          img: require("../../../../assets/images/detail.png"),
          show: true,
        },
        {
          id: 4,
          name: "智商天赋建议职业",
          img: require("../../../../assets/images/card.png"),
          show: true,
        },
        {
          id: 5,
          name: "你的智力各维度指数分布",
          img: require("../../../../assets/images/card.png"),
          show: true,
        },
        {
          id: 6,
          name: "智商基因各维度深入解析",
          img: require("../../../../assets/images/advantage.png"),
          show: true,
        },
        {
          id: 7,
          name: "你的智力各维度专属建议",
          img: require("../../../../assets/images/love.png"),
          show: true,
        },
        {
          id: 8,
          name: "智力构成因素",
          img: require("../../../../assets/images/advantage.png"),
          show: true,
        },
        {
          id: 9,
          name: "影响智力的关键点",
          img: require("../../../../assets/images/advantage.png"),
          show: true,
        },
        {
          id: 10,
          name: "智商与遗传的关系",
          img: require("../../../../assets/images/custom.png"),
          show: true,
        },
        {
          id: 11,
          name: "智力测验的理论依据",
          img: require("../../../../assets/images/pro.png"),
          show: true,
        },
        {
          id: 12,
          name: "您本次测试的错题解析",
          img: require("../../../../assets/images/pro.png"),
          show: true,
        },
        {
          id: 13,
          name: "瑞文高级智商进阶测试",
          img: require("../../../../assets/images/love.png"),
          show: true,
        },
        {
          id: 14,
          name: "赠送免费重测三次",
          img: require("../../../../assets/images/pro.png"),
          show: true,
        },
        {
          id: 15,
          name: "您的智商鉴定报告下载",
          img: require("../../../../assets/images/card.png"),
          show: true,
        },
        {
          id: 16,
          name: "360情商综合评估测试",
          img: require("../../../../assets/images/love.png"),
          show: true,
        },
      ],
      unlockIndex: 3, // 原goods_sale_price_type
    });

    const time = 10 * 60 * 1000;
    onBeforeUnmount(() => {});

    const { testOrderId, promotionId, testPaperId, redPacketType, couponId } =
      route.query;
    const { env, os, isWeChat } = useAgent();

    state.class_type = Number(redPacketType);
    state.redPacketType = Number(redPacketType);
    const wechatInfo = computed(() => store.getters.wechatInfo);
    const hasRedPacket = computed(
      () =>
        state.payInfo?.redPacketConfig &&
        Object.keys(state.payInfo?.redPacketConfig)?.length > 0
    );
    // 获取支付链接
    async function onPay() {
      const tradeType = "NATIVE"; // 支付类型
      try {
        state.payUrl = "";
        state.time = 0;
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
        state.payUrl = info.code_url;
        if (!state.redPacketType) {
          state.qrPayShow = true;
        }
        // else {
        // 	state.redPacketShow = true;
        // }
      } catch (error) {}
    }

    onMounted(() => {
      init();
      window.loading?.close?.();
      window.addEventListener("scroll", handleScroll);
    });
    // 红包支付
    function handleConfirm() {
      handlePay();
    }
    function buttonPay() {
      handlePay();
    }
    function handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let elementbox = document.querySelector(".conter-title");
      let elementbox2 = document.querySelector(".conter");

      if (elementbox) {
        const boxoffsetTop = elementbox.offsetTop;
        if (scrollTop > boxoffsetTop) {
          state.botShow = true;
        } else {
          state.botShow = false;
        }
      }
      if (elementbox2) {
        const box2offsetTop = elementbox2.offsetTop;
        if (scrollTop > box2offsetTop) {
          state.tishitShow = true;
        } else {
          state.tishitShow = false;
        }
      }
      // 处理滚动事件的逻辑
    }
    // 截取小数点后面整数
    function getDecimal(num) {
      if (num && typeof num === "string") {
        return parseInt(num.substring(0, num.indexOf(".")));
      } else {
        return num;
      }
    }
    async function init() {
      const params = !isWeChat ? { couponId } : {};
      try {
        // 获取红包信息
        const {
          testOrderInfo,
          testPaperInfo,
          couponInfo,
          couponList,
          reportProcessList,
          payInfo,
          promotionInfo,
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

        if (state.class_type == 1) {
          state.redPacketValue = state.payInfo?.redPacketConfig?.value1;
        }
        if (state.class_type == 2) {
          state.redPacketValue = state.payInfo?.redPacketConfig?.value2;
        }
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
        if (payInfo.status === 2 || payInfo.status === 3) {
          // 2  已支付  3 无需支付
          // 已支付的订单
          goReport();
        } else {
          if (state.class_type == 1) {
            const {
              testOrderId,
              promotionId,
              testPaperId,
              redPacketType,
              couponId,
            } = route.query;
            setTimeout(() => {
              // state.dialogTipsShow = true;
              Dialog.confirm({
                title: "提示",
                message: "请确定支付是否已完成？",
                showCancelButton: true,
                confirmButtonText: "已完成支付",
                cancelButtonText: "再看看",
                getContainer: ".myput",
              }).finally(() => {
                storeNextPage.value = false;
                router.push({
                  path: "/PaymentReminder2",
                  query: {
                    testOrderId,
                    testPaperId,
                    promotionId,
                    couponId,
                    redPacketType,
                    fromType: route.query.fromType,
                  },
                });
              });
            }, 100);
          }
        }
      } catch (error) {
        window.__bl?.api(
          "获取支付页失败(Promotional)",
          false,
          0,
          "error",
          `调用失败:${error}`
        );
        Dialog.alert({
          title: "出错了~",
          message: "请刷新页面后重试",
          theme: "round-button",
          showCancelButton: false,
          confirmButtonText: "立即刷新",
          confirmButtonColor: "#ff5d7d",
          onConfirm: () => {
            window.location.reload();
          },
        });
      }
    }
    // 退出弹框
    function onRedPacketCancel() {
      state.redPacketValue = state.payInfo?.redPacketConfig.value2;
      state.redPacketShow = false;
      onRedPacketGiftCancel();
    }

    // 支付按钮
    async function handlePay(fay) {
      state.payModalShow = false;
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
        const redirectUrl = `${window.location.origin}/PaymentReminder?${search}`;
        if (env === "browser-mobile") {
          const { needPay } = await checkTestOrderPay({ testOrderId });
          if (needPay !== 1) {
            loading.clear();
            return goReport();
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
          h5Type: fay && (fay == "wx" || fay == "zfb") ? fay : "", // h5支付的方式  wx  zfb
        };
        if (state.payStyleType == 1 || state.payStyleType == 2) {
          if ((fay && fay != "wx") || fay != "zfb") {
            params.unlockIndex = 1;
          } else {
            params.unlockIndex = state.unlockIndex;
          }
        }
        const { info } = await testOrderPay(params);
        loading.clear();
        state.redPacketShow = false;

        if (info.noNeedPay === 1) {
          // 支付金额为0， 无需支付
          return goReport();
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
      // state.qrPayShow = true;
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

    // PC二维码轮询
    async function qrPoll(count) {
      try {
        const { needPay } = await checkTestOrderPay({ testOrderId });
        if (needPay !== 1) {
          goReport();
        } else {
          state.timer = window.setTimeout(async () => {
            state.time++;
            if (state.time > count) {
              Toast("暂未查询到您的支付订单，如已支付请关注公众号联系客服处理");
              return;
            }
            qrPoll(count);
          }, 1000);
        }
      } catch (error) {}
    }
    // 检查订单状态
    const checkOrderStatus = async (fay) => {
      const { needPay } = await checkTestOrderPay({ testOrderId });
      if (needPay !== 1) {
        clearLoading();
        goReport();
      } else {
        if (fay) {
          Toast("暂未查询到您的支付订单，如已支付请关注公众号联系客服处理");
        }
      }
    };
    function clearLoading() {
      window.createOrderLoading?.close();
      window.createOrderLoading = null;
    }

    // 轮询查询支付状态（ww添加）
    async function poll2(count) {
      const { needPay } = await checkTestOrderPay({ testOrderId });
      if (needPay !== 1) {
        clearLoading(); // 跳转支付引导页
        goReport();
      } else {
        state.timer = window.setTimeout(async () => {
          state.time++;
          if (state.time === 1) {
            clearLoading();
          }
          if (state.time > count) {
            return;
          }
          poll2(count);
        }, 1000);
      }
    }

    // 轮询查询支付状态
    async function poll(count, isConfirm) {
      if (!window.createOrderLoading && state.time < 1) {
        window.createOrderLoading = loadingToast("查询订单中...");
      }
      try {
        const { needPay } = await checkTestOrderPay({ testOrderId });
        if (needPay !== 1) {
          clearLoading();
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
    const storeNextPage = ref(true);

    // 路由守卫
    onBeforeRouteLeave(async (to, from, next) => {
      if (!storeNextPage.value) {
        next();
      } else {
        if (state.class_type == 1) {
          state.redPacketType = 2;
          state.class_type == 2;
          state.redPacketValue = state.payInfo?.redPacketConfig.value2;
          state.redPacketShow = true;
          // init()
          // state.redPacketShow = true
          next(false);
        } else {
          onRedPacketGiftCancel();
        }
      }
    });
    function onPayModalCancel() {
      if (hasRedPacket.value) {
        state.redPacketShow = true;
        if (!state.redPacketType) {
          state.redPacketType = 2;
          // sessionStorage.setItem("redPacketType", 1);
        }
      }
    }
    function onRedPacketGiftCancel() {
      storeNextPage.value = false;
      router.replace({
        path: "/wechatQr",
        query: route.query,
      });
    }
    watch(
      () => state.redPacketType,
      async (val) => {
        if ([1, 2].includes(Number(val))) {
          await updateTestOrder({
            testOrderId,
            redPacketType: state.redPacketType,
          });
        }
      }
    );
    async function onQrCancel() {
      if (hasRedPacket.value) {
        state.qrPayShow = false;
        state.redPacketShow = true;
        state.redPacketType = 1;
        await onPay();
        poll();
      } else {
        state.qrPayShow = false;
      }
      checkOrderStatus();
      await updateTestOrder({
        testOrderId,
        redPacketStatus: 6,
      });
    }

    useAuth(
      {
        authType: 1,
      },
      hook
    );
    async function hook() {
      const { fromType } = route.query;
      if (fromType === "pay") {
        // localStorage.setItem('testOrderId', testOrderId);
        poll(60);
      } else {
        poll2(60);
      }
    }
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
        // 红包1
        one: (price - Number(state.payInfo?.redPacketConfig?.value1))?.toFixed(
          2
        ),
        // 红包2
        two: (price - Number(state.payInfo?.redPacketConfig?.value2))?.toFixed(
          2
        ),
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
    return {
      ...toRefs(state),
      onQrCancel,
      handlePay,
      redPacketPriceInfo,
      redPacketPriceInfo2,
      onRedPacketCancel,
      time,
      wechatInfo,
      qrConfirm,
      checkOrderStatus,
      handleConfirm,
      onPayModalCancel,
      buttonPay,
      getDecimal,
      ontab,
    };
  },
};
</script>

<style lang="less" scoped>
:deep(.rich-text) {
	// padding-bottom: @padding-base;
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

	p {
		padding-top: 20px;
	}

}

:deep(.van-popup .van-popup__close-icon) {
	color: #000 !important;
}

img[src=""],
img:not([src]) {
	opacity: 0;
}

/* PC端样式 */

.answer {
	min-height: 100vh;
	background: #fff url('../../../../assets/images/bg_base.png') repeat;
	background-size: 1.6rem;
	padding-bottom: 90px;

	@media (min-width: 750px) {
		.head-title {
			width: 375px !important;

		}
	}

	.head-title {
		width: 100%;
		// left: calc((100vw - 295px) / 2);
		// width:750px;
		// background: rgba(229, 77, 66, 1);
		background: #09ce13;
		font-size: 14px;
		color: #fff;
		display: block;
		line-height: 26px;
		padding: 10px 5px;
		position: fixed;
		top: 0;
		z-index: 999;

		// letter-spacing: 0.05rem;

		.dianji {
			color: #ffeb3b;
			font-size: 16px;
			font-weight: 700;
		}
	}

	.head-active {
		position: fixed;
		top: 0;
	}

	.conter {
		// huanse_bg
		// 背景图
		background: url('../../../../assets/images/huanse_bg.png') no-repeat;
		background-size: 100%;
		padding-top: 70px;
	}

	.conter-title {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 25px 0 19px 0;

		.img-left {
			width: 50px;
			margin-left: 10px;
		}

		.title {
			font-size: 18px;
			color: rgba(76, 75, 88, 1);
			font-weight: 600;
		}

		.img-right {
			width: 50px;
			margin-right: 10px;
			;
		}
	}

	.speciality {
		background-color: rgba(208, 189, 253, 1);
		height: 46px;
		text-align: center;
		line-height: 46px;
		font-size: 16px;
		color: rgba(0, 0, 0, 1);
		font-weight: 600;
		margin: 0 18px;
		display: flex;
		align-items: center;
		justify-content: center;

		.speciality-img {
			width: 18px;
			margin-right: 5px;
			margin-bottom: 3px;

		}

	}

	.card-box {
		width: 90%;
		padding: 15px;
		margin-left: 5%;
		// margin-top: 30px;
		;
		// 阴影样式
		border-radius: 15px;
		background-color: #fff;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);


		.top {
			// padding-bottom: 22px;
		}

		.card-item {
			font-size: 14px;
			color: #333;
			// padding: 25px 20px;
			width: 100%;

			.rich-text {
				// padding: 22px;
			}

			.give {
				color: rgba(99, 99, 99, 1);
				line-height: 24px;
				// padding: 22px 20px;


				.red {
					color: rgba(229, 77, 66, 1);
					font-weight: 600;
				}
			}




			.card-item-icon {
				border-radius: 10px;
				height: 100px !important;
				width: 100px !important;
				// margin-right: 5%;
			}

			.card-item-title {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				// padding-bottom: 15px;
				// padding: 25px 20px;



				.card-item-title-text {


					margin-left: 6%;

					.text-title {
						color: rgba(0, 0, 0, 1);
						font-size: 16px // margin-bottom: 5px;
					}

					.text-desc {
						font-size: 12px;
						color: #757575;
						padding-top: 5px;
					}

					.text-price {
						font-size: 16px;
						color: #f74848;
						line-height: 28px;
						font-weight: 600;

						.text-price-desc {
							color: #000;
							font-weight: 500;
							font-size: 14px
						}

					}

					.text-people {
						color: #9e9e9e;
						font-size: 12px;

					}
				}
			}

			.timer {
				font-size: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 10px 0 5px;
				margin-top: 5px;

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

			.card-item-content {
				width: 100%;
				height: 40px;
				background-color: #fdcbcb;
				border-radius: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 10px;

				.card-item-content-left {
					background-color: #f74848;
					height: 28px;
					padding: 0 10px;
					;
					line-height: 28px;
					;
					border-radius: 4px;
					color: #ffffff;
				}

				.card-item-content-right {
					color: #f74848;
					font-weight: 600;
				}
			}

			.tishi-text {
				color: rgba(156, 156, 156, 1);
				font-size: 12px;
				padding-top: 10px;
				width: 100%;
				text-align: center;
			}

			.chakanjg {
				color: #4862f7;

			}

			.card-item-footer {

				font-size: 16px;
				color: #fff;
				font-weight: 600;
				height: 45px;
				line-height: 45px;
				// width: 90%;
				// margin-left: 5%;
				border-radius: 26px;
				text-align: center;
				margin-top: 10px;
				// 渐变色
				border-radius: 50px;
				background: linear-gradient(270deg, rgba(255, 81, 75, 1) 0%, rgba(254, 158, 130, 1) 100%);

			}
		}
	}

	.card-box2 {
		width: 90%;
		padding: 15px 15px 30px 15px;
		margin-left: 5%;
		// margin-top: 30px;
		// 阴影样式
		border-radius: 15px 15px 0 0;
		background-color: #fff;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
		position: relative;


		.img1 {
			width: 100%;
			height: 10px !important;
			margin-bottom: 15px;
			margin-top: 20px;
		}

		.img2 {
			position: absolute;
			right: 5px;
			top: 5px;
			height: 45px !important;
			width: auto;
		}

		.img3 {
			position: absolute;
			left: 0px;
			top: 0px;
			height: 45px !important;
			width: auto;
		}

		.img6 {
			width: 100%;
			// height: 190px;
		}

		.top {
			// padding-bottom: 22px;
		}

		.card-item {
			font-size: 14px;
			color: #333;
			// padding: 25px 20px;
			width: 100%;
			padding-top: 15px;


			.rich-text {
				// padding: 22px;
			}

			.give {
				color: rgba(99, 99, 99, 1);
				line-height: 24px;
				// padding: 22px 20px;


				.red {
					color: rgba(229, 77, 66, 1);
					font-weight: 600;
				}
			}

			.speciality {
				background-color: rgba(208, 189, 253, 1);
				height: 46px;
				text-align: center;
				line-height: 46px;
				font-size: 16px;
				color: rgba(0, 0, 0, 1);
				font-weight: 600;
				margin-top: 15px;
			}



			.card-item-icon {
				border-radius: 10px;
				height: 116px;
				// margin-right: 5%;
			}

			.card-item-title {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				// padding-bottom: 15px;
				// padding: 25px 20px;



				.card-item-title-text {


					margin-left: 8%;

					.text-title {
						color: #000;
						margin-bottom: 5px;
					}

					.text-desc {
						font-size: 12px;
						color: #757575;
						padding-top: 5px;
					}

					.text-price {
						font-size: 12px;
						color: #f74848;
						padding-top: 5px;

						.text-price-desc {
							color: #000
						}

					}

					.text-people {
						color: #9e9e9e;
						font-size: 12px;
						padding-top: 7px;
					}
				}
			}

			.timer {
				font-size: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 10px 0;

				.colon {
					display: inline-block;
					margin: 0 4px;
					color: rgba(238, 10, 36, 1);
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

			.card-item-content {
				width: 100%;
				height: 40px;
				background-color: #fdcbcb;
				border-radius: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 10px;

				.card-item-content-left {
					background-color: #f74848;
					height: 28px;
					padding: 0 10px;
					;
					line-height: 28px;
					;
					border-radius: 4px;
					color: #ffffff;
				}

				.card-item-content-right {
					color: #f74848;
					font-weight: 600;
				}
			}

			.tishi-text {
				color: rgba(156, 156, 156, 1);
				font-size: 12px;
				padding-top: 10px;
				width: 100%;
				text-align: center;
			}

			.card-item-footer {

				font-size: 16px;
				color: #fff;
				font-weight: 600;
				height: 50px;
				line-height: 50px;
				// width: 90%;
				// margin-left: 5%;
				border-radius: 26px;
				text-align: center;
				margin-top: 10px;
				// 渐变色
				border-radius: 50px;
				background: linear-gradient(270deg, rgba(255, 81, 75, 1) 0%, rgba(254, 158, 130, 1) 100%);

			}
		}
	}

	.card-box3 {
		width: 90%;
		padding: 0 20px 20px 20px;
		margin-left: 5%;
		// margin-top: 30px;
		// 阴影样式
		border-radius: 0 0 15px 15px;
		background-color: #fff;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
		position: relative;


		.top {
			// padding-bottom: 22px;
		}

		.img4 {
			position: absolute;
			right: 5px;
			top: 5px;
			height: 45px !important;
			width: auto;
		}

		.img5 {
			position: absolute;
			right: 0px;
			bottom: 0px;
			height: 45px !important;
			width: auto;
		}

		.card-item {
			font-size: 14px;
			color: #333;
			// padding: 25px 20px;
			width: 100%;
			padding-top: 15px;


			.rich-text {
				// padding: 22px;
			}

			.give {
				color: rgba(99, 99, 99, 1);
				line-height: 22px;
				// padding: 22px 20px;


				.red {
					color: rgba(229, 77, 66, 1);
					font-weight: 600;
				}
			}

			.speciality {
				background-color: rgba(208, 189, 253, 1);
				height: 46px;
				text-align: center;
				line-height: 46px;
				font-size: 16px;
				color: rgba(0, 0, 0, 1);
				font-weight: 600;
				margin-top: 15px;
			}

			.part-title {
				margin-top: 25px;

				font-size: 15px;
				font-weight: 500;
				letter-spacing: 0px;
				line-height: 26px;
				color: rgba(124, 145, 248, 1);
				display: flex;
				align-items: center;

				.part-title-num {
					background: #ffd754;
					padding: 0 10px;
					text-align: center;
					height: 20px;
					line-height: 20px;
					border-radius: 30px;
					color: #000;
				}

				.part-title-text {
					color: rgba(56, 56, 56, 1);
					font-weight: 600;
					margin-left: 10px;
				}
			}

			.card-item-icon {
				border-radius: 10px;
				height: 116px;
				// margin-right: 5%;
			}

			.card-item-title {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				// padding-bottom: 15px;
				// padding: 25px 20px;



				.card-item-title-text {


					margin-left: 8%;

					.text-title {
						color: #000;
						margin-bottom: 5px;
					}

					.text-desc {
						font-size: 12px;
						color: #757575;
						padding-top: 5px;
					}

					.text-price {
						font-size: 12px;
						color: #f74848;
						padding-top: 5px;

						.text-price-desc {
							color: #000
						}

					}

					.text-people {
						color: #9e9e9e;
						font-size: 12px;
						padding-top: 7px;
					}
				}
			}

			.timer {
				font-size: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 10px 0;

				.colon {
					display: inline-block;
					margin: 0 4px;
					color: rgba(238, 10, 36, 1);
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

			.card-item-content {
				width: 100%;
				height: 40px;
				background-color: #fdcbcb;
				border-radius: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 10px;

				.card-item-content-left {
					background-color: #f74848;
					height: 28px;
					padding: 0 10px;
					;
					line-height: 28px;
					;
					border-radius: 4px;
					color: #ffffff;
				}

				.card-item-content-right {
					color: #f74848;
					font-weight: 600;
				}
			}

			.tishi-text {
				color: rgba(156, 156, 156, 1);
				font-size: 12px;
				padding-top: 10px;
				width: 100%;
				text-align: center;
			}

			.card-item-footer {

				font-size: 16px;
				color: #fff;
				font-weight: 600;
				height: 50px;
				line-height: 50px;
				// width: 90%;
				// margin-left: 5%;
				border-radius: 26px;
				text-align: center;
				margin-top: 10px;
				// 渐变色
				border-radius: 50px;
				background: linear-gradient(270deg, rgba(255, 81, 75, 1) 0%, rgba(254, 158, 130, 1) 100%);

			}
		}
	}

	@media (min-width: 750px) {
		.btn {
			width: 375px !important;

		}
	}

	.btn {
		width: 100%;

		position: fixed;
		padding: 10px 20px;
		bottom: 0px;
		z-index: 99;
		//遮罩层
		background-color: rgba(0, 0, 0, 0.7);



	}

	.btn-round {
		width: 100%;
		font-weight: bold;
		font-size: 19px;
		font-weight: 400;
		text-align: center;
		border-radius: 50px;
		height: 45px;
		line-height: 45px;
		color: #fff;
		background-image: linear-gradient(to right, #ff997f, #f74848);

		// animation: scale 3s infinite;
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
}

.pay-box {
	padding-top: 60px;
}
</style>
