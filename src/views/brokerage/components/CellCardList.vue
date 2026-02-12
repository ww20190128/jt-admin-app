<template>
  <div class="cell-card-list">
    <div
      class="item"
      v-for="item in data"
      :key="item.id"
      @click="handleCreateShareInfo(item)"
    >
      <div class="left">
        <van-image fit="cover" :src="item?.coverImg"> </van-image>
      </div>
      <div class="right">
        <p class="title">{{ item?.subhead }}</p>
        <p class="subhead">{{ item?.name }}</p>

        <div class="bottom-info">
          <!--  fa fa-user-plus -->
          <p class="num">{{ item?.saleNum }}人已测试</p>
        </div>
      </div>
      <p class="yield-tag" v-show="item?.shareYield && item.shareYield > 0">
        可获佣金<span class="num">￥{{ item?.shareYield }}</span>
      </p>
      <div class="go-button">分享得佣金</div>
    </div>
  </div>

  <!--分享弹窗 -->
  <Share
    @confirm="handleShare"
    v-model:show="shareVisible"
    :testPaperInfo="testPaperInfo"
    :shareCode="shareCode"
    :shareAmount="shareAmount"
    :shareUrl="shareUrl"
    v-if="testPaperInfo?.id"
  ></Share>
</template>

<script>
import Share from "./Share.vue";
import { reactive, toRefs, computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { createShareInfo } from "@/api/brokerage";
import { useAgent } from "@/hooks/useAgent";

export default {
  name: "CellCardList",
  components: {
    Share,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    clickItem: {
      type: Function,
    },
  },

  setup(props) {
    const router = useRouter();
    const store = useStore();
    const route = useRoute();
    const state = reactive({
      shareVisible: false,
      testPaperInfo: Object, // 分享测评信息
      shareAmount: "", // 分享收益
      shareUrl: "", // 分享url
      shareCode: "", // 分享码
    });
    const { md, ua, network, os, isWeChat } = useAgent();

    async function handleCreateShareInfo({ id }) {
      const { width, height } = window.screen;
      const deviceInfo = {
        phoneModel: "",
        browserVersion: ua,
        screenResolution: `${width}*${height}`,
        network,
        useEnv: isWeChat ? 1 : 2,
      };

      if (os == "iOS") {
        // ios系统的处理
        deviceInfo.phoneModel = md.os() + md.version("iPhone");
      } else if (os == "AndroidOS") {
        // Android系统的处理
        deviceInfo.phoneModel = md.os() + md.version("Android");
      }
      try {
        const { testPaperInfo, shareAmount, shareUrl, shareCode } =
          await createShareInfo({
            testPaperId: id,
            ...deviceInfo,
          });
        state.testPaperInfo = testPaperInfo;
        state.shareAmount = shareAmount;
        state.shareUrl = shareUrl;
        state.shareCode = shareCode;
        state.shareVisible = true;
       
      } catch (error) {}
    }
    function handleShare(item) {}

    return {
      ...toRefs(state),
      handleCreateShareInfo,
      handleShare,
    };
  },
};
</script>

<style lang="less" scoped>
.cell-card-list {
  padding: 80px 10px 10px 10px;

  .item {
    padding: @padding-sm;
    border-radius: 10px;
    box-shadow: 0px 0px 4px #e8e8e8;
    margin-bottom: 15px;
    .pointer();
    .space-between();

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
      font-size: @font-size-lg;
      //  width: 260px;
      flex: 1;
      height: 70px;

      // .column-space-between();
      .title {
        font-weight: bold;
      }

      .subhead {
        height: 20px;
        line-height: 20px;
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
        .space-between();

        .num {
          font-size: @font-size-sm;
          color: @gray-color;
          height: 20px;
          line-height: 20px;

          &::before {
            color: @theme-color;
            padding-right: 5px;
          }
        }

        .yield {
          height: 20px;
          line-height: 20px;
          padding-left: 20px;
          font-size: @font-size-sm;

          &::before {
            color: #ff5d7d;
            padding-right: 3px;
          }

          color: @gray-color;
        }
      }
    }

    .go-button {
      position: absolute;
      right: 5px;
      bottom: 10px;
      width: 70px;
      height: 22px;
      line-height: 22px;
      border-radius: 10px;
      text-align: center;
      background-color: @theme-color;
      color: #fff;
      font-size: @font-size-sm;
    }

    .yield-tag {
      position: absolute;
      right: 5px;
      bottom: 32px;
      text-align: center;
      font-size: @font-size-sm;
      color: @gray-color;

      .num {
        font-size: @font-size-sm;
        color: #f56970ea;
      }
    }
  }
}
</style>
