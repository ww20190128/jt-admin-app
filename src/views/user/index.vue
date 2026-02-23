<template>
  <div class="user-wrap">
    <CopyRight class="copy-right" />
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";

import CopyRight from "@/components/CopyRight";
import { isObject } from "lodash";

import { Toast } from "vant";

import BaseDialog from "@/components/BaseDialog";
import LoginDialog from "@/components/LoginDialog";

import bgUserImg from "@/assets/images/bg-mine.jpg";
import avatar from "@/assets/images/avatar.png";

import tagVipImg from "@/assets/images/tag-vip.png";
import tagReportImg from "@/assets/images/tag-report.png";

export default {
  name: "user",
  components: {
    CopyRight,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    document.title = "个人中心";
    const state = reactive({
      query: {
        pageNum: 1,
        pageLimit: 10,
      },
      nomore: false,
      testOrderList: [],
      loginDialogShow: false,
      resetShow: false,
      testOrderId: "",
      testPaperId: "",
      resetOrderList: [], // 重测订单列表
      vipInfo: {},
    });
    const config = computed(() => store.getters.config);
    const backgroundImage = computed(
      () => config?.value?.userBgImg || bgUserImg
    );

    return {
      ...toRefs(state),
      backgroundImage,
    };
  },
};
</script>

<style lang="less" scoped>
.dialog-content {
  text-align: center;
  padding-top: 30px;
  .title {
    font-weight: bold;
    font-size: 17px;
    padding: 8px 0;
  }
}

.subhead {
  font-size: 20px;
  color: @theme-color;

  &.subhead-mini {
    font-size: 15px;
    line-height: 25px;
    color: @light-black;
    text-align: left;
  }

  &.subhead-text {
    font-size: 16px;
  }
}

.subcenter {
  font-size: 14px;
  line-height: 35px;
  color: #3a3a3a;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-weight: 600;

  .sub {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;

    i {
      margin-right: 10px;
      font-size: 16px;
      color: #526edb;
      //  color: #cecdcd;
    }

    img {
      width: 16px;
    }

    .xiahuaxian {
      //下划线
      border-bottom: 1px solid #000;
    }
  }
}

.head() {
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #efefef;
  padding: 0 @padding-base;
  font-size: 18px;
  font-weight: bold;

  position: relative;
}

.card() {
  // border-radius: @radius-base;
  // box-shadow: 0px 0px 6px #8f8f8f;
  overflow: hidden;
  background-color: #fff;
  width: 100%;
}

@keyframes blink {
  0% {
    left: -50px;
  }

  100% {
    left: 100%;
  }
}

.user-wrap {
  background-color: @bg-color;
  position: relative;
  width: 100%;

  .header {
    position: relative;
    height: 140px;
    // background-color: #ff99ae;
    padding: @padding-base;
    font-size: @font-size-base;
    color: #fff;
    background-repeat: no-repeat;
    background-size: cover;
    .align-center();

    .user-img-warp {
      height: 50px;
      width: 50%;
      position: relative;
      position: absolute;
      top: 25%;
      display: inline-block;

      .avatar-img {
        display: inline-block;
        height: 50px;
        width: 50px;
        border-radius: 50%;
        border: 3px solid #fff;
      }

      .text-warp {
        position: absolute;
        left: 60px;
        top: 0px;
        line-height: 50px;

        .login-text {
          display: flex;
          align-items: center;
          justify-content: center;

          .login-button {
            margin-top: 10px;
            height: 30px;
            width: 90px;
          }
        }
      }
    }

    .vip-icon {
      padding-left: 10px;
    }

    .vip-info {
      // background-image: url("@/assets/images/vip-banner.jpg");
      z-index: 99;
      position: absolute;
      bottom: -45px;
      left: 50%;
      transform: translateX(-50%);
      width: 95%;
      height: 70px;

      background-color: #e3eeff;
      border-radius: 10px;
      // box-shadow: 0px 0px 6px #8f8f8f;
      padding: 15px;
      box-sizing: border-box;
      color: @light-black;

      &::before {
        content: "";
        position: absolute;
        width: 100px;
        height: 4px;
        top: 50%;
        left: -100px;
        background-color: rgba(#fff, 0.2);
        transform: rotate(-45deg);
        animation: blink 2.2s ease-in-out 2s infinite;
      }

      .vip-name {
        height: 30px;
        line-height: 1;
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: @font-size-base;
        .ellipsis();

        .icon {
          padding-left: 5px;
          color: #cd7f32;
        }
      }

      .taps {
        position: absolute;
        top: -3px;
        right: -3px;
        width: 70px;
        height: 20px;
        background-color: black;
        color: @bg-color;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom-left-radius: 10px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 2px;
        font-size: 10px;
      }

      .give-info {
        position: absolute;
        bottom: 0px;
        left: 0;
        right: 0;
        display: flex;
        height: 30px;
        color: @gray-color;
        justify-content: space-between;

        margin: 0 10px;

        p {
          font-size: 12px !important;
        }

        .progress {
          width: 100%;
          position: absolute;
          bottom: 10px;
          left: 0px;
        }
      }
    }
  }

  .content {
    // padding: @padding-base;

    .card {
      .card();

      .head {
        .head();
      }

      .serve-list {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;

        .item {
          width: 25%;
          height: 75px;
          font-size: @font-size-sm;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          cursor: pointer;
          position: relative;

          .van-image {
            width: 45px;
            height: 45px;
            &.animation-shake {
              animation: shake 5s;
              animation-iteration-count: infinite;
              animation-delay: 5s;
            }
          }

          .text {
            padding-top: 5px;
          }
        }
      }
    }

    .show-vip-tap {
      padding-top: 50px;
    }

    .report-list {
      // margin-top: 10px;
      width: 100%;
      padding-bottom: 10px;
      min-height: calc(100vh - 450px);
      .card();

      .head {
        .head();
        color: @theme-color;
      }

      .none {
        text-align: center;
        padding: @padding-base 0;
        font-size: @font-size-base;
        color: @gray-color;
      }

      .item {
        background: whitesmoke;
        margin: 10px;
        border-radius: 5px;
        padding: @padding-sm;
        margin-bottom: @padding-base;
        .pointer();
        .space-between();

        &:nth-last-child(2) {
          border: none;
        }

        height: 90px !important;
        position: relative;

        .left {
          width: 70px !important;
          height: 70px !important;

          .van-image {
            width: 100%;
            height: 100%;

            :deep(img) {
              border-radius: @radius-base;
            }
          }
        }

        .right {
          padding-left: 10px;

          flex: 1;
          height: 70px;

          .title {
            font-size: @font-size-base;
            font-weight: bold;
          }

          .subhead {
            font-size: @font-size-lg;
            height: 25px;
            line-height: 25px;
            color: @gray-color;
            font-size: 14px;
            overflow: hidden;
          }

          position: relative;

          .bottom-info {
            position: absolute;
            height: 20px;
            line-height: 20px;
            bottom: 0;
            left: 10px;
            font-size: 12px;
            color: @gray-color;
          }
        }

        .go-button {
          position: absolute;
          right: 5px;
          bottom: 5px;
          width: 70px;
          height: 22px;
          line-height: 22px;
          border-radius: 15px;
          text-align: center;
          background-color: @theme-color;
          color: #fff;
          font-size: @font-size-sm;
        }
      }
    }
  }
}

.dialog-content {
  padding: @padding-base 20px;
  font-size: @font-size-base;
  position: relative;

  .text-content {
    line-height: 25px;
  }

  .button {
    width: 100%;
    height: 40px;
    border-radius: 40px;
    background-color: #fff;
    color: @theme-color;
    border: 1px solid @theme-color;
    line-height: 40px;
    text-align: center;
    margin: 10px auto;
  }

  .plain {
    border: none;
    color: #000;
  }

  .title {
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    padding: @padding-base 0;
  }

  .report-item {
    .space-between();
    padding: 5px 0;

    .right {
      color: @theme-color;

      &.continue {
        color: #5353f4;
      }
    }
  }
}

@keyframes shake {
  from,
  10%,
  to {
    transform: none;
  }

  12% {
    transform: skewX(-3.5deg) skewY(-3.5deg);
  }

  18% {
    transform: skewX(4.25deg) skewY(4.25deg);
  }

  24% {
    transform: skewX(-2.125deg) skewY(-2.125deg);
  }

  30% {
    transform: skewX(1.5625deg) skewY(1.5625deg);
  }

  36% {
    transform: skewX(-0.78125deg) skewY(-0.78125deg);
  }

  42% {
    transform: skewX(0.390625deg) skewY(0.390625deg);
  }

  48% {
    transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
  }
}
</style>
