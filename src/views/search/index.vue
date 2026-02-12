<template>
    <SearchNavBar
      v-model:value="query.testPaperName"
      @onSearch="init"
    />
    <div class="content">
      <HeaderTitle
        plain
        title="搜索结果"
      >
        <template #right>
          <span @click="$router.push('/classify')">查看全部内容</span>
        </template>
      </HeaderTitle>
  
      <CellCardList :data="testPaperList" />
      <div class="bottom">
        <van-loading
          v-show="loading"
          size="18px"
        >加载中...</van-loading>
        <div
          class="none"
          v-show="!testPaperList.length && !loading"
        >
          暂无“{{noneText}}”的相关内容，请更换关键词试试
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive, toRefs, onMounted } from "vue";
  import { useRoute, useRouter} from "vue-router";
  import SearchNavBar from "@/components/SearchNavBar";
  import HeaderTitle from "@/components/HeaderTitle";
  import CellCardList from "@/components/CellCardList";
  import { getListByClassify } from "@/api/app";

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
        testPaperList: [],
        loading: false,
        noneText: "",
        query: {
          classifyId: 0,
          pageLimit: 20,
          pageNum: 1,
          testPaperName: "",
          sortType: 1,
        },
      });
      onMounted(() => {
        const { keywords } = route.query;
        if (keywords) {
          state.query.testPaperName = keywords;
          init();
        }
      });
  
      async function init() {
        state.loading = true;
        const { list } = await getListByClassify(state.query);
        state.loading = false;
        if (!list.length) {
          state.noneText = state.query.testPaperName;
        }
        state.testPaperList = list;
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