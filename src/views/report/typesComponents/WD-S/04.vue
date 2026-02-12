<template>

  <div class="WD-S-04">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />

    <!-- 简介内容 -->
    <RichTextBody :data="setting?.jianjie" />

    <template
      v-for="item in weiduList"
      :key="item.id"
    >
      <!-- 结果 -->
      <ResultName
        :title="item.weidu_name"
        :result="item.weidu_result?.name"
        :color="item.extend.tubiao_color"
        titleColor="#5a5a5a"
      />
      <PositionBar
        :color="item.extend.tubiao_color"
        :value="item.last_percent"
        :multi="[item.extend?.duorenshu?.min_score,item.extend?.duorenshu?.max_score]"
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
import { toRefs } from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import PositionBar from "../../components/PositionBar";
import Suggest from "../../components/Suggest";
import Warning from "../../components/Warning";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import ResultName from "../../components/ResultName";
export default {
  name: "04",
  components: {
    PositionBar,
    Tabs,
    TabItem,
    Suggest,
    Warning,
    LargeTitle,
    RichTextBody,
    ResultName,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return {
      ...toRefs(props.data),
    };
  },
};
</script>

<style lang="less" scoped>

</style>