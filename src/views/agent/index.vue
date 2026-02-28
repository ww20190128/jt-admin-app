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
          <span class="pointer title-desc">点击查看详情</span>
        </template>
      </HeaderTitle>
      <CellList
        :data="list"
        @clickUpdate="handleUpdateItem"
        v-if="list && list.length > 0"
      />
      <CopyRight />
    </div>
    <!-- 修复：移除可能导致样式冲突的类名，简化结构 -->
    <BaseDialog v-model:show="showUpdate" :showConfirmButton="false">
      <div class="dialog-content">
        <!-- 标题区域 -->
        <div class="dialog-header">
          <div class="dialog-title">修改商户信息</div>
        </div>

        <!-- 内容区域 -->
        <div class="dialog-body">
          <div class="form-item">
            <label class="form-label">代理名称</label>
            <div class="form-value">{{ updateInfo.name }}</div>
          </div>

          <div class="form-item">
            <label class="form-label">重置密码</label>
            <van-field
              v-model="updateInfo.password"
              placeholder="请输入新密码（留空则不修改）"
              type="number"
              class="form-input"
            />
          </div>

          <div class="form-item">
            <label class="form-label">签约状态</label>
            <div class="radio-container">
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="updateInfo.status"
                  value="2"
                  name="status"
                  class="radio-input"
                />
                <span class="radio-dot"></span>
                <span class="radio-text">签约</span>
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="updateInfo.status"
                  value="1"
                  name="status"
                  class="radio-input"
                />
                <span class="radio-dot"></span>
                <span class="radio-text">解除</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 按钮区域 -->
        <div class="dialog-footer">
          <button class="btn cancel-btn" @click="showUpdate = false">
            取消
          </button>
          <button class="btn confirm-btn" @click="handleUpdateConfirm">
            确定
          </button>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import SearchNavBar from "@/components/SearchNavBar";
import CellCardList from "@/components/CellCardList";
import SlideCardList from "@/components/SlideCardList";
import HeaderTitle from "@/components/HeaderTitle";
import CopyRight from "@/components/CopyRight";
import Swipe from "./components/Swipe";
import Navigation from "./components/Navigation";

import ShadowButton from "./components/ShadowButton";
import CellList from "./components/CellList";
import SelectCardList from "@/components/SelectCardList";
import {
  getAgentTopupList,
  resetAgentPassword,
  deleteAgent,
} from "@/api/admin.js";

// 图标
import boutiqueIcon from "@/assets/images/icon-boutique.png";
import hotIcon from "@/assets/images/icon-hot.png";
import newIcon from "@/assets/images/icon-new.png";
import recommendIcon from "@/assets/images/icon-recommend.png";
import newTagImg from "@/assets/images/tag-new.png";

import BaseDialog from "@/components/BaseDialog";

import { Uploader, Field } from "vant";
import { Toast } from "vant";
import { useStore } from "@/store";
export default {
  name: "agent",
  components: {
    SearchNavBar,
    Swipe,
    Navigation,
    HeaderTitle,
    ShadowButton,
    CellList,
    CellCardList,
    CopyRight,
    SlideCardList,
    SelectCardList,
    BaseDialog,
    VanUploader: Uploader,
    VanField: Field,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      list: [], // 登录列表
      count: 0, // 总数
      query: {
        pageIndex: 1, // 当前页
        pageSize: 20, // 每页数量
      },
      showUpdate: false, // 修改
      updateInfo: {
        id: "",
        name: "",
        password: "",
        status: 2,
      },
    });

    onMounted(() => {
      if (!store.getters.token) {
        router.push({ path: "/login", query: {} });
      }
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
      const { data } = await getAgentTopupList({
        pageIndex: 1,
        pageSize: 20,
        status: 1,
      });
      state.list = data.list;
      state.count = data.count;
    }

    // 充值确认
    async function handleUpdateConfirm() {
      if (state.updateInfo.password) {
        await resetAgentPassword({
          id: state.updateInfo.id,
          password: state.updateInfo.password,
        });
        Toast("密码修改成功");
      } else if (state.updateInfo.status == 1) {
        await deleteAgent({
          id: state.updateInfo.id,
        });
        Toast("商户删除成功");
      }
      state.showUpdate = false;
    }

    function handleUpdateItem(item) {
      state.updateInfo = {
        id: item.Agent.id,
        name: item.Agent.name,
        password: "",
        status: item.Agent.status,
      };
      state.showUpdate = true;
    }

    return {
      onNavSearch,
      handleUpdateConfirm,
      ...toRefs(state),
      hotIcon,
      newIcon,
      boutiqueIcon,
      recommendIcon,
      newTagImg,
      handleUpdateItem,
    };
  },
};
</script>

<style lang="less" scoped>
// 基础变量
@padding-base: 16px;
@radius-base: 12px;
@radius-sm: 8px;

// 配色体系
@primary-color: #5b86e5;
@primary-dark: #4a6fcc;
@success-color: #4cb782;
@danger-color: #e06666;
@text-primary: #333333;
@text-secondary: #666666;
@text-placeholder: #999999;
@border-color: #f0f0f0;
@bg-white: #ffffff;
@bg-gray-light: #f8f9fa;
@bg-gray: #f5f5f5;

// 全局样式
.content {
  background-color: @bg-gray-light;
  min-height: 100vh;
}

// 列表页面样式
.page-content {
  padding: 10px @padding-base 0;

  .title-desc {
    font-size: 13px !important;
    position: relative;
    color: @text-secondary;

    &:before {
      content: "";
      display: block;
      height: 6px;
      width: 6px;
      border-radius: 50%;
      background-color: #f0ad4e;
      border: 1px solid @bg-white;
      position: absolute;
      left: -10px;
      bottom: 0;
      transform: translateY(-100%);
    }
  }

  :deep(.header-title-wrap) {
    background-color: @bg-white;
    border-radius: @radius-sm;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  :deep(.cell-list-wrap) {
    .cell-item {
      background-color: @bg-white;
      border-radius: @radius-sm;
      margin-bottom: 8px;
      border: 1px solid @border-color;
      transition: all 0.2s ease;

      &:hover {
        border-color: @primary-color;
        background-color: #f0f5ff;
      }
    }
  }
}

// ========== 弹窗样式（核心修复） ==========
.dialog-content {
  width: 90%;
  max-width: 400px;
  margin: 0 auto;
  background-color: @bg-white;
  border-radius: @radius-base;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

  // 弹窗头部
  .dialog-header {
    padding: 20px @padding-base;
    border-bottom: 1px solid @border-color;
    text-align: center;

    .dialog-title {
      font-size: 18px;
      font-weight: 600;
      color: @text-primary;
      margin: 0;
    }
  }

  // 弹窗内容区
  .dialog-body {
    padding: 20px @padding-base;

    .form-item {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .form-label {
        display: block;
        font-size: 14px;
        color: @text-secondary;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .form-value {
        height: 44px;
        line-height: 44px;
        padding: 0 12px;
        background-color: @bg-gray;
        border-radius: @radius-sm;
        font-size: 16px;
        color: @text-primary;
      }

      // 输入框样式
      .form-input {
        :deep(.van-cell) {
          --van-cell-padding: 0 12px;
          --van-cell-border: none;
          background-color: @bg-gray;
          border-radius: @radius-sm;
          height: 44px;
        }

        :deep(.van-field__control) {
          font-size: 15px;
          color: @text-primary;
          height: 44px;
          line-height: 44px;
        }

        :deep(.van-field__placeholder) {
          color: @text-placeholder;
          font-size: 14px;
        }
      }

      // 单选框容器
      .radio-container {
        display: flex;
        gap: 30px;
        padding-top: 4px;
      }

      // 单选框样式（修复点击问题）
      .radio-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 15px;
        position: relative;

        // 隐藏原生radio，但保留功能
        .radio-input {
          position: absolute;
          opacity: 0;
          width: 20px;
          height: 20px;
          z-index: 2;
          cursor: pointer;
        }

        // 自定义radio圆点
        .radio-dot {
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #ddd;
          margin-right: 8px;
          position: relative;
          transition: all 0.2s ease;
        }

        // 单选文字
        .radio-text {
          color: @text-secondary;
          transition: all 0.2s ease;
        }

        // 签约状态样式
        &:first-child {
          .radio-input:checked + .radio-dot {
            border-color: @success-color;

            &:after {
              content: "";
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background-color: @success-color;
            }
          }

          .radio-input:checked ~ .radio-text {
            color: @success-color;
            font-weight: 500;
          }
        }

        // 解除状态样式
        &:nth-child(2) {
          .radio-input:checked + .radio-dot {
            border-color: @danger-color;

            &:after {
              content: "";
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background-color: @danger-color;
            }
          }

          .radio-input:checked ~ .radio-text {
            color: @danger-color;
            font-weight: 500;
          }
        }
      }
    }
  }

  // 弹窗底部按钮区（修复显示问题）
  .dialog-footer {
    display: flex;
    gap: 12px;
    padding: 16px @padding-base 20px;
    border-top: 1px solid @border-color;
    background-color: @bg-gray-light;

    .btn {
      flex: 1;
      height: 48px;
      border-radius: @radius-sm;
      font-size: 16px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;

      // 取消按钮
      &.cancel-btn {
        background-color: @bg-white;
        color: @text-secondary;
        border: 1px solid @border-color;

        &:active {
          background-color: @bg-gray;
        }
      }

      // 确定按钮
      &.confirm-btn {
        background-color: @primary-color;
        color: @bg-white;

        &:active {
          background-color: @primary-dark;
        }
      }
    }
  }
}
</style>