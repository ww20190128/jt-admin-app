<template>

  <div class="JFPLT-03">

    <!-- 标题1 -->
    <!--
    <LargeTitle
      label="你的人格类型"
      icon="fa fa-codepen"
    />
-->
    <!--<div class="name">{{pl_list?.weidu_name}}</div>-->
    <!-- 总结果分析 -->

    <RichTextBody :data="pl_list?.total_result_explain" />

  </div>

</template>

<script>
import { reactive, toRefs, computed } from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import RichTextBody from "../../components/RichTextBody";
import Progress from "../../components/Progress";
import LargeTitle from "../../components/LargeTitle";

export default {
  name: "03",
  components: {
    Tabs,
    TabItem,
    RichTextBody,
    Progress,
    LargeTitle,
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
      return props.data.pl_list[state.active] || {};
    });
    return {
      ...toRefs(state),
      ...toRefs(props.data),
      currentResult,
    };
  },
};
</script>

<style lang="less" scoped>

.name {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: @theme-color;
}
</style>