<template>
  <div class="position-bar">
    <div class="bar" id="bar">
      <div class="left">{{ start }}</div>
      <div class="right">{{ end }}</div>
      <div class="value" :style="valueStyle">
        你:{{ value }}
      </div>
      <div class="multi" :style="multiStyle" v-if="multi?.length && multi[0] && multi[1]">
        <span class="start">{{ multi[0] }}</span>
        <span class="text">多数人</span>
        <span class="end">{{ multi[1] }}</span>
      </div>

    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, reactive, nextTick } from "vue";
export default {
  name: "PositionBar",
  props: {
    value: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "gray",
    },
    start: {
      type: [Number, String],
      default: 0,
    },
    end: {
      type: [Number, String],
      default: 100,
    },
    multi: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const valueStyle = computed(() => {
      return {
        color: props.color,
      };
    });

    const multiStyle = computed(() => {
      return {
        width: `${props.multi[1] - props.multi[0]}%`,
        left: `${props.multi[0]}%`,
      };
    });
    const barLeft = computed(() => `${props.value}%`);
    return {
      valueStyle,
      multiStyle,
      barLeft,
    };
  },
};
</script>
<style lang="less" scoped>
.position-bar {
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px 15px 20px;

  .bar {

    width: 100%;
    // width: 330px;
    height: 8px;
    border-radius: 5px;
    font-size: 14px;
    background-image: linear-gradient(to right, #e3e0e3, v-bind(color));
    color: #cccccc;
    position: relative;

    .left,
    .right,
    .value,
    .multi {
      position: absolute;
    }

    .left {
      left: 0;
      bottom: 12px;
    }

    .right {
      right: 0;
      bottom: 12px;
    }

    .value {
      bottom: 30px;
      width: 40px;
      text-align: center;
      color: @theme-color;
      left: calc(v-bind(barLeft) - 20px);

      &::after {
        position: absolute;
        content: "";
        left: 50%;
        top: -10px;
        transform: translate(-50%, 100%);
        width: 0px;
        height: 0px;
        border-top: 20px solid #a3a0a3;
        border-bottom: 5px solid transparent;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
      }
    }

    .multi {
      width: 100%;
      height: 8px;
      top: 0;
      background-color: #78a0e9;
      color: #78a0e9;
      border-radius: 5px;
      z-index: 2;
      position: relative;

      .text,
      .start,
      .end {
        position: absolute;
        top: 12px;
        line-height: 20px;
        font-size: 12px;
      }

      .text {
        width: 100%;
        left: 0;
        text-align: center;
      }

      .start {
        left: 0;
        transform: translateX(-50%);
      }

      .end {
        right: 0;
        transform: translateX(50%);
      }
    }

  }
}
</style>