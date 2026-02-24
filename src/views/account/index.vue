<template>
  <div class="account-warper">
    <SearchNavBar
      v-model:value="key_word"
      @onSearch="onNavSearch"
      class="search-bar"
    />
    <div class="content">
      <van-sidebar
        v-model="activeIndex"
        @change="handleClassifyChange"
        class="left-scroll-warper"
      >
        <div class="scroll-content">
          <van-sidebar-item
            :title="item.name"
            v-for="item in classifyList"
            :key="item.id"
            class="item"
          />
        </div>
      </van-sidebar>

      <div class="right-content-list">
        <div class="filter" v-if="false">
          <van-dropdown-menu active-color="#FF5D7D">
            <van-dropdown-item
              v-model="query.sortType"
              :options="option"
              @change="onSearch"
            />
          </van-dropdown-menu>
        </div>

        <div class="right-list">
          <!-- 用户列表项 -->
          <div
            class="item"
            v-for="item in accountList"
            :key="item.id"
            @click="handleItem(item)"
          >
            <div class="item-info-wrap">
              <div class="left-warp">
                <p class="userName">{{ item.username }}</p>
                <p class="account">{{ item?.account }}</p>
              </div>
              <div class="right-warp">
                <!-- 卡类型圆形标签 - 修复类名绑定 -->
                <div
                  class="account-type"
                  :class="[
                    item?.typeId ? `type-${item.typeId}` : 'type-default',
                  ]"
                >
                  <div class="name">{{ getTypeName(item?.typeId) }}</div>
                </div>
                <!-- 到期时间 -->
                <div class="expired-time">
                  <!-- <p class="label">到期时间</p>
                  <p class="value">{{ formatTime(item?.expiredAt) }}</p> -->
                </div>
              </div>
            </div>

            <div class="bottom-wrap">
              有效时间:{{ formatTime(item?.createdAt) }} -
              {{ formatTime(item?.expiredAt) }}
            </div>
          </div>

          <div class="bottom">
            <van-loading v-show="loading" size="18px">加载中...</van-loading>
            <div class="none" v-show="nomore">没有更多用户了</div>
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
import { getMembersList } from "@/api/admin";
import { useScrollBottom } from "@/hooks/useScroll";
import CopyRight from "@/components/CopyRight";
export default {
  name: "account",
  components: {
    SearchNavBar,
    CopyRight,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      activeIndex: -1,
      option: [
        { text: "按时间", value: 1 },
        { text: "按热度", value: 2 },
        { text: "按价格", value: 3 },
      ],
      accountList: [],
      classifyList: [
        { id: -1, name: "全部" },
        { id: 0, name: "免费" },
        { id: 3, name: "七日卡" },
        { id: 99, name: "体验卡" },
        { id: 101, name: "季卡" },
        { id: 102, name: "半年卡" },
        { id: 103, name: "年卡" },
        { id: 104, name: "年卡Plus" },
      ],
      nomore: false,
      loading: false,
      key_word: "",
      query: {
        type_id: -1,
        pageSize: 20,
        pageIndex: 1,
      },
    });

    onActivated(() => {
      if (route.query.id) {
        state.query.classifyId = route.query.id;
        setActiveIndex();
        onSearch();
      } else {
        const id = state.classifyList[state.activeIndex]?.id ?? 0;
        setSearch(id);
      }
    });

    // 格式化时间
    const formatTime = (time) => {
      if (!time) return "暂无";
      const date = new Date(time);
      if (isNaN(date.getTime())) return "格式错误";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}/${month}/${day} ${hours}:${minutes}`;
    };

    // 获取卡类型名称
    const getTypeName = (typeId) => {
      const matchItem = state.classifyList.find((item) => {
        return String(item.id) === String(typeId);
      });
      return matchItem?.name || "未知";
    };

    function onNavSearch() {
      router.push({
        path: "/search",
        query: {
          key_word: state.key_word,
        },
      });
    }

    async function init() {
      setActiveIndex();
    }

    onMounted(() => {
      init();
      getList();
    });

    function setActiveIndex() {
      const index = state.classifyList.findIndex((v) => v.id == route.query.id);
      if (index !== -1) {
        state.activeIndex = index;
      }
    }

    async function getList() {
      if (state.nomore) return;
      state.loading = true;

      const { data } = await getMembersList(state.query);
      state.loading = false;
      if (!data?.list?.length) {
        state.nomore = true;
        return;
      }
      state.accountList = [...state.accountList, ...data.list];
    }

    function setSearch(id) {
      const search = `?id=${id}`;
      window.history.replaceState(
        history.state,
        "",
        `${window.location.origin + route.path + search}`
      );
    }

    function handleClassifyChange(index) {
      const current = state.classifyList[index];
      state.query.type_id = current.id;
      onSearch();
      setSearch(current.id);
    }
    // 跳转到详情
    function handleItem(item) {
      window.localStorage.setItem(
        "account_info_" + item.id,
        JSON.stringify(item)
      );
      router.push({
        path: "/account/info",
        query: {
          id: item.id,
        },
      });
    }

    function onSearch() {
      state.query.pageIndex = 1;
      state.accountList = [];
      state.nomore = false;
      getList();
    }

    useScrollBottom(() => {
      if (state.nomore) return;
      state.query.pageIndex++;
      getList();
    });
    // 触底
    useScrollBottom(() => {
      if (state.nomore) return;
      state.query.pageIndex++;
      getList();
    });
    return {
      handleItem,
      handleClassifyChange,
      onSearch,
      onNavSearch,
      formatTime,
      getTypeName,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.account-warper {
  background-color: #f5f7fa;
  position: relative;
  width: 100%;
  min-height: 100vh;

  .search-bar {
    position: fixed !important;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    max-width: 750px !important;
    width: 100%;
    z-index: 999;
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
    color: #ff5d7d;
  }
}

@media screen and (min-width: 750px) {
  .filter {
    :deep(.van-dropdown-item) {
      width: calc(750px - 80px) !important;
      right: calc((100vw - 750px) / 2) !important;
    }
  }
}

.content {
  display: flex;
  background-color: #f5f7fa;

  .right-content-list {
    background-color: #f5f7fa;
    margin-top: 37px;
    width: calc(100% - 90px);
    padding: 0 8px;

    .right-list {
      .bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 0;
        margin-top: 10px;

        .none {
          color: #969799;
          font-size: 14px;
        }
      }

      // 核心：优化后的item样式
      .item {
        cursor: pointer;
        padding: 12px 12px 20px 12px;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        background: #fff;
        margin: 12px 8px 0;

        transition: all 0.2s ease;
        border: 1px solid #f5f5f5;

        // 悬浮/点击效果
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          border-color: #e8f4f8;
        }
        position: relative;
        .bottom-wrap {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 20px;
          line-height: 20px;
          text-align: center;
          border-radius: 0px 0px 12px 12px;
          font-size: 11px;
          background-color: #ff5d7d;
          opacity: 0.7;
          color: #fff;
        }
        .item-info-wrap {
          display: flex;
          align-items: center;
          width: 100%;
          // 左侧信息区域
          .left-warp {
            flex: 1;
            overflow: hidden;
            padding-right: 12px;
            .userName {
              font-weight: 600;
              font-size: 15px;
              color: #333;
              text-align: left;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              margin-bottom: 4px;
              line-height: 1.4;
            }
            .account {
              color: #969799;
              font-size: 12px;
              line-height: 1.4;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              margin-bottom: 4px;
            }
          }

          // 右侧卡类型+到期时间区域
          .right-warp {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 80px;
            // 圆形卡类型标签 - 确保基础样式始终生效
            .account-type {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              margin-bottom: 5px;
              // 默认背景色（确保没有匹配类型时也有样式）
              background-color: #f5f5f5;

              // 内层白色圆 - 确保显示
              &::before {
                content: "";
                position: absolute;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #fff !important; // 强制显示
                z-index: 1;
              }

              // 卡类型文字 - 确保显示
              .name {
                position: relative;
                z-index: 2;
                font-size: 11px;
                font-weight: 500;
                text-align: center;
                line-height: 1.2;
                padding: 0 4px;
                color: #718096; // 默认文字颜色
              }

              // 不同卡类型的配色 - 修复类名匹配
              &.type-0 {
                // 免费
                background-color: #e8f4f8 !important;
                .name {
                  color: #4299e1 !important;
                }
              }
              &.type-3 {
                // 七日卡
                background-color: #f0f8fb !important;
                .name {
                  color: #38b2ac !important;
                }
              }
              &.type-99 {
                // 体验卡
                background-color: #fef7fb !important;
                .name {
                  color: #9f7aea !important;
                }
              }
              &.type-101 {
                // 季卡
                background-color: #f5fafe !important;
                .name {
                  color: #48bb78 !important;
                }
              }
              &.type-102 {
                // 半年卡
                background-color: #faf0f5 !important;
                .name {
                  color: #ed8936 !important;
                }
              }
              &.type-103 {
                // 年卡
                background-color: #f8f8f8 !important;
                .name {
                  color: #e53e3e !important;
                }
              }
              &.type-104 {
                // 年卡Plus
                background-color: #f7f3e9 !important;
                .name {
                  color: #4299e1 !important;
                }
              }
              &.type--1 {
                // 全部
                background-color: #f5f5f5 !important;
                .name {
                  color: #718096 !important;
                }
              }
              &.type-default {
                // 默认样式
                background-color: #f5f5f5 !important;
                .name {
                  color: #718096 !important;
                }
              }
            }
          }
        }
      }
    }
  }
}

.left-scroll-warper {
  .scroll-content {
    background-color: #fff;
    padding-top: 15px;
    border-top-right-radius: 15px !important;
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
      color: #333;
      background-color: #fff;
    }

    :deep(.van-sidebar-item__text) {
      font-size: 14px !important;
    }

    .van-sidebar-item--select {
      font-weight: bold;
      color: #fff;
      margin-right: 5px;
      background-color: #6ea9fb;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;

      &::before {
        height: 100%;
        width: 4px;
        background-color: rgba(255, 152, 0, 1);
      }
    }
  }
}

:deep(.van-dropdown-menu) {
  .van-ellipsis {
    font-size: 14px;
  }

  .van-dropdown-menu__bar {
    box-shadow: none;
  }

  .van-dropdown-item--down {
    width: calc(100vw - 90px);
    right: 0;
    left: unset;

    :deep(.van-popup) {
      border-bottom: 1px solid #969799;
    }
  }

  .van-dropdown-menu__item {
    justify-content: flex-end;
    padding: 0 12px;
    position: relative;

    &::before {
      content: "排序";
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: #969799;
    }
  }
}
</style>
