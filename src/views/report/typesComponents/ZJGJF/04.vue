<template>

  <div class="ZJGJF-04">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_image"
    />
    <div class="result-name">{{ content?.name }}</div>

    <!-- 简介内容 -->
    <RichTextBody :data="content?.result_explain" />

  </div>

</template>

<script>
import { toRefs } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";

export default {
  name: "04",
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
    return {
      ...toRefs(props.data),
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