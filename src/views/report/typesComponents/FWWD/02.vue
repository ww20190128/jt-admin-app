<template>

  <div class="FWWD-02">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />
    <!-- 简介 -->
    <RichTextBody :data="setting?.jianjie" />

    <template
      v-for="item in fanthreeList"
      :key="item.id"
    >

    <ResultName
      :title="item.weidu_name"
      :result="item.weidu_result?.name"
      :color="item.extend.tubiao_color"
      titleColor="#5a5a5a"
    />


      <PositionBar
        :value="item.last_percent"
        :color="item.extend?.tubiao_color"
      />

      <!-- 结果分析 -->
      <RichTextBody :data="item.weidu_result?.result_explain" />

      <!-- 建议 -->
      <Suggest :data="item.weidu_result?.jianyi" />
      <!-- 小贴士 -->
      <Warning
        :data="item.weidu_result?.zhuyi"
        title="小贴士"
        icon="fa vaaeq fa-bullhorn"
      />
    </template>

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
import ResultName from "../../components/ResultName";
export default {
  name: "02",
  components: {
    PositionBar,
    HalfRingChart,
    LiquidfillChart,
    Suggest,
    Warning,
    LargeTitle,
    RichTextBody,
    ResultName
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
