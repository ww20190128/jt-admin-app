<template>
  <div class="ZJGJF-01">
    <LargeTitle :label="setting?.title" :icon="setting?.title_icon_image" />

    <!-- 简介内容 -->
    <div html="content?.jianjie">
    </div>

    <div v-if="content?.name && setting?.title_icon_type != 4" class="result-warp"
      :style="{ color: setting?.title_icon_color }">
      <span>
        {{ content?.name }}
      </span>
    </div>

    <!-- 动态显示图表组件 -->
    <HalfRingChart v-if="setting?.title_icon_type == 1" :options="halfRingChartOption" />
    <LiquidfillChart v-if="setting?.title_icon_type == 2" :options="liquidfillChartOption" />

    <PositionBar :start="setting?.l_weidu_title" :end="setting?.r_weidu_title" :value="last_percent"
      :color="setting?.title_icon_color" v-if="setting?.title_icon_type == 3" />
    <div class="subsection-content" v-if="setting?.title_icon_type == 4">
      <div class="score">
        <p class="score-value">{{ last_percent }}</p>
        <p>{{ content?.name }}</p>
      </div>
      <div class="title">你在人群中的区间位置是：</div>
      <div class="subsection-body">
        <SubsectionBar :value="renqun_percent" :colors="Object.values(setting?.quduan ?? {})" />
      </div>
    </div>

    <CircleProgress class="circle-progress" v-if="setting?.title_icon_type == 5"
      :percentage="liquidfillChartOption.value" :color="liquidfillChartOption.color" />

    <!-- 结果分析 -->
    <RichTextBody :data="content?.result_explain" />
    <!-- 海报 -->
    <Poster v-if="content?.share_switch" :img="content.share_image" :text="content?.share_btn_text" />

    <!-- 建议 -->
    <Suggest :data="content?.jianyi" />

    <!-- 注意事项 -->
    <Warning :data="content?.zhuyi" />
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
import Poster from "../../components/Poster";
import SubsectionBar from "../../components/SubsectionBar";
import CircleProgress from "../../components/CircleProgress";
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
    Poster,
    SubsectionBar,
    CircleProgress,
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
.subsection-content {
  .score {
    color: #fb8f33;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 10px;
    margin-bottom: 20px;

    .score-value {
      font-size: 40px;
    }
  }

  .title {
    font-size: 16px;
    color: rgba(#000, 0.7);
  }

  .subsection-body {
    padding: 0 10px;
  }
}

.result-warp {

  color: @theme-color;
  text-align: center;
  font-weight: bold;
  padding: @padding-sm;
  span {
    font-size: 30px !important;
  }
}

.warning {
  margin-bottom: 0;
}
</style>
