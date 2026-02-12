<template>
  <div class="yield-record" v-if="dataList.length > 0">
    <div
      class="item"
      v-for="item in dataList"
      :key="item"
      @click="handleItem(item)"
    >
      <div class="test-info-warper">
        <div class="left">
          <van-image fit="cover" :src="item.testPaperInfo?.coverImg">
          </van-image>
        </div>
        <div class="right">
          <p class="title">{{ item.testPaperInfo?.name }}</p>
          <p class="subhead">{{ item.testPaperInfo?.subhead }}</p>
          <p class="yield-info">
            收益：<span>{{ item.amount }}元</span>
          </p>
        </div>
      </div>

      <div class="user-info">
        <img :src="item?.testUserInfo?.headImgUrl" class="user-img" />
        <div class="user-name">
          <p class="name">{{ item?.testUserInfo?.userName }}</p>
          <p class="desc">
            测试时间：{{ $filters.formatDate(item?.testOrderInfo?.createTime) }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="no-data" v-else>
    <img src="@/assets/images/collect-bg.png" />
    <p>暂无收益记录</p>
  </div>

  <div class="footer">
    <div class="button" @click="$router.go(-1)">点这里返回上一页</div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { getHomeData, getSentence } from "@/api/app";
import { yieldList } from "@/api/brokerage";
export default {
  name: "yieldRecord",
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      dataList: [],
    });

    onMounted(() => init());
    // 初始化首页数据
    async function init() {
      const { list } = await yieldList(state.query);
      state.dataList = [...list];
    }
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.no-data {
  height: 100% !important;
  position: relative;
  text-align: center;

  img {
    margin-top: 40%;
    width: 50%;
    height: auto;
  }

  p {
    text-align: center;
    color: @gray-color;
    font-size: @font-size-base;
  }
}

.yield-record {
  width: 100%;
  padding: 10px 15px 60px 15px;
  position: relative;
  background: #f0f0f0;
  min-height: calc(100vh - 0px);
  .item {
    border-radius: 5px;
    padding: 10px;
    background-color: #fff;

    margin-bottom: 15px;

    .test-info-warper {
      position: relative;
      width: 100%;
      padding-bottom: 10px;
      border-bottom: 1px dashed gainsboro;
      .pointer();
      .space-between();
      min-height: 80px;

      .left {
        position: relative;
        background-color: antiquewhite;
        width: 100px !important;
        height: auto !important;
        border-radius: @radius-base;

        .van-image {
          width: 100%;
          height: 100%;
          border-radius: @radius-base;

          :deep(img) {
            width: 100%;
            height: 100%;
            border-radius: @radius-base;
          }
        }
      }

      .right {
        position: relative;
        width: 100%;
        padding-left: 10px;

        .title {
          font-weight: bold;
          font-size: @font-size-lg;
          color: #000;
        }

        .subhead {
          line-height: 20px;
          font-size: @font-size-base;
          color: @gray-color;
          overflow: hidden;
        }

        .yield-info {
          position: absolute;
          right: 0;
          bottom: 0;
          font-size: @font-size-base;
          color: @gray-color;
          overflow: hidden;
          color: #b9a755;

          span {
            color: #f56970ea;
          }
        }

        .button {
          height: 26px;
          border-radius: 3px;
          text-align: center;
          line-height: 26px;
          background-color: @theme-color;
          font-size: @font-size-sm;
          color: #fff;
          padding: 0 10px;
        }
      }

      &:before,
      &::after {
        content: "";
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #f0f0f0;
        position: absolute;
        bottom: -5px;
      }

      &:before {
        left: -15px;
      }

      &::after {
        right: -15px;
      }
    }

    .user-info {
      background-color: #fff;
      height: auto;
      margin-top: 5px;
      width: 100%;
      display: flex;
      align-items: center;

      .user-img {
        display: inline-block;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        border: 1px solid #fff;
        box-shadow: 0px 0px 3px #c2c1c1;
      }

      .user-name {
        padding-left: 5px;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;

        .name {
          font-size: @font-size-sm;
        }

        .desc {
          margin-top: 2px;
          color: @gray-color;
          font-size: @font-size-sm;
        }
      }
    }
  }
}

.footer {
  .fixed-bottom();

  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  -webkit-box-sizing: content-box;
  box-sizing: content-box;

  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px !important;
  background-color: transparent !important;

  .button {
    font-size: 18px;
    color: #fff;
    background-color: @theme-color;
    width: 90%;
    border-radius: 50px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
}
</style>