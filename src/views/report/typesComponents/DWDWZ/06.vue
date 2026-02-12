<template>

  <div class="DWDWZ-06">
    <LargeTitle
      :label="setting?.title"
      :icon="setting?.title_icon_tag"
    />
    <!-- 简介内容 -->
    <RichTextBody :data="setting?.jianjie" />
    <!-- 网状图 -->
    <MeshChart :options="options" />
    <!-- 详细解答 -->
    <RichTextBody :data="setting?.xiangxijieda" />
  </div>

</template>

<script>
import { toRefs } from "vue";
import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import MeshChart from "../../components/Charts/MeshChart";
export default {
  name: "06",
  components: {
    LargeTitle,
    RichTextBody,
    MeshChart,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const indicator = props.data.meshList?.map((v, index) => ({
      text: v.weidu_name,
      max: 100,
      axisLabel: { show: index === 0 ? true : false },
    }));
    const value = props.data?.meshList?.map((v) => v.last_percent);
    const options = {
      value,
      indicator,
      color: props.data.setting.title_icon_color,
      transparentColor: props.data.setting.icon_touming_color,
    };

    return {
      ...toRefs(props.data),
      options,
    };
  },
};
</script>
