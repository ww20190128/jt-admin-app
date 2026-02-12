<template>
  <div
    class="rich-text articels-rich-text"
    v-html="content"
  ></div>
</template>

<script>
import { reactive, onMounted, toRefs } from "vue";
import { useRoute } from "vue-router";
import { getArticleInfo } from "@/api/report";
export default {
  setup() {
    const state = reactive({
      content: '',
    });
    const route = useRoute();
    const { id } = route.query;
    async function init() {
      const { title, content } = await getArticleInfo({ id });
      state.content = content;
      document.title = title;
    }
    onMounted(() => init());
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less">
.articels-rich-text{
li{list-style: disc;}
ul{margin-left: 20px;margin-bottom: 12px;}
p{
  margin-bottom: 12px;
}
.xl-b9{margin-bottom: 20px;}
.fa{font-size:20px;color: #ff5d7d;margin-right: 4px;}
.xl-b9 dl{padding:10px 15px 1px;}
.xl-b9{color:#666;line-height:26px;background:#fff7e9;border-radius: 10px;}
.xl-b9 dl dt{color:#b67705;font-weight:bold;line-height:42px;font-size:16px;}
}
</style>

<style lang="less" scoped>
.rich-text {
  padding: @padding-base;
  font-size: @font-size-base;
  color: #3f3f3f;
  line-height: 24px;
  :deep(img ){
    display: block;
    width: 100%;
  }  
}
</style>