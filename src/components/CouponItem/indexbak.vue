<template>
    <div class="coupon-item">
      <div class="left">
        <div class="name">{{ item.name }}</div>
        <div class="desc">{{ item?.desc }}</div>
        <!-- 有效时间 -->
        <div
          class="time"
          v-show="item?.effectiveEndTime && item?.effectiveEndTime > 0"
        >
          失效时间：
          {{ moment(item.effectiveEndTime * 1000).format("YYYY-MM-DD") }}
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
    background: #F54665;
    // position: relative;
    // background: #fff url("@/assets/images/coupon-02.jpg");
    // background-size: 100% 100%;
    // background-position: left center;
    border-radius: 10px;
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    padding: 15px 25px 15px 30px;
  
    &:first-child {
      margin-top: 0 !important;
    }
  
    .left {
  
      width: 55%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
  
      .name {
        font-size: @font-size-lg;
        font-weight: 500;
      }
  
      .desc {
        font-size: @font-size-sm;
        color: #808080;
        padding: 8px 0px 8px 0;
      }
  
      .time {
        font-size: @font-size-sm;
        color: #cfcfcf;
      }
    }
  
    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
  
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
          background-color: @bg-color !important;
        }
      }
    }
  }
  </style>
  