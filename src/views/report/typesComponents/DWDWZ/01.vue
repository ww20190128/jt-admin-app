<template>

  <div class="DWDWZ-01">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />
    <!-- 简介内容 -->
    <RichTextBody :data="setting?.jianjie" />
    <!-- 图表 -->
    <BarChart :options="options" />

    <div
      class="bottom"
      v-if="abnormal_mesh_list.length"
    >
      <div class="name">异常维度</div>
      <div class="title">
        您在{{abnormal_mesh_list.length}}个精神症状维度上有异常表现（高于2分），需要重点关注。
      </div>
      <div
        v-for="item in abnormal_mesh_list"
        :key="item.id"
        class="item"
      >
        <p class="item-name">{{item.weidu_name}}</p>
        <p>{{item.last_percent}}</p>
      </div>
    </div>

  </div>

</template>

<script>
import { toRefs } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import BarChart from "../../components/Charts/BarChart";
export default {
  name: "01",
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
      data.meshList.map((v) => v.extend?.adults_avg_score),
      data.meshList.map((v) => v.extend?.patients_avg_score),
    ];
    const values = [
      { name: "您的得分" },
      { name: "成年人平均分" },
      { name: "病患者平均分" },
    ];
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
      colors: ["#f27982", "#017f01", "#6b6b6b"],
    };
    return {
      ...toRefs(props.data),
      options,
    };
  },
};
</script>

<style lang="less" scoped>

.bottom {
  font-size: 17px;
  color: @light-black;
  .name {
    color: @theme-color;
    padding: @padding-base 0;
  }
  .title {
    padding-bottom: @padding-base;
  }
  .item {
    line-height: 25px;
    padding-bottom: 10px;
    padding-left: 40px;
    .item-name {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: @light-black;
        top: 50%;
        left: -20px;
        transform: translateY(-50%);
      }
    }
  }
}
</style>