<template>

  <div class="FWJG-01">

    <!-- 标题1 -->
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />
    <!-- 结果名称 -->
    <div class="name">{{fan_result?.result_name}}</div>

    <!-- 网状图 -->
    <MeshChart :options="options" />

    <!-- 结果内容 -->
    <RichTextBody :data="fan_result?.result_explain" />

  </div>

</template>

<script>
import { toRefs } from "vue";
import RichTextBody from "../../components/RichTextBody";
import LargeTitle from "../../components/LargeTitle";
import MeshChart from "../../components/Charts/MeshChart";

export default {
  name: "01",
  components: {
    RichTextBody,
    LargeTitle,
    MeshChart,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    //   网状图数据
    const { chengnuo, jiqing, qinmi } = props.data.result;
    const value = [chengnuo.percent, jiqing.percent, qinmi.percent];
    const indicator = [
      { text: chengnuo.text, max: 100 },
      {
        text: jiqing.text,
        max: 100,
        axisLabel: { show: false },
      },
      {
        text: qinmi.text,
        max: 100,
        axisLabel: { show: false },
      },
    ];

    const options = {
      value,
      indicator,
      color: props.data.setting.title_icon_color,
    };
    return {
      ...toRefs(props.data),
      options,
    };
  },
};
</script>

<style lang="less" scoped>

.name {
  color: @theme-color;
  font-weight: bold;
  text-align: center;
  padding: @padding-base 0;
  font-size: 20px;
}
</style>