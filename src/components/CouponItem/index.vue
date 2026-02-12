<template>
  <div class="coupon-item">
    <div class="left">
      <div class="inner">
        <div class="name">{{ item.name }}</div>
        <div class="desc">
          {{ item?.desc }}
        </div>
        <!-- 有效时间 -->
        <div
          class="time"
          v-show="item?.effectiveEndTime && item?.effectiveEndTime > 0"
        >
          失效时间：
          {{ moment(item.effectiveEndTime * 1000).format("YYYY-MM-DD") }}
        </div>
      </div>
    </div>
    <div class="right">
      <div class="price">
        <!-- 现金折扣 -->
        <span v-if="item.type === 1">￥{{ item.value }}</span>
        <span v-if="item.type === 2">免费</span>
        <span v-if="item.type === 3">{{ item.value }}折</span>
        <span v-if="item.type === 4">{{ item.value }}折</span>
      </div>
      <div
        class="button"
        @click="handleGet"
        :class="{ gradient, disabled: getCouponStatus !== 0 }"
      >
        {{ getButtonText }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import moment from "moment";

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  gradient: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: "立即领取",
  },
});
const emit = defineEmits(["clickButton"]);
function handleGet() {
  if (getCouponStatus.value !== 0 && props.item.type !== 2) return;
  emit("clickButton", props.item);
}

const getCouponStatus = computed(() => {
  const endTime = moment(props.item.effectiveEndTime * 1000).format(
    "YYYY-MM-DD"
  );
  if (props.item.status === 1) return 1;
  if (moment(endTime).isBefore(moment().format("YYYY-MM-DD"))) return 2;
  return 0;
});
const getButtonText = computed(() => {
  return {
    0: props.buttonText,
    1: "已使用",
    2: "已过期",
  }[getCouponStatus.value];
});
const getCouponType = computed(() => {
  // 1=现金券,2=赠送券,3=折扣券,4=VIP折扣券
  return {
    1: "现金券",
    2: "赠送券",
    3: "折扣券",
    4: "VIP折扣券",
  }[props.item.type];
});
</script>
<style scoped lang="less">
.coupon-item {
  width: 100%;
  height: 120px;
  background: #f54665;
  overflow: hidden;
  border-radius: 10px;
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  padding: 8px 0px 8px 10px;
  &:first-child {
    margin-top: 0 !important;
  }
  position: relative;
  &:before {
    content: "";
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    width: 20px;
    height: 20px;
    background-color: #f54665;
    border-radius: 50%;
    z-index: 999;
  }
  .left {
    background: #fff;
    border-radius: 15px 50px 50px 15px;
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    position: relative;

    &::before {
      content: "";
      position: absolute;
      right: 40px;
      top: 0%;
      transform: translateY(-50%) translateX(50%);
      width: 20px;
      height: 20px;
      background-color: #f54665;
      border-radius: 50%;
    }
    // 第2个after 伪类  右下角红色圆点
    &::after {
      content: "";
      position: absolute;
      right: 40px;
      bottom: 0;
      transform: translateY(50%) translateX(50%);
      width: 20px;
      height: 20px;
      background-color: #f54665;
      border-radius: 50%;
    }

    .inner {
      padding: 10px 0px 10px 15px;
      height: 100%;
      width: calc(100% - 40px);
      // 右边设置为红色圆点
      border-right: #f54665 2px dashed;
      position: relative;
      .name {
        font-size: @font-size-lg;
        font-weight: 500;

        overflow: hidden;
      }
      .desc {
        margin-top: 5px;
        font-size: @font-size-sm;
        color: #808080;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .time {
        position: absolute;
        bottom: 5px;
        left: 15px;
        font-size: @font-size-sm;
        color: #cfcfcf;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    .price {
      color: #fff;
      font-weight: 500;
      width: 100%;
      text-align: center;
      line-height: 36px;
      span {
        font-size: 28px !important;
      }
    }

    position: relative;

    .button {
      color: #fff;
      background-color: @theme-color;
      height: 30px !important;
      width: 60px !important;
      border-radius: 5px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.disabled {
        background-color: #bbb9b9;
      }
    }
  }
}
</style>
