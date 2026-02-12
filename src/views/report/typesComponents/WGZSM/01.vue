<template>

  <div class="WGZSM01">
    <LargeTitle :label="setting?.title" :icon="setting?.title_icon_tag" />
    <div class="name">{{ result }}</div>
    <!-- 简介内容 -->
    <RichTextBody :data="setting?.jianjie" />
    <VerticalBarChart :options="options" />

    <!-- 结果 -->
    <RichTextBody :data="analyse" />

  </div>

</template>

<script>
import { toRefs, computed } from "vue";

import LargeTitle from "../../components/LargeTitle";
import RichTextBody from "../../components/RichTextBody";
import VerticalBarChart from "../../components/Charts/VerticalBarChart";
export default {
  name: "01",
  components: {
    LargeTitle,
    RichTextBody,
    VerticalBarChart,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { setting } = props.data;
    const options = {
      xAxisData: ["男性特质", "女性特质"],
      seriesData: [
        {
          value: setting?.l1_percent,
          itemStyle: {
            color: "#5A84FE",
          },
        },
        {
          value: setting?.l2_percent,
          itemStyle: {
            color: "#FF8383",
          },
        },
      ],
    };

    const result = computed(() => {
      if (setting.l1_percent >= 50 && setting.l2_percent >= 50) {
        return "双性化型";
      } else if (setting.l1_percent >= 50 && setting.l2_percent < 50) {
        return "男性化型";
      } else if (setting.l1_percent < 50 && setting.l2_percent >= 50) {
        return "女性化型";
      } else if (setting.l1_percent < 50 && setting.l2_percent < 50) {
        return "未分化型";
      }
    });
    const analyse = computed(() => {
      if (setting.l1_percent >= 50 && setting.l2_percent >= 50) {
        return setting.all_result;
      } else if (setting.l1_percent >= 50 && setting.l2_percent < 50) {
        return setting.man_result;
      } else if (setting.l1_percent < 50 && setting.l2_percent >= 50) {
        return setting.woman_result;
      } else if (setting.l1_percent < 50 && setting.l2_percent < 50) {
        return setting.weifenhua_result;
      }
    });

    return {
      ...toRefs(props.data),
      analyse,
      options,
      result,
    };
  },
};
</script>

<style lang="less" scoped>
.name {
  color: @theme-color;
  font-weight: bold;
  text-align: center;
  padding: @padding-base 0;
  font-size: 20px;
}
</style>