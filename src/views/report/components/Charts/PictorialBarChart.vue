<template>
  <div class="charts">
    <!-- style="width: 8rem; height: 100%" -->
    <canvas
      height="100"
      width="345"
      style="width: 100%; height: 100%"
      ref="el"
    ></canvas>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";

export default {
  name: "PictorialBarChart",
  props: {
    options: {
      type: Object,
      default: () => ({
        value: 0,
      }),
    },
  },
  setup(props) {
    const el = ref(null);
    onMounted(() => nextTick(() => setOptions()));
    function setOptions() {
      const chart = echarts.init(el.value, null, { devicePixelRatio: 2.5 });
      // const p1 =
      //   "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAACHCAYAAAC7+mFJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBNjA4RjY3MEE0RUVFQjExOEExNURCQTIyNDBDQ0Y3RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBQzUxNDBCREVFQTQxMUVCODI0NURFMjkzMzNBNjc2NCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBQzUxNDBCQ0VFQTQxMUVCODI0NURFMjkzMzNBNjc2NCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNjA4RjY3MEE0RUVFQjExOEExNURCQTIyNDBDQ0Y3RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNjA4RjY3MEE0RUVFQjExOEExNURCQTIyNDBDQ0Y3RSIvPiA8L3JkZjpEZXNjcmlwdGlv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";
      // const p2 =
      //   "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAACHCAYAAAC7+mFJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBNjA4RjY3MEE0RUVFQjExOEExNURCQTIyNDBDQ0Y3RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMDZDMjU5MUVFQTQxMUVCQkRFQkQ4MEFFMDgwMjk5RCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMDZDMjU5MEVFQTQxMUVCQkRFQkQ4MEFFMDgwMjk5RCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNjA4RjY3MEE0RUVFQjExOEExNURCQTIyNDBDQ0Y3RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNjA4RjY3MEE0RUVFQjExOEExNURCQTIyNDBDQ0Y3RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pvk/a+kAAAMiSURBVHja7J3tcaMwEIYVJg2ogxtaoAVdCU4JTgdn/8xPcx2YEkwLaoEWmOtAJThmbnWRdYD5WLBQ3p1R7HEC7LO7WlZCVl6u16uIRRIRkbw2P/78+lji3JKaoddG6iUu9OP3xxcMsxxuLSMA5XyuHaDi1qpFPMMkGYH4EFbcz1KCOYYIs7u1fQeE6AE739p7SAnAekSNPE6Rh04hwdg+MkUUHbsPAcZad+45VCgwGYMeksEos2FSpnBnMUrCYFHO1B5NOSNjgjHPhjGMMHUsMJqjVksYlNBMIfZ0mJLBO1wGYUkAxQxlNBmjCKVq1k5aHVOWVATyFtoQwIab6RnP+AaoOct/7sGZjf2DcxPMOkaaJVc/WQrGSk4t9Wo3loy1Nox7E6zFihLVVFN882Yjxi7Kq3DNiGrX/m3Xa1vq1twwBwJpLrhb0dCa5gZs9qvmwOxJebMyhGi5AWdiwDzba4832CYamMAao17oRmuGwpzIEiqw/u1Gx9uQbHYIFMQfXl+GwIQOYkNOOmVTK8yJebZlaSDVB7MFr7Qlqv8SwE5sT5Sf1ZI+t21ApNs1Eq882aJ3spgKzTQWz4iYwky4SWDoEKCk6jUdOGHBNUEixlTrY2BKen9Zwdq1UyGfuUeaus2tC0rlgW162Cw73rPAyBA6+Lea0ABMTDAmJhiJMAMMYAADGMAABjCAAQxgALMhGBMTjIRn4BkkgDuYvjDSWwm5ZKCCdcAhZ3wYu3LoEcgzpG/d891KdQtzJIvrlpMcnwxTkUGrDpB/xnYfNv0UfxcJ1I5H8pmK2AXczRO35qnw1PUG73Ss/73Pu2jyn5zlC4SIveB55rnKnq6wSmrG6lnAAAYwgAEMYAADGMAABjCAAQxgAAMYwAAGMIABDGAAAxjAAAYwgAEMYAADGMAAJlAYfOl0DYMtGWZzFqrKtWDqEdatJsBM3iE4mWhxPSFUihHHrQZTicebD7YtVDUDDKHFjE11p24K2ijq7mClHGUapbu2usudz929BrXze702jL1wTgppx/KP+lRBTYmvHYVZdtJ+wX8GAgxgvi/MpwADALDfr36VyCvRAAAAAElFTkSuQmCC";

      // const option = {
      //   xAxis: {
      //     show: false,

      //     splitLine: {
      //       show: false,
      //     },
      //     offset: 0,
      //     axisLine: {
      //       show: false,
      //     },
      //     axisLine: {
      //       show: false,
      //     },
      //   },
      //   yAxis: {
      //     show: false,
      //     data: [],
      //     axisTick: {
      //       show: false,
      //     },
      //     axisLine: {
      //       show: false,
      //     },
      //     axisLabel: {
      //       show: false,
      //     },
      //   },
      //   grid: {
      //     left: 0,
      //     right: 0,
      //   },
      //   series: [
      //     {
      //       type: "pictorialBar",
      //       symbol: p2,
      //       symbolRepeat: "fixed",
      //       symbolMargin: "2%",
      //       symbolClip: true,
      //       symbolBoundingData: 200,
      //       barWidth: 100,
      //       data: [
      //         {
      //           value: props.options.value,
      //           // symbol: p2,
      //           symbolSize: ["30%", "80%"],
      //           symbolPosition: "left",
      //         },
      //       ],

      //       z: 10,
      //     },
      //     {
      //       barWidth: 100,
      //       data: [
      //         {
      //           value: 100,
      //           symbolSize: ["30%", "80%"],
      //           symbolPosition: "left",
      //         },
      //       ],
      //       type: "pictorialBar",
      //       label: {
      //         show: false,
      //       },
      //       animationDuration: 0,
      //       symbolRepeat: "fixed",
      //       symbolMargin: "2%",
      //       symbol: p1,
      //       symbolBoundingData: 200,
      //       z: 5,
      //     },
      //   ],
      // };

      const option = {
        grid: {
          left: 60,
          right: 40,
          height: 35,
          top: "20%",
        },
        xAxis: {
          type: "value",
          max: 100,
        },
        yAxis: {
          type: "category",
          data: ["超越同\n龄人比例"],
          axisLabel: {
            lineHeight: 20,
          },
        },
        series: [
          {
            barWidth: "90%",
            data: [
              {
                value: props.options.value,
                itemStyle: {
                  color: "#FD7682",
                },
              },
            ],
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "right",
                color: "#FD7682",
                formatter: (params) => `${params.value}%`,
              },
            },
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
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
  display: flex;
  justify-content: center;
}
</style>
