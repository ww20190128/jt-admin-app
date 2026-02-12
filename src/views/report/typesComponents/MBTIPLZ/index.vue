<template>
  <component :is="components[data.setting?.pl_type]" :class="{ 'report-card': data.setting?.pl_type != 7 }"  :data="data" :testOrderInfo="testOrderInfo"
    :sendCouponList="sendCouponList"></component>
</template>

<script>
import { reactive, toRefs } from "vue";
import MBTIPLZ01 from "./01";
import MBTIPLZ02 from "./02";
import MBTIPLZ03 from "./03";
import MBTIPLZ04 from "./04";
import MBTIPLZ05 from "./05";
import MBTIPLZ06 from "./06";
import MBTIPLZ07 from "./07";
// mbti 
export default {
  name: "MBTIPLZ",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    testOrderInfo: {
      type: Object,
      default: () => ({}),
    },
    sendCouponList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    MBTIPLZ01,
    MBTIPLZ02,
    MBTIPLZ03,
    MBTIPLZ04,
    MBTIPLZ05,
    MBTIPLZ06,
    MBTIPLZ07,
  },

  setup(props, { emit }) {
    const state = reactive({
      components: {
        1: "MBTIPLZ01",
        2: "MBTIPLZ02",
        3: "MBTIPLZ03",
        4: "MBTIPLZ04",
        5: "MBTIPLZ05",
        6: "MBTIPLZ06",
        7: "MBTIPLZ07",
      },
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
