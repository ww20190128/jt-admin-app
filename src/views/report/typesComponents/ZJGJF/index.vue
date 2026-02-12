<template>
  <component :is="components[data.jifen_guize]" :data="data"></component>
</template>

<script>
import { reactive, toRefs } from "vue";
import ZJGJF01 from "./01";
import ZJGJF02 from "./02";
import ZJGJF03 from "./03";
import ZJGJF04 from "./04";
export default {
  name: "ZJGJF",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ZJGJF01,
    ZJGJF02,
    ZJGJF03,
    ZJGJF04
  },
  setup() {
    const state = reactive({
      components: {
        1: "ZJGJF01",
        2: "ZJGJF02",
        3: "ZJGJF03",
        4: "ZJGJF04",
      },
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>