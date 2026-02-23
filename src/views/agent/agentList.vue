<template>
  <div class="content">
    <div class="page-content">
      <HeaderTitle
        plain
        title="商户列表"
        :iconImg="recommendIcon"
        v-if="list && list.length > 0"
      >
        <template #right>
          <span @click="handleAll" class="pointer title-desc"
            >查看全部商户
          </span>
        </template>
      </HeaderTitle>
      <CellCardList
        :data="list"
        @clickItem="handleDetailItem"
        v-if="list && list.length > 0"
      />
      <!-- <ShadowButton @click="handleAll">
        查看全部测评
      </ShadowButton> -->
      <CopyRight />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import SearchNavBar from "@/components/SearchNavBar";
import CellCardList from "@/components/CellCardList";
import SlideCardList from "@/components/SlideCardList";
import HeaderTitle from "@/components/HeaderTitle";
import CopyRight from "@/components/CopyRight";
import Swipe from "./components/Swipe";
import Navigation from "./components/Navigation";

import CardList from "./components/CardList";
import ShadowButton from "./components/ShadowButton";
import CellList from "./components/CellList";
import SelectCardList from "@/components/SelectCardList";
import { getAgentTopupList } from "@/api/admin.js";

// 图标
import boutiqueIcon from "@/assets/images/icon-boutique.png";
import hotIcon from "@/assets/images/icon-hot.png";
import newIcon from "@/assets/images/icon-new.png";
import recommendIcon from "@/assets/images/icon-recommend.png";
import newTagImg from "@/assets/images/tag-new.png";

import { loadingToast } from "@/plugins/vant";

export default {
  name: "agent",
  components: {
    SearchNavBar,
    Swipe,
    Navigation,
    HeaderTitle,
    CardList,
    ShadowButton,
    CellList,
    CellCardList,
    CopyRight,
    SlideCardList,
    SelectCardList,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      list: [], // 登录列表
      count: 0, // 总数
      query: {
        pageIndex: 1, // 当前页
        pageSize: 4, // 每页数量
        classifyId: 103, // 热卖火爆
      },
      maxPageNum: 1, // 最大页码数
    });
    onMounted(() => {
      init();
    });

    // 跳转搜索页
    function onNavSearch() {
      router.push({
        path: "/search",
        query: {
          keywords: state.keywords,
        },
      });
    }
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
    // 换一批
    async function handleToggleHotList() {
      try {
        if (state.query.pageNum >= state.maxPageNum) {
          state.query.pageNum = 1;
        } else {
          state.query.pageNum++;
        }
        const loading = loadingToast();
        // 获取数据
        const { list, totalNum } = await getListByClassify(state.query);
        loading.clear();
        state.newList = list;
        state.maxPageNum = Math.ceil(totalNum / state.query.pageLimit);
      } catch (error) {}
    }
    // 查看全部内容
    function handleAll() {
      router.push("/classify");
    }
    // 测评详情
    function handleDetailItem({ id }) {
      router.push({
        path: "/detail",
        query: {
          testPaperId: id,
        },
      });
    }
    return {
      handleAll,
      handleDetailItem,
      handleToggleHotList,
      onNavSearch,
      ...toRefs(state),
      hotIcon,
      newIcon,
      boutiqueIcon,
      recommendIcon,
      newTagImg,
    };
  },
};
</script>

<style lang="less" scoped>
.page-content {
  padding: 60px @padding-base 0 @padding-base;
  .title-desc {
    font-size: 13px !important;
    position: relative;

    &:before {
      content: "";
      display: block;
      height: 6px;
      width: 6px;
      border-radius: 50px;
      background-color: #ffd427;
      border: 1px solid #fff;
      position: absolute;
      left: -10px;
      bottom: 0;
      transform: translateY(-100%);
      //  transform: translate(50%, 50%, -50%); // 平移并倾斜45度
    }
  }
}
</style>