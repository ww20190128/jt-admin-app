
<template>
  <div class="DWDWZ">
    <component
      :is="components[data.setting?.mesh_type]"
      :data="data"
    ></component>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import DWDWZ01 from "./01";
import DWDWZ02 from "./02";
import DWDWZ03 from "./03";
import DWDWZ04 from "./04";
import DWDWZ05 from "./05";
import DWDWZ06 from "./06";
import DWDWZ07 from "./07";
import DWDWZ08 from "./08";
export default {
  name: "DWDWZ",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    DWDWZ01,
    DWDWZ02,
    DWDWZ03,
    DWDWZ04,
    DWDWZ05,
    DWDWZ06,
    DWDWZ07,
    DWDWZ08
  },
  setup() {
    const state = reactive({
      components: {
        1: "DWDWZ01",
        2: "DWDWZ02",
        3: "DWDWZ03",
        4: "DWDWZ04",
        5: "DWDWZ05",
        6: "DWDWZ06",
        7: "DWDWZ07",
        8: "DWDWZ08",
      },
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>