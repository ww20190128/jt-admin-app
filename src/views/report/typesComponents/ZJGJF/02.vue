<template>

  <div class="ZJGJF-02">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_image"
    />

    <!-- 简介内容 -->
    <RichTextBody :data="content?.jianjie" />

    <div class="result-name">{{ content?.name }}</div>

    <!-- 结果图片 -->
    <div
      class="img"
      v-if="setting?.zongjieguo_image"
    >
      <van-image :src="setting?.zongjieguo_image">
      </van-image>
    </div>

    <!-- 结果分析 -->
    <RichTextBody :data="content?.result_explain" />
    <!-- 海报 -->
    <Poster
      v-if="content?.share_switch"
      :img="content.share_image"
      :text="content?.share_btn_text"
    />
    <!-- 建议 -->
    <Suggest :data="content?.jianyi" />

    <!-- 注意事项 -->
    <Warning :data="content?.zhuyi" />

  </div>

</template>

<script>
import { toRefs } from "vue";

import Suggest from "../../components/Suggest";
import Warning from "../../components/Warning";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import Poster from "../../components/Poster";
export default {
  name: "02",
  components: {
    Suggest,
    Warning,
    LargeTitle,
    RichTextBody,
    Poster,
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


.img {
  padding: @padding-base 0;

  .van-image {
    width: 100%;
  }
}

.result-name {
  color: @theme-color;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  padding: @padding-sm;
}
</style>