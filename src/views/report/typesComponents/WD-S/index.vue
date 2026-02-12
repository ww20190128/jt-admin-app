<template>
  <component :is="components[data.setting?.dan_weidu_type]" :data="data"></component>
</template>

<script>
import { reactive, toRefs } from "vue";
import WDS01 from "./01";
import WDS02 from "./02";
import WDS03 from "./03";
import WDS04 from "./04";
import WDS05 from "./05";
export default {
  name: "WD-S",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    WDS01,
    WDS02,
    WDS03,
    WDS04,
    WDS05,
  },

  setup() {
    const state = reactive({
      components: {
        1: "WDS01",
        2: "WDS02",
        3: "WDS03",
        4: "WDS04",
        5: "WDS05",
      },
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>
