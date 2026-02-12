<template>

  <div class="FWJG-05">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />

    <!-- 简介内容 -->
    <RichTextBody :data="result?.jianjie" />

    <div class="result-name">{{result?.result_name}}</div>

    <!-- 动态显示图表组件 -->
    <HalfRingChart
      v-if="setting?.title_icon_type==1"
      :options="halfRingChartOption"
    />
    <LiquidfillChart
      v-if="setting?.title_icon_type==2"
      :options="liquidfillChartOption"
    />
    <PositionBar
      :start="setting?.l_weidu_title"
      :end="setting?.r_weidu_title"
      :value="last_percent"
      v-if="setting?.title_icon_type==3"
      :color="setting.title_icon_color"
    />

    <!-- 结果分析 -->
    <RichTextBody :data="result?.result_explain" />

    <!-- 建议 -->
    <Suggest :data="result?.jianyi" />

    <!-- 注意事项 -->
    <Warning :data="result?.zhuyi" />

  </div>

</template>

<script>
import { computed, toRefs } from "vue";
import HalfRingChart from "../../components/Charts/HalfRingChart";
import LiquidfillChart from "../../components/Charts/LiquidfillChart";
import PositionBar from "../../components/PositionBar";
import Suggest from "../../components/Suggest";
import Warning from "../../components/Warning";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
export default {
  name: "05",
  components: {
    PositionBar,
    HalfRingChart,
    LiquidfillChart,
    Suggest,
    Warning,
    LargeTitle,
    RichTextBody,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { data } = props;

    // 半环形图数据
    const halfRingChartOption = computed(() => {
      return {
        color: data.setting?.title_icon_color,
        value: data.last_percent,
      };
    });

    // 水波纹图数据
    const liquidfillChartOption = computed(() => {
      return {
        color: data.setting?.title_icon_color,
        clearColor: data.setting?.icon2_touming,
        value: data.last_percent,
      };
    });

    return {
      halfRingChartOption,
      liquidfillChartOption,
      ...toRefs(props.data),
    };
  },
};
</script>

<style lang="less" scoped>

.result-name {
  color: @theme-color;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  padding: @padding-sm;
}
</style>