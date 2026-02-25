<template>
  <div class="mine-wrap">
    <!-- 头部信息 -->
    <div class="header" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <div class="user-img-warp">
        <img :src="userInfo?.avatar || avatar" class="avatar-img" />
        <div class="text-warp">
          <template v-if="userInfo?.userName">
            <p>{{ userInfo?.userName }}</p>
          </template>
          <div v-else class="login-text">
            <van-button
              round
              color="#a1c4fd"
              class="login-button"
              @click="handleLogin"
              >点击登录</van-button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content">
      <!-- 审核订单区域 -->
      <div class="card" v-if="statusList.length">
        <div class="card-header">审核订单</div>
        
        <!-- 状态Tab -->
        <div class="status-tabs">
          <div 
            class="tab-item" 
            v-for="item in statusList" 
            :key="item.id"
            :class="{ active: activeStatus === item.id }"
            @click="switchStatus(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
        
        <!-- 订单列表 -->
        <div class="order-list" v-if="topupList.length">
          <div class="order-item" v-for="item in topupList" :key="item.id">
            <div class="order-row">
              <span class="label">金额：</span>
              <span class="value amount">¥{{ item.amount || 0 }}</span>
            </div>
            <div class="order-row">
              <span class="label">商铺：</span>
              <span class="value">{{ item.Agent?.name || '未知商铺' }}</span>
            </div>
            <div class="order-row">
              <span class="label">备注：</span>
              <span class="value">{{ item.Agent?.remark || '无' }}</span>
            </div>
            <div class="order-row">
              <span class="label">状态：</span>
              <span class="value status-tag" :class="getStatusClass(item.status)">
                {{ statusList.find((s) => s.id === item.status)?.name || '未知' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 空数据 -->
        <div class="empty-tip" v-else>
          暂无相关订单
        </div>
        
        <!-- 加载提示 -->
        <div class="load-tip" v-if="!nomore && topupList.length">
          加载中...
        </div>
      </div>
    </div>

    <CopyRight class="copy-right" />
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { useScrollBottom } from "@/hooks/useScroll";
import CopyRight from "@/components/CopyRight";
import { Toast } from "vant";
import { topuplist } from "@/api/admin";

// 图片资源
import bgUserImg from "@/assets/images/bg-mine.jpg";
import avatar from "@/assets/images/avatar.png";

export default {
  name: "mine",
  components: { CopyRight },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    document.title = "个人中心";

    const state = reactive({
      query: {
        pageIndex: 1,
        pageSize: 10,
        status: 1,
      },
      nomore: false,
      topupList: [],
      activeStatus: 1, // 当前激活的状态
    });

    // 初始化数据
    onMounted(async () => {
      if (store.getters.token) {
        await init();
      } else {
        router.push({ path: "/login", query: {} });
      }
    });

    // 用户信息
    const userInfo = computed(() => store.getters.userInfo);
    // 背景图
    const backgroundImage = computed(() => {
      const config = store.getters.config;
      return config?.value?.userBgImg || bgUserImg;
    });

    // 状态列表
    const statusList = computed(() => [
      { id: 1, name: "待处理" },
      { id: 2, name: "已处理" },
      { id: 3, name: "已拒绝" },
    ]);

    // 获取订单数据
    async function init() {
      if (state.nomore) return;
      try {
        const { data } = await topuplist(state.query);
        // 切换状态时清空列表
        if (state.query.pageIndex === 1) {
          state.topupList = [];
        }
        // 追加数据
        if (data.list && data.list.length) {
          state.topupList = [...state.topupList, ...data.list];
          state.nomore = data.list.length < state.query.pageSize;
        } else {
          state.nomore = true;
        }
      } catch (error) {
        console.error("获取订单失败:", error);
        Toast("加载失败，请重试");
        state.nomore = true;
      }
    }

    // 切换状态
    function switchStatus(statusId) {
      state.activeStatus = statusId;
      state.query.status = statusId;
      state.query.pageIndex = 1;
      state.nomore = false;
      init();
    }

    // 滚动加载
    useScrollBottom(() => {
      if (state.nomore || !store.getters.token) return;
      state.query.pageIndex++;
      init();
    }, 100);

    // 登录处理
    function handleLogin() {
      if (!store.getters.token) {
        router.push({ path: "/login", query: {} });
      }
    }

    // 获取状态样式类
    function getStatusClass(status) {
      switch (status) {
        case 1: return "pending"; // 待处理
        case 2: return "completed"; // 已处理
        case 3: return "rejected"; // 已拒绝
        default: return "";
      }
    }

    return {
      ...toRefs(state),
      userInfo,
      backgroundImage,
      avatar,
      statusList,
      handleLogin,
      switchStatus,
      getStatusClass,
    };
  },
};
</script>

<style lang="less" scoped>
// 基础变量
@primary: #409eff;
@grey-bg: #f5f7fa;
@white: #ffffff;
@text-main: #333333;
@text-secondary: #666666;
@text-light: #999999;
@pending-color: #ff9000;
@completed-color: #00b42a;
@rejected-color: #f53f3f;
@border-color: #eeeeee;
@padding-base: 15px;

// 页面容器
.mine-wrap {
  background-color: @grey-bg;
  min-height: 100vh;
  width: 100%;
}

// 头部样式
.header {
  height: 140px;
  padding: @padding-base;
  color: @white;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;

  .user-img-warp {
    display: flex;
    align-items: center;

    .avatar-img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 3px solid @white;
    }

    .text-warp {
      margin-left: 15px;
      line-height: 1.5;

      .login-button {
        height: 30px;
        width: 90px;
      }
    }
  }
}

// 内容区域
.content {
  padding: @padding-base;

  .card {
    background: @white;
    border-radius: 8px;
    overflow: hidden;

    // 卡片头部
    .card-header {
      height: 50px;
      line-height: 50px;
      padding: 0 @padding-base;
      font-size: 16px;
      font-weight: 600;
      border-bottom: 1px solid @border-color;
    }

    // 状态Tab
    .status-tabs {
      display: flex;
      border-bottom: 1px solid @border-color;

      .tab-item {
        flex: 1;
        height: 45px;
        line-height: 45px;
        text-align: center;
        font-size: 14px;
        color: @text-secondary;
        cursor: pointer;
        transition: all 0.2s;

        &.active {
          color: @primary;
          font-weight: 600;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 2px;
            background: @primary;
          }
        }
      }
    }

    // 订单列表
    .order-list {
      padding: 10px;

      .order-item {
        padding: 15px;
        margin-bottom: 10px;
        background: @grey-bg;
        border-radius: 6px;

        &:last-child {
          margin-bottom: 0;
        }

        .order-row {
          display: flex;
          margin-bottom: 8px;
          font-size: 14px;

          &:last-child {
            margin-bottom: 0;
          }

          .label {
            min-width: 60px;
            color: @text-secondary;
          }

          .value {
            flex: 1;
            color: @text-main;

            &.amount {
              color: @primary;
              font-weight: 600;
            }

            &.status-tag {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;

              &.pending {
                background: #fff7e6;
                color: @pending-color;
              }

              &.completed {
                background: #e8fff3;
                color: @completed-color;
              }

              &.rejected {
                background: #fff1f0;
                color: @rejected-color;
              }
            }
          }
        }
      }
    }

    // 空数据提示
    .empty-tip {
      padding: 40px 0;
      text-align: center;
      color: @text-light;
      font-size: 14px;
    }

    // 加载提示
    .load-tip {
      padding: 15px 0;
      text-align: center;
      color: @text-light;
      font-size: 14px;
    }
  }
}

// 版权信息
.copy-right {
  padding: 20px 0;
  text-align: center;
  font-size: 12px;
  color: @text-light;
}
</style>