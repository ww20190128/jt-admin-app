<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from "vue";
const props = defineProps({
  percentage: {
    type: Number,
  },
  color: {
    type: String,
  },
});
const progressValues = computed(() => {
  return Math.floor((props.percentage / 100) * 36);
});
const show = reactive([]);
function getItemStyle(index, num) {
  const value = 360 / num;
  return {
    transform: `translate(-50%, 0) rotate(${value * index}deg)`,
  };
}
const containerRef = ref();

function sleep(timeout = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}
async function createAnimation() {
  nextTick(async () => {
    const rect = containerRef.value.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      for (let index = 0; index < progressValues.value; index++) {
        await sleep();
        show[index] = true;
      }
    }
  });
}
const getBoforeStyle = computed(() => ({
  boxShadow: `0 0 20px 4px ${props.color}`,
}));
const getAfterStyle = computed(() => ({
  boxShadow: `inset 0 0 20px 4px ${props.color}`,
}));
function scroll() {
  createAnimation();
}
onMounted(() => {
  createAnimation();
  window.addEventListener("scroll", scroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", scroll);
});
</script>

<template>
  <div class="rotate-wrapper" ref="containerRef">
    <div class="rotate">
      <div class="inner">
        <div class="inner-content">
          <div
            class="inner-item"
            v-for="(item, index) in 22"
            :key="index"
            :style="getItemStyle(index, 22)"
          ></div>
        </div>
        <div class="before" :style="getBoforeStyle"></div>
        <div class="after" :style="getAfterStyle"></div>
      </div>
      <div
        class="item"
        v-for="(item, index) in progressValues"
        :key="index"
        :style="[getItemStyle(index, 36), { opacity: show[index] ? 1 : 0 }]"
      ></div>
      <div class="value">{{ percentage }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@color: v-bind(color);
.rotate-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .rotate {
    width: 200px;
    height: 200px;
    font-size: 12px;
    position: relative;
    border-radius: 50%;
    .value {
      font-size: 24px;
      font-weight: bold;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: @color;
    }
    .inner {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160px;
      height: 160px;
      border: 3px solid @color;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;

      .before,
      .after {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        opacity: 0.5;
      }
      .before {
        width: 160px;
        height: 160px;
      }
      .after {
        width: 157px;
        height: 157px;
      }
      .inner-content {
        width: 140px;
        height: 140px;
        position: relative;
        border-radius: 50%;
        .inner-item {
          width: 10px;
          height: 3px;
          background-color: @color;
          position: absolute;
          top: 0;
          left: 50%;
          transform-origin: 4px 70px;
        }
      }
    }
    .item {
      width: 8px;
      height: 12px;
      background-color: @color;
      position: absolute;
      top: 0;
      left: 50%;
      transform-origin: 4px 100px;
      transition: opacity 300ms linear;
    }
  }
}
</style>
