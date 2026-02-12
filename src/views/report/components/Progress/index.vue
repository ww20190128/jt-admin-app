<template>
  <div class="progress">
    <div class="left">{{ title }}</div>
    <!-- 进度条 -->
    <div class="center">
      <div class="progress-bar">
        <div class="progress-value" :style="progressStyle"></div>
      </div>
      <!-- 文字内容 -->
      <div class="progress-text">
        <slot>
        </slot>
      </div>
    </div>
    <div class="right">{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: "Progress",
  props: {
    title: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#9A9BF7",
    },
    value: {
      type: [Number, String],
      default: 0,
    },
  },
  setup(props) {
    const { color, value } = props;
    const titleStyle = {
      color,
    };
    const progressStyle = {
      backgroundColor: color,
      width: `${value > 100 ? 100 : value}%`,
    };
    return {
      titleStyle,
      progressStyle,
    };
  },
};
</script>

<style lang="less" scoped>
.progress {
  overflow: hidden;
  display: flex;
  font-size: @font-size-base;
  color: @light-black;
  padding-bottom: @padding-base;
  padding-right: 5px;

  .left {
    text-align: left;
    font-weight: bold;
    width: 80px;
    overflow: hidden;
  }

  .right {
    overflow: hidden;
    text-align: right;
    width: 50px;
    font-size: @font-size-sm;
  }

  .center {
    flex: 1;
    .progress-bar {
      font-size: 15px;
      margin: 5px 0;
      font-weight: bold;
      height: 5px;
      .align-center();
      height: 5px;
      border-radius: 0 10px 10px 0;
      position: relative;
      background-color: #f1eff2;
      flex: 1;
      .progress-value {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 0 10px 10px 0;
      }
    }

    .progress-text {
      color: #666666;
      margin-bottom: 8px;
    }
  }
}
</style>