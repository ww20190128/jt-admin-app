<template>
    <div class="position-bar">
      <div
        class="bar"
        id="bar"
      >
        <div class="left">{{start}}</div>
        <div class="right">{{end}}</div>
        <div
          class="value"
          :style="valueStyle"
        >
          你:{{value}}
        </div>
        <div
          class="multi"
          :style="multiStyle"
          v-if="multi?.length && multi[0] && multi[1]"
        >
          <span class="start">{{multi[0]}}</span>
          <span class="text">多数人</span>
          <span class="end">{{multi[1]}}</span>
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
    background-color: #f0556e;
    width: 100%;
    padding: 50px 0 15px 0;
    .bar {
      width: 330px;
      height: 5px;
      border-radius: 20px;
      font-size: 13px;
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
        bottom: 8px;
      }
      .right {
        right: 0;
        bottom: 8px;
      }
      .value {
        bottom: 30px;
        text-align: center;
        color: @theme-color;
        // left: calc(v-bind(barLeft) - 20px);
        &::after {
          position: absolute;
          content: "";
          left: 50%;
          top: -5px;
          transform: translate(-50%, 100%);
          width: 0px;
          height: 0px;
          border-top: 20px solid #f0556e;
          border-bottom: 5px solid transparent;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
        }
      }
      .multi {
        height: 5px;
        top: 0;
        background-color: #78a0e9;
        color: #78a0e9;
        z-index: 2;
        position: relative;
  
        .text,
        .start,
        .end {
          position: absolute;
          
          line-height: 20px;
        }
        .text {
          width: 100%;
          left: 0;
          top: 8px !important;
          text-align: center;
        }
        .start {
          font-size: 13px;
          color: #cccccc;
          left: 0;
          top: -20px;
          transform: translateX(-50%);
        }
        .end {
          font-size: 13px;
          color: #cccccc;
          right: 0;
          top: -20px;
          transform: translateX(50%);
        }
      }
    }
  }
  </style>