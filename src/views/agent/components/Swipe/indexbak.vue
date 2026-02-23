<!-- 首页轮播图 -->
<template>
  <div class="swipe">
    <van-swipe
      :autoplay="3000"
      indicator-color="#ff5d7d"
    >
      <van-swipe-item
        v-for="(item,index) in data"
        :key="index"
        @click="handleItem(item)"
      >
        <van-image
          fit="cover"
          :src="item.url"
          :key="index"
        >
        </van-image>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
import { useRouter } from "vue-router";
export default {
  name: "Swipe",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const router = useRouter();
    function handleItem(item) {
      router.push(item.goto);
    }
    return {
      handleItem,
    };
  },
};
</script>

<style lang="less" scoped>
.swipe {

  border-radius: @radius-base;
  overflow: hidden;
  height: 138px;
  transform: translateY(0);
  :deep(.van-swipe__indicators) {
    bottom: 15px;
  }

  .van-swipe-item {
    height: 138px;

    :deep(.van-image) {
      width: 100%;
      height: 138px;
      img {
        border-radius: @radius-base;
        width: 100%;
      }
    }
  }
}
</style>