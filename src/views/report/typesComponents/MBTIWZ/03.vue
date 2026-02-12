<template>

  <div class="MBTIWZ-03">
    <div class="top">
      <!-- 简介 -->
      <RichTextBody :data="wz_list[0]?.total_result_explain" />

    </div>

    <div class="bottom">
      <!-- 标题1 -->
      <LargeTitle :label="setting?.title1" :icon="setting?.title_icon_tag1" />
      <!-- 简介 -->
      <RichTextBody :data="setting?.jianjie" />

      <!-- 网状图 -->
      <MeshChart :options="options" />

      <!-- 解释 -->
      <RichTextBody :data="setting?.jieshi" />

      <Tabs v-model:active="active">
        <TabItem :name="index" v-for="(item, index) in wz_list" :key="item.id">
          {{ item.weidu_name }}
        </TabItem>

      </Tabs>

      <div class="name">{{ currentResult?.weidu_name }}</div>
      <PositionBar :value="currentResult?.select_count_percent" color="#F6727E" />
      <!-- 具体结果分析 -->
      <RichTextBody :data="currentResult?.juti_result_explain" />

    </div>

  </div>

</template>

<script>
import { reactive, toRefs, computed } from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import RichTextBody from "../../components/RichTextBody";
import PositionBar from "../../components/PositionBar";
import LargeTitle from "../../components/LargeTitle";
import MeshChart from "../../components/Charts/MeshChart";

export default {
  name: "03",
  components: {
    Tabs,
    TabItem,
    RichTextBody,
    MeshChart,
    LargeTitle,
    PositionBar,
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
    const indicator = props.data.wz_list.map((v, index) => ({
      text: v.weidu_name,
      max: 100,
      axisLabel: { show: index === 0 ? true : false },
    }));
    const value = props.data.wz_list.map((v) => v.select_count_percent);
    const options = {
      value,
      indicator,
      color: props.data.setting.title_icon_color,
    };
    // 当前tab展示的内容
    const currentResult = computed(() => {
      return props.data.wz_list[state.active] || {};
    });
    console.log(options, 'currentResult');
    return {
      ...toRefs(state),
      ...toRefs(props.data),
      currentResult,
      options,
    };
  },
};
</script>

<style lang="less" scoped>

.name {
  font-size: @font-size-lg;
  font-weight: bold;
  color: @theme-color;
}
</style>