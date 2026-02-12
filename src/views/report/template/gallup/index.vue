<template>
  <div class="content">
    <Content01 v-if="true" class="report-card" :data="data?.duoweidu" />
    <!-- 大才分布情况 -->
    <Content03 v-if="true" class="report-card" :data="data?.duoweidu" />
    <!-- 4大才干象限 -->
    <Content02 v-if="true" class="report-card" :data="data?.duoweidu" />
    <!-- 才干得分 -->
    <Content04 v-if="true" class="report-card" :data="data?.duoweidu" />
    <Content05 v-if="true" class="report-card" :data="data?.duoweidu" />

    <Content06 v-if="false" class="report-card" :data="data?.duoweidu" />
    <!-- 扩展阅读 -->
    <Content07 v-if="false" class="report-card" :data="data?.duoweidu" />
  </div>
</template>
  
<script>
import { reactive, toRefs } from "vue";
import Content01 from "./components/Content01";
import Content02 from "./components/Content02";
import Content03 from "./components/Content03";
import Content04 from "./components/Content04";
import Content05 from "./components/Content05";
import Content06 from "./components/Content06";
import Content07 from "./components/Content07";
  // mbti 
export default {
  name: "gallup",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    Content01,
    Content02,
    Content03,
    Content04,
    Content05,
    Content06,
    Content07,
  },
  
  setup(props) {
    const { data } = props;
    const state = reactive({
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>