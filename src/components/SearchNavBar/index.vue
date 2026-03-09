<template>
  <view class="search-nav-bar">
    <view class="left">
      <div class="logo" @click="$router.push('/')">
        <img :src="wechatInfo?.logo" />
      </div>
      <text>{{ wechatInfo?.slogan }}</text>
      <!-- -->
      <div class="attention-button animation-button" @click="handleAddUser">
        <span>开卡~</span>
      </div>

      <div class="tryout-user-button" @click="gotoTryoutUser">
        <span>体验用户</span>
      </div>
    </view>
    <view class="right" v-if="false">
      <div @click="onSearch" class="search">
        <i class="icon fa fa-search"></i>
      </div>
      <input
        type="text"
        @input="onInput"
        @keyup.enter="onSearch"
        enterkeyhint="search"
        v-model="inputValue"
        placeholder="搜索"
      />
    </view>
  </view>
  <!-- 提示开通VIP -->
  <!-- 非微信用户进入 微信用户才可以进入的页面时进行拦截 -->
  <WeChatQr v-model:show="attentionVisible" title="长按扫码关注">
    <template #subhead>
      <p class="subhead">领福利~</p>
    </template>
    <div class="qr-text">
      <p>解锁更多精彩内容</p>
    </div>
  </WeChatQr>
</template>

<script>
import { useStore } from "@/store";
import WeChatQr from "@/components/WeChatQr";
import { reactive, toRefs, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
export default {
  name: "SearchNavBar",

  props: {
    value: {
      type: [String, Number],
      default: "",
    },
  },
  components: {
    WeChatQr,
  },

  setup(props, ctx) {
    const inputValue = computed({
      get: () => props.value,
      set: (value) => ctx.emit("update:value", value),
    });
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      attentionVisible: false,
    });
    function onSearch() {
      ctx.emit("onSearch");
    }
    function onInput(e) {
      ctx.emit("update:value", e.target.value);
    }
    const wechatInfo = computed(() => store.getters.wechatInfo);
    function handleAddUser() {
      router.push({
        path: "/account/create",
        query: {},
      });
    }
    function gotoTryoutUser() {
      router.push({
        path: "/trialAccount/list",
        query: {},
      });
    }
    return {
      ...toRefs(state),
      onSearch,
      onInput,
      wechatInfo,
      inputValue,
      handleAddUser,
      gotoTryoutUser,
    };
  },
};
</script>

<style lang="less" scoped>
.van-icon {
  display: flex;
  align-items: center;
}

.search-nav-bar {
  z-index: 999 !important;
  position: fixed;
  overflow: hidden;
  width: 100%;
  max-width: 750px !important;
  height: 50px;
  background-color: @bg-color;
  padding: 0 @padding-base;
  .align-center();
  .space-between();

  .left {
    height: 100%;
    .align-center();
    .pointer();
    font-size: @font-size-base;
    font-weight: bold;

    text {
      padding: 0 5px;
    }

    .logo {
      border-radius: 50%;
      width: 30px;
      height: 30px;

      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
      }
    }
  }

  .right {
    width: 110px;
    border-radius: 15px;
    // background-color: #e4e4e4;
    background-color: #ebebeb;
    height: 26px;
    line-height: 26px;
    .align-center();
    .space-between();
    padding: 0 @padding-sm;

    .icon {
      margin-right: 5px;
      font-size: @font-size-base;
      text-align: center;
      color: @gray-color;
      line-height: 28px;
    }

    input {
      text-align: left;
      width: 100px;
      background: transparent;
      padding: 0;
      border: none;
      color: @gray-color;
      font-size: @font-size-base;
    }
  }
}

.subhead {
  color: @theme-color;
  font-size: 15px;
  padding-bottom: 5px;
  text-align: center;
}

.qr-text {
  color: #48ad4c;
  line-height: 25px;

  p {
    font-size: @font-size-base;
    text-align: center !important;
  }
}
.tryout-user-button {
  position: absolute;
  right: 30px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  -o-user-select: none;
  user-select: none;
  padding: 0 5px;
  background: #8ec5fc;
  cursor: pointer;
  color: #fff;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 5px;
  span {
    font-size: @font-size-base;
    font-weight: 500;
  }
}
// 关注按钮
.attention-button {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  -o-user-select: none;
  user-select: none;
  padding: 0 5px;
  background-image: linear-gradient(270deg, #e0c3fc 0%, #8ec5fc 100%);
  cursor: pointer;
  color: #fff;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 50px;
  margin-left: 2px;

  &.animation-button {
    animation: scale 5s infinite;
  }

  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1), 0px 2px 2px rgba(0, 0, 0, 0.1);

  span {
    font-size: @font-size-sm;
    font-weight: 500;
  }
}
</style>