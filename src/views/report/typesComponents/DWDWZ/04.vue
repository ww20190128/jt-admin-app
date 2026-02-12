<template>

  <div class="DWDWZ-04">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />
    <!-- 简介内容 -->
    <RichTextBody :data="setting?.jianjie" />
    <!-- 饼图图 -->
    <PieChart :options="options" />

    <!-- 详细解答 -->
    <RichTextBody :data="setting?.xiangxijieda" />
  </div>

</template>

<script>
import { toRefs } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import PieChart from "../../components/Charts/PieChart";
export default {
  name: "04",
  components: {
    LargeTitle,
    RichTextBody,
    PieChart,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const data = props.data.meshList.map((v) => ({
      name: v.weidu_name,
      value: v.last_percent,
    }));

    const options = {
      data,
    };
    return {
      ...toRefs(props.data),
      options,
    };
  },
};
</script>