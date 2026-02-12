<template>

  <div class="FWWD-01">
    <LargeTitle :label="setting?.title" :icon="setting?.title_icon_tag" />
    <!-- 简介 -->
    <RichTextBody :data="setting?.jianjie" />

    <template v-for="item in fanthreeList" :key="item.id">

      <div class="result">
        <div class="header">{{ item.weidu_name }}：{{ item.last_percent }}</div>
        <div class="warning">{{ item.weidu_result?.name }}</div>
      </div>
      <!-- 结果分析 -->
      <RichTextBody :data="item.weidu_result?.result_explain" />

      <!-- 建议 -->
      <Suggest :data="item.weidu_result?.jianyi" />
      <!-- 注意事项 -->
      <Warning :data="item.weidu_result?.zhuyi" title="注意事项" icon="fa vaaeq fa-bullhorn" />
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
export default {
  name: "01",
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
.result {
  display: flex;

  font-weight: bold;
  color: @light-black;
  padding: @padding-base 0;
  padding-left: 15px;
  .header {
    
    font-size: 18px !important;
  }

  .warning {
    font-size: 18px !important;
    color: #fa709a;
    padding-left: @padding-sm;
  }
  position: relative;
  &:before {
    content: '';
    display: block;
    height: 8px;
    width: 8px;
    border-radius: 50px;
    background-color: #ffd427;
    border: 1px solid #fff;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translate(0, -50%); // 平移并倾斜45度
  }
}
</style>