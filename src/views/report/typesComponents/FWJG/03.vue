<template>

  <div class="FWJG-03">

    <div class="top">
      <!-- 标题1 -->
      <LargeTitle
        :label="setting?.title1"
        :icon="setting?.title_icon_tag1"
      />
      <!-- 结果名称 -->
      <div class="name">{{psqi_level}}</div>

      <!-- 结果内容 -->
      <RichTextBody :data="fanone?.result_explain" />

    </div>
    <div class="bottom">
      <!-- 标题2 -->
      <LargeTitle
        :label="setting?.title2"
        :icon="setting?.title_icon_tag1"
      />

      <div
        v-for="(item,prop,index) in result"
        :key="index"
        class="list"
      >
        <span>{{prop}}</span>
        <span>{{item.text}}:</span>
        <span class="red">{{item.score}}</span>
        分
      </div>

      <Warning
        :data="setting?.zhuyi"
        title="注意事项"
        icon="fa vaaeq fa-bullhorn"
      />
    </div>
  </div>

</template>

<script>
import { toRefs } from "vue";
import RichTextBody from "../../components/RichTextBody";
import LargeTitle from "../../components/LargeTitle";
import Warning from "../../components/Warning";

export default {
  name: "03",
  components: {
    RichTextBody,
    LargeTitle,
    Warning,
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
.top,
.bottom {
  padding: 0 @padding-base;
}
.red {
  color: red;
}
.top {
  margin-bottom: @padding-base;
  border-bottom: 15px solid #ebebeb;
}
.list {
  font-size: @font-size-lg;
  line-height: 30px;
  color: @light-black;
}
.name {
  color: @theme-color;
  font-weight: bold;
  text-align: center;
  padding: @padding-base 0;
  font-size: 20px;
}
</style>