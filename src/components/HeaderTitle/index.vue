<template>
  <div class="header-title">
    <div class="left-wrap">
      <slot>
        <span :class="{ 'hot': !plain }">{{ leftStr }}</span>
        <span>{{ rightStr }}</span>
      </slot>
      <img class="icon-img" :src="iconImg" v-if="!plain">
    </div>

    <div class="right-wrap">
      <slot name="right" class="sub-Title">

      </slot>
    </div>
  </div>
</template>

<script>

import { computed } from "vue";
export default {
  name: "HeaderTitle",
  props: {
    title: {
      type: String,
      default: "",
    },
    plain: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
    iconImg: {
      type: String,
      default: "",
    },

    iconFont: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const leftStr = computed(() => props.title.slice(0, 2));
    const rightStr = computed(() => props.title.slice(2, 4));
    return {
      leftStr,
      rightStr,
    };
  },
};
</script>

<style lang="less" scoped>
.header-title {
  .space-between();
  margin: 20px 0 10px 0;
  .left-wrap {
    .hot {
      color: @theme-color;
    }

    .icon-img {
      height: 25px !important;
      margin-left: 2px !important;
      width: auto !important;
    }

    .icon {
      font-size: 12px !important;
      padding-left: 5px;
      color: #9A9AF7;
    }


    span {
      font-size: 20px;
      font-weight: bold;
    }

    position: relative;

    // &::after {
    //   content: '';
    //   display: block;
    //   width: 50%;
    //   height: 6px; // 下划线的粗细
    //   background-color: #d4ad0f; // 下划线的颜色
    //   opacity: 0.5;
    //   position: absolute;
    //   bottom: 0px; // 调整下划线与文字的距离
    //   left: 10px;
    //   // transform: translateX(50%);
    // }



  }

  .right-wrap {

    display: flex;
    color: @gray-color;
    display: flex;
    align-items: flex-end;


  }

}
</style>