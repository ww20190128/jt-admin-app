<template>
  <div class="RW-02">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />

    <!-- 智商评估结果 -->
    <div class="large-text">
      {{ruiwenAdvInfo.zhili_pinggu}}
    </div>

    <!-- 象形图 -->
    <PictorialBarChart :options="options" />

    <!-- 百分比简介 -->
    <div class="text">
      {{ruiwenAdvInfo.baifenbi_jianjie}}
    </div>

    <!-- 总结果分析 -->
    <RichTextBody :data="ruiwenAdvInfo?.xiangxi_explain" />

  </div>

</template>

<script>
import { toRefs, watch } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import PictorialBarChart from "../../components/Charts/PictorialBarChart";
export default {
  name: "02",
  components: {
    LargeTitle,
    RichTextBody,
    PictorialBarChart,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {


    const options = {
      value: props.data.percentInfo.percent,
	};

	
    return {
      ...toRefs(props.data),
      options,
    };
  },
};
</script>

<style lang="less" scoped>

.large-text {
  color: #df757f;
  font-size: 35px;
  font-weight: bold;
  text-align: center;
}

.text {
  color: #df757f;
  text-align: center;
  font-size: @font-size-lg;
}
</style>