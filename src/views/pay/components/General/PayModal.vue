<template>
  <van-dialog
    class="pay-modal"
    v-model:show="visible"
    :show-confirm-button="false"
  >
    <div class="content">
      <van-icon name="cross" class="close-icon" @click="cancel" />
      <div class="card">
        <div class="title">你的专业报告说明</div>
        <div class="detail" v-if="payInfo?.payConfirmDec">
          <div v-html="payInfo?.payConfirmDec"></div>
        </div>
      </div>
      <!-- <div class="num">累计{{ payInfo.goods_vr_sale_count }}人已购</div> -->
      <div class="price">
        <span class="text">新用户限时优惠价：</span>
        <span class="new">{{ payInfo?.price }}元</span>
        <span class="old">{{ payInfo?.originalPrice }}</span>
      </div>
      <div class="timer" v-if="!showCoupon">
        <van-count-down :time="3 * 60 * 1000" millisecond>
          <template #default="timeData">
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

      <div v-else class="coupon" @click="handleCoupon">
        <div class="left">
          <span class="text">{{
            Object.keys(currentCoupon).length ? "优惠券已抵扣" : "未选择优惠券"
          }}</span>
          <span class="coupon-title" v-if="currentCoupon.discountValue">
            {{ `立减${currentCoupon.discountValue}元` }}</span
          >
          <span v-else class="coupon-title">点击选择优惠券</span>
        </div>
        <div class="right">
          <span class="coupon-price" v-if="Object.keys(currentCoupon).length"
            >券后￥{{ currentCoupon.newPrice }}</span
          >
          <span v-if="isWeChat" class="icon"></span>
        </div>
      </div>

      <div class="confirm button" @click="confirm">
        <!-- 微信支付 ￥ {{ payInfo.price }} -->
        {{ payInfo?.ui_payBtnText }}
      </div>
      <!-- <div
                class="cancel button"
                @click="cancel"
            >退出</div> -->
    </div>
  </van-dialog>
</template>

<script setup>
import { computed } from "vue";
import { useAgent } from "@/hooks/useAgent";

const { isWeChat } = useAgent();
const emit = defineEmits(["update:show", "cancel", "onCoupon"]);
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
});
const visible = computed({
  get: () => props.show,
  set: (val) => emit("update:show", val),
});

function confirm() {
  emit("confirm");
}
function cancel() {
  visible.value = false;
  emit("cancel");
}
function handleCoupon() {
  if (!isWeChat) {
    return;
  }
  emit("onCoupon");
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
    font-size: 24px;
  }

  .card {
    padding: 10px 15px;
    // border: 1px solid #86aaac;
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
</style>
