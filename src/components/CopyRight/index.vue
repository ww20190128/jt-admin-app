<template>
  <div class="copy-right" :style="{ backgroundColor }">
    <slot>
      {{ wechatInfo?.copyright }}
      <!-- <p class="practice">{{ wechatInfo?.practice }}</p>
      <div class="privacy-policy" @click="gotoPrivacyPolicy">《隐私政策》</div> -->
    </slot>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

export default {
  name: "CopyRight",
  props: {
    backgroundColor: {
      type: String,
      default: "#F9F9F9",
    },
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const wechatInfo = computed(() => store.getters.wechatInfo);

    function gotoPrivacyPolicy() {
      router.push({
        path: "/privacyPolicy",
        query: {},
      });
    }
    return {
      wechatInfo,
      gotoPrivacyPolicy,
    };
  },
};
</script>

<style lang="less" scoped>
.copy-right {
  width: 100%;
  text-align: center;
  font-size: @font-size-sm;
  color: #c7c7c7;
  margin-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
  margin-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
  padding: 10px 0;
  .practice {
    margin-top: 6px;
    text-align: center;
    font-size: @font-size-sm;
  }
  .privacy-policy {
    margin-top: 6px;
    text-align: center;
    font-size: @font-size-sm;
    color: #007aff;
    cursor: pointer;
  }
}
</style>