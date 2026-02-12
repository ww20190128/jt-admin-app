<!-- 首页轮播图 -->
<template>
  <div class="swipe">
    <van-swipe :autoplay="3000" indicator-color="#ff5d7d">
      <van-swipe-item v-for="(item, index) in data" :key="index" @click="handleItem(item)">
        <van-image fit="cover" :src="item.url" :key="index">
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
  width: 100%;
  height: auto;
  border-radius: 15px;
  overflow: hidden;

  transform: translateY(0);

  :deep(.van-swipe__indicators) {
    bottom: 15px;
  }


  .van-swipe-item {
    width: 100%;
    height: auto;

    :deep(.van-image) {
      width: 100%;
      height: 100%;
      
      img {
        width: 100%;
        height: 100%;
        border-radius: 15px;

      }
    }
  }
}
</style>