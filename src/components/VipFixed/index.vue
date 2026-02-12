<template>
  <div class="vip-fixed" @click="handleLink">
    <img :src="vipOpen" />
    <span>{{ text }}</span>
  </div>
</template>

<script>
import vipOpen from "@/assets/images/gift012.png";
import { useRouter } from "vue-router";
export default {
  name: "VipFixed",
  props: {
    text: {
      type: String,
      default: "赠送好友",
    },
  },
  setup(_, ctx) {
    const router = useRouter();
    function handleLink() {
      ctx.emit("click");
    }
    return {
      handleLink,
      vipOpen,
    };
  },
};
</script>

<style lang="less" scoped>
.vip-fixed {
  font-size: @font-size-sm;
  color: #323232;
  line-height: 35px;
  height: 35px;
  background-color: #fff;
  border-radius: 50px 0 0 50px;
  position: fixed;
  box-shadow: 0 0 10px rgb(#000, 0.2);
  // right: calc((100vw - 400px) / 2);

  right: 0;

  top: 20%;
  .align-center();
  .pointer();
  animation: give 5s;
  animation-iteration-count: infinite;
  animation-delay: 3s;
  padding-left: 5px;
  padding-right: 5px;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  span {
    padding-left: 0px;
  }

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    width: 4px;
    height: 100%;

    background: #fecc46;

  }
}

@keyframes vip {

  from,
  10%,
  to {
    transform: none;
  }

  12% {
    transform: skewX(-8.5deg) skewY(-8.5deg);
  }

  18% {
    transform: skewX(4.25deg) skewY(4.25deg);
  }

  24% {
    transform: skewX(-2.125deg) skewY(-2.125deg);
  }

  30% {
    transform: skewX(1.5625deg) skewY(1.5625deg);
  }

  36% {
    transform: skewX(-0.78125deg) skewY(-0.78125deg);
  }

  42% {
    transform: skewX(0.390625deg) skewY(0.390625deg);
  }

  48% {
    transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
  }
}

@keyframes give {

  from,
  10%,
  to {
    transform: none;
  }

  12% {
    transform: skewX(-8.5deg) skewY(-8.5deg);
  }

  18% {
    transform: skewX(4.25deg) skewY(4.25deg);
  }

  24% {
    transform: skewX(-2.125deg) skewY(-2.125deg);
  }

  30% {
    transform: skewX(1.5625deg) skewY(1.5625deg);
  }

  36% {
    transform: skewX(-0.78125deg) skewY(-0.78125deg);
  }

  42% {
    transform: skewX(0.390625deg) skewY(0.390625deg);
  }

  48% {
    transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
  }
}
</style>