<template>

  <div class="FWWZ-02">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />
    <!-- 简介内容 -->
    <RichTextBody :data="setting?.jianjie" />
    <!-- 饼图图 -->
    <PieChart :options="options" />

    <!-- 详细解答 -->
    <RichTextBody :data="fantwoList[0]?.extend?.xiangxijieda" />
  </div>

</template>

<script>
import { toRefs } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import PieChart from "../../components/Charts/PieChart";
export default {
  name: "02",
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
    const data = props.data.fantwoList.map((v) => ({
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
