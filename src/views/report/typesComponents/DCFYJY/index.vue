<template>

  <div class="DCFYJY">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />
    <!-- 说明 -->
    <RichTextBody :data="setting?.shuoming" />

    <Tabs v-model:active="active">
      <TabItem
        :name="index"
        v-for="(item,index) in pageList"
        :key="item.id"
      >
        {{item.title}}
      </TabItem>

    </Tabs>

    <!-- 结果分析 -->
    <RichTextBody :data="currentResult.content" />

  </div>

</template>

<script>
import { toRefs, reactive, computed } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
export default {
  name: "DCFYJY",
  components: {
    LargeTitle,
    RichTextBody,
    Tabs,
    TabItem,
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
      return props.data.pageList[state.active] || {};
    });

    return {
      ...toRefs(props.data),
      ...toRefs(state),
      currentResult,
    };
  },
};
</script>

<style lang="less" scoped>
.DCFYJY {
  padding: 0 @padding-base;
  background-color: #fff;
  margin-bottom: @padding-base;
}

</style>