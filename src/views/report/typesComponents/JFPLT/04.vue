<template>

  <div class="JFPLT-04">
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

      <Progress
        :title="item.weidu_name"
        :value="item.last_percent"
        v-for="item in progressList"
        :key="item.id"
        :color="item.weidu_icon_color"
      >
        {{item.jianjie}}
      </Progress>

    </div>
    <div class="gap">
      <!-- 标题2 -->
      <LargeTitle
        :label="setting?.title2"
        :icon="setting?.title_icon_tag2"
      />
      <!-- 优势说明 -->
      <RichTextBody :data="setting?.title2_shuoming" />
      <!-- 优势列表 -->
      <RichTextBody
        :data="item"
        v-for="(item,index) in advantage"
        :key="index"
      />

    </div>
    <div class="bottom">
      <!-- 标题3 -->
      <LargeTitle
        :label="setting?.title3"
        :icon="setting?.title_icon_tag3"
      />
      <!-- 劣势说明 -->
      <RichTextBody :data="setting?.title3_shuoming" />
      <!-- 劣势列表 -->
      <RichTextBody
        :data="item"
        v-for="(item,index) in disadvantage"
        :key="index"
      />

    </div>

  </div>

</template>

<script>
import { toRefs } from "vue";

import RichTextBody from "../../components/RichTextBody";
import Progress from "../../components/Progress";
import LargeTitle from "../../components/LargeTitle";

export default {
  name: "04",
  components: {
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
    const { jifenPailieList } = props.data;
    // 优势列表
    const advantage = jifenPailieList
      .map((v) => v.extend.xingge_you)
      .splice(0, 5);

    // 劣势列表
    const disadvantage = jifenPailieList
      .map((v) => v.extend.xingge_lie)
      .splice(-5);

    const progressList = jifenPailieList.sort(
      (a, b) => b.last_percent - a.last_percent
    );

    return {
      ...toRefs(props.data),
      advantage,
      disadvantage,
      progressList,
    };
  },
};
</script>

