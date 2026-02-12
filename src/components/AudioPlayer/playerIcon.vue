<template>
  <transition name="el-fade-in">
    <div class="player-icon-warper" v-if="gbPlayerState?.currentItem && gbPlayerState?.state != 'destroy'" @click.stop="onClick">
      <div class="left" @click="gbPlayerState.show = true">
        <img :src="gbPlayerState.currentItem.cover" :class="{ rotating: gbPlayerState?.state == 'playing' }">
      </div>

      <div class="center">
        <!-- <span class="progress">50%</span> -->
      </div>
      <div class="right" @click="handlePlayItem">
        <img :src="gbPlayerState?.state == 'playing' ? pauseImg : playImg"
          :class="gbPlayerState?.state == 'playing' && 'playing'">
      </div>
    </div>
  </transition>
</template>

<script>
import { reactive, toRefs, inject } from "vue";

import playImg from "@/assets/images/icon/play-1.png";
import pauseImg from "@/assets/images/icon/pause-1.png";
export default {
  name: "PlayerIcon",
  setup(props, ctx) {
    let gbPlayer = inject("gbPlayer");
    let gbPlayerState = inject("gbPlayerState");
    // 课程播放切换
    function handlePlayItem(item) {
      gbPlayer.value.toggle();
    }
    return {
      playImg,
      pauseImg,
      gbPlayer,
      gbPlayerState,
      handlePlayItem,
    };
  },
};
</script>
<style lang="less" scoped>
@keyframes rotateAnimation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.player-icon-warper {
  height: 30px;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 0 6px #9795f0;
  cursor: pointer;
  border-radius: 50px;
  position: fixed;
  // transform: translateX(10%);
  right: calc((100vw - 355px) / 2 + 10px);
  bottom: calc(150px + constant(safe-area-inset-bottom));
  bottom: calc(150px + env(safe-area-inset-bottom));
  z-index: 999;
  background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);
  .space-between();

  .left {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 6px #0000001f;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;

      &.rotating {
        animation: rotateAnimation 10s linear infinite;
        transition: transform 0.5s ease;
      }
    }
  }

  .center {
    width: 15px;
    text-align: center;

    .progress {
      padding-left: 2px;
      font-size: @font-size-sm;
      color: #fff;
    }
  }

  .right {
    height: 30px;
    width: 30px;
    border-radius: 50%;

    img {
      height: 100%;
      width: 100%;
    }
  }
}
</style>