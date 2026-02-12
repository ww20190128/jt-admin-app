<template>
  <div
    class="qr-card"
    :class="{'vertical':vertical}"
  >
    <div class="left">
      <img :src="wechatInfo?.wechat_qrcode">
    </div>
    <div class="right">
      <div
        class="title"
        v-if="showTitle"
      >{{wechatInfo?.wechat_qrcode_title}}</div>
      <div class="subhead">{{wechatInfo?.wechat_qrcode_desc}}</div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "@/store";
export default {
  name: "index",
  props: {
    vertical: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const store = useStore();
    const wechatInfo = computed(() => store.getters.wechatInfo || {});

    return {
      wechatInfo,
    };
  },
};
</script>

<style lang="less" scoped>
.vertical {
  flex-direction: column;
}
.qr-card {
  border-top: 1px solid #f3f3f3;
  height: 110px;
  padding: @padding-base 0;
  .align-center();
  .left {
    height: 88px;
    width: 88px;
    img {
      width: 100%;
      pointer-events: auto;
    }
  }
  .right {
    font-size: @font-size-base;
    flex: 1;
    height: 100%;
    padding-left: @padding-base;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    line-height: 25px;
    .title {
      font-weight: bold;
    }
    .subhead {
      color: @light-black;
    }
  }
}
</style>