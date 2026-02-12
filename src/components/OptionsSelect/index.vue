<template>
  <van-popup
    v-model:show="visible"
    closeable
    position="bottom"
    :style="style"
  >
    <div class="popup-content" v-if="versionConfig">
      <div class="title">{{versionConfig?.text}}</div>
      <div class="options">

        <van-row gutter="15">
          <van-col
            span="12"
            v-for="item in versionConfig?.options"
            :key="item.id"
            @click="handleSelectItem(item)"
          >
            <div
              class="item"
              :class="{'active':current===item.id}"
            >
              <img :src="item.img">
              <p>{{item.name}}</p>
            </div>
          </van-col>

        </van-row>

      </div>
      <div
        class="button"
        @click="confirm"
      >开始测试</div>
    </div>
  </van-popup>
</template>

<script>
import { computed } from "vue";
export default {
  name: "OptionsSelect",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    current: {
      type: [String, Number, undefined],
    },
    versionConfig: {
      type: Object,
      default: () => {},
    },
    lastTestOrderInfo: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, ctx) {
    const style = {
      height: "100%",
      backgroundColor: "#F5F5F5",
    };
    const visible = computed({
      get() {
        return props.show;
      },
      set(val) {
        ctx.emit("update:show", val);
      },
    });
    function handleSelectItem(item) {
      ctx.emit("update:current", item.id);
    }
    function confirm() {
      ctx.emit("confirm");
    }
    return {
      style,
      handleSelectItem,
      confirm,
      visible,
    };
  },
};
</script>

<style lang="less" scoped>
.popup-content {
  padding-top: 80px;
  .title {
    font-size: 22px;
    text-align: center;
    font-weight: bold;
    color: @light-black;
  }
  .options {
    display: flex;
    justify-content: center;
    padding: 50px 0;
    .item {
      width: 150px;
      height: 180px;
      border-radius: 15px;
      background-color: #fff;
      padding: 25px;
      border: 3px solid #f5f5f5;
      .align-center();
      flex-direction: column;
      img {
        width: 100%;
      }
      p {
        font-size: @font-size-lg;
        padding-top: 18px;
      }
    }
    .active {
      border-color: @theme-color;
    }
  }
  .button {
    background-image: linear-gradient(to right, #ff6f8c, #fd466a);
    font-weight: bold;
    font-size: 18px;
    height: 40px;
    width: 180px;
    border-radius: 40px;
    color: #fff;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    letter-spacing: 5px;
  }
}
</style>