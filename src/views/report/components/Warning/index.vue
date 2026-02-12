<template>
  <div class="warning" v-if="data">
    <div class="head-warp" :class="[color]"><i class="icon" :class="[icon]"></i>{{ title }}</div>
    <div class="content" v-html="data"></div>
  </div>
</template>

<script>
export default {
  name: "Warning",
  props: {
    title: {
      type: String,
      default: "温馨提示：",
    },
    icon: {
      type: String,
      default: "fa fa-exclamation-circle",
    },
    data: {
      type: String,
    },
    color: {
      type: String,
      default: "blue",
    },
  },
};
</script>

<style lang="less" scoped>
.warning {
  border-radius: 5px 5px 0 0;
  margin: 10px 0;

  .head-warp {
    .icon {
      padding-left: 5px;
      font-size: @font-size-lg;
      margin-right: 5px;
    }
    border-radius: 5px 5px 0 0;
    color: #fff;
    font-size: @font-size-base;
    // background-color: #f5cbcf;
    background-color: #99b8f1;
    height: 30px;
    width: 100%;
    line-height: 30px;
    &.blue {
      background-color: #99b8f1;
      .icon {
        color: #ebe709;
      }
    }
    &.red {
      background-color: #f56970ea;
      .icon {
        color: #ebe71c;
      }
    }
  }

  .content {
    min-height: 60px;
    padding: 5px;
    background: #f5f5f5;
    color: @light-black;
    line-height: 25px;
    font-size: @font-size-sm;
  }
}
</style>