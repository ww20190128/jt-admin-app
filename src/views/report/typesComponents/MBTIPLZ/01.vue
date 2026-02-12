<template>

  <div class="JFPLT-01">

    <div class="top">
      <!-- 标题1 -->
      <LargeTitle
        :label="setting?.title1"
        :icon="setting?.title_icon_tag1"
      />
      <div class="name">{{pl_list[0]?.weidu_name}}</div>
      <!-- 总结果分析 -->
      <RichTextBody :data="pl_list[0]?.total_result_explain" />

    </div>
    <div class="top">
      <!-- 标题2 -->
      <LargeTitle
        :label="setting?.title2"
        :icon="setting?.title_icon_tag2"
      />
      <!-- 排列介绍 -->
      <RichTextBody :data="setting?.jianjie" />

      <TitleProgress
        :icon="enums[item.need_jisuan_value]?.icon"
        :title="item.weidu_name"
        :value="item.last_percent"
        :color="enums[item.need_jisuan_value]?.color"
        v-for="item in pl_list"
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

    <div class="bottom">
      <!-- 标题3 -->
      <LargeTitle
        :label="setting?.title3"
        :icon="setting?.title_icon_tag3"
      />
      <!-- 排列介绍 -->
      <RichTextBody :data="setting?.title3_jieshao" />
      <Tabs v-model:active="active">
        <TabItem
          :name="index"
          v-for="(item,index) in pl_list"
          :key="item.id"
        >
          <i
            class="icon"
            :class="[enums[item.need_jisuan_value]?.icon]"
          ></i>
        </TabItem>

      </Tabs>

      <!-- 详细说明 -->
      <RichTextBody :data="currentResult?.juti_result_explain" />

    </div>
  </div>

</template>

<script>
import { reactive, toRefs, computed } from "vue";
import Tabs from "../../components/Tabs";
import TabItem from "../../components/Tabs/TabItem";
import RichTextBody from "../../components/RichTextBody";
import TitleProgress from "../../components/TitleProgress";
import Warning from "../../components/Warning";
import LargeTitle from "../../components/LargeTitle";

export default {
  name: "01",
  components: {
    Tabs,
    TabItem,
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
    const state = reactive({
      active: 0,
    });

    const enums = {
      A: {
        icon: "fa fa-comments",
        color: "#EF818A",
      },
      B: {
        icon: "fa fa-clock-o",
        color: "#FAA458",
      },
      C: {
        icon: "fa fa-gift",
        color: "#FFC540",
      },
      D: {
        icon: "fa fa-bell",
        color: "#7AB995",
      },
      E: {
        icon: "fa fa-handshake-o",
        color: "#767ABA",
      },
    };
    // 当前tab展示的内容
    const currentResult = computed(() => {
      return props.data.pl_list[state.active] || {};
    });
    return {
      ...toRefs(state),
      ...toRefs(props.data),
      currentResult,
      enums,
    };
  },
};
</script>

<style lang="less" scoped>

.name {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: @theme-color;
}
.icon {
  font-size: 25px;
}
:deep(.tab-item.active) {
  background-color: #79b996;
  color: #fff;
}
:deep(.tab-item) {
  color: #cab7b9;
}
.title-progress{margin-bottom:15px;}
</style>