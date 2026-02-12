<template>
  <div ref="el" class="half-ring-chart"></div>
</template>

<script>
import { ref, onMounted, nextTick, watch } from "vue";
import * as echarts from "echarts";
export default {
  name: "HalfRingChart",
  props: {
    options: {
      type: Object,
      default: () => ({
        color: "#E0F0FE",
        value: 0,
      }),
    },
  },
  setup(props) {
    const el = ref(null);
    onMounted(() => nextTick(() => setOptions()));

    watch(
      () => props.options,
      () => setOptions(),
      {
        deep: true,
      }
    );

    function setOptions() {
      const chart = echarts.init(el.value);
      let value = props.options.value || 0;
      const option = {
        series: [
          {
            name: "Indicator",
            type: "gauge",
            detail: {
              formatter: "{value}%",
            },
            radius:"95%",
            data: [
              {
                value: value,
              },
            ],
            clockwise: true,
            splitNumber: 5,
            axisLine: {
              show: true,
            },
            progress: {
              show: value > 0,
              width: 1,
              itemStyle: {
                color: "#E0F0FE",
              },
            },
            splitLine: {
              show: true,
              length: 20,
              distance: 0,
              lineStyle: {
                color: "#E0F0FE",
                width: 2,
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              fontStyle: "normal",
              distance: 15,
            },
            pointer: {
              itemStyle: {
                color: "#E0F0FE",
              },
            },
            startAngle: 200,
            endAngle: -20,
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
.half-ring-chart {
  height: 200px;
  margin: 0 auto -40px;

}
</style>