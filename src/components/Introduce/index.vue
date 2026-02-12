<template>
  <div class="introdoce-title">测评介绍</div>
  <component
    :is="components[theme]"
    :testPaperInfo="testPaperInfo"
    :themeColor="themeColor"
    class="theme"
  >
  </component>
  <div class="introdoce-notice-warper" v-if="testPaperInfo?.introduce?.notice">
    <div class="title-warper">测评须知</div>
    <div class="content-warper" v-html="testPaperInfo?.introduce?.notice"></div>
  </div>
  <div class="customer-service-warper" v-if="false">
    <div class="title-warper">售后服务</div>
    <div class="content-warper">
      <p>
        1）本产品为虚拟商品，购买24小时内，对报告内容不满意，可申请退款，超过24小时不支持退款，请谨慎购买！
      </p>
      <p>2）付费后您将获得一份专属的测评报告，报告永久有效！</p>
      <p>
        3）如有疑问请点击客服：
        <a :href="wechatInfo?.customerServiceLink" target="_blank" class="link">
          立即聊一聊
        </a>
      </p>
      <p>4）工作时间：周一至周日8:00 - 21:30（非工作时间请点击在线客服留言）</p>
      <p class="privacy-policy">
        5）关于<span class="link" @click="gotoPrivacyPolicy">《隐私政策》</span
        >和<span class="link" @click="gotoPrivacyPolicy">《用户协议》</span>
      </p>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import ThemeBlue from "./blue";
import ThemeWhite from "./white";
import ThemePink from "./pink";
import ThemeOrange from "./orange";
import ThemePurple from "./purple";
import ThemeGray from "./gray";
import ThemeCyan from "./cyan";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
export default {
  name: "Introduce",
  props: {
    testPaperInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ThemeBlue,
    ThemeWhite,
    ThemePink,
    ThemeOrange,
    ThemePurple,
    ThemeGray,
    ThemeCyan,
  },
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      components: {
        blue: "ThemeBlue",
        white: "ThemeWhite",
        pink: "ThemePink",
        orange: "ThemeOrange",
        purple: "ThemePurple",
        gray: "ThemeGray",
        cyan: "ThemeCyan",
      },
    });
    const wechatInfo = computed(() => store.getters.wechatInfo);
    const themeColor = computed(
      () => props.testPaperInfo.introduce?.themeColor || "blue"
    );
    const theme = computed(
      () => props.testPaperInfo.introduce?.theme || "blue"
    );
    function gotoPrivacyPolicy() {
      router.push({
        path: "/privacyPolicy",
        query: {},
      });
    }
    return {
      ...toRefs(state),
      themeColor,
      theme,
      wechatInfo,
      gotoPrivacyPolicy,
    };
  },
};
</script>
<style lang="less">
.theme-white,
.theme-pink,
.theme-blue {
  .undelline {
    background: linear-gradient(
      to bottom,
      transparent 60%,
      rgba(171, 178, 243, 0.8) 50%
    );
  }
}

.theme-cyan {
  .undelline {
    background: linear-gradient(to bottom, transparent 50%, #8ff0f5 50%);
  }
}

.theme-purple {
  .undelline {
    background: linear-gradient(to bottom, transparent 50%, #c8c6e4 50%);
  }
}

.theme-gray {
  .undelline {
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(171, 178, 243, 0.356) 50%
    );
  }
}

.theme-orange {
  .undelline {
    background: linear-gradient(
      to bottom,
      transparent 60%,
      rgba(252, 241, 92, 0.8) 50%
    );
  }
}

.theme {
  .color-bule {
    color: #679bfa !important;
    font-size: @font-size-lg !important;
  }

  .color-red {
    color: #f74444 !important;
    font-size: @font-size-lg !important;
  }

  // 下划线
  .undelline {
    font-size: @font-size-lg !important;
    position: relative;
    border-radius: 2px; // 设置圆角半径
  }

  .list-warper {
    margin-bottom: 10px;
    background-color: #9cbaf1;
    padding: 10px;
    font-weight: 400;
    border-radius: 10px;
    color: #fff;

    p {
      padding-left: 20px;
      padding-bottom: 5px;
      border-bottom: 0.5px solid #fff;
      position: relative;

      &::before {
        content: "";
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: #fff;

        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 10px;
      }

      &:last-child {
        padding-bottom: none !important;
        border-bottom: none !important;
      }
    }

    &.sm {
      padding: 5px;

      p {
        line-height: 1.5;
        padding-bottom: 0px;
        padding-left: 15px;
        font-size: @font-size-base !important;

        &::before {
          width: 5px;
          height: 5px;
          top: 10px;
        }
      }
    }

    li {
      font-size: @font-size-base !important;
    }
  }

  // 简介
  .recommend {
    background: #fff;
    position: relative;
    padding: 20px 10px 20px 10px;
    border-radius: 5px;
    margin-left: 10px;
    margin-right: 10px;
    font-size: @font-size-lg !important;
    line-height: 1.8;
    box-shadow: 0px 0px 4px #e8e8e8;
    color: @light-black;
    p {
      font-size: @font-size-lg !important;

      margin-bottom: 20px !important;
      position: relative;
    }
  }

  .bg-title {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;

    span {
      padding: 5px 20px;
      border: 1px solid #9cbaf1;
      font-size: 18px;
      border-radius: 20px;
      font-weight: 500;
      color: #fff;
      box-shadow: 3px 3px 0 #fff, 3px 3px 0 0.5px #9cbaf1;
      position: relative;
      background-color: #9cbaf1;

      &:after,
      &:before {
        content: "";
        width: 8px;
        height: 8px;
        border: 2px solid #9cbaf1;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }

      &:before {
        left: -15px;
      }

      &:after {
        right: -15px;
      }
    }
  }

  .theory-warper {
    background: #fff url("@/assets/images/bg_base.png") repeat !important;
    background-size: 1.6rem !important;
  }

  .theory {
    line-height: 2;
    font-size: @font-size-lg;

    color: @light-black;

    p {
      font-size: @font-size-lg;
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0px !important;
      }
    }
  }
}

.introdoce-title {
  margin-top: 10px;
  font-size: 17px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-weight: bold;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 30px;
    height: 3px;
    border-radius: 3px;
    background-color: #dddddd;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}

.introdoce-notice-warper {
  position: relative;
  width: 100%;
  padding: 20px;

  border-radius: 2px;
  background-color: #fff;

  .title-warper {
    font-size: 17px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-weight: bold;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      width: 30px;
      height: 3px;
      border-radius: 3px;
      background-color: #dddddd;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .content-warper {
    background-color: @bg-color;
    margin-top: 20px;
    padding: 5px 10px;
    font-size: @font-size-base;
    border-radius: 5px;
    color: @light-black;

    p {
      line-height: 1.8;
      font-size: @font-size-base;
      margin-bottom: 10px !important;
    }
  }
}

.customer-service-warper {
  position: relative;
  width: 100%;
  padding: 20px;

  border-radius: 2px;
  background-color: #fff;

  .title-warper {
    font-size: 17px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-weight: bold;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      width: 30px;
      height: 3px;
      border-radius: 3px;
      background-color: #dddddd;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .content-warper {
    background-color: @bg-color;
    margin-top: 20px;
    padding: 5px 10px;
    font-size: @font-size-base;
    border-radius: 5px;
    color: @light-black;

    p {
      line-height: 1.8;
      font-size: @font-size-base;
      margin-bottom: 10px !important;
    }
    .link {
      color: #679bfa !important;
      text-decoration: underline;
      &:hover {
        color: #679bfa !important;
        text-decoration: none;
      }
    }
  }
}
</style>
