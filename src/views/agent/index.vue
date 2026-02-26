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
    <BaseDialog v-model:show="showUpdate" :showConfirmButton="false">
      <div class="dialog-content">
        <div class="title">修改</div>
        <div class="content">
          <div class="field-item">
            <div class="name">代理名称</div>
            <div class="value">{{ updateInfo.name }}</div>
          </div>
          <div class="field-item">
            <div class="name">重置密码</div>
            <van-field
              v-model="updateInfo.password"
              placeholder="请输入新密码"
              type="number"
              class="top-up-input"
            />
          </div>
          <div class="field-item">
            <div class="name">签约状态</div>
            <div class="radio-group">
              <label class="radio-item">
                <input
                  type="radio"
                  v-model="updateInfo.status"
                  value="2"
                  name="status"
                />
                签约
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  v-model="updateInfo.status"
                  value="1"
                  name="status"
                />
                解除
              </label>
            </div>
          </div>
        </div>
        <div class="botton-wrap">
          <div class="cancel-botton" @click="showUpdate = false">取消</div>
          <div class="confirm-botton" @click="handleUpdateConfirm">确定</div>
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
      console.log(state.updateInfo);

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
@padding-base: 16px;
@primary-color: #2563eb;
@grey-color: #4e5969;
@light-grey: #f5f7fa;
@border-color: #e5e6eb;
.dialog-content {
  text-align: center;
  padding: 20px @padding-base;
  font-size: 14px;
  color: #333;

  .title {
    font-weight: bold;
    font-size: 18px;
    color: #1d2129;
    text-align: center;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .content {
    margin-bottom: 32px;
    .field-item {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .name {
        text-align: left;
        line-height: 30px;
        width: 100px;
        font-size: 14px;
        color: @grey-color;
      }
      .value {
        font-size: 16px;
        color: #1d2129;
      }
    }

    .top-up-input {
      :deep(.van-cell) {
        --van-cell-padding: 12px 0;
        --van-cell-border-color: @border-color;
      }
      :deep(.van-field__label) {
        font-weight: 500;
        color: #1d2129;
        width: 80px;
      }
      :deep(.van-field__control) {
        font-size: 15px;
        color: #1d2129;
        padding-right: 0;
      }
      :deep(.van-field__placeholder) {
        color: #c9cdd4;
      }
    }
  }

  .botton-wrap {
    display: flex;
    gap: 12px;
    width: 100%;

    .confirm-botton {
      flex: 1;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background-color: @primary-color;
      color: #ffffff;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:active {
        background-color: #1d4ed8;
      }
    }

    .cancel-botton {
      flex: 1;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background-color: #dde9fc;
      color: @grey-color;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:active {
        background-color: @border-color;
      }
    }
  }
}

.page-content {
  padding: 10px @padding-base 0 @padding-base;
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
    }
  }
}
</style>
