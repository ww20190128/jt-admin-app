<template>

  <div class="JFPLT-03">
    <!-- 总结果说明 -->
    <RichTextBody
      class="text top"
      :data="jifenPailieList[0]?.total_result_remark"
    />

    <div class="gap">
      <!-- 标题1 -->
      <LargeTitle
        :label="setting?.title1"
        :icon="setting?.title_icon_tag1"
      />
      <!-- 排列介绍 -->
      <RichTextBody :data="setting?.pl_jieshao" />

      <TitleProgress
        :icon="item.weidu_icon"
        :title="item.weidu_name"
        :value="item.last_percent"
        :color="item.weidu_icon_color"
        v-for="item in jifenPailieList"
        :key="item.id"
      >
        {{item.jianjie}}
      </TitleProgress>

      <!-- 小贴士 -->
      <Warning
        :data="setting?.zhuyi"
        title="注意事项"
        icon="fa vaaeq fa-bullhorn"
      />
    </div>

    <!-- 维度详情 -->
    <RichTextBody
      class="text"
      :data="jifenPailieList[0]?.weidu_xiangxi_jiexi"
    />

  </div>

</template>

<script>
import { reactive, toRefs, computed } from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import RichTextBody from "../../components/RichTextBody";
import TitleProgress from "../../components/TitleProgress";
import Warning from "../../components/Warning";
import LargeTitle from "../../components/LargeTitle";

export default {
  name: "03",
  components: {
    Tabs,
    TabItem,
    RichTextBody,
    TitleProgress,
    Warning,
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
      return props.data.jifenPailieList[state.active] || {};
    });
    return {
      ...toRefs(state),
      ...toRefs(props.data),
      currentResult,
    };
  },
};
</script>