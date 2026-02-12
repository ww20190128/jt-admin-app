<template>
  <div ref="el" class="charts"></div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import { px2number } from "@/utils/rem";
export default {
  name: "HalfRingChart",
  props: {
    options: {
      type: Object,
      default: () => ({
        data: [],
      }),
    },
  },
  setup(props) {
    const { options } = props;
    const el = ref(null);
    onMounted(() => nextTick(() => setOptions()));
    function setOptions() {
      const chart = echarts.init(el.value);
      const option = {
        series: [
          {
            type: "pie",
            radius: "80%",
            itemStyle: {
              borderRadius: 0,
            },
            label: {
              position: "inside",
              formatter: "{b}\n{d}%",
              fontSize: px2number(14),
            },

            data: options.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
              },
            },
          },
        ],
      };
      chart.setOption(option);
    }
    return {
      el,
    };
  },
};
</script>

<style lang="less" scoped>
.charts {
  width: 345px;
  height: 250px;
  margin: 0 auto;
}
</style>
