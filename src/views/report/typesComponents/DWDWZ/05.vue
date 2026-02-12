<template>

  <div class="DWDWZ-05">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />

    <div class="result-name">{{item?.result?.name}}</div>

    <!-- 结果分析 -->
    <RichTextBody :data="item?.result?.result_explain" />

  </div>

</template>

<script>
import { toRefs } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";

export default {
  name: "05",
  components: {
    LargeTitle,
    RichTextBody,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const [item] = props.data.meshList;
    return {
      ...toRefs(props.data),
      item,
    };
  },
};
</script>

<style lang="less" scoped>
.result-name {
  color: @theme-color;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  padding: @padding-sm;
}
</style>