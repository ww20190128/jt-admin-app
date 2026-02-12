<template>

  <div class="DWDWZ-02">
    <LargeTitle :label="setting?.title" :icon="setting?.title_icon_tag" />

    <!-- 简介内容 -->

    <div v-html="setting?.jianjie"></div>
    <Progress :title="item.weidu_name" :value="item.last_percent" v-for="item in meshList" :key="item.id"
      :color="item.extend?.tubiao_color">
      {{ item.extend?.jian_jie }}
    </Progress>
    <!-- 详细回答 -->
    <div v-html="setting?.xiangxijieda"></div>
  </div>

</template>

<script>
import { toRefs } from "vue";
import LargeTitle from "../../components/LargeTitle";
import Progress from "../../components/Progress";
export default {
  name: "02",
  components: {
    LargeTitle,
    Progress,
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

.rich-text {
  margin-bottom: 10px;
}

.progress {
  margin-bottom: 8px;
}

.text-content {
  margin-top: 8px;
}
</style>