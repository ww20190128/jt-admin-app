<template>
  <div class="MBTIPLZ-06">
    <div class="item top">
      <!-- 标题1 -->
      <LargeTitle :label="setting?.title1" :icon="setting?.title_icon_tag1" />

      <div class="name">{{ groupOne?.weidu_name }}</div>
      <!-- 总结果分析 -->
      <RichTextBody :data="groupOne?.juti_result_explain" />
      <!-- 海报 -->
      <Poster
        v-if="groupOne?.share_switch"
        :img="groupOne?.share_image"
        :text="groupOne?.share_btn_text"
      />
    </div>
    <div class="item">
      <LargeTitle :label="setting?.title2" :icon="setting?.title_icon_tag2" />
      <div class="name">{{ groupTwo?.weidu_name }}</div>
      <!-- 总结果分析 -->
      <RichTextBody :data="groupTwo?.juti_result_explain" />
      <!-- 海报 -->
      <Poster
        v-if="groupTwo?.share_switch"
        :img="groupTwo?.share_image"
        :text="groupTwo?.share_btn_text"
      />
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
    Poster,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const groupOne = computed(() => {
      const list = props.data?.pl_list[0]?.list ?? [];
      return list[0] || {};
    });
    const groupTwo = computed(() => {
      const list = props.data?.pl_list[1]?.list ?? [];
      return list[0] || {};
    });

    return {
      ...toRefs(props.data),
      groupOne,
      groupTwo,
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
