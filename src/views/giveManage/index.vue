<template>
  <div class="content">
    <van-tabs v-model:active="tabActive" color="#6EA9FB" type="card" @change="handleTabsChange">
      <van-tab title="我赠送的">
        <div class="give-list">
          <div class="item" v-for="item in giveList" :key="item" @click="handleItem(item)">
            <div class="left-wrap">
              <van-image fit="cover" :src="item.testPaperInfo?.coverImg">
              </van-image>
            </div>
            <div class="right">
              <div class="top">
                <span class="title">{{ item?.testPaperInfo?.name }}</span>
                <!-- 领取状态 ["待领取", "已领取", "已测试"]-->
                <div class="button">{{ statusMap[item?.status] }}</div>
              </div>

              <div class="center">
                <div class="time">赠送时间：{{ $filters.formatDate(item.createTime) }}</div>
                <!-- <div class="order-no">
                  <span class="no">赠送单号：{{item?.id}}</span>
                  <div class="copy" @click="clipboard(item?.id, $event)">复制</div>
                </div> -->
              </div>
              <div class="bottom-info">
                <div>接收人：{{ item?.drawUserInfo?.userName || '暂未领取' }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="我收到的">
        <div class="give-list">
          <div class="item" v-for="item in giveList" :key="item" @click="handleItem(item)">
            <div class="left-wrap">
              <van-image fit="cover" :src="item.testPaperInfo?.coverImg">
              </van-image>
            </div>
            <div class="right">
              <div class="top">
                <span class="title">{{ item?.testPaperInfo?.name }}</span>
                <!-- 领取状态 ["待领取", "已领取", "已测试"]-->
                <div class="button">{{ statusMap[item?.status] }}</div>
              </div>

              <div class="center">
                <div class="time">领取时间：{{ item?.drawTime > 0 ? $filters.formatDate(item?.drawTime) : '待领取' }}</div>
                <!-- <div class="order-no">
                  <span class="no">赠送单号：{{item?.id}}</span>
                  <div class="copy" @click="clipboard(item?.id, $event)">复制</div>
                </div> -->
              </div>
              <div class="bottom-info">
                <div>赠送人：{{ item?.giveUserInfo?.userName || '系统' }}</div>
              </div>
            </div>
          </div>
        </div>

      </van-tab>
    </van-tabs>
    
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getGiveList } from "@/api/give";
import { useScrollBottom } from "@/hooks/useScroll";
import clipboard from "@/utils/clipboard";
export default {
  name: "giveManage",
  setup() {
    const router = useRouter();
    const state = reactive({
      tabActive: 0,
      query: {
        type: 1,
        pageLimit: 20,
        pageNum: 1,
      },
      loading: false,
      nomore: false,
      giveList: [],
      statusMap: ["待领取", "已领取", "已使用"],
    });
    onMounted(() => init());

    // tab切换
    function handleTabsChange(index) {
      state.query.type = index === 0 ? 1 : 2;
      state.query.pageNum = 1;
      state.nomore = false;
      state.giveList = [];
      init();
    }

    // 进入赠送详情
    function handleItem({ id }) {
      router.push({
        path: "/giveDetail",
        query: {
          giveId: id,
        },
      });
    }

    // 获取列表数据
    async function init() {
      if (state.nomore) return;
      state.loading = true;
      const { list } = await getGiveList(state.query);
      state.loading = false;
      if (!list.length) {
        state.nomore = true;
        return;
      }
      state.giveList = [...state.giveList, ...list];
    }

    // 滚动事件
    useScrollBottom(() => {
      if (state.nomore) return;
      state.query.pageNum++;
      init();
    });

    return {
      ...toRefs(state),
      clipboard,
      handleTabsChange,
      handleItem,
    };
  },
};
</script>

<style lang="less" scoped>


.content {
  .gray-page();

  .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: @padding-sm 0;
    background-color:#fff !important;
    .none {
      color: #969799;
      font-size: @font-size-base;
    }
  }

  .give-list {
    background-color: #fff;
    font-size: @font-size-sm;
    padding-top: 20px;

    .item {
      color: @gray-color;
      background: whitesmoke;
      margin-left: 10px;
      margin-right: 10px;
      border-radius: 5px;
      padding: @padding-sm;
      margin-bottom: @padding-sm;
      .pointer();
      .space-between();

      &:nth-last-child(2) {
        border: none;
      }

      .space-between();

      .left-wrap {
        position: relative;
        background-color: antiquewhite;
        width: 80px !important;
        height: auto !important;

        .van-image {
          width: 100%;
          height: 100%;

          :deep(img) {
            width: 100%;
            height: 100%;
            border-radius: @radius-base;
          }
        }
      }

      .right {
        width: 100%;
        padding-left: 10px;

        .top {
          font-size: @font-size-base;
          .space-between();

          .title {
            font-weight: bold;
            font-size: @font-size-base;
            color: #000;
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

        .center {
          font-size: @font-size-sm;

          // padding-top: @font-size-sm;
          .order-no {
            .space-between();

            .copy {
              width: 40px;
              height: 18px;
              line-height: 18px;
              border-radius: 3px;
              border: 1px solid @gray-color;
              color: @gray-color;
              font-size: 10px;
              text-align: center;
            }
          }

          &:nth-last-child {
            border: none;
          }
        }

        .bottom-info {
          font-size: @font-size-sm;
          padding-top: @font-size-sm;
        }
      }


    }
  }
}

:deep(.van-tabs__wrap) {
  height: 45px;
  border-bottom: 1px solid #dddddd;

  .van-tabs__nav--card {
    border: none;
    margin: 0;
    height: 100%;
    background-color: @bg-color;

    .van-tab {
      color: @light-black !important;
      font-size: @font-size-lg;
    }

    .van-tab--active {
      color: #fff !important;
    }
  }
}
</style>