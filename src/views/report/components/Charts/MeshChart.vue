<template>
  <div ref="el" class="mesh-chart"></div>
</template>

<script>
import { ref, onMounted, nextTick, watch } from "vue";
import * as echarts from "echarts";
import { px2number } from "@/utils/rem";
export default {
  name: "MeshChart",
  props: {
    options: {
      type: Object,
      default: () => ({
        indicator: [],
        value: [],
        color: "#f6727e",
        transparentColor: "rgba(246, 122, 134, 0.5)",
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

      const data = [
        {
          value: props.options.value,
          areaStyle: {
            color: "rgba(154, 155, 247, 0.5)", // 覆盖区域颜色
          },
        },
      ];

      const option = {
        color: "rgba(154, 155, 247, 0.7)", // 维度圆点颜色
        radar: [
          {
            indicator: props.options.indicator,
            nameGap: px2number(10), //维度名称与图形之间的距离
            center: ["50%", "50%"], //横坐标和纵坐标偏移距离
            radius: ["0%", "65%"], //雷达图大小，内半径和外半径
            startAngle: 90, //雷达图起始角度
            splitNumber: 5, //雷达图圈数
            shape: "circle",
            axisLabel: {
              //刻度样式
              show: true,
              color: "rgba(160, 160, 160, 0.4)",
              showMinLabel: false,
              fontSize: px2number(12),
              formatter: "{value}%",
              verticalAlign: "top",
              margin: -5,
              align: "left",
            },
            name: {
              //维度名称设置
              formatter: "{value}",
              textStyle: {
                color: "#333",
                fontSize: px2number(12),
              },
              formatter: (text) => {
                text = text.replace(/\S{5}/g, (match) => {
                  return match + "\n";
                });
                return text;
              },
            },
            splitArea: {
              //分隔区域
              areaStyle: {
                color: ["#f9f6f9", "#f9f6f9", "#f9f6f9", "#f9f6f9"], //圆环背景色
                shadowColor: "rgba(210, 210, 210, 0.4)", //圆环阴影
                shadowBlur: 15,
              },
            },
            axisLine: { lineStyle: { color: "#fff" } }, //坐标轴轴线相关设置
            splitLine: { lineStyle: { color: "#d6d3d6" } }, //分隔线
          },
        ],
        series: [
          { type: "radar", emphasis: { lineStyle: { width: 4 } }, data },
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
.mesh-chart {
  height: 270px;
  margin: 0 auto;
}
</style>
