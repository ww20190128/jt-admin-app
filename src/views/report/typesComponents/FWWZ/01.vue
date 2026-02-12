<template>

  <div class="FWWZ-01">

    <!-- 标题1 -->
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />
    <!-- 排列介绍 -->
    <RichTextBody :data="setting?.pailie" />
    <TitleProgress
      :title="item.weidu_name"
      :value="item.last_percent"
      :icon="item.extend?.weidu_icon"
      :color="item.extend?.icon_color"
      v-for="item in fantwoList"
      :key="item.id"
    >
      {{item.extend?.jianjie}}
    </TitleProgress>

    <!-- 小贴士 -->
    <Warning
      :data="setting?.zhuyi"
      title="注意事项"
      icon="fa vaaeq fa-bullhorn"
    />

  </div>

</template>

<script>
import { toRefs } from "vue";
import RichTextBody from "../../components/RichTextBody";
import TitleProgress from "../../components/TitleProgress";
import Warning from "../../components/Warning";
import LargeTitle from "../../components/LargeTitle";

export default {
  name: "01",
  components: {
    RichTextBody,
    TitleProgress,
    Warning,
    LargeTitle,
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
