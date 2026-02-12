<template>
  <div ref="el" class="charts"></div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import { px2number } from "@/utils/rem";

export default {
  name: "VerticalBarChart",
  props: {
    options: {
      type: Object,
      default: () => ({
        xAxisData: [],
        seriesData: [],
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
        xAxis: {
          type: "category",
          data: options.xAxisData,
          axisLabel: {
            textStyle: {
              fontSize: px2number(14), // 设置文字大小
            },
          },
        },
        yAxis: {
          type: "value",
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        series: [
          {
            data: options.seriesData,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
            itemStyle: {
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "black",
                  fontSize: px2number(16),
                },
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
  width: 85%;
  height: 220px;
  margin: 0 auto;
}
</style>
