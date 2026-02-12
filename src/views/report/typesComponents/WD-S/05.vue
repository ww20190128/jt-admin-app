<template>

  <div class="WD-S-05">
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
      <!-- 维度名称 -->
      <div
        class="result-name"
        :style="{color:item.extend.tubiao_color}"
      >{{item.weidu_name}}</div>

      <!-- 说明内容 -->
      <div class="card wjianju">
        <RichTextBody :data="item.weidu_result?.shuoming" />
      </div>
      <!-- 结果 -->
      <ResultName
        title="得分分析"
        :result="item.weidu_result?.name"
        :color="item.extend.tubiao_color"
        titleColor="#5a5a5a"
      />

      <PositionBar
        :value="item.last_percent"
        :color="item.extend.tubiao_color"
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
  name: "05",
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

.card {
  background-color: #f5f5f5;
  border-radius: @radius-base;
  padding: 10px;
}
.result-name {
  color: @theme-color;
  font-size: 20px;
  font-weight: bold;
  padding: @padding-sm 0;
  margin-top: 20px;
}
.wjianju{padding:0 0.26667rem;}
</style>