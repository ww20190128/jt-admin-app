<template>
    <div
      class="vip-center"
      v-show="loading"
    >
      <!-- 顶部会员信息 -->
      <div class="header">
        <div class="avatar">
          <img
            :src="userInfo?.headImgUrl"
            class="avatar-img"
          >
          <img
            src="../../assets/images/vip.png"
            class="vip-icon"
            v-if="userInfo?.vipInfo && userInfo?.vipInfo.name"
          >
        </div>
       
        <div class="text-warp">
      
          <!-- 显示vip信息 -->
          <div v-if="userInfo?.vipInfo && userInfo?.vipInfo?.name && userInfo?.vipInfo?.name"> 
            <p >{{userInfo.vipInfo.name}}</p>
            <p v-if="userInfo?.vipInfo?.effectEndTime > 0">会员有效期至：{{$filters.formatDate(userInfo?.vipInfo.effectEndTime) || '已到期'}}</p>
            <p v-if="userInfo?.vipInfo.vipGiveLimit > 0">剩余赠送次数：{{userInfo?.vipInfo?.vipGiveLimit - userInfo?.vipInfo?.vipGiveNum}}</p>
          </div>
        </div>
      </div>
      <!-- 记录区域 -->
      <div class="card-list">
        <div class="head">
          <span>VIP购买记录</span>
        </div>
        <div
          class="content"
          v-for="item in vipOrderList"
          :key="item.orderId"
        >
          <div class="top">
            <div class="left">
              <div class="title">{{item?.name}}</div>
              <div class="price">
                ￥{{item?.price}}
              </div>
              <div class="time">购买时间：{{$filters.formatDate(item.effectTime)}}</div>
            </div>
          </div>
          <div class="order">
            <div class="order-no" v-if="item.outTradeNo">订单号：{{item.outTradeNo}}</div>
            <div
              class="copy"
              @click="clipboard(item.name, $event)"
            >复制</div>
          </div>
        </div>
  
        <div
          class="none"
          v-if="!vipOrderList.length"
        >
          暂无记录
        </div>
      </div>
  
      <!-- 会员优惠订单 -->
      <div class="card-list">
        <div class="head">
          <span>VIP优惠订单</span>
          <!-- <span class="right">累计已省{{userInfo.vip_free_money}}元</span> -->
        </div>
        <div
          class="content"
          v-for="item in userTestOrderList"
          :key="item.testCode"
        >
          <div class="top">
            <div class="left">
              <div class="title">{{item?.testPaperInfo?.name}}</div>
              <div class="price">
                ￥{{item?.price}} <span>￥{{item?.testPaperInfo?.price}}</span>
              </div>
              <div class="time" v-if="item?.testPaperInfo?.createTime">测试时间：{{ $filters.formatDate(item?.testPaperInfo?.createTime) }}</div>
            </div>
            <div class="right">
              <div
                class="button"
                @click="handleReport(item)"
              >查看结果</div>
            </div>
          </div>
          <!-- <div class="order">
            <div class="order-no">订单号：{{item.testCode}}</div>
            <div
              class="copy"
              @click="clipboard(item.testCode,$event)"
            >复制</div>
          </div> -->
        </div>
  
        <div
          class="none"
          v-if="!userTestOrderList.length"
        >
          暂无VIP优惠订单
        </div>
      </div>
    </div>
  
  </template>
  
  <script>
  import { reactive, toRefs } from "vue";
  import { useRouter } from "vue-router";
  import { useAuth } from "@/hooks/useAuth";
  import { getUserInfo, getTestOrderList } from "@/api/user";
  import { useScrollBottom } from "@/hooks/useScroll";
  import clipboard from "@/utils/clipboard";
  import { Dialog } from "vant";
  export default {
    name: "vipCenter",
    setup() {
      const router = useRouter();
      const state = reactive({
        show: true,
        vipOrderList: [], // vip开通订单列表
        userTestOrderList: [], // vip做题订单列表
        userInfo: {}, //用户信息
        query: {
          pageNum: 1,
          pageLimit: 10,
          status: 1,
        },
        nomore: false,
        loading: false,
      });
      // 授权钩子
      useAuth(
        {
          authType: 1,
        },
        () => {
          init();
          loadTestOrderList();
        }
      );
      
      // 获取数据
      async function init() {
        try {
          const {
            userInfo, userVipOrderList
          } = await getUserInfo({ pageNum: 1, pageLimit: 100 });
          state.userInfo = userInfo;
          state.vipOrderList = userVipOrderList;
          state.loading = true;
          if (!userInfo?.vipInfo || !userInfo?.vipInfo.name) {  // 检查是否为vip， 如果不是引导去开通
            Dialog.confirm({
              title: "提示",
              message: "您还不是VIP用户哦，请开通VIP会员享受权益。",
              confirmButtonText: "去开通",
              cancelButtonText: "返回",
            })
              .then(() => {
                router.replace("/vipOpened");
              })
              .catch(() => {
                router.go(-1);
              }
            );
          }
        } catch (error) {
          Dialog.confirm({
            title: "提示",
            message: "您还不是VIP用户哦，请开通VIP会员享受权益。",
            confirmButtonText: "去开通",
            cancelButtonText: "返回",
          })
            .then(() => {
              router.replace("/vipOpened");
            })
            .catch(() => {
              router.go(-1);
            });
        }
      }
  
      // 会员优惠订单
      async function loadTestOrderList() {
        try {
          if (state.nomore) {
            return;
          }
          const {
            list,
          } = await getTestOrderList(state.query);
          if (!list.length) {
            state.nomore = true;
            return;
          }
          state.userTestOrderList = [...state.userTestOrderList, ...list];
        } catch (error) {}
      }
  
      useScrollBottom(() => {
        if (state.nomore) {
          return;
        }
        state.query.pageNum++;
        loadTestOrderList();
      });
      // 查看报告
      function handleReport({ id, testPaperInfo }) {
        router.push({
          path: "/report",
          query: {
            testOrderId: id,
            testPaperId: testPaperInfo.id,
          },
        });
      }
      return {
        ...toRefs(state),
        clipboard,
        handleReport,
      };
    },
  };
  </script>
  
  <style lang="less" scoped>
  .vip-center {
    background-color: @bg-color;
    padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom);
    margin-bottom: 40px;
    .none {
      font-size: @font-size-base;
      text-align: center;
      padding: @padding-base;
      color: @gray-color;
    }
    .header {
      height: 120px;
      background-image: url("../../assets/images/vip-bg05.png");
      background-repeat: no-repeat;
      background-size: cover;
      padding: @padding-base;
      font-size: @font-size-base;
      color: #fff;
      .align-center();
      .avatar {
        width: 75px;
        height: 75px;
        position: relative;
        .vip-icon {
          position: absolute;
          width: 44px;
          left: 50%;
          bottom: -5px;
          transform: translateX(-50%);
        }
        .avatar-img {
          width: 100%;
          border-radius: 50%;
        }
      }
      .text-warp {
        padding-left: 10px;
        line-height: 25px;
      }
    }
    .card-list {
      border-radius: @radius-base;
      box-shadow: 0px 0px 6px #d6d6d6;
      overflow: hidden;
      background-color: #fff;
      margin: 30px @padding-base;
      .head {
        height: 45px;
        line-height: 45px;
        background-color: #fff;
        border-bottom: 1px solid #efefef;
        padding: 0 @padding-base;
        font-size: 15px;
        font-weight: bold;
        .space-between();
        .right {
          color: @gray-color;
          font-size: @font-size-sm;
          font-weight: normal;
        }
      }
      .content {
        padding: @padding-base;
        font-size: @font-size-sm;
        line-height: 25px;
        .top {
          .space-between();
          .left {
            .title {
              font-size: @font-size-base;
              font-weight: bold;
            }
            .price {
              font-size: @font-size-base;
              font-weight: bold;
              color: #ff8c00;
              span {
                text-decoration: line-through;
                font-size: 10px;
                color: @gray-color;
              }
            }
            .time {
              color: @gray-color;
            }
          }
          .right {
            .button {
              width: 70px;
              height: 26px;
              border-radius: 3px;
              text-align: center;
              line-height: 26px;
              background-color: @theme-color;
              font-size: @font-size-sm;
              color: #fff;
            }
          }
        }
        .order {
          .space-between();
          color: @gray-color;
          .copy {
            width: 40px;
            height: 18px;
            line-height: 18px;
            border-radius: 3px;
            border: 1px solid @gray-color;
            font-size: 10px;
            text-align: center;
          }
        }
      }
    }
  }
  </style>