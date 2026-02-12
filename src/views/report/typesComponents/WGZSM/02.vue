<template>

  <div class="WGZSM02">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />

    <van-image
      
      fit="cover"
      :src="setting?.total_result_image"
      v-if="setting?.total_result_image"
    >
    </van-image>

    <!-- 简介内容 -->
    <RichTextBody :data="setting?.xiangxi_desc" />

  </div>

</template>

<script>
import { toRefs } from "vue";

import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";

export default {
  name: "02",
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
.WGZSM02 {
  padding: 0 @padding-base;
}
.name {
  color: @theme-color;
  font-weight: bold;
  text-align: center;
  padding: @padding-base 0;
  font-size: 20px;
}
.van-image {
  width: 100%;
}
</style>