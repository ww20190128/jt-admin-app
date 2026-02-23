<template>
  <div class="info"></div>
</template>

<script>
import { reactive, toRefs, onMounted, inject } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "agentInfo",
  components: {},
  setup() {
    const router = useRouter();
    const state = reactive({});
    onMounted(() => {
      init();
    });

    // 初始化首页数据
    async function init() {
      try {
        const { data } = await getAgentTopupList({
          pageIndex: 1,
          pageSize: 4,
          status: 1,
        });
        state.list = data.list;
        state.count = data.count;
        console.log(data);
        return;

        state.newTotalNum = data.totalNum;

        // 初始化热卖火爆最大页码数
        state.maxPageNum = Math.ceil(
          testPaperList.newTotalNum / state.query.pageLimit
        );
      } catch (error) {
        console.log(error);
      }
    }

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>

</style>