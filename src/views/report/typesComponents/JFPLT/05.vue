<template>

  <div class="JFPLT-05">

    <div class="gap">
      <!-- 标题1 -->
      <LargeTitle
        :label="setting?.title1"
        :icon="setting?.title_icon_tag1"
      />
      <!-- 维度1总结果 -->
      <RichTextBody :data="jifenPailieList[0]?.total_result_remark" />
    </div>
    <div class="gap">
      <!-- 标题2 -->
      <LargeTitle
        :label="setting?.title2"
        :icon="setting?.title_icon_tag2"
      />
      <!-- 维度2总结果 -->
      <RichTextBody :data="jifenPailieList[1]?.total_result_remark" />

    </div>
    <div class="bottom">
      <!-- 标题3 -->
      <LargeTitle
        :label="setting?.title3"
        :icon="setting?.title_icon_tag3"
      />
      <!-- 排列介绍 -->
      <RichTextBody :data="setting?.pl_jieshao" />
      <!-- 维度列表 -->
      <TitleProgress
        :icon="item.weidu_icon"
        :title="item.weidu_name"
        :value="item.last_percent"
        :color="item.weidu_icon_color"
        v-for="item in jifenPailieList"
        :key="item.id"
      >
        <!-- 说明 -->
        <RichTextBody :data="item.extend?.weidu_remark" />
      </TitleProgress>

    </div>

  </div>

</template>

<script>
import { toRefs } from "vue";

import RichTextBody from "../../components/RichTextBody";
import TitleProgress from "../../components/TitleProgress";
import LargeTitle from "../../components/LargeTitle";

export default {
  name: "05",
  components: {
    RichTextBody,
    TitleProgress,
    LargeTitle,

  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { jifenPailieList } = props.data;
    // 优势列表
    const advantage = jifenPailieList.map((v) => v.extend.xingge_you);

    // 劣势列表
    const disadvantage = jifenPailieList.map((v) => v.extend.xingge_lie);

    return {
      ...toRefs(props.data),
      advantage,
      disadvantage,
    };
  },
};
</script>

