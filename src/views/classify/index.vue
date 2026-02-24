<template>
  <div class="classify-warper">

    <SearchNavBar v-model:value="keywords" @onSearch="onNavSearch" class="search-bar" />
    <div class="content">
      <van-sidebar v-model="activeIndex" @change="handleClassifyChange" class="left-scroll-warper">
        <div class="scroll-content">
          <van-sidebar-item :title="item.name" v-for="item in classifyList" :key="item.id" class="item" />
        </div>
      </van-sidebar>

      <div class="right-content-list">
        <div class="filter" v-if="false">
          <van-dropdown-menu active-color="#FF5D7D">
            <van-dropdown-item v-model="query.sortType" :options="option" @change="onSearch" />
          </van-dropdown-menu>
        </div>

        <div class="right-list">
          <div class="item" v-for="item in testPaperList" :key="item.id" @click="handleTestPaperItem(item)">
            <div class="left-warp">
              <p class="title">{{ item.name }}</p>
              <p class="subhead">{{ item?.subhead }}</p>
              <p class="bottom-warp">
              <p class="price-warp">
                <span v-if="item.price <= 0">免费测试</span>
                <span v-else>￥{{ item.price }}</span>
              </p>
              <p class="num-warp"><span class="num">{{ item.saleNum }}</span>人已测</p>
              </p>
            </div>
            <div class="right-warp">
              <van-image :src="item.coverImg"> </van-image>
            </div>
          </div>
          <div class="bottom">
            <van-loading v-show="loading" size="18px">加载中...</van-loading>
            <div class="none" v-show="nomore">没有更多测评了</div>
          </div>
          <CopyRight />
        </div>
      </div>
    </div>

  </div>
</template>

<script>


import { reactive, toRefs, onMounted, onActivated } from "vue";
import { useRouter, useRoute } from "vue-router";
import SearchNavBar from "@/components/SearchNavBar";
import { getClassifyList, getListByClassify } from "@/api/app";
import { useScrollBottom } from "@/hooks/useScroll";
import { shareWx } from "@/hooks/shareWx";
import CopyRight from "@/components/CopyRight";

export default {
  name: "classify",
  components: {
    SearchNavBar,
    CopyRight,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      activeIndex: 0,
      option: [
        { text: "按时间", value: 1 },
        { text: "按热度", value: 2 },
        { text: "按价格", value: 3 },
      ],
      testPaperList: [],
      classifyList: [],
      nomore: false,
      loading: false,
      keywords: "",

      query: {
         classifyId: 0,
        pageLimit: 10,
        pageNum: 1,
        testPaperName: "",
        sortType: 2,
      },
    });
    onActivated(() => {
      shareWx({},'app');
      if (route.query.id) {
        state.query.classifyId = route.query.id;
        setActiveIndex();
        onSearch();
      } else {
        const id = state.classifyList[state.activeIndex]?.id ?? 0;
        setSearch(id);
      }
    });

    function onNavSearch() {
      router.push({
        path: "/search",
        query: {
          keywords: state.keywords,
        },
      });
    }
    // 获取分类列表
    async function init() {
      const { list } = await getClassifyList();
      state.classifyList = list;
      setActiveIndex();
    }
    onMounted(() => {
      init();
      getList();
    });
    // 设置分类选中
    function setActiveIndex() {
      const index = state.classifyList.findIndex((v) => v.id == route.query.id);
      if (index !== -1) {
        state.activeIndex = index;
      }
    }

    // 获取测评列表
    async function getList() {
      if (state.nomore) return;
      state.loading = true;
      const { list } = await getListByClassify(state.query);
      state.loading = false;
      if (!list.length) {
        state.nomore = true;
        return;
      }
      state.testPaperList = [...state.testPaperList, ...list];
    }
    function setSearch(id) {
      const search = `?id=${id}`;
      window.history.replaceState(
        history.state,
        "",
        `${window.location.origin + route.path + search}`
      );
    }
    // 分类切换事件
    function handleClassifyChange(index) {
      const current = state.classifyList[index];
      state.query.classifyId = current.id;
      onSearch();
      setSearch(current.id);
    }
    // 点击测评
    function handleTestPaperItem({ id }) {
      router.push({
        path: "/detail",
        query: {
          testPaperId: id,
        },
      });
    }
    function onSearch() {
      state.query.pageNum = 1;
      state.testPaperList = [];
      state.nomore = false;
      getList();
    }

    // 触底
    useScrollBottom(() => {
      if (state.nomore) return;
      state.query.pageNum++;
      getList();
    });

    return {
      handleTestPaperItem,
      handleClassifyChange,
      onSearch,
      onNavSearch,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.classify-warper {

  background-color: @bg-color;
  position: relative;
  width: 100%;
  height: auto;

  .search-bar {

    position: fixed !important;
    top: 0;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    max-width: 750PX !important;
    width: 100%;
    z-index: 999;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    height: 40px;
  }
}

.filter {
  position: fixed;
  top: 50px;
  right: calc(50% - 197px);
  width: 295px;
  z-index: 1;
  color: #969799;

  :deep(.van-dropdown-item__option--active, .van-dropdown-menu__title--active) {
    color: @theme-color;

  }
}

@media screen and (min-width: @max-device-width) {
  .filter {
    :deep(.van-dropdown-item) {
      width: calc(@max-device-width - 80px) !important;
      right: calc((100vw - @max-device-width) / 2) !important;

    }
  }
}

.content {
  background-color: @bg-color;
  .space-between();
  .right-content-list {
    background-color: @bg-color;
    // margin-top: 100px; // 添加排序功能，时这个要打开
    margin-top: 37px;
    width: calc(100% - 90px);

    .right-list {
      .bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: @padding-sm 0;
        margin-top: 10px;

        .none {
          color: #969799;
          font-size: @font-size-base;
        }
      }

      .item {
        .pointer();
        padding: 5px;
        border-radius: 10px;
        box-shadow: 0px 0px 4px #e8e8e8;
        background: #fff;
        margin: 15px @padding-sm 0 @padding-sm;

        .space-between();

        .left-warp {

          padding-right: 5px;
          flex: 1;
          overflow: hidden;

          position: relative;

          .title {
            font-weight: bold;
            overflow: hidden;
            font-size: @font-size-base;
            text-align: left !important;
            .ellipsis();
          }

          .subhead {
            color: @gray-color;
            font-size: @font-size-sm;
            line-height: 24px;
            .ellipsis();
          }

          // 显示在底部
          .bottom-warp {

            position: absolute;
            bottom: 0px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .price-warp {
              font-size: @font-size-base;
              color: @theme-color;
            }

            .num-warp {
              font-size: @font-size-sm;
              color: @gray-color;
              position: relative;

              .num {
                font-size: @font-size-sm;
                color: #FF5D7D !important;
              }
            }
          }
        }

        .right-warp {
          width: 90px;
          height: 90px;
          margin-left: 5px;

          :deep(.van-image) {
            width: 100%;
            height: 100%;

            img {
              border-radius: @radius-base;
            }
          }
        }
      }
    }
  }
}

.left-scroll-warper {}

.scroll-content {


 background-color: #fff;
  padding-top: 15px;
  border-top-right-radius: 15px !important;
  // border: 1px solid #efefef;
  // box-shadow: #efefef 2px 2px 4px 1px;
  box-shadow: 0px 0px 4px #e8e8e8;
  position: fixed;
  top: 50px;
  width: 90px;
  height: 100%;

  .van-sidebar-item {
    
    z-index: 99;
    height: 50px;
    line-height: 1;
    text-align: center;
    color: @light-black;
    background-color: #fff;
  }

  :deep(.van-sidebar-item__text) {

    font-size: @font-size-base !important;
  }

  .van-sidebar-item--select {
    font-weight: bold;
    // color: @light-black;
    color: #fff;
    margin-right: 5px;
    background-color: #6EA9FB;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;

    // box-shadow: 0px 2px 8px rgba(#6EA9FB, 0.5);
    &::before {
      height: 100%;
      width: 4px;
      background-color: rgba(#ff9800, 1);
    }
  }
}

:deep(.van-dropdown-menu) {
  .van-ellipsis {
    font-size: @font-size-base;
  }

  .van-dropdown-menu__bar {
    box-shadow: none;
  }

  .van-dropdown-item--down {
    width: calc(100vw - 90px);
    right: 0;
    left: unset;

    :deep(.van-popup) {
      border-bottom: 1px solid @gray-color;
    }
  }

  .van-dropdown-menu__item {
    justify-content: flex-end;
    padding: 0 @padding-base;
    position: relative;

    &::before {
      content: "排序";
      position: absolute;
      left: @padding-base;
      top: 50%;
      transform: translateY(-50%);
      font-size: @font-size-base;
      color: @gray-color;
    }
  }
}
</style>