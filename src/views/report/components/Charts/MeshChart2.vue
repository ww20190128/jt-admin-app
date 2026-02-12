<template>
  <!-- 网状图 -->
  <div ref="el" class="charts"></div>
  
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
        color: "#9A9BF7",
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

      const indicator = props.options.child_duoweidu.map((v, index) => ({
                text: v.weidu_name,
                max: 100,
                axisLabel: { show: index === 0 ? true : false },
            }));

            const value = props.options.child_duoweidu.map(
                (v) => v.last_percent
            );
      const data = [
        {
          value: value,
          areaStyle: {
            color: props.options.transparentColor || "rgba(53, 116, 233, 0.3)",
          },
        },
      ];

      const option = {
        color: props.options.color || "rgba(53, 116, 233, 0.3)",

        radar: [
          {
            indicator: indicator,
            nameGap: px2number(10), //维度名称与图形之间的距离
            center: ["50%", "50%"], //横坐标和纵坐标偏移距离
            radius: ["0%", "65%"], //雷达图大小，内半径和外半径
            startAngle: 90, //雷达图起始角度
            splitNumber: 5, //雷达图圈数
            shape: "circle",
            axisLabel: {
              //刻度样式
              show: true,
              color: "rgba(160, 160, 160, 0.5)",
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
                fontSize: px2number(14),
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
                color: ["#E4F0FF", "#E4F0FF", "#E4F0FF", "#E4F0FF"], //圆环背景色
                shadowColor: "rgba(210, 210, 210, .5)", // 圆环阴影
                shadowBlur: 15,
              },
            },
            axisLine: { lineStyle: { color: "#fff" } }, //坐标轴轴线相关设置
            splitLine: { lineStyle: { color: "#d6d3d6" } }, // 分隔线
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
.charts {
  height: 250px;
  margin: 0 auto;

}
</style>
