<template>
  <!-- <van-popup v-model:show="visible" round closeable position="bottom" :close-on-click-overlay="false" class="pay-modal"
		@click-close-icon="emit('cancel')" style="--van-popup-close-color: #000;"> -->

  <div class="mbti_pay">
    <div class="price_top">
      <div class="p1">
        <span class="js">
          <van-count-down :time="10 * 60 * 1000" millisecond>
            <template #default="timeData">
              <span class="block2">您的专属报告将于</span>
              <span class="block">{{
                String(timeData.minutes).padStart(2, "0")
              }}</span>
              <span class="colon">:</span>
              <span class="block">{{
                String(timeData.seconds).padStart(2, "0")
              }}</span>
              <!-- <span class="colon">:</span>
                                    <span class="block">{{
                                        timeData.milliseconds.toString().slice(0, 2)
                                    }}</span> -->
              <span class="block2">后失效</span>
            </template>
          </van-count-down></span
        >
      </div>
      <div class="p2">
        解锁完整报告即可 <span class="yjzf">永久保存及转发</span>
      </div>
    </div>
    <div class="price_mid">
      <div class="js_choose">
        <div
          class="tab"
          :class="{ cur: item.fay }"
          @click="ontab(index)"
          v-for="(item, index) in setPrice"
          :key="index"
        >
          <div class="new-discounts-tag" v-if="index == 2">86%的人选择</div>
          <div class="p1">{{ item.name }}</div>
          <div class="p2" style="color: #000">
            ￥{{
              (item.price - (priceInfo?.value ? priceInfo?.value : 0)).toFixed(
                2
              )
            }}<span style="color: rgb(85, 85, 85)"
              >￥{{ item.originalPrice }}</span
            >
          </div>
          <div class="dikouxj" v-if="priceInfo?.value && priceInfo?.value > 0">
            已抵扣{{ getDecimal(priceInfo?.value) }}元红包
          </div>
          <div class="p3">{{ item.center }}</div>
        </div>
        <!-- <div class="tab cur">
						<div class="new-discounts-tag"> 86%的人选择 </div>
						<div class="p1">完整解读</div>
						<div class="p2" style="color: rgb(255, 0, 0);">￥29.8<span style="color: rgb(85, 85, 85);">￥98</span>
						</div>
						<div class="p3">完整解读+职业推荐+交友指南</div>
					</div>
					<div class="tab">
						<div class="new-discounts-tag"> 86%的人选择 </div>
						<div class="p1">完整解读Pro</div>
						<div class="p2" style="color: rgb(255, 0, 0);">￥39.8<span
								style="color: rgb(85, 85, 85);">￥298</span></div>
						<div class="p3">完整解读+职业推荐+交友指南+八维报告</div>
					</div> -->
      </div>
    </div>

    <!-- <div class="price_zf">
      <div class="wxzf"><img src="../../../../assets/images/wx2.jpg" class="wxzf-img"><span
					style="margin-left: 10px;">支付</span></div>
      <div class="p4">已有 {{ getPeople }} 人解锁</div>
    </div> -->

    <div class="price_zf_wrap">
      <!-- <div class="wxzf"><img src="../../../../assets/images/wx2.jpg" class="wxzf-img"><span
					style="margin-left: 10px;">支付</span></div> -->
      <div class="item zfb" @click="confirm('wx')">
        <img src="../../../../assets/images/wx-pay-icon.jpg" class="img" />
        <div class="name">点击支付</div>
      </div>
      <div class="item wx" @click="confirm('zfb')" v-if="false">
        <img src="../../../../assets/images/zfb-pay-icon.jpg" class="img" />
        <div class="name">支付宝支付</div>
      </div>
      <div class="p4">已有 {{ getPeople }} 人解锁</div>
    </div>

    <div class="new-price-rights">
      <div class="new-price-rights-title" v-if="unlockIndex == 1">
        <span>只看{{ setPrice[0]?.name }}，</span>您可以享受以下权利
      </div>
      <div class="new-price-rights-title" v-if="unlockIndex == 2">
        <span class="new-price-rights-title-txt2"
          >{{ setPrice[1]?.name }}，</span
        >您可以享受以下权利
      </div>
      <div class="new-price-rights-title" v-if="unlockIndex == 3">
        <span class="new-price-rights-title-txt">{{ setPrice[2]?.name }}，</span
        >您可以享受以下权利
      </div>
      <div class="new-price-right-box" v-if="unlockIndex == 1">
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="@/assets/images/detail.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">基础解读</div>
        </div>
        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/detail.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">完整解读</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/card.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">MBTI类型</div>
        </div>
        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/card.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">八维类型</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/advantage.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">MBTI身份卡</div>
        </div>
        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/love.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">MBTI恋爱卡</div>
        </div>
        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/advantage.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">潜能&amp;劣势</div>
        </div>
        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/advantage.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">发展规划</div>
        </div>
        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/custom.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">价值观分析</div>
        </div>
        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/pro.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">最佳职业</div>
        </div>
        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/pro.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">职场规划</div>
        </div>

        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/love.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">恋爱解密</div>
        </div>

        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/love.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">爱情婚姻揭密</div>
        </div>
        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/pro.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">深度职业解读报告</div>
        </div>

        <div class="new-price-right-item one-line through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/card.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">
            荣格八维报告（含Ne Ni Se Si Te Ti Fe Fi）
          </div>
        </div>
      </div>
      <div class="new-price-right-box" v-if="unlockIndex == 2">
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/detail.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">基础解读</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/detail.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">完整解读</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/card.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">MBTI类型</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/card.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">八维类型</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/advantage.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">MBTI身份卡</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/love.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">MBTI恋爱卡</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/advantage.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">潜能&amp;劣势</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/advantage.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">发展规划</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/custom.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">价值观分析</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/pro.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">最佳职业</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/pro.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">职场规划</div>
        </div>

        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/love.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">恋爱解密</div>
        </div>

        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/love.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">爱情婚姻揭密</div>
        </div>
        <div class="new-price-right-item through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/pro.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">深度职业解读报告</div>
        </div>
        <div class="new-price-right-item one-line through">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/card.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">
            荣格八维报告（含Ne Ni Se Si Te Ti Fe Fi）
          </div>
        </div>
      </div>

      <div class="new-price-right-box" v-if="unlockIndex == 3">
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/detail.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">基础解读</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/detail.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">完整解读</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/card.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">MBTI类型</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/card.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">八维类型</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/advantage.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">MBTI身份卡</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/love.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">MBTI恋爱卡</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/advantage.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">潜能&amp;劣势</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/advantage.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">发展规划</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/custom.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">价值观分析</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/pro.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">最佳职业</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/pro.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">职场规划</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/love.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">恋爱解密</div>
        </div>

        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/love.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">爱情婚姻揭密</div>
        </div>
        <div class="new-price-right-item">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/pro.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">深度职业解读报告</div>
        </div>
        <div class="new-price-right-item one-line">
          <div class="right-icon-wrapper">
            <div class="right-icon">
              <img
                src="../../../../assets/images/card.png"
                class="taro-img__mode-aspectfit"
              />
            </div>
          </div>
          <div class="right-txt right-txt-active">
            荣格八维报告（含Ne Ni Se Si Te Ti Fe Fi）
          </div>
        </div>
      </div>
      <div class="new-price-safe hydrated">
        <div class="safe-top hydrated">
          <div class="safe-top-img hydrated">
            <img
              src="../../../../assets/images/anquan.png"
              class="taro-img__mode-aspectfit2"
            />
          </div>
          <div class="safe-top-img hydrated">
            <img
              src="../../../../assets/images/baozhang.png"
              class="taro-img__mode-aspectfit2"
            />
          </div>
        </div>
        <div class="safe-txt hydrated">安全联盟已验证请放心支付</div>
      </div>
    </div>
  </div>
  <!-- </van-popup> -->
</template>

<script setup>
import { computed, ref } from "vue";
import { useAgent } from "@/hooks/useAgent";

const { isWeChat } = useAgent();

const emit = defineEmits([
  "update:show",
  "cancel",
  "onCoupon",
  "handlePay",
  "ontab",
]);

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  showCoupon: {
    type: Boolean,
    default: false,
  },
  payInfo: {
    type: Object,
    default: () => ({}),
  },

  currentCoupon: {
    type: Object,
    default: () => ({}),
  },
  list: {
    type: Array,
    default: () => [],
  },
  unlockIndex: {
    type: Number,
    default: () => ({}),
  },
  redPacketType: {
    type: Number,
    default: 0,
  },
  priceInfo: {
    type: Object,
    default: () => ({}),
  },
});
const visible = computed({
  get: () => props.show,
  set: (val) => emit("update:show", val),
});

// 人数  获取秒的时间戳后5位
const getPeople = computed(() => {
  var date = new Date();
  var timestamp = date.getTime();
  var timestamp_str = timestamp.toString();
  var timestamp_str_last6 = timestamp_str.substring(5, 10);
  return "1" + timestamp_str_last6;
});

// const getPrice = computed(() => {
// 	const { currentCoupon, data } = props;
// 	if (currentCoupon.discountAmount) {
// 		const value = data.goods_sale_price - currentCoupon.discountAmount;
// 		if (value < 0) return 0;
// 		return value.toFixed(2);
// 	}
// 	return data.goods_sale_price;
// });
const setPrice = computed(() => {
  return props.list;
});
const unlockIndex = computed(() => {
  return props.unlockIndex;
});

// const red_packet_money=ref(1)

// if(props.redPacketType ==1){

// 	red_packet_money.value=props.data.red_packet_money
// }
// if(props.redPacketType ==2){

// 	red_packet_money.value=props.data.red_packet2_money
// 	console.log('%c [ props.data ]-523', 'font-size:13px; background:pink; color:#bf2c9f;', props.data)
// }
function confirm(h5Type) {
  emit("handlePay", h5Type);
}
function cancel() {
  visible.value = false;
  emit("cancel");
}
function handleCoupon() {
  if (!isWeChat) return;
  emit("onCoupon");
}
function ontab(index) {
  emit("ontab", index);
}
function getDecimal(num) {
  if (num && typeof num === "string") {
    return parseInt(num.substring(0, num.indexOf(".")));
  } else {
    return num;
  }
}
</script>

<style lang="less">
@media screen and (min-width: @max-device-width) {
  .pay-modal {
    top: 50%;
    left: 50%;
    transform: scale(0.75) translate3d(-50%, -50%, 0);
    transform-origin: 0 0;
    max-height: none;
  }
}
</style>
<style lang="less" scoped>
.icon {
  margin-left: 10px;
}

.content {
  padding: 40px 12px 16px 12px;
  position: relative;

  .coupon {
    background-color: #feefec;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    padding: 8px;

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
        color: #ee0a24;
        font-weight: bold;
      }

      .icon {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fe4650;
        border-radius: 50%;

        &::after {
          content: "";
          width: 6px;
          height: 6px;
          left: 50%;

          transform: rotate(225deg);
          border-left: 2px solid #fff;
          border-top: 2px solid #fff;
        }
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

  .close-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 28px;
  }

  .card {
    padding: 10px 15px;
    border: 1px solid #86aaac;
    border-radius: 8px;
    background-color: #f1f8fe;

    .title {
      font-size: 22px;
      text-align: center;
      color: #5996b2;
      font-weight: 600;
    }

    .detail {
      font-size: 16px;
      padding: 10px 0;
      line-height: 24px;
      color: #565656;

      p {
        font-size: 16px;
        color: #444444;
      }
    }
  }

  .price {
    text-align: center;
    line-height: 28px;
    padding-top: 5px;

    .old {
      font-size: 14px;
      text-decoration: line-through;
      color: #a1a1a1;
      padding: 0 2px;
    }

    .text {
      font-size: 14px;
      color: #a1a1a1;
    }

    .new {
      font-size: 21px;
      color: #ee0a24;
      font-weight: bold;
      padding: 0 2px;
    }
  }

  .num {
    font-size: 14px;
    color: #d8d8d8;
    text-align: center;
    margin: 6px 0 10px;
  }

  .button {
    height: 45px;
    line-height: 45px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    border-radius: 50px;
    margin: 0 auto;

    &.confirm {
      width: 100%;
      background-color: #00c801;
      font-weight: bold;
      // margin-bottom: 10px;
    }

    &.cancel {
      width: 180px;

      background-color: #9e9e9e;
    }
  }
}

.mbti_pay {
  margin-top: -25px;
  padding: 5px;
  box-sizing: border-box;
  // padding-bottom: 30px;
}

.mbti_pay .price_top {
  text-align: center;
  padding-bottom: 5px;
}

.block2 {
  color: #555 !important;
  font-size: 14px !important;
  text-align: center !important;
}

.mbti_pay .price_top .p1,
.mbti_pay .price_top .p2 {
  color: #555;
  font-size: 12px;
  margin-bottom: 7px;
  text-align: center !important;
  .js {
    text-align: center !important;
  }
}

.mbti_pay .price_top .p1 span,
.mbti_pay .price_top .p2 span {
  color: red;
  font-size: 22px;
  font-weight: 300;
}

.mbti_pay .price_top {
  text-align: center;
}

.mbti_pay .price_top .p1 .yjzf,
.mbti_pay .price_top .p2 .yjzf {
  font-size: 13px;
}

.price_zf_wrap {
  margin-top: 10px;
  margin-bottom: 5px;
  padding: 0px 30px;
  box-sizing: border-box;

  // 支付方式容器
  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    transition: all 0.3s;

    &:active {
      transform: scale(0.98);
      background: #f8f8f8;
    }
    // 图片样式
    .img {
      width: 75px;
      height: 75px;
      object-fit: contain;
    }
    // 支付方式名称
    .name {
      margin-top: 2px;
      font-size: 14px;
      color: #333;
    }
  }

  // 支付方式并列布局
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  // 已解锁人数
  .p4 {
    width: 100%;
    text-align: center;
    margin-top: 10px;
    font-size: 12px;
    color: #999;
  }
}

.wxzf {
  background-color: #07c160;
  width: 98%;
  margin: auto;
  border-radius: 20px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  color: #fff;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  .wxzf-img {
    width: 25px;
    height: 25px;
  }
}
.zfbzf {
  background-color: #07c160;
  width: 98%;
  margin: auto;
  border-radius: 20px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  color: #fff;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  .zfb-img {
    width: 25px;
    height: 25px;
  }
}
.price_zf .p4 {
  text-align: center;
  color: #999;
  font-size: 11px;
  margin-top: 11px;
}

.new-price-rights-title {
  text-align: center;
  margin-top: 11px;
  margin-bottom: 11px;
  color: #c58c34;
}

.new-price-rights-title-txt {
  color: #7c32cb;
}

.new-price-rights-title-txt2 {
  color: #ff5d7d;
}

.new-price-right-box {
  display: flex;
  flex-wrap: wrap;
}

.new-price-safe {
  text-align: center;
  margin-top: 10px;
}

.js_choose {
  display: flex;
  justify-content: space-around;
}

.js_choose .tab {
  width: 31%;
  border: 1px solid #ddd;
  border-radius: 6px;
  position: relative;
  box-sizing: border-box;
  text-align: center;
  padding-top: 15px;
}

.js_choose .tab .p1 {
  font-size: 15px;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.js_choose .tab .p2 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 5px;
}

.js_choose .tab .p3 {
  height: 80px;
  color: #999;
  font-size: 13px;
  margin: 0 5px;
}

.js_choose .cur {
  border: 1px solid #edbf79;
  background: #fef6f0;
}

.new-discounts-tag {
  position: absolute;
  height: 20px;
  background: linear-gradient(180deg, #b66af0, #7c32cb 98%);
  color: #fff;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  line-height: 20px;
  white-space: nowrap;
  padding-left: 5px;
  padding-right: 5px;
  top: -10px;
  right: 0;
}

.js_choose .tab .p2 span {
  font-size: 12px;
  text-decoration: line-through;
  font-weight: 400;
}

.new-price-rights-title {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 10px;
  color: #c58c34;
  font-size: 14px;
}

.new-price-right-box {
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
}

.new-price-safe {
  text-align: center;
  margin-top: 5px;
}

.ew-price-rights {
  font-size: 14px;
}

.new-price-safe .safe-top {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.new-price-right-box .new-price-right-item {
  width: 40%;
  display: flex;

  box-sizing: border-box;
  margin-bottom: 4px;
  font-size: 14px;
  margin-left: 10%;
}

.new-price-right-box .new-price-right-item .right-icon {
  margin-right: 5px;
}

.new-price-safe .safe-txt {
  color: #5ec455;
  font-size: 12px;
  margin-bottom: 6px;
}

.through {
  color: #ccc;
  text-decoration: line-through;
}

.new-price-right-box .one-line {
  width: 100%;
}

.van-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

.taro-img__mode-aspectfit {
  width: 14px;
}

.taro-img__mode-aspectfit2 {
  width: 50px;
}

.dikouxj {
  font-size: 12px;
  background: #ff9800;
  margin: 0 3px;
  padding: 2px;
  border-radius: 5px;
  color: #fff;
  margin-bottom: 5px;
}
</style>
