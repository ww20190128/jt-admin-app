
<template>
  <div class="FWWZ-05">
    <LargeTitle :label="setting?.title" :icon="setting?.title_icon_tag" />
    <!-- 简介内容 -->
    <RichTextBody :data="setting?.jianjie" />
    <!-- 网状图 -->

    <MeshChart :options="options" v-if="setting?.tubiao_yangshi == 1" />
    <RadarChart :data="radarChartData" v-if="setting?.tubiao_yangshi == 2" />
   

    <!-- 详细解答 -->
    <RichTextBody :data="setting?.xiangxijieda" />

    <RichTextBody :data="currentResult.result?.result_explain" />
  </div>
</template>

<script>
import { toRefs, reactive, computed } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import MeshChart from "../../components/Charts/MeshChart";
import RadarChart from "../../components/Charts/RadarChart";
// import RectLiquidfillChart from "../../components/Charts/RectLiquidfillChart";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import { px2rem } from "@/utils/rem";
export default {
  name: "05",
  components: {
    LargeTitle,
    RichTextBody,
    MeshChart,
    Tabs,
    TabItem,
    //   RectLiquidfillChart,
    RadarChart,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const state = reactive({
      active: 0,
    });

    // 当前tab展示的内容
    const currentResult = computed(() => {
      return props.data.fantwoList[0] || {};
    });

    const indicator = props.data.fantwoList.map((v, index) => ({
      text: v.weidu_name,
      max: 100,
      axisLabel: { show: index === 0 ? true : false },
    }));
    const value = props.data.fantwoList.map((v) => v.last_percent);
    const options = {
      value,
      indicator,
    };
    const radarChartData = computed(() => {
      return props.data.fantwoList.map((item, index) => ({
        name: item.weidu_name,
        value: value[index],
        max: 100,
      }));
    });

    return {
      ...toRefs(props.data),
      ...toRefs(state),
      options,
      currentResult,
      px2rem,
      radarChartData,
    };
  },
};
</script>

<style lang="less" scoped>

.liquidfill {
  display: flex;
  justify-content: space-around;
}
.title,
.result {
  font-size: 18px;
  font-weight: bold;
  color: @theme-color;
  padding: @padding-sm 0;
}
.result {
  text-align: center;
  font-size: 20px;
}
</style>
