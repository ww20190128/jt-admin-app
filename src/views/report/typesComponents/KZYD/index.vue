<template>
  <div class="KZYD">
    <LargeTitle :label="setting?.title" :icon="setting?.title_icon_tag" />
    <!-- 说明 -->
    <RichTextBody :data="setting?.content" />
  </div>

</template>
<!-- 扩展阅读 -->
<script>
import { toRefs } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
export default {
  name: "KZYD",
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