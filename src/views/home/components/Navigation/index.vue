<!-- 首页分类 -->
<template>
  <div class="navigation">
    <div
      class="item"
      v-for="item in data.slice(0, 3)"
      :key="item.id"
      @click="handleItem(item)"
    >
      <div
        class="icon fa"
        :class="[item.icon]"
      ></div>
      <div class="text">{{ item.name }}</div>
    </div>
    <div
      class="item"
      @click="handleItem({ id: 0 })"
    >
      <div class="icon fa fa-th-large"></div>
      <div class="text">更多分类</div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  name: "Navigation",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const router = useRouter();
    function handleItem(item) {
      router.push({
        path: "/classify",
        query: {
          id: item.id,
        },
      });
    }
    return {
      handleItem,
    };
  },
};
</script>

<style lang="less" scoped>
.navigation {
  border-radius: @radius-base;
  box-shadow: 0px 0px 2px #d6d6d6;
  margin-top: @padding-base;
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 25%;
    height: 80px;
    padding: @padding-sm 0;
    .pointer();
    .column-space-between();
    align-items: center;

    .icon {
      font-size: 30px;
      color: @theme-color;
    }

    .text {
      font-size: 14px;
    }
  }
}
</style>