<template>
  <van-overlay :show="show" class="pc-red-packet">
    <div :class="{ zoom: zoom }" class="pc-content" :style="style">
      <div class="pc-close" @click="close">
        <van-icon name="close" />
      </div>
      <div class="pc-top">
        <h1 class="pc-title">恭喜你获得<span>满额</span>红包</h1>
        <div class="pc-amount">
          立减 <span>{{ redPacketConfig?.value1 }}</span
          >元
        </div>
        <div class="pc-text">据说只有10%的用户获得</div>
      </div>
      <div class="pc-qr">
        <VueQr :text="qrUrl" :size="200" :margin="10"></VueQr>
        <div class="pc-qrloading" v-if="!qrUrl">
          <van-loading size="22px" vertical>二维码加载中...</van-loading>
        </div>
      </div>
      <div class="pc-bottom">
        <div class="pc-timer">
          <van-count-down :time="time" millisecond>
            <template #default="timeData">
              <span class="pc-text">红包于</span>
              <span class="pc-block">{{
                String(timeData.minutes).padStart(2, "0")
              }}</span>
              <span class="pc-block">{{
                String(timeData.seconds).padStart(2, "0")
              }}</span>
              <span class="pc-block">{{
                timeData.milliseconds.toString().slice(0, 2)
              }}</span>
              <span class="pc-text">后失效</span>
            </template>
          </van-count-down>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script setup>
import { computed, watch, ref } from "vue";
import redPacketPc from "@/assets/images/redpacket-pc.png";
import VueQr from "vue-qr/src/packages/vue-qr";
import { useRoute } from "vue-router";
import { updateTestOrder } from "@/api/testPaper";

const props = defineProps({
  redPacketConfig: {
    type: Object,
    default: () => ({}),
  },
  show: {
    type: Boolean,
    default: false,
  },
  qrUrl: {
    type: String,
  },
});
const route = useRoute();
const zoom = ref(false);
const { testOrderId } = route.query;
const emit = defineEmits(["update:show"]);
const style = computed(() => ({
  backgroundImage: `url(${redPacketPc})`,
}));

watch(
  () => props.show,
  async (show) => {
    setTimeout(
      () => {
        zoom.value = !zoom.value;
      },
      show ? 200 : 0
    );
    if (show) {
      await updateTestOrder({
        testOrderId,
        redPacketStatus: 1,
      });
    }
  }
);
const time = 3 * 60 * 1000;
// 关闭
async function close() {
  emit("update:show", false);
  await updateTestOrder({
    testOrderId,
    redPacketStatus: 8,
  });
}
</script>
<style scoped lang="less">
.pc-red-packet {
  width: 90vw;
  overflow: hidden;
  z-index: 2000;
  .pc-content {
    position: absolute;
    top: 50vh;
    left: 50%;
    margin-top: -350px;
    margin-left: -355px;
    width: 700px;
    height: 710px;
    padding: 60px 0;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: scale(0, 0);
    transition: all 0.3s;

    &.zoom {
      transform: scale(1, 1);
    }

    .pc-close {
      position: absolute;
      right: 70px;
      top: 70px;
      font-size: 36px;
      color: #fff;
      cursor: pointer;
    }

    .pc-qr {
      height: 200px;
      width: 200px;
      position: relative;
      margin: 0 auto;
      border-radius: 10px;
      overflow: hidden;

      .pc-qrloading {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: rgba(#fff, 0.9);
        position: absolute;
        left: 0;
        bottom: 0;

        :deep(.van-loading) {
          color: rgba(#000, 0.7);

          .van-loading__text {
            font-size: 16px;
            color: rgba(#000, 0.7);
          }
        }
      }
    }

    .pc-top {
      padding-top: 110px;
      text-align: center;

      .pc-title {
        color: #fff;
        font-size: 28px;
        padding-bottom: 10px;

        span {
          font-size: 30px;
          color: #f6ff00;
        }
      }

      .pc-amount {
        color: #f6ff00;

        font-size: 24px;

        span {
          font-size: 48px;
          font-weight: bold;
        }
      }

      .pc-text {
        font-size: 14px;
        color: #fff;

        span {
          font-size: 18px;
          color: red;
          font-weight: 600;
        }
      }
    }

    .pc-bottom {
      padding-bottom: 90px;

      .pc-text {
        font-size: 16px;
        color: #f7c793;
        text-align: center;

        span {
          font-size: 16px;
          color: #fff;
        }
      }

      .pc-timer {
        text-align: center;
        padding-bottom: 15px;

        .pc-block {
          display: inline-block;
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          background-color: #fff;
          font-size: 12px;
          margin: 0 4px;
          border-radius: 4px;
        }

        .pc-text {
          color: #fff;
          padding-left: 4px;
          font-size: 12px;
        }
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

.zoom {
  &-enter-active {
    animation: enter 0.3s both ease-out;
  }

  &-leave-active {
    animation: leave 0.3s both ease-in;
  }
}

@keyframes enter {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes leave {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
