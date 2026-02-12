<!--
 * @Date: 2023-04-10 20:24:36
-->
<template>
  <div>
    <component
      :is="components[data.setting?.fan_type]"
      :data="data"
    ></component>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from "vue";
import FWWZ01 from "./01";
import FWWZ02 from "./02";
import FWWZ03 from "./03";
import FWWZ04 from "./04";
import FWWZ05 from "./05";
export default {
  name: "WD-S",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    FWWZ01,
    FWWZ02,
    FWWZ03,
    FWWZ04,
    FWWZ05,
  },

  setup(props) {
    const state = reactive({
      components: {
        1: "FWWZ01",
        2: "FWWZ02",
        3: "FWWZ03",
        4: "FWWZ04",
        5: "FWWZ05",
      },
    });
    watch(
      () => props.data,
      (val) => {
        console.log(val);
      },
      {
        deep: true,
      }
    );

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>

</style>