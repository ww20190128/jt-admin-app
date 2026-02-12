<template>
  <div class="footer">
    <footer class="footer-fixed">
      <div class="left-warp">
        <div class="item" @click="handleGoHome">
          <img :src="homePlain" />
          <p class="name">测评大厅</p>
        </div>
        <!-- <div class="item" :class="{ disabled: !resultOff }" @click="handleReslut">
          <img :src="resultOff ? result : resultDisabled" />
          <p>结果</p>
        </div> -->
        <div class="item" :class="{ disabled: vipInfo?.vipGiveLimit <= vipInfo?.vipGiveNum }" @click="handleGive">
          <img :src="gift" />
          <p class="name">赠送</p>
        </div>
      </div>
      <div class="right-warp">
        <div v-if="vipInfo?.surplusTestPaperNum && vipInfo?.surplusTestPaperNum > 0" class="button vip"
          @click="handleConfirm">
          免费开始测试
          <div class="text">VIP权益已抵扣</div>
        </div>
        <div class="button" @click="handleConfirm" v-else>立即测试</div>
      </div>
    </footer>
    <div class="placeholder"></div>
  </div>
</template>

<script>
import gift from "@/assets/images/icon/gift.png";
import homePlain from "@/assets/images/icon/icon-home-on.png";
import result from "@/assets/images/result.png";
import resultDisabled from "@/assets/images/result-disabled.png";
import { useRouter } from "vue-router";
export default {
  name: "ActionBar",
  props: {
    resultOff: {
      type: [Boolean, Number],
      default: true,
    },
    vipInfo: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    function handleGoHome() {
      router.push("/home");
    }
    // 立即测试
    function handleConfirm() {

      ctx.emit("confirm");
    }
    // 结果
    function handleReslut() {
      if (!props.resultOff) return;
      ctx.emit("reslutClick");
    }
    // 赠送
    function handleGive() {
      ctx.emit("giveClick");
    }
    return {
      handleGoHome,
      handleConfirm,
      handleReslut,
      handleGive,
      gift,
      homePlain,
      result,
      resultDisabled,
    };
  },
};
</script>

<style lang="less" scoped>
.placeholder {
  height: 50px;
  padding-bottom: constant(safe-area-inset-bottom);
  /* 兼容 iOS < 11.2 */
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box;
}

.footer-fixed {
  max-width: 750PX !important;
  box-shadow: 0px 0px 4px #e8e8e8;
  border-top-left-radius: 10px;
  border-top-right-radius: 30px;
  .fixed-bottom();
  .space-between();
  width: 100%;

  .left-warp {
    padding-left: 10px;
    width: 32%;
  }
  .right-warp {

    box-shadow: 0px 0px 4px #e8e8e8;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    width: 68%;
    height: 45px;
    position: absolute;
    bottom: 0;
    right: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    // padding: 5px @padding-base;
    .button {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      height: 100%;
      color: #fff;
      font-size: 19px;
      font-weight: bold;
      letter-spacing: 5px;
      .align-center();
      justify-content: center;
      background: linear-gradient(to right,
          rgb(255, 111, 140),
          rgb(253, 70, 106));
      // border-radius: 50px;
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        width: 100px;
        height: 4px;
        top: 50%;
        left: -100px;
        background-color: rgba(#fff, 0.4);
        transform: rotate(-45deg);
        animation: blink 1.2s ease-in-out 1s infinite;
      }
    }

    .vip {
      background: linear-gradient(to right,
          rgb(255, 242, 129),
          rgb(231, 202, 0));
      color: #a66300;
      letter-spacing: 1px;
      flex-direction: column;

      .text {
        font-size: @font-size-sm;
        font-weight: normal;
      }
    }
  }

  // 左边
  .left-warp {
    .space-between();
    .item {
     
      overflow: hidden;
      flex: 1;
      .align-center();
      .pointer();
      flex-direction: column;
      justify-content: center;
      font-size: @font-size-sm;

      img {
        width: 21px;
      }
      .name {
        height: 19px;
        overflow: hidden;
      }
    }
  }
}

.disabled {
  color: #dadada;
}

@keyframes blink {
  0% {
    left: -50px;
  }

  100% {
    left: 100%;
  }
}
</style>
