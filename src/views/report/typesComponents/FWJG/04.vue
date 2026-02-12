<template>

  <div class="FWJG-04">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />

    <div class="result-name">{{result?.result_name}}</div>

    <!-- 动态显示图表组件 -->
    <HalfRingChart
      :options="halfRingChartOption"
    />

    <!-- 结果分析 -->
    <RichTextBody :data="result?.result_explain" />

    <!-- 注意事项 -->
    <Warning
      :data="result?.zhuyi"
      title="注意事项"
      icon="fa vaaeq fa-bullhorn"
    />

  </div>

</template>

<script>
import { computed, toRefs } from "vue";
import HalfRingChart from "../../components/Charts/HalfRingChart";
import Warning from "../../components/Warning";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
export default {
  name: "04",
  components: {
    HalfRingChart,
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

    return {
      halfRingChartOption,
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