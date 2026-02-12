<template>
  <div
    ref="el"
    class="bar-charts"
    :style="{
      height:(options.yAxisData.length * 50  )+'px'
    }"
  ></div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";

export default {
  name: "BarChart",
  props: {
    options: {
      type: Object,
      default: () => ({
        legendData: [],
        yAxisData: [],
        series: [],
        colors: ["#f27982", "#017f01", "#6b6b6b"],
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
        color: options.colors,
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: { data: options.legendData },
        grid: {
          left: "3%",
          top: "30px",
          right: "8%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLine: { lineStyle: { color: "#3f4565" }, show: true },
          axisLabel: { color: "#333" },
        },
        yAxis: {
          type: "category",
          axisTick: { show: false },
          // data: ["躯体化", "强迫症状", "人际关系紧张"],
          data: options.yAxisData,
        },
        series: options.series,
        title: {top: "1%",}
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
.bar-charts {
  width: 345px;
  min-height: 160px;
  margin: 0 auto;
}
</style>