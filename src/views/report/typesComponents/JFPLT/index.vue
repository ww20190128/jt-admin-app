<template>
  <component :is="components[data.setting.pl_type]" :data="data"></component>
</template>

<script>
import { reactive, toRefs } from "vue";
import JFPLT01 from "./01";
import JFPLT02 from "./02";
import JFPLT03 from "./03";
import JFPLT04 from "./04";
import JFPLT05 from "./05";
import JFPLT06 from "./06";
export default {
  name: "ZJGJF",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    JFPLT01,
    JFPLT02,
    JFPLT03,
    JFPLT04,
    JFPLT05,
    JFPLT06,
  },
  setup() {
    const state = reactive({
      components: {
        1: "JFPLT01",
        2: "JFPLT02",
        3: "JFPLT03",
        4: "JFPLT04",
        5: "JFPLT05",
        6: "JFPLT06",
      },
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>