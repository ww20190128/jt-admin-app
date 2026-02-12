<template>

  <div class="JFPLT-04">

    <div class="top">
      <!-- 标题1 -->
      <LargeTitle
        :label="setting?.title1"
        :icon="setting?.title_icon_tag1"
      />
      <div class="name">{{pl_list[0]?.weidu_name}}</div>
      <!-- 总结果分析 -->
      <RichTextBody :data="pl_list[0]?.total_result_explain" />
      <!-- 海报 -->
      <Poster
        v-if="pl_list[0]?.share_switch"
        :img="pl_list[0]?.share_image"
        :text="pl_list[0]?.share_btn_text"
      />
    </div>

    <div class="bottom">
      <!-- 标题2 -->
      <LargeTitle
        :label="setting?.title2"
        :icon="setting?.title_icon_tag2"
      />
      <!-- 简介 -->
      <RichTextBody :data="setting?.title3_jieshao" />

      <Tabs v-model:active="active">
        <TabItem
          :name="index"
          v-for="(item,index) in pl_list.slice(0,3)"
          :key="item.id"
        >
          {{item.weidu_name}}
        </TabItem>

      </Tabs>

      <!-- 具体结果分析 -->
      <RichTextBody :data="currentResult?.juti_result_explain" />

    </div>
  </div>

</template>

<script>
import { reactive, toRefs, computed } from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import RichTextBody from "../../components/RichTextBody";
import Progress from "../../components/Progress";
import LargeTitle from "../../components/LargeTitle";
import Poster from "../../components/Poster";

export default {
  name: "04",
  components: {
    Tabs,
    TabItem,
    RichTextBody,
    Progress,
    LargeTitle,
    Poster
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