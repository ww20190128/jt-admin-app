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
        @clickItem="handleDetailItem"
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
            <div class="value">万人民币范围</div>
          </div>
          <div class="field-item">
            <div class="name">更新密码</div>
            <van-field
              v-model="topUpAmount"
              placeholder="请输入新密码"
              type="number"
              class="top-up-input"
            />
          </div>
          <div class="field-item">
            <div class="name">签约状态</div>
            <van-field
              v-model="topUpAmount"
              placeholder="请输入新密码"
              type="number"
              class="top-up-input"
            />
          </div>
        </div>
        <div class="botton-wrap">
          <div class="confirm-botton" @click="handleUpdateConfirm">确定</div>
          <div class="cancel-botton" @click="showUpdate = false">取消</div>
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
import { getAgentTopupList } from "@/api/admin.js";

// 图标
import boutiqueIcon from "@/assets/images/icon-boutique.png";
import hotIcon from "@/assets/images/icon-hot.png";
import newIcon from "@/assets/images/icon-new.png";
import recommendIcon from "@/assets/images/icon-recommend.png";
import newTagImg from "@/assets/images/tag-new.png";

import { loadingToast, Toast } from "@/plugins/vant"; // 补充Toast提示

import BaseDialog from "@/components/BaseDialog";

import { Uploader, Field } from "vant";

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
      maxPageNum: 1, // 最大页码数
      showUpdate: true, // 修改
      topUpProof: [], // 充值凭证
      topUpAmount: "20", // 充值金额
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
      const loading = loadingToast(); // 增加加载提示
      const { data } = await getAgentTopupList({
        pageIndex: 1,
        pageSize: 20,
        status: 1,
      });
      loading.clear();
      state.list = data.list;
      state.count = data.count;
      console.log(data);
    }

    // 图片上传前校验
    function beforeRead(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        Toast("请上传图片格式文件");
        return false;
      }
      const isLt5M = file.size <= 5 * 1024 * 1024;
      if (!isLt5M) {
        Toast("图片大小不能超过5MB");
        return false;
      }
      return true;
    }

    // 图片上传后处理
    function afterRead(file) {
      console.log("上传的文件：", file);
      // 模拟上传接口请求
      const loading = loadingToast("上传中...");
      setTimeout(() => {
        loading.clear();
        file.status = "success"; // 标记上传成功
        Toast("图片上传成功");
        state.topUpProof = [file]; // 更新上传列表
      }, 2000);
    }

    // 充值确认
    function handleUpdateConfirm() {
      if (!state.topUpAmount || Number(state.topUpAmount) <= 0) {
        Toast("请输入有效的充值金额");
        return;
      }
      if (state.topUpProof.length === 0) {
        Toast("请上传充值凭证");
        return;
      }
      // 执行充值逻辑
      Toast("充值申请已提交");
      state.showTopUp = false;
    }

    return {
      onNavSearch,
      handleUpdateConfirm,
      beforeRead,
      afterRead,
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

    .upload-wrap {
      margin-top: 20px;
      text-align: left;
      .text {
        font-size: 14px;
        color: @grey-color;
        margin-bottom: 8px;
      }

      :deep(.van-uploader) {
        --van-uploader-upload-border-color: @border-color;
        --van-uploader-upload-background: @light-grey;
        --van-uploader-upload-icon-color: #86909c;
        --van-uploader-upload-text-color: #86909c;
        --van-uploader-upload-border-style: dashed;
      }

      :deep(.van-uploader__upload) {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 12px;
      }

      :deep(.van-uploader__preview) {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        overflow: hidden;

        &-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
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
