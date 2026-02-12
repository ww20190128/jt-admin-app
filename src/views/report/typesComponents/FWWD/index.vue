<template>
  <div class="FWWD">
    <component
      :is="components[data.setting?.fan_type]"
      :data="data"
    ></component>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from "vue";
import FWWD01 from "./01";
import FWWD02 from "./02";

export default {
  name: "FWWD",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    FWWD01,
    FWWD02,
  },

  setup(props) {
    const state = reactive({
      components: {
        1: "FWWD01",
        2: "FWWD02",
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