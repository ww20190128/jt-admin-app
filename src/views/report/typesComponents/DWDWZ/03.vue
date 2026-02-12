<template>

  <div class="DWDWZ-03">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />
    <!-- 简介内容 -->
    <RichTextBody :data="setting?.jianjie" />
    <!-- 图表 -->
    <BarChart :options="options" />
    <!-- 详细解答 -->
    <RichTextBody :data="setting?.xiangxijieda" />
  </div>

</template>

<script>
import { toRefs } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import BarChart from "../../components/Charts/BarChart";
export default {
  name: "03",
  components: {
    LargeTitle,
    RichTextBody,
    BarChart,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { data } = props;
    const yAxisData = data.meshList.map((v) => v.weidu_name);
    const seriesData = [
      data.meshList.map((v) => v.last_percent),
      data.meshList.map((v) => v.extend?.all_people),
    ];
    const values = [{ name: "您的得分" }, { name: "所有人" }];
    values.map((v, i) => {
      seriesData.map((r, j) => {
        if (i === j) {
          v.seriesItem = {
            name: v.name,
            type: "bar",
            data: r,
            label: { show: true, position: "right", valueAnimation: true },
            barGap: 0,
          };
        }
      });
    });
    const series = values.map((v) => v.seriesItem);
    const legendData = values.map((v) => v.name);

    const options = {
      legendData,
      series,
      yAxisData,
      colors:["#E77D83", "#B6D0B3"]
    };
    return {
      ...toRefs(props.data),
      options,
    };
  },
};
</script>
