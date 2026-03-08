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
          <!-- 空列表提示 -->
          <div class="empty-state" v-if="accountList.length === 0 && !loading">
            <div class="empty-icon">📄</div>
            <div class="empty-text">暂无相关用户数据</div>
            <div class="empty-tip">请更换筛选条件或搜索关键词</div>
          </div>

          <!-- 用户列表项 -->
          <div
            class="item"
            v-for="item in accountList"
            :key="item.id"
            @click="handleItem(item)"
          >
            <div class="item-header">
              <div class="user-info">
                <h3 class="userName">{{ item.username }}</h3>
                <p class="account">{{ item?.account || "未绑定手机号" }}</p>
              </div>
              <!-- 卡类型标签 - 优化为胶囊+圆形组合 -->
              <div class="card-tag-group">
                <div
                  class="account-type"
                  :class="[
                    item?.typeId ? `type-${item.typeId}` : 'type-default',
                  ]"
                >
                  <span class="name">{{ getTypeName(item?.typeId) }}</span>
                </div>
              </div>
            </div>

            <div class="item-body">
              <div class="time-info">
                <span class="label">到期时间：</span>

                <span class="value expired">{{
                  formatTime(item?.expiredAt)
                }}</span>
              </div>
            </div>

            <!-- 状态标签 - 新增到期提醒 -->
            <div class="item-footer">
              <div
                class="status-tag"
                :class="getStatusClass(item?.expiredAt)"
                v-if="item?.expiredAt"
              >
                {{ getStatusText(item?.expiredAt) }}
              </div>
            </div>
          </div>

          <!-- 加载/无更多 -->
          <div class="load-more">
            <van-loading v-show="loading" size="18px">加载中...</van-loading>
            <div class="no-more" v-show="nomore">
              <span class="icon">✓</span>
              <span class="text">已加载全部用户</span>
            </div>
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
import { useStore } from "@/store";
export default {
  name: "account",
  components: {
    SearchNavBar,
    CopyRight,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const state = reactive({
      activeIndex: 0,
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

    // 格式化时间（简化显示）
    const formatTime = (time) => {
      if (!time) return "未设置";
      const date = new Date(time);
      if (isNaN(date.getTime())) return "格式错误";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}/${month}/${day}`;
    };

    // 获取卡类型名称
    const getTypeName = (typeId) => {
      const matchItem = state.classifyList.find((item) => {
        return String(item.id) === String(typeId);
      });
      return matchItem?.name || "未知卡型";
    };

    // 新增：获取状态文本
    const getStatusText = (expiredAt) => {
      if (!expiredAt) return "未设置有效期";

      const now = new Date();
      const expireDate = new Date(expiredAt);
      const diffDays = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "已过期";
      if (diffDays <= 7) return `即将过期（${diffDays}天）`;
      return "正常使用中";
    };

    // 新增：获取状态样式类
    const getStatusClass = (expiredAt) => {
      if (!expiredAt) return "status-default";

      const now = new Date();
      const expireDate = new Date(expiredAt);
      const diffDays = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "status-expired";
      if (diffDays <= 7) return "status-warning";
      return "status-normal";
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
      if (!store.getters.token) {
        router.push({ path: "/login", query: {} });
      }
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

    // 移除重复的触底监听
    useScrollBottom(() => {
      if (state.nomore || state.loading) return;
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
      getStatusText, // 新增
      getStatusClass, // 新增
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
// 全局变量
@primary-color: #6ea9fb;
@success-color: #48bb78;
@warning-color: #ed8936;
@danger-color: #e53e3e;
@default-color: #718096;
@light-gray: #f5f7fa;
@border-color: #e8e8e8;
@card-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
@card-shadow-hover: 0 6px 20px rgba(0, 0, 0, 0.1);

.account-warper {
  background-color: @light-gray;
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
  background-color: @light-gray;

  // 左侧侧边栏
  .left-scroll-warper {
    .scroll-content {
      background-color: #fff;
      padding-top: 15px;
      border-top-right-radius: 15px !important;
      box-shadow: 0px 0px 4px @border-color;
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
        transition: all 0.2s ease;
      }

      :deep(.van-sidebar-item__text) {
        font-size: 14px !important;
      }

      .van-sidebar-item--select {
        font-weight: 600;
        color: #fff;
        margin-right: 5px;
        background-color: @primary-color;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;

        &::before {
          height: 100%;
          width: 4px;
          background-color: #ff9800;
        }
      }
    }
  }

  // 右侧内容区
  .right-content-list {
    background-color: @light-gray;
    margin-top: 37px;
    width: calc(100% - 90px);
    padding: 0 8px;

    .right-list {
      padding: 8px 0;

      // 空状态样式
      .empty-state {
        padding: 60px 20px;
        text-align: center;
        color: @default-color;

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-text {
          font-size: 16px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .empty-tip {
          font-size: 14px;
          opacity: 0.7;
        }
      }

      // 列表项样式
      .item {
        cursor: pointer;
        padding: 16px;
        border-radius: 16px;
        box-shadow: @card-shadow;
        background: #fff;
        margin: 0 8px 16px;
        border: 1px solid #fff;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

        // 悬浮效果
        &:hover {
          transform: translateY(-2px);
          box-shadow: @card-shadow-hover;
          border-color: @primary-color;
        }

        // 点击效果
        &:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        // 列表项头部
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid @border-color;

          .user-info {
            flex: 1;

            .userName {
              font-weight: 600;
              font-size: 16px;
              color: #333;
              margin-bottom: 4px;
              line-height: 1.4;
            }

            .account {
              color: @default-color;
              font-size: 13px;
              line-height: 1.4;
            }
          }

          // 卡类型标签
          .card-tag-group {
            .account-type {
              min-width: 64px;
              height: 28px;
              line-height: 28px;
              border-radius: 14px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 0 12px;
              background-color: @light-gray;

              .name {
                font-size: 12px;
                font-weight: 500;
                color: @default-color;
              }

              // 不同卡类型配色
              &.type-0 {
                // 免费
                background-color: #e8f4f8;
                .name {
                  color: #4299e1;
                }
              }
              &.type-3 {
                // 七日卡
                background-color: #f0f8fb;
                .name {
                  color: #38b2ac;
                }
              }
              &.type-99 {
                // 体验卡
                background-color: #fef7fb;
                .name {
                  color: #9f7aea;
                }
              }
              &.type-101 {
                // 季卡
                background-color: #f5fafe;
                .name {
                  color: #48bb78;
                }
              }
              &.type-102 {
                // 半年卡
                background-color: #faf0f5;
                .name {
                  color: #ed8936;
                }
              }
              &.type-103 {
                // 年卡
                background-color: #f8f8f8;
                .name {
                  color: #e53e3e;
                }
              }
              &.type-104 {
                // 年卡Plus
                background-color: #f7f3e9;
                .name {
                  color: #4299e1;
                }
              }
              &.type-default {
                // 默认
                background-color: #f5f5f5;
                .name {
                  color: #718096;
                }
              }
            }
          }
        }

        // 列表项主体
        .item-body {
          margin-bottom: 12px;

          .time-info {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 4px 8px;
            font-size: 14px;

            .label {
              color: @default-color;
              font-weight: 500;
            }

            .value {
              color: #333;
            }

            .expired {
              color: @primary-color;
              font-weight: 500;
            }

            .separator {
              color: @border-color;
              margin: 0 4px;
            }
          }
        }

        // 列表项底部（状态标签）
        .item-footer {
          .status-tag {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 500;

            &.status-normal {
              background-color: rgba(72, 187, 120, 0.1);
              color: @success-color;
            }

            &.status-warning {
              background-color: rgba(237, 137, 54, 0.1);
              color: @warning-color;
            }

            &.status-expired {
              background-color: rgba(229, 62, 62, 0.1);
              color: @danger-color;
            }

            &.status-default {
              background-color: @light-gray;
              color: @default-color;
            }
          }
        }
      }

      // 加载/无更多样式
      .load-more {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
        color: @default-color;
        font-size: 14px;

        .no-more {
          display: flex;
          align-items: center;
          gap: 8px;

          .icon {
            font-size: 16px;
            color: @success-color;
          }

          .text {
            opacity: 0.8;
          }
        }
      }
    }
  }
}

// 下拉菜单样式优化
:deep(.van-dropdown-menu) {
  .van-ellipsis {
    font-size: 14px;
  }

  .van-dropdown-menu__bar {
    box-shadow: none;
    background-color: transparent;
  }

  .van-dropdown-item--down {
    width: calc(100vw - 90px);
    right: 0;
    left: unset;

    :deep(.van-popup) {
      border-bottom: 1px solid @border-color;
      border-radius: 8px 8px 0 0;
    }
  }

  .van-dropdown-menu__item {
    justify-content: flex-end;
    padding: 0 12px;
    position: relative;
    background-color: #fff;
    border-radius: 8px;
    margin-right: 8px;

    &::before {
      content: "排序";
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: @default-color;
    }
  }
}
</style>