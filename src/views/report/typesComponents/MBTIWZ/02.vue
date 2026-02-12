<template>

  <div class="MBTIWZ-02">

    <div class="top">
      <!-- 标题1 -->
      <LargeTitle :label="setting?.title1" :icon="setting?.title_icon_tag1" />
      <div class="name">{{ wz_list[0]?.weidu_name }}</div>
      <!-- 总结果分析 -->
      <RichTextBody :data="wz_list[0]?.result.total_result_explain" />

    </div>

    <div class="bottom">
      <!-- 标题2 -->
      <LargeTitle :label="setting?.title2" :icon="setting?.title_icon_tag2" />

      <!-- 标题2说明 -->
      <RichTextBody :data="setting?.title2_jieshao" class="wtextbody" />

      <template v-for="item in wz_list" :key="item.id">
        <div class="w-wd">
          <div class="name name-left">{{ item.weidu_name }}</div>

          <!-- 维度说明 -->
          <div class="card wjianju">
            <RichTextBody :data="item.result?.weidu_remark" />
          </div>
          <!-- 结果 -->
          <div class="result">
            <span>你的得分：</span>
            <span class="result-text">{{ item.result?.name }}</span>
          </div>

          <PositionBar :value="item.select_count_percent" color="#F6727E" />
          <!-- 维度详细分析-->
          <RichTextBody :data="item.result?.weidu_xiangxi_fenxi" />

          <!-- 建议指导 -->
          <Suggest :data="item.result?.jianyi" class="w-sug" />
        </div>
      </template>
    </div>
  </div>

</template>

<script>
import { reactive, toRefs, computed } from "vue";

import RichTextBody from "../../components/RichTextBody";
import LargeTitle from "../../components/LargeTitle";
import PositionBar from "../../components/PositionBar";
import Suggest from "../../components/Suggest";
import ResultName from "../../components/ResultName";

export default {
  name: "02",
  components: {
    RichTextBody,
    PositionBar,
    Suggest,
    LargeTitle,
    ResultName,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const state = reactive({
      active: 0,
    });
    const indicator = props.data.wz_list.map((v, index) => ({
      text: v.weidu_name,
      max: 100,
      axisLabel: { show: index === 0 ? true : false },
    }));
    const value = props.data.wz_list.map((v) => v.percent);
    const options = {
      value,
      indicator,
    };
    // 当前tab展示的内容
    const currentResult = computed(() => {
      return props.data.wz_list[state.active] || {};
    });

    return {
      ...toRefs(state),
      ...toRefs(props.data),
      currentResult,
      options,
    };
  },
};
</script>

<style lang="less" scoped>
.result {
  font-size: @font-size-lg;
  font-weight: bold;

  .result-text {
    color: @theme-color;
  }
}

.name {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: @theme-color;
}

.name-left {
  text-align: left;
  margin-bottom: 15px;
}

.card {
  background-color: #f5f5f5;
  padding: @padding-sm;
  border-radius: @radius-base;
}

.wjianju {
  padding: 0 10px;
  margin-bottom: 15px;
}

.w-wd {
  margin: 10px 0 30px;
}

.w-sug {
  margin: 0;
}

.wtextbody {
  margin: 0;
  padding: 0;
}
</style>