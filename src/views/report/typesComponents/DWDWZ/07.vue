<template>

  <div class="DWDWZ-07">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />
    <!-- 简介内容 -->
    <RichTextBody :data="setting?.jianjie" />
    <!-- 网状图 -->
    <MeshChart :options="options" />
    <!-- 详细解答 -->
    <RichTextBody :data="setting?.xiangxijieda" />

    <Tabs v-model:active="active">
      <TabItem
        :name="index"
        v-for="(item,index) in meshList"
        :key="item.id"
      >
        {{item.weidu_name}}
      </TabItem>

    </Tabs>

    <div class="matching-rate">
      <div class="title">你的匹配度：</div>
      <div class="percentage">
        {{currentResult.last_percent}}%
      </div>
    </div>
    <!-- 结果分析 -->
    <RichTextBody :data="currentResult.result_explain" />

  </div>

</template>

<script>
import { toRefs, reactive, computed } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import MeshChart from "../../components/Charts/MeshChart";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
export default {
  name: "07",
  components: {
    LargeTitle,
    RichTextBody,
    MeshChart,
    Tabs,
    TabItem,
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
    const indicator = props.data.meshList.map((v, index) => ({
      text: v.weidu_name,
      max: 100,
      axisLabel: { show: index === 0 ? true : false },
    }));
    const value = props.data.meshList.map((v) => v.last_percent);
    const options = {
      value,
      indicator,
      color: props.data.setting.title_icon_color,
      transparentColor: props.data.setting.icon_touming_color,
    };
    // 当前tab展示的内容
    const currentResult = computed(() => {
      return props.data.meshList[state.active] || {};
    });

    return {
      ...toRefs(props.data),
      ...toRefs(state),
      currentResult,
      options,
    };
  },
};
</script>

<style lang="less" scoped>

.matching-rate {
  color: @theme-color;
  font-size: 20px;
  font-weight: bold;
  padding: @padding-sm 0;
  .percentage {
    text-align: center;
  }
}
</style>