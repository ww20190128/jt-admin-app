<template>
  <SearchNavBar v-model:value="query.key_word" @onSearch="init" />
  <div class="content">
    <HeaderTitle plain title="搜索结果">
      <template #right>
        <span @click="$router.push('/classify')">查看全部内容</span>
      </template>
    </HeaderTitle>

    <CellCardList :data="accountList" />
    <div class="bottom">
      <van-loading v-show="loading" size="18px">加载中...</van-loading>
      <div class="none" v-show="!accountList.length && !loading">
        暂无“{{ noneText }}”的相关内容，请更换关键词试试
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SearchNavBar from "@/components/SearchNavBar";
import HeaderTitle from "@/components/HeaderTitle";
import CellCardList from "@/components/CellCardList";
import { getMembersList } from "@/api/admin";

export default {
  name: "search",
  components: {
    SearchNavBar,
    HeaderTitle,
    CellCardList,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      accountList: [],
      loading: false,
      noneText: "",
      query: {
        type_id: -1,
        pageSize: 20,
        pageIndex: 1,
      },
    });
    onMounted(() => {
      const { key_word } = route.query;
      if (key_word) {
        state.query.key_word = key_word;
        init();
      }
    });

    async function init() {
      state.loading = true;
      const { data } = await getMembersList(state.query);
      state.loading = false;
      if (!data.list.length) {
        state.noneText = state.query.key_word;
      }
      state.accountList = data.list;
    }

    return {
      init,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 0 @padding-base @padding-base @padding-base;
}
.none-result {
  text-align: center;
  padding: @padding-base;
  color: @gray-color;
  font-size: @font-size-base;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: @padding-sm;
  .none {
    color: #969799;
    font-size: @font-size-base;
  }
}
</style>
