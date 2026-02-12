<template>
  <van-dialog
    :showConfirmButton="false"
    v-bind="$attrs"
    class="red-packet-dialog"
    transition="bounce"
  >
    <div v-show="props.redPacketType == 1" class="content" :style="style">
      <div class="top">
        <h1 class="title">恭喜获得红包！</h1>
        <div class="amount">
          <span>{{ props.redPacketConfig?.value1 }}</span
          >元
        </div>
        <div class="text">
          可享受
          <span>{{ props.redPacketConfig?.discount1 }}折</span> 查看专属报告
        </div>
      </div>
      <div class="bottom">
        <div class="timer-text">未解锁的报告将于</div>
        <div class="timer">
          <van-count-down :time="time" millisecond>
            <template #default="timeData">
              <!-- String(timeData.hours).padStart(2, '0') -->
              <span class="block">{{
                String(timeData.hours).padStart(2, "0")
              }}</span>
              <span class="colon">:</span>
              <span class="block">{{
                String(timeData.minutes).padStart(2, "0")
              }}</span>
              <span class="colon">:</span>
              <span class="block">{{
                String(timeData.seconds).padStart(2, "0")
              }}</span>
              <span class="colon">:</span>
              <span class="block">{{
                timeData.milliseconds.toString().slice(0, 2)
              }}</span>
              <span class="text">后失效</span>
            </template>
          </van-count-down>
        </div>
        <div class="button confirm" @click="handleConfirm">
          {{ props.priceInfo.one }}解锁{{ redPacketText }}
        </div>
        <div class="button" @click="handleReject">彻底放弃报告</div>
      </div>
    </div>
    <div v-show="props.redPacketType == 2" class="content blin" :style="style">
      <div class="top">
        <h1 class="title">恭喜你获得大额红包！</h1>
        <div class="amount">
          <span>{{ props.redPacketConfig.value2 }}</span
          >元
        </div>
      </div>
      <div class="bottom">
        <div class="text">
          <div>你已获得 <span>满额红包</span></div>
          <!--
                                <div>查看报告 <span>仅需{{ props.priceInfo.two }}元</span> 了</div>
                                <div>错过再也没有了</div>
                                -->
        </div>
        <div class="button confirm" @click="handleConfirm">点击查看报告</div>
        <div class="button" @click="handleCancel">退出</div>
      </div>
    </div>
  </van-dialog>
  <!-- </div>
            </transition>
        </div>
    </transition> -->
</template>

<script setup>
import { computed } from "vue";
import redPacket from "@/assets/images/red-packet.png";
import redPacketBlin from "@/assets/images/red-packet-blin.png";
import { useRoute } from "vue-router";
import { updateTestOrder } from "@/api/testPaper";
const props = defineProps({
  redPacketConfig: {
    type: Object,
    default: () => ({}),
  },
  // 价格信息
  priceInfo: {
    type: Object,
    default: 0,
  },
  // 红包类型 1第一次弹出红包 2第二次弹出红包
  redPacketType: {
    type: Number,
    default: 0,
  },
  // show: {
  // 	type: Boolean,
  // 	default: false
  // }
  // 字符串状态值
  redPacketText: {
    type: String,
    default: "专属报告",
  },
});

const route = useRoute();
const { testOrderId } = route.query;
const emit = defineEmits([
  "update:redPacketType",
  "update:show",
  "confirm",
  "cancel",
]);
const style = computed(() => ({
  backgroundImage: `url(${
    props.redPacketType === 1 ? redPacket : redPacketBlin
  })`,
}));
const time = 10 * 60 * 1000;

// 残忍拒绝
async function handleReject() {
  emit("update:show", false);
  // 第二个红包金额为0不弹出红包
  if (!Number(props.redPacketConfig?.value2)) return;

  setTimeout(() => {
    emit("update:redPacketType", 2);
    sessionStorage.setItem("redPacketType", 2);
    emit("update:show", true);
  }, 300);
  await updateTestOrder({
    testOrderId,
    redPacketStatus: 2,
  });
}
// 去支付
async function handleConfirm() {
  emit("confirm");
  await updateTestOrder({
    testOrderId,
    //  1 解锁报告 3 领取报告 red_packet_btn
    redPacketStatus: props.redPacketType == 1 ? 1 : 3,
  });
}
// 退出
async function handleCancel() {
  emit("cancel");
  await updateTestOrder({
    testOrderId,
    redPacketStatus: 4,
  });
}
</script>

<style lang="less">
.red-packet-dialog {
  background-color: transparent !important;
  max-width: 100vw;
  width: 375px;
}

.bounce-enter-from {
  transform: translate3d(-50%, -50%, 0) scale(0.3);
  opacity: 0;
}

.bounce-leave-active {
  transform: translate3d(-50%, -50%, 0) scale(0.3);
  opacity: 0;
}
</style>

<style scoped lang="less">
.content {
  width: 375px;
  height: 560px;
  margin: 0 auto;
  background-size: 420px 560px;
  background-position: center center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &.blin {
    .amount {
      padding-top: 16px;
    }
  }

  .top {
    padding-top: 110px;
    text-align: center;

    .title {
      color: #e38000;
      font-size: 18px;
    }

    .amount {
      color: red;
      font-weight: 600;
      font-size: 16px;

      span {
        font-size: 52px;
      }
    }

    .text {
      font-size: 16px;
      color: #c37d3f;

      span {
        font-size: 18px;
        color: red;
        font-weight: 600;
      }
    }
  }

  .bottom {
    padding-bottom: 90px;

    .timer-text {
      font-weight: bold;
      color: #fff;
      font-size: 16px;
      text-align: center;
      padding-bottom: 8px;
    }

    .text {
      font-size: 16px;
      color: #f7c793;
      text-align: center;

      span {
        font-size: 16px;
        color: #fff;
      }
    }

    .button {
      width: 180px;
      height: 40px;
      color: #f7b352;
      font-size: 18px;
      border: 1px solid #d49c46;
      border-radius: 40px;
      line-height: 40px;
      text-align: center;
      margin: auto;

      &.confirm {
        width: 200px;
        animation: scale 1s infinite;
        color: #c72e2d;
        border: none;
        box-shadow: 0 4px 10px -5px rgba(#000, 1);
        background: linear-gradient(to bottom, #f7cda9, #e8ab6e);
        margin: 16px auto;
      }
    }

    .timer {
      font-size: 12px;
      text-align: center;

      .colon {
        display: inline-block;
        padding: 0 2px;
        color: #fff;
      }

      .block {
        color: #fff;
        display: inline-block;
        width: 22px;
        height: 22px;
        text-align: center;
        line-height: 22px;
        background-color: #b63437;
        border: 1px solid #fa455f;
      }

      .text {
        color: #fff;
        padding-left: 4px;
      }
    }
  }
}

@keyframes scale {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

// .zoom {
// 	&-enter-active {
// 		animation: enter 0.3s both ease-out;
// 	}

// 	&-leave-active {
// 		animation: leave 0.3s both ease-in;
// 	}
// }

// @keyframes enter {

// 	0% {
// 		transform: scale(0);
// 	}

// 	50% {
// 		transform: scale(0.5);
// 	}

// 	100% {
// 		transform: scale(1);
// 	}
// }

// @keyframes leave {
// 	0% {
// 		opacity: 1;
// 	}

// 	100% {
// 		opacity: 0;
// 	}
// }
</style>
