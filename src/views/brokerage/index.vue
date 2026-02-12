<template>
  <div class="brokerage-index-warper">
    <div v-if="isSubmitting" class="loading-mask">
      <div class="loading-spinner"></div>
    </div>
    <div class="top-warper">
      <!-- 用户头像 -->
      <div
        class="user-img-warp"
        v-show="userInfo?.headImgUrl && userInfo.headImgUrl"
      >
        <img :src="userInfo?.headImgUrl" class="avatar-img" />
        <div class="user-type-wrap">
          <div class="type">特邀推广</div>
          <div class="desc" v-if="userTypeInfo?.commissionRate >= 5">
            收益高达{{ userTypeInfo?.commissionRate }}%
          </div>
        </div>
      </div>
    </div>
    <div class="content-warper">
      <div class="fix-card">
        <div class="title">
          <div class="left">
            <span class="icon"> <i class="fa fa-database"></i></span>
            <span class="name">我的收益</span>
            <span class="desc">点击提现按钮 立即提现</span>
          </div>
          <div
            class="right"
            :class="{ active: residueAmount > 0 }"
            @click="showWithdrawBaseDialog"
          >
            提现
          </div>
        </div>
        <div class="content">
          <div class="left">
            <p class="name">累积收益</p>
            <p class="value">{{ shareYield }}</p>
            <p class="button" @click="handleYieldRecord">收益明细</p>
          </div>
          <div class="right">
            <p class="name">可提现收益</p>
            <p class="value">{{ residueAmount }}</p>
            <p class="button" @click="handleWithdrawRecord">提现记录</p>
          </div>
        </div>
      </div>
      <CellCardList class="list-waper" :data="testPaperList" />
    </div>
  </div>
  <!-- 提现弹窗 -->
  <BaseDialog
    v-model:show="withdrawVisible"
    :showConfirmButton="false"
    class="withdraw-wrap"
  >
    <div class="content-wrap">
      <div class="title-warper">
        <div class="left">提现金额</div>
        <img :src="withdrawIcon" class="right" />
      </div>
      <div class="input-warper">
        <div class="left">
          <i class="icon fa fa-jpy"></i
          ><input
            type="text"
            @input="withdrawOnInput"
            v-model="withdrawValue"
            v-numberOnly
            placeholder="请输入提现金额"
          />
        </div>
        <div class="right all" @click="withdrawAll">全部提现</div>
      </div>
      <p class="desc">提现到<span>微信钱包</span></p>

      <div
        class="button"
        :class="{ active: withdrawValue > 0, isSubmitting: isSubmitting }"
        @click="submitWithdraw"
        :disabled="isSubmitting"
      >
        {{ buttonText }}
        <span class="loading-d" v-if="buttonText != '立即提现'">...</span>
      </div>

      <p class="text">提现金额200元以内，系统实时到账。</p>
      <p class="text">超出200元，3个工作日内打款结算，不收取手续费。</p>
      <p class="text">如有疑问，请联系客服。</p>
    </div>
    <div
      class="close-button"
      @click="closeWithdrawBaseDialog"
      v-if="!isSubmitting"
    >
      <van-icon name="close" />
    </div>
  </BaseDialog>
  <LoginDialog v-model:show="loginDialogShow" redirectPage="user"></LoginDialog>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";

import CellCardList from "./components/CellCardList.vue";
import {
  withdrawApply,
  info,
  wxTransferInfo,
  wxTransferCancel,
} from "@/api/brokerage";
import { wxTransfer } from "@/utils/wxTransfer";
import { Toast } from "vant";
import BaseDialog from "@/components/BaseDialog";
import withdrawIcon from "@/assets/images/icon/icon-withdraw.png";
import LoginDialog from "@/components/LoginDialog";
import { loadingToast } from "@/plugins/vant";
export default {
  name: "brokerageIndex",
  components: {
    CellCardList,
    BaseDialog,
    LoginDialog,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      testPaperList: [],
      shareYield: 0.0,
      residueAmount: 0.0, // 最大可提现金额
      withdrawVisible: false, // 是否显示提现弹窗
      withdrawValue: "", // 提现金额
      userTypeInfo: {},
      loginDialogShow: false,
      doWithdraw: false, // 是否操作过提现
      time: 0, // 轮询次数
      timer: null,
      isSubmitting: false, // 是否正在提交提现申请
      applyId: 0, // 提现申请id
      toast: null,
      buttonText: "立即提现",
    });

    onMounted(async () => {
      if (store.getters.token) {
        init();
        store.dispatch("user/getUserInfo");
      } else {
        const { code } = route.query;
        if (code) {
          try {
            await store.dispatch("user/login", { code });
            // 登录完毕清除微信回调过来的code和state
            window.history.replaceState(
              null,
              null,
              `${window.location.origin}/user`
            );
            // 执行授权页的获取数据钩子
            init();
          } catch (error) {
            console.log(error);
            // 登录失败 回退上一页
            Toast("登录失败，请重新登录user/login");
            // setTimeout(() => {
            //   router.go(-1);
            // }, 1000);
          }
          // 登录完成 没有用户信息  获取用户信息
          if (!store.getters.hasUserInfo && store.getters.token) {
            store.dispatch("user/getUserInfo");
          }
        } else {
          state.loginDialogShow = true;
        }
      }
    });
    const userInfo = computed(() => store.getters.userInfo);
    // 初始化首页数据
    async function init() {
      try {
        const { shareYield, residueAmount, testPaperList, userTypeInfo } =
          await info();
        state.testPaperList = testPaperList;
        state.shareYield = shareYield;
        state.residueAmount = residueAmount;
        state.userTypeInfo = userTypeInfo;
      } catch (error) {}
    }
    // 提现弹窗
    function showWithdrawBaseDialog() {
      setTimeout(function () {
        state.withdrawVisible = true;
        state.withdrawValue = "";
      }, 500);
    }
    function handleYieldRecord() {
      router.push({
        path: "/yieldRecord",
        query: {},
      });
    }
    function handleWithdrawRecord() {
      router.push({
        path: "/withdrawRecord",
        query: {},
      });
    }
    // 提现申请
    async function submitWithdraw() {
      if (state.isSubmitting) {
        return;
      }
      state.isSubmitting = true;

      try {
        const applyResult = await withdrawApply({
          withdrawValue: state.withdrawValue,
        });
        if (applyResult?.errorStr) {
          // 提现失败
          Toast(applyResult?.errorStr);
          state.buttonText = "立即提现";
          state.isSubmitting = false;
          // 2秒后关闭弹窗
          setTimeout(function () {
            closeWithdrawBaseDialog();
          }, 2000);
        } else if (applyResult?.packageInfo) {
          state.buttonText = "确认收款中";
          state.applyId = applyResult?.id;
          // 拉起确认收款页面
          // 提现成功
          state.doWithdraw = true;
          clearTimeout(state.timer);
          state.timer = null;
          state.time = 0;
          // 等用户确认后 再执行
          wxTransfer(
            applyResult,
            () => {
              poll(5, true);
            },
            () => {
              // 取消提现
              transferCancel(applyResult?.id);
            }
          );
        }
      } catch (error) {
        state.isSubmitting = false;
        state.applyId = 0;
        state.buttonText = "立即提现";
      }
    }
    // 取消提现
    async function transferCancel() {
      if (!state.applyId) {
        return;
      }
      state.buttonText = "取消收款";
      await wxTransferCancel({
        id: state.applyId,
      });
      closeWithdrawBaseDialog();
    }

    // 设置最大提现金额为200
    function withdrawAll() {
      state.withdrawValue = state.residueAmount;
    }
    function withdrawOnInput(e) {
      let value = e.target.value;
      // 只允许输入数字和一个小数点
      value = value.replace(/[^\d.]/g, "");
      // 只保留一个小数点
      if (value.match(/\./g) && value.match(/\./g).length > 1) {
        value = value.replace(/\.([^.]*)$/, "");
      }
      // 转换为数字类型以便比较大小
      const numValue = parseFloat(value);
      if (
        isNaN(numValue) ||
        numValue <= 0 ||
        (state.residueAmount && numValue > state.residueAmount)
      ) {
        // 如果输入值不合法，将输入值重置为之前合法的值
        value = this.withdrawValue;
      }
      state.withdrawValue = value;
    }
    // 关闭提现弹窗
    function closeWithdrawBaseDialog() {
      if (state.doWithdraw) {
        setTimeout(function () {
          window.location.reload();
        }, 500);
      } else {
        state.withdrawVisible = false;
        state.isSubmitting = false;
        state.applyId = 0;
        state.buttonText = "立即提现";
      }
    }
    // 轮询查询确认状态
    async function poll(count, isConfirm) {
      state.buttonText = "转账中";
      try {
        // 查询提现状态
        const { status } = await wxTransferInfo({
          id: state.applyId,
        });
        if (status == 5) {
          // 资金到账
          state.buttonText = "资金已到账";
          // 已确认
          state.toast?.clear();
          // 提现列表
          // router.replace("/withdrawRecord");
          window.location.reload();
        } else {
          state.timer = window.setTimeout(() => {
            state.time++;
            // 轮询到第5秒时清除loading 显示错误弹窗 但是继续轮询
            if (state.time === 5) {
              state.toast?.clear();
              state.toast = null;
              state.isSubmitting = false;
            }
            if (state.time > count) {
              return;
            }
            poll(count, isConfirm);
          }, 1000);
        }
      } catch (error) {
        state.toast?.clear();
        state.isSubmitting = false;
        router.replace("/withdrawRecord");
      }
    }
    return {
      ...toRefs(state),
      userInfo,
      showWithdrawBaseDialog,
      handleYieldRecord,
      handleWithdrawRecord,
      submitWithdraw,
      withdrawIcon,
      withdrawAll,
      withdrawOnInput,
      closeWithdrawBaseDialog,
    };
  },
};
</script>

<style lang="less" scoped>
// 加载遮罩层样式

.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.loading-d {
  display: inline-block;
  font-family: monospace;
  clip-path: inset(0 3ch 0 0);
  animation: l 1s steps(4) infinite;
}

@keyframes l {
  to {
    clip-path: inset(0 -1ch 0 0);
  }
}
.withdraw-wrap {
  .content-wrap {
    padding: 30px 20px 80px 20px;
    position: relative;
    height: auto;
    background-image: linear-gradient(
      to top,
      #f3e7e9 0%,
      #e3eeff 99%,
      #e3eeff 100%
    );

    .title-warper {
      width: 100%;
      height: 50px;
      margin-bottom: 15px;
      color: @light-black;
      .space-between();
      width: 100%;

      .left {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        font-size: 20px;
        font-weight: 500;
        line-height: 20px;
      }

      .right {
        height: 60px;
        width: auto;
        display: flex;
        align-items: center;
        font-size: @font-size-base;
        color: @light-black;
      }
    }

    .input-warper {
      border-bottom: 1px solid @light-black;
      width: 100%;
      margin-bottom: 5px;
      .space-between();

      .left {
        display: flex;
        align-items: center;
        width: 70%;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          text-align: center;
          color: @light-black;
          line-height: 40px;
        }

        input {
          text-align: left;
          background: transparent;
          font-weight: 200;
          border: none;
          color: @light-black;
          font-size: @font-size-lg;
        }
      }
      .right {
        text-align: right;
        height: 40px;
        display: flex;
        align-items: center;
        font-size: @font-size-base;
        color: @light-black;
      }
    }

    .desc {
      font-size: @font-size-base;
      color: @gray-color;

      span {
        font-size: @font-size-base;
        color: #ff5d5e;
      }
    }

    .button {
      margin-top: 40px !important;
      margin: 20px 30px 10px 30px;
      height: 30px;
      line-height: 30px;
      // background-color: @gray-color;
      background-color: @theme-color !important;
      text-align: center;
      border-radius: 20px;
      font-size: @font-size-lg;
      color: #fff;
      transition: transform 0.3s ease;
      &:active {
        transform: scale(0.95);
      }
      &.active {
        background-color: @theme-color !important;
      }
      &.isSubmitting {
        background-color: #b4d0f8 !important;
        cursor: not-allowed;
      }
    }

    .text {
      font-size: @font-size-sm;
      color: @gray-color;
      line-height: 20px;
    }
  }
  .close-button {
    font-size: 35px;
    position: absolute;
    left: 50%;
    bottom: 10px;
    color: #fff;
    transform: translateX(-50%) translateY(0%);
    z-index: 999;
  }
}

.brokerage-index-warper {
  width: 100%;
  position: relative;
  height: auto;
  .top-warper {
    background-image: url("@/assets/images/brokerag-bg.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    height: 210px;
    width: 100%;
    .user-img-warp {
      position: absolute;
      top: 40px;
      right: 35px;
      width: 100px;
      text-align: center;
      .avatar-img {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        border: 3px solid #fff;
      }
      .user-type-wrap {
        margin-top: 5px;
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .type {
          text-align: center;
          font-size: 12px;
          height: 18px;
          line-height: 18px;
          background-color: rgba(98, 134, 212, 0.4);
          color: #e3eeff;
          border-radius: 1px;
          width: 55px;
          // border-top: 1px solid #ffd427;
          border-bottom: 2px solid #ffd427;
        }
        .desc {
          margin-top: 0px;
          text-align: center;
          font-size: 12px;
          height: 20px;
          line-height: 20px;
          // background-color: #6ea9fb;
          color: #ffd427;
          border-radius: 5px;
        }
      }
    }
  }

  .content-warper {
    width: 100%;
    position: relative;
    .fix-card {
      padding: 5px 10px;
      position: absolute;
      top: 0;
      left: 50%;
      width: 85%;

      height: auto;
      background: #f5f7fa;
      box-shadow: 0px 0px 4px #e8e8e8;
      transform: translateX(-50%) translateY(-40%);
      border-radius: 10px;

      .title {
        width: 100%;
        height: 28px;
        border-bottom: 1px solid #9c9b9b;
        .space-between();

        .left {
          .icon {
            font-size: @font-size-lg;
            width: auto;
            color: #f56970ea;
          }

          .name {
            color: @light-black;
            margin-left: 5px;
            font-size: @font-size-base;
          }

          .desc {
            color: @gray-color;
            margin-left: 8px;
            font-size: @font-size-sm;
          }
        }

        .right {
          width: 50px;
          height: 20px;
          // background-color: @gray-color;
          background-color: #6ea9fb !important;
          border-radius: 10px;
          line-height: 20px;
          text-align: center;
          color: #fff;
          font-size: @font-size-base;
          &.active {
            background-color: #6ea9fb !important;
          }
        }
      }

      .content {
        width: 100%;
        height: auto;
        .space-between();
        padding-top: 10px;

        .left,
        .right {
          width: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .name {
            color: @light-black;
            font-size: @font-size-base;
          }

          .value {
            margin-top: 5px;
            color: @gray-color;
            font-size: 20px;
          }

          .button {
            font-size: @font-size-sm;
            border-radius: 2px;
            margin-top: 2px;
            padding: 2px 2px;
            background-color: #f56970ea;
            color: #fff;
          }
        }

        .left {
          border-right: 1px solid #9c9b9b;
        }
      }
    }
  }
}
</style>
