<template>
    <van-popup
      v-model:show="visible"
      position="bottom"
      round
    >
      <div class="popup-content">
        <div class="header">
          <div
            class="cancel"
            @click="handleCancel"
          >暂不使用</div>
          <div
            class="confirm"
            @click="handleConfirm"
          >确认</div>
        </div>
        <div class="list">
          <div
            class="item"
            v-for="item in data"
            :key="item.id"
            :class="{ on:item.id === currentCoupon.id }"
            @click="handleItem(item)"
          >
            <div class="left">
              <span class="coupon-type">{{getCouponType(item)}}</span>
              <span class="coupon-title">{{item.couponSubtitle}}</span>
            </div>
            <div class="right">
  
              <!-- 打折券 -->
              <span v-if="item.coupon.type === 3">{{ item.coupon.discount }}折</span>
  
              <!-- 现金券 -->
              <span v-if="item.coupon.type === 1">￥{{ item.coupon.coupon_amount }}</span>
  
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </template>
  
  <script setup>
  import { computed } from "vue";
  
  const emit = defineEmits(["update:show", "update:currentCoupon"]);
  const props = defineProps({
    currentCoupon: {
      type: Object,
      default: () => ({})
    },
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
  });
  const visible = computed({
    get: () => props.show,
    set: (val) => emit("update:show", val),
  });
  function handleCancel() {
    visible.value = false;
    emit("update:currentCoupon", {})
  }
  function handleConfirm() {
    visible.value = false;
  }
  function handleItem(item) {
    emit("update:currentCoupon", item)
  }
  
  function getCouponType(item) {
    // 1=现金券,2=赠送券,3=折扣券,4=VIP折扣券
    return {
      1: "现金券",
      // 2: "赠送券",
      3: "折扣券",
      // 4: "VIP折扣券",
    }[item.coupon.type];
  }
  
  </script>
  
  <style lang="less" scoped>
  .popup-content {
    padding: 20px 24px 30px 24px;
    .header {
      font-size: 16px;
      display: flex;
      justify-content: space-between;
  
      .cancel {
        color: #a6a6a6;
      }
  
      .confirm {
        color: #d43030;
      }
    }
  
    .list {
      max-height: 60vh;
      min-height: 100px;
      .item {
        display: flex;
        justify-content: space-between;
        border-radius: 8px;
        padding: 10px;
        background-color: #d9d9d9;
        margin-top: 16px;
  
        &.on {
          background-color: #ff5d7d;
        }
  
        .left {
          display: flex;
          align-items: center;
  
          .coupon-type {
            font-size: 16px;
            background-color: #feefec;
            display: flex;
            height: 100%;
            padding: 4px 8px;
            align-items: center;
            border-radius: 4px;
            margin-right: 12px;
          }
  
          .coupon-title {
            font-size: 16px;
            color: #fff;
            text-shadow: 0px 1.75px 3.5px rgba(0, 0, 0, 0.25);
          }
        }
  
        .right {
          font-size: 16px;
          color: #fff;
          display: flex;
          align-items: center;
          text-shadow: 0px 1.75px 3.5px rgba(0, 0, 0, 0.25);
        }
      }
    }
  }
  </style>
  