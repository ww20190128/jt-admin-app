<template>
  <div class="title-progress">
    <!-- 标题 -->
    <div
      class="title"
      :style="titleStyle"
    >
      <i
        class="icon fa"
        :class="[icon]"
      ></i>
      {{title}}
    </div>
    <!-- 进度条 -->
    <div class="progress-content">
      <div class="progress">
        <div
          class="progress-value"
          :style="progressStyle"
        ></div>
      </div>
      <div class="value">{{value}}</div>
    </div>
    <!-- 内容 -->
    <div class="text-content">
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleProgress",
  props: {
    color: {
      type: String,
      default: "#F6727E",
    },
    value: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const { color, value } = props;
    const titleStyle = {
      color,
    };
    const progressStyle = {
      backgroundColor: color,
      width: `${value}%`,
    };
    return {
      titleStyle,
      progressStyle,
    };
  },
};
</script>

<style lang="less" scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  .icon {
    font-size: 22px;
  }
}
.progress-content {
  font-size: 15px;
  margin: 5px 0;
  .progress {
    height: 12px;
    border-radius: 0 12px 12px 0;
    position: relative;
    background-color: #f1eff2;
    flex: 1;
    .progress-value {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 0 12px 12px 0;
    }
  }
  .value {
    padding-left: 5px;
  }
  .align-center();
}
.text-content {
  padding-bottom: @padding-base;
  line-height: 26px;
  font-size: 15px;
  color: #8e8c8f;
}
</style>