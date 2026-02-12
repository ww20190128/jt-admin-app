<template>
  <div class="content">
    <SearchNavBar v-model:value="keywords" @onSearch="onNavSearch" />
    <div class="page-content">
      <!-- 轮播图 -->
      <Swipe :data="bannerList" v-if="bannerList && bannerList.length > 0" />
      <!-- 导航区 -->
      <!-- <Navigation :data="classifyList" /> -->
      <HeaderTitle title="用户管理" :iconImg="boutiqueIcon" v-if="choicenessList && choicenessList.length > 0">
        <!-- <template #right>
          <span class="title-desc">高质量，精选内容</span>
        </template> -->
      </HeaderTitle>
      <!-- 左右滑动 -->
      <SlideCardList :data="choicenessList" v-if="choicenessList && choicenessList.length > 0" @clickItem="handleDetailItem" />

      <HeaderTitle title="限时免费" v-if="freeList && freeList.length > 0">
        <template #right>
          <span class="title-desc">测一测，快乐一整天</span>
        </template>
      </HeaderTitle>
      <!-- 左右滑动 -->
      <SelectCardList :leftData="freeList[0]" :rightData="freeList[1]" v-if="freeList && freeList.length > 0" @clickItem="handleDetailItem" />
      <HeaderTitle title="热门爆款" :iconImg="hotIcon" v-if="hotList && hotList.length > 0">
        <!-- <template #right>
          <span class="title-desc">测一测，快乐一整天</span>
        </template> -->
      </HeaderTitle>
      <CellList :data="hotList" @clickItem="handleDetailItem" v-if="hotList && hotList.length > 0" />

      <HeaderTitle title="新品上线" :iconImg="newIcon" v-if="newList && newList.length > 0">
        <template #right>
          <span class="title-desc">时下流行</span>
        </template>
      </HeaderTitle>
      <!-- 卡片列表 -->
      <CardList :data="newList" @clickItem="handleDetailItem" :tagImg="newTagImg" v-if="newList && newList.length > 0" />
      <ShadowButton @click="handleToggleHotList" v-if="newTotalNum && newTotalNum > 0">
        换一批
      </ShadowButton>

      <HeaderTitle plain title="用户推荐" :iconImg="recommendIcon" v-if="userRecommendList && userRecommendList.length > 0">
        <template #right>
          <span @click="handleAll" class="pointer title-desc">查看全部测评 </span>
        </template>
      </HeaderTitle>
      <CellCardList :data="userRecommendList" @clickItem="handleDetailItem" v-if="userRecommendList && userRecommendList.length > 0" />
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
import { getHomeData, getListByClassify } from "@/api/app";

// 图标
import boutiqueIcon from "@/assets/images/icon-boutique.png";
import hotIcon from "@/assets/images/icon-hot.png";
import newIcon from "@/assets/images/icon-new.png";
import recommendIcon from "@/assets/images/icon-recommend.png";
import newTagImg from "@/assets/images/tag-new.png";

import { loadingToast } from "@/plugins/vant";

import { shareWx } from "@/hooks/shareWx";

export default {
  name: "home",
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
    SelectCardList
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      keywords: "", // 搜索输入框值
      bannerList: [], // 首页轮播图数据
      classifyList: [], // 首页分类数据
      hotList: [],
      newList: [],
      choicenessList: [],
      userRecommendList: [],
      freeList:[],
      newTotalNum:0,
      query: {
        pageNum: 1, // 当前页
        pageLimit: 4, // 每页数量
        classifyId: 103, // 热卖火爆 
      },
      maxPageNum: 1, // 最大页码数
    });
    onMounted(() => {
      init();
      shareWx({}, 'app');

      // 测试调用全局播放器
      // let gbPlayer = inject("gbPlayer");
      // let gbPlayerState = inject("gbPlayerState");
      // setTimeout(() => {
      //   gbPlayer.value.list.add([
      //     {
      //       name: 'name111',
      //       artist: 'artist111',
      //       url: 'https://zhile-static.oss-cn-beijing.aliyuncs.com/resources/mindfulness/audio/%E6%94%B9%E5%96%84%E4%BA%B2%E5%AD%90%E6%B2%9F%E9%80%9A/%E5%B9%B3%E9%9D%99%E6%83%85%E7%BB%AA.mp3',
      //       cover: 'https://zhile-static.oss-cn-beijing.aliyuncs.com/resources/mindfulness/cover/改善亲子沟通.jpg',
      //       lrc: '[00:00.00]第一句歌词啊\n[00:04.01]这是歌词第二句啊\n[00:06.02]然后是第三句歌词啊',
      //     },
      //     {
      //       name: 'name22222',
      //       artist: 'artist222',
      //       url: 'https://zhile-static.oss-cn-beijing.aliyuncs.com/resources/mindfulness/audio/%E6%B8%85%E9%99%A4%E8%B4%9F%E9%9D%A2%E6%83%85%E7%BB%AA/%E6%B8%85%E9%99%A4%E8%B4%9F%E9%9D%A2%E6%83%85%E7%BB%AA.mp3',
      //       cover: 'https://zhile-static.oss-cn-beijing.aliyuncs.com/resources/mindfulness/cover/%E6%B6%88%E9%99%A4%E8%B4%9F%E9%9D%A2%E6%83%85%E7%BB%AA.jpg',
      //       lrc: '[00:00.00]第一句歌词啊\n[00:03.01]这是歌词第二句啊\n[00:06.02]然后是第三句歌词啊',
      //     }
      //   ])
      //   // 默认显示列表
      //   // gbPlayer.value.list.show();
      //   // 默认显示歌词
      //   // gbPlayer.value.lrc.show();
      //   // 显示播放组件
      //   gbPlayerState.value.show = true;
      // }, 3000)
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
        const {
          bannerList, classifyList, testPaperList
        } = await getHomeData();
        state.bannerList = bannerList; // 首页轮播图
        state.classifyList = classifyList; // 分类列表
        state.choicenessList = testPaperList.choicenessList; // 精选推荐
        state.freeList = testPaperList.freeList; // 限时免费
        state.userRecommendList = testPaperList.userRecommendList; // 用户推荐
        state.hotList = testPaperList.hotList;
        state.newList = testPaperList.newList;
        state.newTotalNum = testPaperList.newTotalNum;
      
        // 初始化热卖火爆最大页码数
        state.maxPageNum = Math.ceil(testPaperList.newTotalNum / state.query.pageLimit);
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
      } catch (error) {
      }
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
      newTagImg
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
      content: '';
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