<template>

  <div class="FWWZ-04">
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
        v-for="(item,index) in fantwoList"
        :key="item.id"
      >
        {{item.weidu_name}}
      </TabItem>

    </Tabs>
    <div class="title">你的匹配度：</div>
    <div class="result">{{currentResult.last_percent}}%</div>
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
  name: "04",
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

    // 当前tab展示的内容
    const currentResult = computed(() => {
      return props.data.fantwoList[state.active] || {};
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

    return {
      ...toRefs(props.data),
      ...toRefs(state),
      options,
      currentResult,
    };
  },
};
</script>

<style lang="less" scoped>

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