<template>

  <div class="JFPLT-01">
    <div
      class="top"
      v-if="jifenPailieList[0]?.total_result_remark"
    >
      <!-- 排列介绍 -->
      <RichTextBody :data="jifenPailieList[0]?.total_result_remark" />

      <!-- 海报 -->
      <Poster
        v-if="jifenPailieList[0]?.share_switch"
        :img="jifenPailieList[0]?.share_image"
        :text="jifenPailieList[0]?.share_btn_text"
      />
    </div>
    <div class="top">
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
        v-for="item in jifenPailieList"
        :key="item.id"
        :color="item.weidu_icon_color"
      >
        {{item.jianjie}}
      </Progress>
      <!-- 小贴士 -->
      <Warning
        :data="setting?.zhuyi"
        title="注意事项"
        icon="fa vaaeq fa-bullhorn"
      />
    </div>

    <div class="bottom">
      <!-- 标题2 -->
      <LargeTitle
        :label="setting?.title2"
        :icon="setting?.title_icon_tag2"
      />
      <!-- 排列介绍 -->
      <RichTextBody :data="setting?.title2_jieshao" />
      <Tabs v-model:active="active">
        <TabItem
          :name="index"
          v-for="(item,index) in jifenPailieList.slice(0,3)"
          :key="item.id"
        >
          {{item.weidu_name}}
        </TabItem>

      </Tabs>

      <!-- 详细说明 -->
      <RichTextBody :data="currentResult?.xiangxi" />

    </div>

  </div>

</template>

<script>
import { reactive, toRefs, computed } from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import RichTextBody from "../../components/RichTextBody";
import Progress from "../../components/Progress";
import Warning from "../../components/Warning";
import LargeTitle from "../../components/LargeTitle";
import Poster from "../../components/Poster";

export default {
  name: "01",
  components: {
    Tabs,
    TabItem,
    RichTextBody,
    Progress,
    Warning,
    LargeTitle,
    Poster,
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

