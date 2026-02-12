<template>
  <div class="RW">
    <!-- 瑞文-普通 -->
    <RW01
      v-if="data.ruiwen_ord && data.ruiwen_ord?.length !==0"
      :data="data.ruiwen_ord"
    />
    <!-- 瑞文-高级 -->
    <RW02
      v-if="data.ruiwen_adv && data.ruiwen_adv?.length !==0"
      :data="data.ruiwen_adv"
    />

  </div>
</template>

<script>
import RW01 from "./01";
import RW02 from "./02";
export default {
  name: "RW",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    RW01,
    RW02,
  },

  setup() {},
};
</script>

<style lang="less" scoped>

</style>