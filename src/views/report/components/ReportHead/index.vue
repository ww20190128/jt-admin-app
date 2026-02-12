<template>
  <div class="report-head-warper">
    <!-- 瑞文 -->
    <div
      class="button-list"
      v-if="reportInfo.ruiwen_ord?.length !== 0 && goods_sale_price_type == 3"
    >
      <div class="button-item button-wight" @click="handleReset">免费重测</div>
      <div class="button-item button-wight" @click="exportPtf">下载报告</div>
      <div class="button-item button-wight" @click="handleGoErrorRecord">
        错题解析
      </div>
    </div>
    <div
      class="button-list"
      v-else-if="
        reportInfo.ruiwen_ord?.length !== 0 &&
        (goods_sale_price_type == 1 || goods_sale_price_type == 2)
      "
    ></div>
    <!-- 其他 -->
    <div class="button-list" v-else>
      <div class="button-item" @click="pushBaseUrl('/home')">首页</div>
      <div class="button-item" @click="handleReset">免费重测</div>
      <div class="button-item" @click="handleGive">分享给好友</div>
    </div>
    <div class="title-warp">
      <p class="title">《{{ testPaperInfo.name }}》报告</p>
      <!-- <div class="subhead">{{ testPaperInfo.subhead }}</div> -->
    </div>

    <div class="user-warp" v-if="userInfo?.headImgUrl">
      <div class="avatar">
        <img :src="userInfo?.headImgUrl" class="avatar-img" />
      </div>
      <div class="user-info">
        <!-- <p class="userName">{{ userInfo.userName }}</p> -->
        <p class="time">
          报告生成时间：{{
            testOrderInfo.createTime
              ? $filters.formatDate(testOrderInfo.createTime)
              : ""
          }}
        </p>
      </div>
    </div>
    <p v-else class="only-time">
      报告生成时间：{{
        testOrderInfo.createTime
          ? $filters.formatDate(testOrderInfo.createTime)
          : ""
      }}
    </p>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

export default {
  name: "reportHead",
  props: {
    testPaperInfo: {
      type: Object,
      default: () => ({}),
    },
    userInfo: {
      type: Object,
      default: () => ({}),
    },
    testOrderInfo: {
      type: Object,
      default: () => ({}),
    },
    reportInfo: {
      type: Object,
      default: () => ({}),
    },
    goods_sale_price_type: {
      type: Number,
      default: 0,
    },
  },

  emits: [
    "handleReset",
    "exportPtf",
    "handleGoErrorRecord",
    "pushBaseUrl",
    "handleGive",
  ],
  setup(props, ctx) {
    const {
      testPaperInfo,
      userInfo,
      testOrderInfo,
      reportInfo,
      goods_sale_price_type,
    } = props;
    const state = reactive({});

    function handleReset() {
      ctx.emit("handleReset");
    }
    function exportPtf() {
      ctx.emit("exportPtf");
    }
    function handleGoErrorRecord() {
      ctx.emit("handleGoErrorRecord");
    }
    function pushBaseUrl(val) {
      ctx.emit("pushBaseUrl", val);
    }
    function handleGive() {
      ctx.emit("handleGive");
    }
    return {
      handleReset,
      exportPtf,
      handleGoErrorRecord,
      pushBaseUrl,
      handleGive,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.report-head-warper {
  width: 100%;
  padding: 0 @padding-base 0px @padding-base;
  background-image: linear-gradient(
    to bottom,
    #f3e7e9 0%,
    #e3eeff 99%,
    #e3eeff 100%
  );

  // 按钮
  .button-list {
    padding: 10px 0;
    .space-between();
    width: 100%;

    .button-item {
      border-radius: 3px;
      padding: 0 5px;
      font-size: @font-size-sm;
      background: #bdc2e8;
      opacity: 0.8;
      line-height: 22px;
      color: #fff;
    }
  }

  .title-warp {
    text-align: center;

    .title {
      text-align: center;
      font-size: @font-size-lg;
      font-weight: bold;
      color: #000;
    }

    .subhead {
      color: @gray-color;
      line-height: 20px;
      font-size: @font-size-base;
    }
  }
  //   用户信息
  .only-time {
    text-align: center;
    font-size: 12px;
    color: #898989;
    margin-top: 5px;
  }
  .user-warp {
    margin-top: -3px;
    display: flex;
    .user-info {
      color: #898989;
      padding-left: 10px;
      display: flex;
      flex-direction: column-reverse;
      position: relative;
      .userName {
        font-size: 14px;
      }

      .time {
        // margin-top: 2px;
        font-size: 12px;
      }
    }

    .avatar {
      width: 30px;
      height: 30px;
      position: relative;
      .avatar-img {
        width: 100%;
        border-radius: 50%;
      }
    }
  }
}
</style>
