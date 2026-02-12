<template>
  <div>
    <component :is="components[data.setting?.show_type&&data.setting?.show_type!=0?2:1]" :data="data"></component>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import WDS01 from "./01";
import WDS02 from "./02";
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
  },
  // data.setting?.show_type?data.setting?.show_type:1
  setup() {
    const state = reactive({
      components: {
        1: "WDS01",
        2: "WDS02",
      },
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>